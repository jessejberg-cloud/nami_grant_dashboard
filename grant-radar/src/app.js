// Grant Radar interface. The build inlines core.mjs and guides.mjs above this
// file inside one closure, so every name they export is in scope here.

/* global VERSION REVISION_DATE APP_ID DASHBOARD_URL STORAGE statuses STATUS_LABEL PUT_AWAY defaultPreferences defaultSettings
   initialOpportunities clone normalize localToday daysBetween blankLead findDuplicate dateState daysLeft fitExplanation
   sourceFreshness needsChecking safeSource validateOpportunity searchLinks buildExport exportFileName makeBackup readImport
   mergeRefresh FIELD_LABEL TOUR TIPS QUICK_START MANUAL GLOSSARY */

// ---------------------------------------------------------------- storage --
// Saved in this browser always; also with the person's Claude account when
// the page runs as a Claude link and they are signed in, so work follows them.
const local={
  get(k){try{return localStorage.getItem(k)}catch{return null}},
  set(k,v){try{localStorage.setItem(k,v);return true}catch{return false}}
};
const KEY_NAME=Object.fromEntries(Object.entries(STORAGE).map(([n,k])=>[k,n]));
function load(key,fallback){const raw=local.get(key);if(raw==null)return clone(fallback);try{return JSON.parse(raw)}catch{return clone(fallback)}}
const cloud={db:null,uid:null,pending:{},busy:{},timer:{},tooBig:false,refused:false};
const caps={downloads:null,ready:Promise.resolve()};
let storageOK=true;

function save(key,value){
  const text=JSON.stringify(value), at=new Date().toISOString();
  const ok=local.set(key,text);local.set(key+':at',at);
  if(!ok&&storageOK&&!cloud.db){storageOK=false;toast('This browser is not keeping changes. Save a backup from Help before you close the page.')}
  cloudWrite(key,value,at);
}
function cloudWrite(key,value,savedAt){
  if(!cloud.db||cloud.refused)return;
  const name=KEY_NAME[key];
  if(JSON.stringify(value).length>240000){if(!cloud.tooBig){cloud.tooBig=true;toast('Too many leads to keep with your account. They are still saved in this browser; save a backup from Help.')}return}
  cloud.pending[name]={value,savedAt};
  clearTimeout(cloud.timer[name]);cloud.timer[name]=setTimeout(()=>flush(name),500);
}
async function flush(name){
  if(cloud.busy[name]||!cloud.pending[name])return;
  const body=cloud.pending[name];delete cloud.pending[name];cloud.busy[name]=true;
  try{await cloud.db.doc(`data/users/${cloud.uid}/${name}`).set(body)}
  catch(e){if(e&&e.code==='invalid_argument'){cloud.refused=true}}
  finally{cloud.busy[name]=false;if(cloud.pending[name])flush(name)}
}
async function connectCloud(){
  if(!window.claude||typeof window.claude.use!=='function')return;
  try{
    caps.ready=window.claude.use('downloads').then(d=>{caps.downloads=d}).catch(()=>{});
    const [db,user]=await Promise.all([window.claude.use('db'),window.claude.use('user')]);
    if(!db||!user)return;
    const uid=await user.id();if(!uid)return;
    cloud.db=db;cloud.uid=uid;
    let changed=false;
    for(const [name,key] of Object.entries(STORAGE)){
      const snap=await db.doc(`data/users/${uid}/${name}`).get();
      const localAt=local.get(key+':at')||'', localRaw=local.get(key);
      if(snap.exists){
        const d=snap.data()||{};
        if(String(d.savedAt||'')>localAt){applyStored(name,d.value);local.set(key,JSON.stringify(d.value));local.set(key+':at',String(d.savedAt));changed=true}
        else if(localRaw&&localAt>String(d.savedAt||'')){try{cloudWrite(key,JSON.parse(localRaw),localAt)}catch{}}
      }else if(localRaw){try{cloudWrite(key,JSON.parse(localRaw),localAt||new Date().toISOString())}catch{}}
    }
    if(changed&&!document.querySelector('.dialog'))render();
    else if(S.tab==='Help')render();
  }catch{/* the page works the same without an account */}
}
function applyStored(name,value){
  if(name==='opportunities'&&Array.isArray(value))S.items=value;
  if(name==='preferences'&&value)S.preferences={...clone(defaultPreferences),...value};
  if(name==='activity'&&Array.isArray(value))S.activity=value;
  if(name==='settings'&&value){S.settings={...clone(defaultSettings),...value};applyComfort()}
  if(name==='onboarding'&&value){S.onboarded=true;if(S.tour>=0)endTour(false)}
}

// ------------------------------------------------------------------ state --
const S={
  tab:'Home',selected:null,
  items:load(STORAGE.opportunities,initialOpportunities),
  preferences:{...clone(defaultPreferences),...load(STORAGE.preferences,defaultPreferences)},
  activity:load(STORAGE.activity,[]),
  settings:{...clone(defaultSettings),...load(STORAGE.settings,defaultSettings)},
  onboarded:local.get(STORAGE.onboarding)!=null,
  query:'',filter:'Active',helpView:'start',manualAt:MANUAL[0].id,
  sendKind:'public',picks:null,lastSent:null,confirmFresh:false,
  tour:-1,draft:null,undo:null
};
const $=s=>document.querySelector(s);
const esc=(s='')=>String(s??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const byId=id=>S.items.find(i=>i.id===id);
function persist(){save(STORAGE.opportunities,S.items)}
function log(action,item,details=''){S.activity.unshift({at:new Date().toISOString(),action,itemId:item?.id||'',title:item?.title||'',details});S.activity=S.activity.slice(0,100);save(STORAGE.activity,S.activity)}
function newId(){try{return crypto.randomUUID()}catch{return 'lead-'+Date.now().toString(36)+Math.random().toString(36).slice(2,8)}}

// ----------------------------------------------------------------- format --
function fmtDate(iso,opts={}){if(!iso)return '';const d=new Date(iso.length===10?iso+'T12:00:00':iso);if(!Number.isFinite(d.getTime()))return '';const sameYear=d.getFullYear()===new Date().getFullYear();return d.toLocaleDateString('en-US',{month:'short',day:'numeric',...(sameYear&&!opts.year?{}:{year:'numeric'})})}
function money(i){const f=n=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(n);if(i.fundingMin==null&&i.fundingMax==null)return '';if(i.fundingMin!=null&&i.fundingMax!=null&&i.fundingMin!==i.fundingMax)return `${f(i.fundingMin)} – ${f(i.fundingMax)}`;return (i.fundingMin==null?'Up to ':'')+f(i.fundingMax??i.fundingMin)}
function whenText(i){
  const ds=dateState(i),n=daysLeft(i);
  if(ds==='CLOSED')return {main:'Closed',sub:i.deadline?fmtDate(i.deadline,{year:true}):'',soon:false};
  if(ds==='ROLLING')return {main:'Rolling',sub:'Apply any time',soon:false};
  if(ds==='UNKNOWN')return {main:'Date not known',sub:'',soon:false};
  return {main:fmtDate(i.deadline),sub:n===0?'Today':n===1?'Tomorrow':`${n} days`,soon:n<=30};
}
function checkedText(i){
  const f=sourceFreshness(i);
  if(f==='UNKNOWN')return {main:'Not checked yet',sub:'Open the funder\'s page to check'};
  return {main:fmtDate(i.checkedAt),sub:f==='STALE'?'Time for a fresh look':'Checked recently'};
}
function sortLeads(list){
  const rank=i=>{const ds=dateState(i);return ds==='CLOSED'?3:ds==='UNKNOWN'?2:ds==='ROLLING'?1:0};
  return [...list].sort((a,b)=>rank(a)-rank(b)||(a.deadline||'').localeCompare(b.deadline||'')||a.title.localeCompare(b.title));
}
const active=()=>S.items.filter(i=>!PUT_AWAY.includes(i.status));
const FILTERS={
  'Active':i=>!PUT_AWAY.includes(i.status),
  'Due in 30 days':i=>!PUT_AWAY.includes(i.status)&&daysLeft(i)!=null&&daysLeft(i)<=30,
  'Needs checking':i=>needsChecking(i),
  'Shortlisted':i=>i.status==='Shortlisted',
  'Put away':i=>PUT_AWAY.includes(i.status),
  'All':()=>true
};

// ------------------------------------------------------------------ icons --
const ICON={
  Home:'<path d="M4 11l8-6 8 6v8a1 1 0 0 1-1 1h-4v-5h-6v5H5a1 1 0 0 1-1-1z"/>',
  Leads:'<path d="M8 6h12M8 12h12M8 18h12"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/>',
  'Find grants':'<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>',
  Send:'<path d="M4 12l16-8-6 16-3-7z"/><path d="M11 13l9-9"/>',
  Help:'<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .8-1 1.5v.7"/><circle cx="12" cy="17.2" r=".6"/>',
  search:'<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>'
};
const svg=(name)=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON[name]}</svg>`;
const TABS=['Home','Leads','Find grants','Send','Help'];
const TAB_LABEL={Home:'Home',Leads:'Leads','Find grants':'Find grants',Send:'Send',Help:'Help'};

// ------------------------------------------------------------------ pages --
// One line per page, until put away. Got it puts it away for good; Later
// brings it back tomorrow.
function tip(tab){
  if(!TIPS[tab]||S.settings.tipsSeen.includes(tab))return '';
  const later=(S.settings.tipsLater||{})[tab];if(later&&Date.now()<later)return '';
  return `<div class="tip" role="note"><p>${esc(TIPS[tab])}</p><span class="row"><button class="btn quiet" data-act="tip-later" data-arg="${esc(tab)}">Later</button><button class="btn quiet" data-act="tip-ok" data-arg="${esc(tab)}">Got it</button></span></div>`;
}
function head(title,sub,action=''){return `<div class="head"><div><h1 id="page-title" tabindex="-1">${title}</h1>${sub?`<p>${sub}</p>`:''}</div>${action}</div>`}
const addBtn=`<button class="btn primary" data-act="add" data-tour="add-lead">+ Add a lead</button>`;

// Home is three short lists, headings at a glance: the names of the leads,
// never a number of them. A number on a pile reads as a backlog.
function home(){
  const act=active();
  const horizon=Number(S.preferences.deadlineHorizon)||180;
  const coming=sortLeads(act.filter(i=>{const n=daysLeft(i);return n!=null&&n<=horizon}));
  const check=sortLeads(act.filter(needsChecking));
  const short=sortLeads(act.filter(i=>i.status==='Shortlisted'));
  const panel=(title,filter,list,showNext,none)=>`<section class="panel"><div class="panel-head"><h2>${title}</h2>${list.length?`<button class="btn quiet" data-act="see" data-arg="${filter}">See all</button>`:''}</div><div class="list">${list.slice(0,4).map(i=>row(i,showNext)).join('')||`<p class="empty">${none}</p>`}</div></section>`;
  return `${head('Grant Radar','What is coming up, and what to look at next.',addBtn)}${tip('Home')}
  ${panel('Coming up','Due in 30 days',coming,false,'No dates coming up.')}
  ${panel('Needs checking','Needs checking',check,true,'Nothing to check.')}
  ${panel('Shortlisted','Shortlisted',short,false,'Nothing shortlisted.')}`;
}
function row(i,showNext=false){
  const w=whenText(i);
  const tags=`${i.recordType==='sample'?'<span class="tag practice">Practice</span>':''}${i.sentAt?'<span class="tag sent">Sent</span>':''}${i.changeFlags?.length?'<span class="dot" title="Changed since you last looked"></span><span class="sr-only">Changed since you last looked</span>':''}`;
  const sub=showNext&&i.nextAction?`Next: ${esc(i.nextAction)}`:`${esc(i.funder||'Funder not noted')}${i.owner?` · ${esc(i.owner)}`:''}`;
  return `<button class="lead" data-act="open" data-arg="${esc(i.id)}"><span class="name">${esc(i.title)} ${tags}</span><span class="sub">${sub}</span><span class="when ${w.soon?'soon':''}">${esc(w.main)}${w.sub?`<br><small>${esc(w.sub)}</small>`:''}</span></button>`;
}

function leads(){
  if(S.selected){const i=byId(S.selected);if(i)return detail(i);S.selected=null}
  return `${head('Leads','Every grant you are keeping an eye on, soonest first.',addBtn)}${tip('Leads')}
  <label class="search"><span class="sr-only">Search leads</span>${svg('search')}<input id="q" class="pen" type="search" autocomplete="off" placeholder="Search names, funders, owners, notes" value="${esc(S.query)}"></label>
  <div class="chips" role="group" aria-label="Show">${Object.keys(FILTERS).map(f=>`<button class="chip" data-act="filter" data-arg="${f}" aria-pressed="${S.filter===f}">${f}</button>`).join('')}</div>
  <section class="panel" aria-live="polite"><div class="list" id="lead-list">${leadList()}</div></section>`;
}
function leadList(){
  const q=normalize(S.query);
  const list=sortLeads(S.items.filter(FILTERS[S.filter]||FILTERS.All).filter(i=>!q||normalize([i.title,i.funder,i.owner,i.notes,i.nextAction,i.description].join(' ')).includes(q)));
  return list.map(i=>row(i)).join('')||`<p class="empty">${q?'No leads match that search.':S.filter==='Put away'?'Nothing put away.':'No leads here yet.'}</p>`;
}

function detail(i){
  const w=whenText(i),c=checkedText(i),fit=fitExplanation(i),away=PUT_AWAY.includes(i.status);
  const list=(arr,none)=>arr?.length?`<ul>${arr.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:`<p class="empty" style="padding:.3rem 0">${none}</p>`;
  const url=safeSource(i.officialUrl);
  const hist=(i.history||[]).slice().reverse().map(h=>`<div>${esc(fmtDate(h.at,{year:true}))} · ${esc(h.action||(h.type==='source-refresh'?'Changed: '+(h.changed||[]).map(k=>FIELD_LABEL[k]||k).join(', '):h.type==='source-check-note'?'Checked the page':h.type))}${h.note?`: ${esc(h.note)}`:''}</div>`).join('');
  return `<div><button class="btn quiet" data-act="back">← Leads</button></div>
  ${head(esc(i.title),`${esc(i.funder||'Funder not noted')}`,`<div class="row">${i.recordType==='sample'?'<span class="tag practice">Practice</span>':''}${i.sentAt?`<span class="tag sent">Sent ${esc(fmtDate(i.sentAt))}</span>`:''}</div>`)}
  ${i.changeFlags?.length?`<div class="changed" role="status"><span><strong>Changed since you last looked:</strong> ${esc(i.changeFlags.map(k=>FIELD_LABEL[k]||k).join(', '))}</span><button class="btn" data-act="ack">OK, noted</button></div>`:''}
  <section class="facts" aria-label="Key facts">
    <div class="fact"><span>Deadline</span><strong class="${w.soon?'when soon':''}">${esc(w.main)}</strong><small>${esc(w.sub)}${i.deadlineTimezone&&dateState(i)!=='ROLLING'&&!/^(unknown|not applicable|not stated)/i.test(i.deadlineTimezone)?` · ${esc(i.deadlineTimezone)}`:''}</small></div>
    <div class="fact"><span>Amount</span><strong>${esc(money(i)||'Not known')}</strong><small>${i.matchingFunds&&i.matchingFunds!=='Unknown'?'Match: '+esc(i.matchingFunds):''}</small></div>
    <div class="fact"><span>Funder's page</span><strong>${esc(c.main)}</strong><small>${esc(c.sub)}</small></div>
  </section>
  <div class="row">${url?`<a class="btn primary" href="${esc(url)}" target="_blank" rel="noopener noreferrer">Open funder's page ↗</a>`:''}<button class="btn" data-act="check">I checked the page</button><button class="btn" data-act="edit">Edit details</button><button class="btn" data-act="send-one">Send to Dashboard</button>${away?'<button class="btn" data-act="restore">Bring back</button>':'<button class="btn" data-act="archive">Archive</button>'}</div>
  <section class="panel"><h2>Status</h2><div class="seg" role="group" aria-label="Status">${statuses.filter(s=>!PUT_AWAY.includes(s)||s==='Declined'||s===i.status).map(s=>`<button class="chip" data-act="status" data-arg="${s}" aria-pressed="${i.status===s}">${STATUS_LABEL[s]}</button>`).join('')}</div></section>
  <section class="panel"><h2>Your notes</h2><p class="empty" style="padding:0 0 .6rem">These save by themselves.</p><div class="grid2">
    <label class="field"><span>Owner</span><input class="pen" data-live="owner" maxlength="120" value="${esc(i.owner)}" placeholder="Who is looking after this?"></label>
    <label class="field"><span>Next step</span><input class="pen" data-live="nextAction" maxlength="300" value="${esc(i.nextAction)}" placeholder="One small next step"></label>
    <label class="field full"><span>Notes</span><textarea class="pen" data-live="notes" rows="3" placeholder="Anything worth remembering">${esc(i.notes)}</textarea></label>
  </div></section>
  <section class="panel"><h2>${esc(fit.label)}</h2><div class="reasons">
    <div><h3>Why it might fit</h3>${list(i.fitReasons,'Not noted yet.')}</div>
    <div><h3>Still to find out</h3>${list(i.gaps,'Nothing noted. Eligibility is still checked on the funder\'s page.')}</div>
    <div><h3>Deal-breakers</h3>${list(i.disqualifiers,'None noted.')}</div>
  </div></section>
  <details class="more panel"><summary>More details</summary><dl class="kv">
    ${[['About it',i.description],['Who can apply',i.applicantEligibility],['Area',i.geography],['How to apply',i.applicationRoute],['Matching funds',i.matchingFunds],['Restrictions',i.restrictions],['Fit, in words',i.programFit],['Link',url?`<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(url)}</a>`:'']].map(([k,v])=>`<dt>${k}</dt><dd>${k==='Link'?(v||'Not noted'):esc(v||'Not noted')}</dd>`).join('')}
  </dl><h3>History</h3><div class="history">${hist||'<div>Nothing yet.</div>'}</div></details>`;
}

function find(){
  const p=S.preferences;
  const groups=[['Area','geography',['Milwaukee County','Ozaukee County','Washington County','Waukesha County','Wisconsin','United States']],['Topics','interests',['Mental health','Peer support','Family education','Advocacy','Community outreach','Suicide prevention','Youth mental health']],['Who can apply','applicantTypes',['501(c)(3) nonprofit','Fiscal sponsor permitted','Affiliate or chapter','Government partner required']],['Skip','exclusions',['Invitation-only','Closed or expired','Partisan political activity','Capital-only','Match required']]];
  return `${head('Find grants','One tap opens a ready-made search. When something looks right, add it as a lead.',addBtn)}${tip('Find grants')}
  <section class="panel"><h2>Search</h2><div class="searches">${searchLinks(p).map(s=>`<a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer"><strong>${esc(s.label)} ↗</strong><span>${esc(s.hint)}</span></a>`).join('')}</div>
  <p class="empty" style="padding:.8rem 0 0">Radar does not search on its own yet.</p></section>
  <section class="panel"><h2>What you are looking for</h2><p class="empty" style="padding:0">These shape the search buttons. They save as you tap. They are preferences, not facts about the agency.</p>
  ${groups.map(([t,k,opts])=>`<h3>${t}</h3><div class="toggles">${opts.map(o=>`<button class="chip" data-act="pref" data-group="${k}" data-arg="${esc(o)}" aria-pressed="${(p[k]||[]).includes(o)}">${esc(o)}</button>`).join('')}</div>`).join('')}
  <div class="grid2" style="margin-top:1.2rem">
    <label class="field"><span>Smallest amount ($)</span><input class="pen" type="number" min="0" step="1000" data-pref="minimumAmount" value="${esc(p.minimumAmount)}"></label>
    <label class="field"><span>Largest amount ($)</span><input class="pen" type="number" min="0" step="1000" data-pref="maximumAmount" value="${esc(p.maximumAmount)}"></label>
    <label class="field"><span>Look ahead (days)</span><input class="pen" type="number" min="1" max="730" data-pref="deadlineHorizon" value="${esc(p.deadlineHorizon)}"><small>Home lists deadlines this far ahead.</small></label>
    <label class="field"><span>Search words</span><input class="pen" data-pref="keywords" value="${esc(p.keywords)}"><small>Separate with commas. The first three are used.</small></label>
  </div><p class="form-error" id="pref-error" role="alert"></p></section>`;
}

function send(){
  const kind=S.sendKind;
  const pool=sortLeads(S.items.filter(i=>i.recordType===kind&&!PUT_AWAY.includes(i.status)));
  if(!S.picks)S.picks=pool.filter(i=>!i.sentAt&&['Shortlisted','Reviewing'].includes(i.status)).map(i=>i.id);
  const picked=pool.filter(i=>S.picks.includes(i.id));
  const resend=picked.filter(i=>i.sentAt);
  return `${head('Send to the Grant Dashboard','Three steps. Radar remembers what you have already sent.')}${tip('Send')}
  <div class="steps">
  <section class="panel step"><h2>Pick leads</h2>
    <div class="row" style="justify-content:space-between;margin:.4rem 0 .6rem"><div class="chips" role="group" aria-label="Which leads"><button class="chip" data-act="send-kind" data-arg="public" aria-pressed="${kind==='public'}">Real leads</button><button class="chip" data-act="send-kind" data-arg="sample" aria-pressed="${kind==='sample'}">Practice leads</button></div>
    <div class="row"><button class="btn quiet" data-act="pick-unsent">Tick all not sent</button><button class="btn quiet" data-act="pick-none">Clear</button></div></div>
    <div class="picklist">${pool.map(i=>`<label class="pick"><input type="checkbox" data-pick="${esc(i.id)}" ${S.picks.includes(i.id)?'checked':''}><span><strong>${esc(i.title)}</strong> ${i.sentAt?`<span class="tag sent">Sent ${esc(fmtDate(i.sentAt))}</span>`:''}<span class="sub">${esc(STATUS_LABEL[i.status])} · ${esc(whenText(i).main)}</span></span></label>`).join('')||'<p class="empty">No active leads of this kind.</p>'}</div>
    <p id="pick-count" style="margin-top:.6rem"><strong>${picked.length}</strong> picked.${resend.length?` <span class="tag soon">${resend.length} already sent</span> The Dashboard refuses a file if any lead in it is already there. Remove the old copy in the Dashboard first, or untick it.`:''}</p>
  </section>
  <section class="panel step"><h2>Save the file</h2><p>Radar saves a small .json file for the Dashboard and marks those leads Sent.</p>
    <div class="row"><button class="btn primary" data-act="save-file" ${picked.length?'':'disabled'}>Save the file</button><button class="btn quiet" data-act="copy-file" ${picked.length?'':'disabled'}>Copy instead</button></div>
    ${S.lastSent?`<p role="status" style="margin-top:.6rem">Saved <strong>${esc(S.lastSent.name)}</strong> with ${S.lastSent.count} lead${S.lastSent.count===1?'':'s'}.</p>`:''}
  </section>
  <section class="panel step"><h2>Import it in the Grant Dashboard</h2>
    <p><a class="btn" href="${esc(DASHBOARD_URL)}" target="_blank" rel="noopener noreferrer">Open the Grant Dashboard ↗</a></p>
    <p class="path" aria-label="In the Dashboard"><span>Settings</span><i>›</i><span>${kind==='sample'?'Sample workspace':'Agency workspace'}</span><i>›</i><span>Import records</span><i>›</i><span>Choose JSON</span></p>
    <p>Pick the file you just saved. The leads arrive in the Dashboard's Grant Radar list as opportunities, not awards.</p>
  </section></div>`;
}

function help(){
  const views=[['start','Start here'],['quick','Quick start'],['manual','Manual'],['words','Words'],['data','Your data and comfort']];
  let body='';
  if(S.helpView==='start')body=`<section class="panel"><h2>Learn by doing</h2><div class="row"><button class="btn primary" data-act="tour">Take the tour</button><button class="btn" data-act="practice">Open the practice lead</button><button class="btn" data-act="tips-reset">Show page tips again</button></div></section>
    <section class="panel"><h2>Read or keep a copy</h2><div class="row"><button class="btn" data-act="help" data-arg="quick">Read the quick start</button><button class="btn" data-act="help" data-arg="manual">Read the manual</button></div>
    <h3>Files</h3><ul class="prose">${[['Quick start (PDF, one page)','Nami_Grant_Radar_Quick_Start.pdf'],['Manual (PDF)','Nami_Grant_Radar_User_Manual.pdf'],['Quick start (Word)','Nami_Grant_Radar_Quick_Start.docx'],['Manual (Word)','Nami_Grant_Radar_User_Manual.docx']].filter(([,f])=>!(window.claude&&f.endsWith('.docx'))).map(([l,f])=>`<li><a href="${f}" download data-act="doc" data-arg="${f}">${l}</a></li>`).join('')}</ul></section>`;
  if(S.helpView==='quick')body=`<section class="panel prose"><h2>${esc(QUICK_START.title)}</h2><p>${esc(QUICK_START.intro)}</p><ol class="qs">${QUICK_START.steps.map(([t,d])=>`<li><span><strong>${esc(t)}.</strong> ${esc(d)}</span></li>`).join('')}</ol><p><em>${esc(QUICK_START.safety)}</em></p></section>`;
  if(S.helpView==='manual'){const at=MANUAL.find(m=>m.id===S.manualAt)||MANUAL[0];const idx=MANUAL.indexOf(at);
    body=`<div class="reader"><nav class="toc" aria-label="Manual sections">${MANUAL.map(m=>`<button data-act="toc" data-arg="${m.id}" aria-current="${m.id===at.id}">${esc(m.title)}</button>`).join('')}</nav>
    <section class="panel prose"><h2 id="manual-h" tabindex="-1">${esc(at.title)}</h2>${at.html}<div class="row" style="justify-content:space-between;margin-top:1.2rem">${idx>0?`<button class="btn quiet" data-act="toc" data-arg="${MANUAL[idx-1].id}">← ${esc(MANUAL[idx-1].title)}</button>`:'<span></span>'}${idx<MANUAL.length-1?`<button class="btn quiet" data-act="toc" data-arg="${MANUAL[idx+1].id}">${esc(MANUAL[idx+1].title)} →</button>`:''}</div></section></div>`}
  if(S.helpView==='words')body=`<section class="panel"><dl class="kv">${GLOSSARY.map(([w,d])=>`<dt><strong>${esc(w)}</strong></dt><dd>${esc(d)}</dd>`).join('')}</dl></section>`;
  if(S.helpView==='data'){
    const where=cloud.db?(cloud.refused?'Saved in this browser. (Your account could not keep them this time.)':'Saved with your Claude account and in this browser.'):storageOK?'Saved in this browser on this computer.':'Not being kept by this browser. Save a backup before you close the page.';
    body=`<section class="panel"><h2>Your data</h2><p id="where-saved">${esc(where)}</p><div class="settings-list">
      <div class="setting"><div><strong>Save a backup</strong><p>One file with all your leads and preferences. Keep it safe, or open it on another computer.</p></div><button class="btn" data-act="backup">Save a backup</button></div>
      <div class="setting"><div><strong>Open a file</strong><p>A Radar backup, a Radar send file, or a Grant Dashboard export. Adds what is new and never overwrites.</p></div><label class="btn" for="import-file">Open a file</label><input id="import-file" type="file" accept=".json,application/json" class="sr-only"></div>
      <div class="setting"><div><strong>Start fresh</strong><p>Puts the starting leads back. You can undo it.</p></div>${S.confirmFresh?`<div class="confirm row"><span>Replace your leads with the starting ones?</span><button class="btn primary" data-act="fresh-yes">Yes, start fresh</button><button class="btn" data-act="fresh-no">Keep my leads</button></div>`:'<button class="btn" data-act="fresh">Start fresh</button>'}</div>
    </div></section>
    <section class="panel"><h2>Comfort</h2><div class="settings-list">
      <div class="setting"><div><strong>Larger text</strong><p>Makes every word bigger.</p></div><button class="switch" role="switch" aria-checked="${S.settings.textSize==='large'}" aria-label="Larger text" data-act="large"></button></div>
      <div class="setting"><div><strong>Still screen</strong><p>Turns off movement and fades.</p></div><button class="switch" role="switch" aria-checked="${!!S.settings.calm}" aria-label="Still screen" data-act="still"></button></div>
    </div></section>
    <p class="empty">Grant Radar ${esc(VERSION)} · guides updated ${esc(fmtDate(REVISION_DATE,{year:true}))}. Use public information only.</p>`;
  }
  return `${head('Help','Guides, the manual, and your data.')}${tip('Help')}<div class="chips" role="group" aria-label="Help sections">${views.map(([k,l])=>`<button class="chip" data-act="help" data-arg="${k}" aria-pressed="${S.helpView===k}">${l}</button>`).join('')}</div>${body}`;
}

// ----------------------------------------------------------------- render --
function render(){
  const nav=$('#nav');
  nav.innerHTML=TABS.map(t=>`<button data-act="nav" data-arg="${t}" data-tour="nav-${t}" ${S.tab===t?'aria-current="page"':''}>${svg(t)}<span>${TAB_LABEL[t]}</span></button>`).join('');
  const pages={Home:home,Leads:leads,'Find grants':find,Send:send,Help:help};
  $('#content').innerHTML=`<div class="page">${pages[S.tab]()}</div>`;
  document.title=S.tab==='Home'?'Grant Radar':`${S.tab==='Leads'&&S.selected?byId(S.selected)?.title||'Leads':S.tab} · Grant Radar`;
}
function go(tab,opts={}){S.tab=tab;if(!opts.keepSelected)S.selected=null;if(tab!=='Send')S.picks=opts.picks||null;else if(opts.picks)S.picks=opts.picks;S.confirmFresh=false;render();window.scrollTo(0,0);$('#page-title')?.focus({preventScroll:true})}
function applyComfort(){const r=document.querySelector('.gr-root')||document.body;r.classList.toggle('gr-large',S.settings.textSize==='large');r.classList.toggle('gr-still',!!S.settings.calm);document.documentElement.classList.toggle('gr-large',S.settings.textSize==='large')}

// ------------------------------------------------------------------ toast --
let toastTimer=0;
function toast(msg,action){
  const t=$('#toast');if(!t)return;
  clearTimeout(toastTimer);
  t.innerHTML=`<span>${esc(msg)}</span>${action?`<button class="btn" id="toast-act">${esc(action.label)}</button>`:''}`;
  t.classList.add('show');
  if(action)$('#toast-act').onclick=()=>{t.classList.remove('show');action.fn()};
  toastTimer=setTimeout(()=>t.classList.remove('show'),action?7000:3500);
}

// ---------------------------------------------------------------- actions --
function setStatus(i,status,note){
  const before=clone(i);
  i.status=status;i.history=[...(i.history||[]),{at:new Date().toISOString(),type:'staff-decision',action:note||`Status: ${STATUS_LABEL[status]}`}];
  persist();log(note||'Changed status',i,status);return before;
}
function undoable(msg,before){
  toast(msg,{label:'Undo',fn:()=>{S.items=S.items.map(x=>x.id===before.id?before:x);persist();log('Undid a change',before);render();toast('Undone.')}});
}
const ACT={
  nav:a=>go(a),
  see:a=>{S.filter=a;S.query='';go('Leads')},
  open:a=>{S.selected=a;S.tab='Leads';render();window.scrollTo(0,0);$('#page-title')?.focus({preventScroll:true})},
  back:()=>{S.selected=null;render();$('#q')?.focus()},
  filter:a=>{S.filter=a;render()},
  add:()=>openLeadForm(null),
  edit:()=>openLeadForm(byId(S.selected)),
  check:()=>openCheckForm(byId(S.selected)),
  status:a=>{const i=byId(S.selected);if(!i||i.status===a)return;const before=setStatus(i,a);render();undoable(`Status: ${STATUS_LABEL[a]}.`,before)},
  archive:()=>{const i=byId(S.selected);if(!i)return;const before=setStatus(i,'Archived','Archived');S.selected=null;render();undoable('Archived. Find it under Put away.',before)},
  restore:()=>{const i=byId(S.selected);if(!i)return;const before=setStatus(i,'Reviewing','Brought back');render();undoable('Brought back.',before)},
  ack:()=>{const i=byId(S.selected);if(!i)return;i.changeFlags=[];persist();log('Noted page changes',i);render()},
  'send-one':()=>{const i=byId(S.selected);if(!i)return;S.sendKind=i.recordType;go('Send',{picks:[i.id]})},
  'tip-ok':a=>{S.settings.tipsSeen=[...new Set([...S.settings.tipsSeen,a])];save(STORAGE.settings,S.settings);render()},
  'tip-later':a=>{S.settings.tipsLater={...(S.settings.tipsLater||{}),[a]:Date.now()+86400000};save(STORAGE.settings,S.settings);render()},
  'tips-reset':()=>{S.settings.tipsSeen=[];S.settings.tipsLater={};save(STORAGE.settings,S.settings);render();toast('Page tips will show again.')},
  tour:()=>startTour(),
  practice:()=>ACT.open('sample-peer-wellbeing'),
  help:a=>{S.helpView=a;S.confirmFresh=false;render()},
  toc:a=>{S.manualAt=a;render();$('#manual-h')?.focus()},
  pref:(a,el)=>{const g=el.dataset.group;const cur=new Set(S.preferences[g]||[]);cur.has(a)?cur.delete(a):cur.add(a);S.preferences[g]=[...cur];save(STORAGE.preferences,S.preferences);el.setAttribute('aria-pressed',String(cur.has(a)));refreshSearches()},
  'send-kind':a=>{S.sendKind=a;S.picks=null;S.lastSent=null;render()},
  'pick-unsent':()=>{S.picks=S.items.filter(i=>i.recordType===S.sendKind&&!PUT_AWAY.includes(i.status)&&!i.sentAt).map(i=>i.id);render()},
  'pick-none':()=>{S.picks=[];render()},
  'save-file':()=>sendFile(false),
  'copy-file':()=>sendFile(true),
  backup:()=>{const today=localToday();saveFile(`grant-radar-backup-${today}.json`,JSON.stringify(makeBackup(S),null,2)).then(ok=>{if(ok){log('Saved a backup');toast('Backup saved.')}})},
  fresh:()=>{S.confirmFresh=true;render()},
  'fresh-no':()=>{S.confirmFresh=false;render()},
  'fresh-yes':()=>{const before={items:S.items,preferences:S.preferences};S.items=clone(initialOpportunities);S.preferences=clone(defaultPreferences);persist();save(STORAGE.preferences,S.preferences);S.confirmFresh=false;log('Started fresh');render();
    toast('Starting leads are back.',{label:'Undo',fn:()=>{S.items=before.items;S.preferences=before.preferences;persist();save(STORAGE.preferences,S.preferences);render();toast('Your leads are back.')}})},
  large:()=>{S.settings.textSize=S.settings.textSize==='large'?'standard':'large';save(STORAGE.settings,S.settings);applyComfort();render()},
  still:()=>{S.settings.calm=!S.settings.calm;save(STORAGE.settings,S.settings);applyComfort();render()},
  doc:(a,el,e)=>{if(!caps.downloads)return;e.preventDefault();fetch(a).then(r=>{if(!r.ok)throw 0;return r.blob()}).then(b=>caps.downloads.save({filename:a,data:b})).catch(err=>{if(err&&err.code==='declined')return;toast('That file could not be saved here. Try the manual on this page instead.')})}
};
function refreshSearches(){const box=$('.searches');if(box)box.innerHTML=searchLinks(S.preferences).map(s=>`<a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer"><strong>${esc(s.label)} ↗</strong><span>${esc(s.hint)}</span></a>`).join('')}

document.addEventListener('click',e=>{
  const el=e.target.closest('[data-act]');if(!el||el.disabled)return;
  if(el.closest('.tour-card'))return;
  const fn=ACT[el.dataset.act];if(fn)fn(el.dataset.arg,el,e);
});
let liveTimer=0;
document.addEventListener('input',e=>{
  const t=e.target;
  if(t.id==='q'){S.query=t.value;const list=$('#lead-list');if(list)list.innerHTML=leadList();return}
  if(t.dataset.live){const i=byId(S.selected);if(!i)return;i[t.dataset.live]=t.value;clearTimeout(liveTimer);liveTimer=setTimeout(persist,600);return}
  if(t.dataset.pref){
    const k=t.dataset.pref,p=S.preferences;
    p[k]=k==='keywords'?t.value:Math.max(0,Number(t.value)||0);
    const err=$('#pref-error');
    if(p.minimumAmount>p.maximumAmount){if(err)err.textContent='The smallest amount is bigger than the largest.';}else if(err)err.textContent='';
    save(STORAGE.preferences,p);refreshSearches();return
  }
  if(t.dataset.pick!=null){const id=t.dataset.pick;S.picks=t.checked?[...new Set([...S.picks,id])]:S.picks.filter(x=>x!==id);const y=window.scrollY;render();window.scrollTo(0,y);document.querySelector(`[data-pick="${CSS.escape(id)}"]`)?.focus();return}
});
document.addEventListener('focusout',e=>{const t=e.target;if(t.dataset&&t.dataset.live){clearTimeout(liveTimer);const i=byId(S.selected);if(i){i[t.dataset.live]=t.value;persist()}}});
document.addEventListener('change',e=>{
  const t=e.target;
  if(t.id==='import-file'){const f=t.files&&t.files[0];if(!f)return;f.text().then(text=>importText(text)).catch(()=>toast('That file could not be opened.'));t.value=''}
});

// ------------------------------------------------------------------ files --
async function saveFile(name,text){
  await Promise.race([caps.ready,new Promise(r=>setTimeout(r,3000))]);
  if(caps.downloads){
    try{await caps.downloads.save({filename:name,data:text});return true}
    catch(e){if(e&&e.code==='declined'){toast('Not saved.');return false}if(e&&e.code==='rate_limited'){toast('A save box is already open.');return false}}
  }
  try{
    const blob=new Blob([text],{type:'application/json'}),a=document.createElement('a');
    a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();a.remove();
    setTimeout(()=>URL.revokeObjectURL(a.href),4000);return true;
  }catch{showCopy(name,text);return false}
}
function sendFile(copy){
  const picked=S.items.filter(i=>(S.picks||[]).includes(i.id));
  let data;try{data=buildExport(picked)}catch(e){toast(e.message);return}
  const name=exportFileName(picked),text=JSON.stringify(data,null,2);
  const done=()=>{const at=new Date().toISOString();for(const i of picked)i.sentAt=at;persist();log('Sent to the Grant Dashboard',null,`${picked.length} leads`);S.lastSent={name,count:picked.length};S.picks=[];render()};
  if(copy){showCopy(name,text,done);return}
  saveFile(name,text).then(ok=>{if(ok){done();toast(`Saved. Now import it in the Dashboard.`)}});
}
function importText(text){
  let r;try{r=readImport(text,S.items,newId)}catch(e){toast(e.message);return}
  if(r.added.length){S.items=[...r.added,...S.items];persist();log('Opened a file',null,`${r.added.length} added`)}
  const parts=[`${r.added.length} lead${r.added.length===1?'':'s'} added`];
  if(r.skipped.length)parts.push(`${r.skipped.length} already here`);
  if(r.problems.length)parts.push(`${r.problems.length} could not be read`);
  const added=r.added.map(i=>i.id);
  render();
  toast(parts.join(', ')+'.',r.added.length?{label:'Undo',fn:()=>{S.items=S.items.filter(i=>!added.includes(i.id));persist();render();toast('Removed what was added.')}}:null);
  if(r.problems.length)console.warn('Grant Radar import:',r.problems);
}

// ---------------------------------------------------------------- dialogs --
let opener=null;
function openDialog(html,onReady){
  opener=document.activeElement;
  $('#dialog-root').innerHTML=`<div class="backdrop" data-close><section class="dialog" role="dialog" aria-modal="true" aria-labelledby="dlg-title">${html}</section></div>`;
  $('#dialog-root .backdrop').addEventListener('mousedown',e=>{if(e.target.hasAttribute('data-close'))closeDialog()});
  $('#dialog-root').querySelectorAll('[data-dismiss]').forEach(b=>b.addEventListener('click',()=>closeDialog()));
  onReady&&onReady($('#dialog-root .dialog'));
}
function closeDialog(){const root=$('#dialog-root');if(!root.innerHTML)return;const keep=root.querySelector('#lead-form');if(keep&&keep.dataset.mode==='add')S.draft=formToLead(keep,S.draft||blankLead(),true);root.innerHTML='';if(opener&&document.contains(opener))opener.focus();else $('#page-title')?.focus()}

function deadlineFields(v,prefix=''){
  const k=v.deadlineKind||'unknown';
  return `<fieldset class="field full" style="border:0;padding:0;margin:0"><legend class="sr-only">Deadline</legend><span>Deadline</span>
    <div class="seg" role="radiogroup" aria-label="Deadline">${[['confirmed','Date'],['rolling','Rolling'],['unknown','Not sure']].map(([val,l])=>`<label class="chip" style="display:inline-flex;align-items:center;gap:.4rem"><input type="radio" name="${prefix}deadlineKind" value="${val}" ${k===val?'checked':''} style="accent-color:var(--accent)">${l}</label>`).join('')}</div>
    <input class="pen" type="date" name="${prefix}deadline" value="${esc(v.deadline||'')}" aria-label="Deadline date" ${k==='confirmed'?'':'hidden'}></fieldset>`;
}
function wireDeadline(form,prefix=''){
  const date=form.querySelector(`[name="${prefix}deadline"]`);
  form.querySelectorAll(`[name="${prefix}deadlineKind"]`).forEach(r=>r.addEventListener('change',()=>{date.hidden=r.value!=='confirmed'||!r.checked;if(r.checked&&r.value==='confirmed')date.focus()}));
}
const lines=v=>String(v||'').split('\n').map(x=>x.trim()).filter(Boolean);
const num=v=>v===''||v==null?null:Number(v);

function formToLead(form,v,lenient=false){
  const f=new FormData(form),g=k=>String(f.get(k)??'');
  const kind=g('deadlineKind')||'unknown';
  return {...v,title:g('title').trim(),funder:g('funder').trim(),officialUrl:g('officialUrl').trim(),
    deadlineKind:kind,deadline:kind==='confirmed'?g('deadline'):(lenient?g('deadline'):''),
    fundingMin:num(g('fundingMin')),fundingMax:num(g('fundingMax')),nextAction:g('nextAction').trim(),
    fitReasons:lines(g('fitReasons')),gaps:lines(g('gaps')),disqualifiers:lines(g('disqualifiers')),
    applicantEligibility:g('applicantEligibility'),geography:g('geography'),applicationRoute:g('applicationRoute'),
    matchingFunds:g('matchingFunds'),restrictions:g('restrictions'),deadlineTimezone:g('deadlineTimezone').trim(),
    description:g('description'),status:g('status')||v.status,owner:g('owner').trim(),externalId:g('externalId').trim(),
    recordType:f.get('practice')?'sample':'public'};
}
function openLeadForm(item){
  const editing=!!item;
  const v=editing?clone(item):(S.draft?clone(S.draft):blankLead());
  const t=(name,label,val,attrs='')=>`<label class="field"><span>${label}</span><input class="pen" name="${name}" value="${esc(val??'')}" ${attrs}></label>`;
  const ta=(name,label,val,hint='')=>`<label class="field full"><span>${label}</span><textarea class="pen" name="${name}" rows="2">${esc(val??'')}</textarea>${hint?`<small>${hint}</small>`:''}</label>`;
  openDialog(`<div class="dialog-head"><h2 id="dlg-title">${editing?'Edit lead':'Add a lead'}</h2><button class="btn quiet" data-dismiss aria-label="Close">Close</button></div>
  <form id="lead-form" data-mode="${editing?'edit':'add'}" novalidate><div class="grid2">
    <label class="field full"><span>Name of the grant</span><input class="pen" name="title" maxlength="180" required value="${esc(v.title)}" placeholder="e.g. Community Wellness Fund 2027"><small>The only thing you need. Everything else can wait.</small></label>
    ${t('funder','Funder',v.funder,'maxlength="180" placeholder="Who gives the money"')}
    ${t('officialUrl','Link to the funder\'s page',v.officialUrl,'type="url" inputmode="url" maxlength="2000" placeholder="https://"')}
    ${deadlineFields(v)}
    ${t('fundingMax','Up to ($)',v.fundingMax,'type="number" min="0" step="500" inputmode="numeric"')}
    ${t('nextAction','Next step',v.nextAction,'maxlength="300" placeholder="One small next step"')}
  </div>
  <details class="more" ${editing?'':''}><summary>More details</summary><div class="grid2">
    ${ta('fitReasons','Why it might fit',(v.fitReasons||[]).join('\n'),'One per line.')}
    ${ta('gaps','Still to find out',(v.gaps||[]).join('\n'),'One per line.')}
    ${ta('disqualifiers','Deal-breakers',(v.disqualifiers||[]).join('\n'),'One per line.')}
    ${ta('applicantEligibility','Who can apply',v.applicantEligibility)}
    ${t('geography','Area',v.geography)}${t('applicationRoute','How to apply',v.applicationRoute)}
    ${t('matchingFunds','Matching funds',v.matchingFunds)}${t('deadlineTimezone','Deadline time zone',v.deadlineTimezone,'placeholder="e.g. 5 pm Central"')}
    ${t('fundingMin','At least ($)',v.fundingMin,'type="number" min="0" step="500" inputmode="numeric"')}
    ${t('owner','Owner',v.owner,'maxlength="120"')}
    ${ta('restrictions','Restrictions',v.restrictions)}${ta('description','About it',v.description)}
    <label class="field"><span>Status</span><select class="pen" name="status">${statuses.map(s=>`<option value="${s}" ${v.status===s?'selected':''}>${STATUS_LABEL[s]}</option>`).join('')}</select></label>
    ${t('externalId','Lead ID',v.externalId,'maxlength="100"')}
    <label class="field full" style="grid-template-columns:auto 1fr;align-items:center;gap:.6rem"><input type="checkbox" name="practice" ${v.recordType==='sample'?'checked':''} style="width:1.2em;height:1.2em;accent-color:var(--accent)"><span style="font-size:.95em;color:var(--ink);font-weight:400">This is a practice lead (made up)</span></label>
  </div></details>
  <p class="form-error" id="form-error" role="alert"></p>
  <div class="dialog-foot">${!editing&&S.draft?'<button type="button" class="btn quiet" id="clear-draft">Clear form</button>':''}<button type="button" class="btn" data-dismiss>Close</button><button class="btn primary">Save lead</button></div></form>`,
  dlg=>{
    const form=dlg.querySelector('#lead-form');wireDeadline(form);
    dlg.querySelector('#clear-draft')?.addEventListener('click',()=>{S.draft=null;$('#dialog-root').innerHTML='';openLeadForm(null)});
    form.addEventListener('submit',e=>{
      e.preventDefault();
      const c=formToLead(form,v);
      try{validateOpportunity(c)}catch(err){$('#form-error').textContent=err.message;return}
      const dupe=findDuplicate(S.items,c,v.id);
      if(dupe){$('#form-error').innerHTML=`This looks like “${esc(dupe.title)}”, which is already here. <button type="button" class="btn quiet" id="open-dupe">Open it</button>`;$('#open-dupe').onclick=()=>{S.draft=null;$('#dialog-root').innerHTML='';ACT.open(dupe.id)};return}
      c.id=v.id||newId();c.history=[...(v.history||[]),{at:new Date().toISOString(),type:'staff-edit',action:editing?'Edited':'Added'}];
      if(editing)S.items=S.items.map(x=>x.id===v.id?c:x);else{S.items.unshift(c);S.draft=null}
      persist();log(editing?'Edited a lead':'Added a lead',c);
      $('#dialog-root').innerHTML='';S.tab='Leads';S.selected=c.id;render();$('#page-title')?.focus();
      toast(editing?'Saved.':'Lead added.');
    });
    setTimeout(()=>form.querySelector('[name=title]').focus(),60);
  });
}
function openCheckForm(item){
  if(!item)return;
  const today=localToday();
  openDialog(`<div class="dialog-head"><h2 id="dlg-title">I checked the funder's page</h2><button class="btn quiet" data-dismiss aria-label="Close">Close</button></div>
  <p class="empty" style="padding:0 0 .8rem">Note what the page says now. Your notes, owner and status stay as they are.</p>
  <form id="check-form" novalidate><div class="grid2">
    <label class="field"><span>Date you looked</span><input class="pen" type="date" name="checked" max="${today}" value="${today}"></label>
    <fieldset class="field" style="border:0;padding:0;margin:0"><span>Is it open?</span><div class="seg">${[['open','Open'],['closed','Closed'],['unknown','Not sure']].map(([val,l])=>`<label class="chip" style="display:inline-flex;align-items:center;gap:.4rem"><input type="radio" name="sourceAvailability" value="${val}" ${(item.sourceAvailability||'unknown')===val?'checked':''} style="accent-color:var(--accent)">${l}</label>`).join('')}</div></fieldset>
    ${deadlineFields(item)}
    <label class="field"><span>At least ($)</span><input class="pen" type="number" min="0" name="fundingMin" value="${item.fundingMin??''}"></label>
    <label class="field"><span>Up to ($)</span><input class="pen" type="number" min="0" name="fundingMax" value="${item.fundingMax??''}"></label>
    <label class="field"><span>How to apply</span><input class="pen" name="applicationRoute" value="${esc(item.applicationRoute||'')}"></label>
    <label class="field"><span>Deadline time zone</span><input class="pen" name="deadlineTimezone" value="${esc(item.deadlineTimezone||'')}"></label>
    <label class="field full"><span>Restrictions</span><textarea class="pen" name="restrictions" rows="2">${esc(item.restrictions||'')}</textarea></label>
    <label class="field full"><span>What did you notice? (optional)</span><textarea class="pen" name="checkNote" rows="2" placeholder="Anything that changed, or is still unclear"></textarea></label>
  </div><p class="form-error" id="check-error" role="alert"></p>
  <div class="dialog-foot"><button type="button" class="btn" data-dismiss>Close</button><button class="btn primary">Save check</button></div></form>`,
  dlg=>{
    const form=dlg.querySelector('#check-form');wireDeadline(form);
    form.addEventListener('submit',e=>{
      e.preventDefault();
      const f=new FormData(form),g=k=>String(f.get(k)??'');
      const checked=g('checked')&&g('checked')<=today?g('checked'):today;
      const kind=g('deadlineKind')||'unknown';
      const copy=clone(item);
      const incoming={...copy,sourceAvailability:g('sourceAvailability'),deadlineTimezone:g('deadlineTimezone').trim(),applicationRoute:g('applicationRoute'),restrictions:g('restrictions'),
        checkedAt:new Date(checked+'T12:00:00Z').toISOString(),sourceState:'CURRENT',deadlineKind:kind,deadline:kind==='confirmed'?g('deadline'):'',
        fundingMin:num(g('fundingMin')),fundingMax:num(g('fundingMax'))};
      try{validateOpportunity(incoming)}catch(err){$('#check-error').textContent=err.message;return}
      const merged=mergeRefresh(copy,incoming);
      // A fresh check is not itself a change worth flagging.
      merged.changeFlags=merged.changeFlags.filter(k=>k!=='sourceState'||copy.changeFlags?.includes('sourceState'));
      if(g('sourceAvailability')==='closed'&&!PUT_AWAY.includes(merged.status))merged.history.push({at:new Date().toISOString(),type:'staff-decision',action:'Page says closed'});
      merged.history.push({at:new Date().toISOString(),type:'source-check-note',note:g('checkNote').trim()});
      S.items=S.items.map(x=>x.id===copy.id?merged:x);persist();log('Checked the funder\'s page',merged,g('checkNote'));
      $('#dialog-root').innerHTML='';render();$('#page-title')?.focus();
      const real=merged.changeFlags.filter(k=>!(copy.changeFlags||[]).includes(k));
      toast(real.length?`Saved. Changed: ${real.map(k=>FIELD_LABEL[k]||k).join(', ')}.`:'Saved. Nothing changed.');
    });
    setTimeout(()=>form.querySelector('[name=checked]').focus(),60);
  });
}
function showCopy(name,text,onDone){
  openDialog(`<div class="dialog-head"><h2 id="dlg-title">Copy the file</h2><button class="btn quiet" data-dismiss aria-label="Close">Close</button></div>
  <p>Copy this text, paste it into a plain text file, and save it as <strong>${esc(name)}</strong>.</p>
  <textarea id="copy-text" class="pen" rows="8" readonly style="font-family:ui-monospace,monospace;font-size:.8em">${esc(text)}</textarea>
  <div class="dialog-foot"><button class="btn primary" id="copy-btn">Copy</button></div>`,
  dlg=>{dlg.querySelector('#copy-btn').onclick=async()=>{const ta=dlg.querySelector('#copy-text');try{await navigator.clipboard.writeText(text);toast('Copied.')}catch{ta.focus();ta.select();toast('Selected. Press Ctrl+C (or ⌘+C) to copy.')}onDone&&onDone()}});
}

// ------------------------------------------------------------------- tour --
function startTour(){S.tour=0;if(S.tab!=='Home'){S.tab='Home';S.selected=null;render()}showTour()}
function endTour(done=true){
  S.tour=-1;document.querySelectorAll('.tour-ring,.tour-card,.tour-dim').forEach(n=>n.remove());
  S.onboarded=true;save(STORAGE.onboarding,{result:done?'completed':'skipped',at:new Date().toISOString()});
  if(done)toast('Want to try it on the practice lead?',{label:'Open it',fn:()=>ACT.practice()});
  $('#page-title')?.focus();
}
function showTour(){
  document.querySelectorAll('.tour-ring,.tour-card,.tour-dim').forEach(n=>n.remove());
  const step=TOUR[S.tour];if(!step)return endTour(true);
  const target=step.target?[...document.querySelectorAll(`[data-tour="${CSS.escape(step.target)}"]`)].find(n=>n.offsetParent!==null||n.getClientRects().length):null;
  const card=document.createElement('div');card.className='tour-card';card.setAttribute('role','dialog');card.setAttribute('aria-modal','true');card.setAttribute('aria-labelledby','tour-title');
  card.innerHTML=`<span class="dots" role="img" aria-label="Step ${S.tour+1} of ${TOUR.length}">${TOUR.map((_,k)=>`<i class="${k<=S.tour?'on':''}"></i>`).join('')}</span><h2 id="tour-title" tabindex="-1">${esc(step.title)}</h2><p>${esc(step.body)}</p>
    <div class="row" style="justify-content:space-between;margin-top:.8rem"><button class="btn quiet" id="tour-skip">Skip tour</button><div class="row">${S.tour>0?'<button class="btn" id="tour-back">Back</button>':''}<button class="btn primary" id="tour-next">${S.tour===TOUR.length-1?'Done':'Next'}</button></div></div>`;
  if(target){
    const r=target.getBoundingClientRect(),pad=6;
    const ring=document.createElement('div');ring.className='tour-ring';
    Object.assign(ring.style,{left:`${r.left-pad}px`,top:`${r.top-pad}px`,width:`${r.width+pad*2}px`,height:`${r.height+pad*2}px`});
    document.body.appendChild(ring);document.body.appendChild(card);
    const cw=card.offsetWidth,ch=card.offsetHeight,vw=window.innerWidth,vh=window.innerHeight;
    let left=r.right+16,top=r.top;
    if(left+cw>vw-16){left=Math.min(Math.max(16,r.left),vw-cw-16);top=r.bottom+16;if(top+ch>vh-16)top=r.top-ch-16}
    card.style.left=`${Math.max(16,left)}px`;card.style.top=`${Math.max(16,Math.min(top,vh-ch-16))}px`;
  }else{
    const dim=document.createElement('div');dim.className='tour-dim';document.body.appendChild(dim);document.body.appendChild(card);
    card.style.left=`${Math.max(16,(window.innerWidth-card.offsetWidth)/2)}px`;card.style.top=`${Math.max(16,(window.innerHeight-card.offsetHeight)/2)}px`;
  }
  card.querySelector('#tour-skip').onclick=()=>endTour(false);
  card.querySelector('#tour-next').onclick=()=>{S.tour++;S.tour>=TOUR.length?endTour(true):showTour()};
  card.querySelector('#tour-back')?.addEventListener('click',()=>{S.tour--;showTour()});
  card.querySelector('#tour-title').focus();
}
window.addEventListener('resize',()=>{if(S.tour>=0)showTour()});

// --------------------------------------------------------------- keyboard --
document.addEventListener('keydown',e=>{
  const layer=document.querySelector('.tour-card')||document.querySelector('#dialog-root .dialog');
  if(!layer)return;
  if(e.key==='Escape'){e.preventDefault();if(layer.classList.contains('tour-card'))endTour(false);else closeDialog();return}
  if(e.key==='Tab'){
    const nodes=[...layer.querySelectorAll('button,input,select,textarea,a[href],summary')].filter(n=>!n.disabled&&!n.hidden&&n.getClientRects().length);
    if(!nodes.length)return;
    const first=nodes[0],last=nodes[nodes.length-1];
    if(e.shiftKey&&(document.activeElement===first||!layer.contains(document.activeElement))){e.preventDefault();last.focus()}
    else if(!e.shiftKey&&(document.activeElement===last||!layer.contains(document.activeElement))){e.preventDefault();first.focus()}
  }
});

// ------------------------------------------------------------------- boot --
applyComfort();
render();
if(!S.onboarded)setTimeout(startTour,250);
connectCloud();
