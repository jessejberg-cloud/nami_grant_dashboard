// Grant Radar logic. No DOM here, so the tests can import it directly and the
// build can inline it into the single-file app.

export const VERSION = '2.1.0';
export const REVISION_DATE = '2026-10-05';
export const APP_ID = 'nami-grant-radar';
export const DASHBOARD_URL = 'https://nami-grant-workspace.brainspottingonline.chatgpt.site';

export const STORAGE = {
  opportunities: 'nami-radar-opportunities-v1',
  preferences: 'nami-radar-preferences-v1',
  onboarding: 'nami-radar-onboarding-v1',
  activity: 'nami-radar-activity-v1',
  settings: 'nami-radar-settings-v2'
};

// Stored status values are the Dashboard-facing names; STATUS_LABEL is the
// word on screen.
export const statuses = ['New','Verification needed','Reviewing','Shortlisted','Declined','Archived','Closed'];
export const STATUS_LABEL = {
  'New':'New',
  'Verification needed':'Needs checking',
  'Reviewing':'Looking into it',
  'Shortlisted':'Shortlisted',
  'Declined':'Not for us',
  'Archived':'Archived',
  'Closed':'Closed'
};
export const PUT_AWAY = ['Declined','Archived','Closed'];
export const sourceStates = ['CURRENT','STALE','UNKNOWN'];

export const defaultPreferences = {
  geography: ['Milwaukee County','Ozaukee County','Washington County','Waukesha County','Wisconsin'],
  interests: ['Mental health','Peer support','Family education','Advocacy','Community outreach'],
  applicantTypes: ['501(c)(3) nonprofit','Fiscal sponsor permitted','Affiliate or chapter'],
  minimumAmount: 0,
  maximumAmount: 250000,
  deadlineHorizon: 180,
  exclusions: ['Invitation-only','Closed or expired','Partisan political activity'],
  keywords: 'mental health, peer support, family education, advocacy, community outreach'
};

export const defaultSettings = {textSize:'standard', calm:false, tipsSeen:[], tipsLater:{}};

const base = {
  description: '', geography: '', applicantEligibility: '', programFit: '', fitReasons: [],
  gaps: [], disqualifiers: [], fundingMin: null, fundingMax: null, deadline: '',
  deadlineKind: 'unknown', deadlineTimezone: '', applicationRoute: '', matchingFunds: 'Unknown',
  restrictions: '', owner: '', status: 'New', notes: '', nextAction: '', checkedAt: '',
  sourceState: 'UNKNOWN', sourceType: 'official', recordType: 'public', changeFlags: [], history: [],
  sentAt: ''
};

export const initialOpportunities = [
  {...base,
    id:'pub-gmf-west-bend-2026-cycle-2', externalId:'gmf-west-bend-charitable-fund-2026-cycle-2',
    title:"West Bend Insurance Company's Charitable Fund - Cycle 2", funder:'Greater Milwaukee Foundation / West Bend Insurance Company Charitable Fund',
    officialUrl:'https://www.greatermilwaukeefoundation.org/grantseekers/funding-opportunities/west-bend-insurance-companys-charitable-fund-cycle-2',
    description:'The fund page lists mental health among its priorities and a fall 2026 application cycle.',
    geography:'Washington County, Wisconsin', applicantEligibility:'Not fully stated on the page. Check the fund and Foundation rules.',
    programFit:'Mental health is a stated priority. Whether our service area counts is not yet known.',
    fitReasons:['Mental health is a stated priority','Southeastern Wisconsin'],
    gaps:['Do we serve Washington County residents in a way that counts?','Applicant and board requirements','Award amount and portal steps'],
    disqualifiers:[], fundingMin:null, fundingMax:null, deadline:'2026-10-09', deadlineKind:'confirmed', deadlineTimezone:'Not stated on the page',
    applicationRoute:'Greater Milwaukee Foundation grant portal', matchingFunds:'Unknown',
    restrictions:'The page says the fund serves Washington County.', owner:'', status:'Verification needed',
    notes:'Found on the funder\'s public page. Whether we qualify is not checked yet.', nextAction:'Check whether we qualify by area and applicant type.',
    checkedAt:'2026-09-12T11:20:00Z', sourceState:'CURRENT', recordType:'public'
  },
  {...base,
    id:'pub-gmf-2026-cycle-2', externalId:'gmf-general-cycle-2-2026', title:'Greater Milwaukee Foundation 2026 grant cycle 2', funder:'Greater Milwaukee Foundation',
    officialUrl:'https://www.greatermilwaukeefoundation.org/grantseekers/2026-grant-guidelines-cycle-2/',
    description:'General cycle for Milwaukee, Ozaukee, Washington and Waukesha counties. The 2026 cycle has closed.',
    geography:'Milwaukee, Ozaukee, Washington and Waukesha counties', applicantEligibility:'The page asks for 501(c)(3) status, a set board size, and unrelated board members.',
    programFit:'Mental health sits inside the Foundation\'s community wellness work. This cycle has closed.',
    fitReasons:['Covers our counties','Mental health is a Foundation priority'],
    gaps:['Check our eligibility before the next cycle','Watch for the next cycle'], disqualifiers:['Applications closed June 12, 2026'],
    deadline:'2026-06-12', deadlineKind:'confirmed', deadlineTimezone:'Not stated on the page', applicationRoute:'Foundation grant portal',
    restrictions:'One application per organization per cycle. Other rules apply.', status:'Closed',
    notes:'Kept so we notice the next cycle. Not open now.', nextAction:'Look at the funding page again for the next cycle.',
    checkedAt:'2026-09-12T11:24:00Z', sourceState:'CURRENT', recordType:'public'
  },
  {...base,
    id:'pub-gmf-community-bridge', externalId:'gmf-community-bridge-directory', title:'Greater Milwaukee Foundation Community Bridge directory', funder:'Greater Milwaukee Foundation',
    officialUrl:'https://greatermilwaukeefoundation.org/community-bridge',
    description:'A nonprofit directory where organizations share funding needs with donors. It is a listing, not a grant application.',
    geography:'Greater Milwaukee area', applicantEligibility:'Directory listing rules need a look.',
    programFit:'A way for local donors to find us, rather than a grant.',
    fitReasons:['Local donors browse it','Mental health and family support work can be listed'],
    gaps:['Are we already listed?','Listing terms and who signs off','Does this belong with development outreach instead?'],
    disqualifiers:['Not a grant application'], deadline:'', deadlineKind:'rolling', deadlineTimezone:'Not applicable',
    applicationRoute:'Community Bridge directory submission', matchingFunds:'Not applicable', restrictions:'The Foundation reviews listings. Donor funding is not promised.',
    status:'Verification needed', notes:'A donor-discovery listing, not a grant.', nextAction:'Decide whether to list us.',
    checkedAt:'2026-09-12T11:28:00Z', sourceState:'CURRENT', recordType:'public'
  },
  {...base,
    id:'pub-bader-grantmaking', externalId:'bader-philanthropies-grantmaking', title:'Bader Philanthropies grantmaking programs', funder:'Bader Philanthropies',
    officialUrl:'https://bader.org/', description:'Funds work in Milwaukee including addiction recovery and neighborhood engagement.',
    geography:'Milwaukee and program-specific areas', applicantEligibility:'Not stated on the home page. Each program has its own rules.',
    programFit:'May overlap with peer support and recovery work. No open application found yet.',
    fitReasons:['Milwaukee-focused','Recovery and neighborhood work may overlap ours'],
    gaps:['Find current application guidance','Open to proposals, or invitation only?','Which programs and applicants qualify','Deadline and amount'],
    disqualifiers:['No open application found'], deadline:'', deadlineKind:'unknown', deadlineTimezone:'Unknown', applicationRoute:'Unknown',
    matchingFunds:'Unknown', restrictions:'Depends on the program.', status:'Verification needed',
    notes:'No open application found on the first look.', nextAction:'Find their current application guidance.',
    checkedAt:'2026-09-12T11:31:00Z', sourceState:'CURRENT', recordType:'public'
  },
  {...base,
    id:'sample-peer-wellbeing', externalId:'sample-peer-wellbeing-2027', title:'Community Peer Wellbeing Innovation Fund', funder:'Harbor Community Trust (made up)',
    officialUrl:'https://example.org/fictional-grant', description:'A made-up lead for practice. Try anything here; nothing is real.',
    geography:'Milwaukee County', applicantEligibility:'Made-up: 501(c)(3) community organizations.', programFit:'A strong made-up match for peer support.',
    fitReasons:['Peer support is one of our topics','Local','Flexible program support'], gaps:['Practice: confirm tax status','Practice: read the exclusions'],
    disqualifiers:[], fundingMin:25000, fundingMax:75000, deadline:'2027-01-15', deadlineKind:'confirmed', deadlineTimezone:'Central Time',
    applicationRoute:'Online form', matchingFunds:'None required', restrictions:'No equipment or building purchases.', owner:'Associate Director', status:'Reviewing',
    notes:'Practice lead. This funder does not exist.', nextAction:'Practice: open the details and add a next step.',
    checkedAt:'2026-09-12T11:35:00Z', sourceState:'CURRENT', sourceType:'sample', recordType:'sample'
  }
];

export function clone(value){ return JSON.parse(JSON.stringify(value)); }
export function normalize(value=''){ return String(value??'').trim().toLowerCase().replace(/\s+/g,' '); }

// The person's own calendar day, not UTC: at 8 pm in Milwaukee UTC is already
// tomorrow, and a deadline would tip a day early.
export function localToday(now=new Date()){
  const p=n=>String(n).padStart(2,'0');
  return `${now.getFullYear()}-${p(now.getMonth()+1)}-${p(now.getDate())}`;
}
export function daysBetween(fromISO,toISO){ return Math.round((Date.parse(toISO.slice(0,10))-Date.parse(fromISO.slice(0,10)))/86400000); }

export function blankLead(){
  return {...clone(base), id:'', externalId:'', title:'', funder:'', officialUrl:'', recordType:'public'};
}

export function stableKey(item){ return item.externalId ? `id:${normalize(item.externalId)}` : `source:${normalize(item.officialUrl)}|title:${normalize(item.title)}`; }
export function findDuplicate(items, candidate, ignoreId=''){
  const url=String(candidate.officialUrl||'').trim();
  return items.find(x=>x.id!==ignoreId && (
    (candidate.externalId && x.externalId && normalize(candidate.externalId)===normalize(x.externalId)) ||
    (url && normalize(x.title)===normalize(candidate.title) && String(x.officialUrl||'').trim()===url)
  )) || null;
}

export function dateState(item, today=localToday()){
  if(item.status==='Closed'||item.sourceAvailability==='closed') return 'CLOSED';
  if(item.deadlineKind==='rolling') return 'ROLLING';
  if(item.deadlineKind==='unknown'||!item.deadline) return 'UNKNOWN';
  if(item.deadline<today) return 'CLOSED';
  return daysBetween(today,item.deadline)<=30 ? 'APPROACHING' : 'CONFIRMED';
}
export function daysLeft(item,today=localToday()){
  if(item.deadlineKind!=='confirmed'||!item.deadline||item.deadline<today) return null;
  return daysBetween(today,item.deadline);
}

export function fitExplanation(item){
  const positives=item.fitReasons?.length||0, unknowns=item.gaps?.length||0, blocks=item.disqualifiers?.length||0;
  return {positives,unknowns,blocks,label:blocks?'Has a deal-breaker':!positives?'Fit not looked at yet':unknowns?'Promising, with questions':'Promising'};
}

export function sourceFreshness(item,today=localToday()){
  if(!item.checkedAt || !Number.isFinite(Date.parse(item.checkedAt)) || item.sourceState==='UNKNOWN')return 'UNKNOWN';
  return item.sourceState==='STALE'||daysBetween(item.checkedAt,today)>30?'STALE':'CURRENT';
}
export function needsChecking(item){
  return item.status==='Verification needed' || (!PUT_AWAY.includes(item.status) && (sourceFreshness(item)!=='CURRENT' || (item.changeFlags||[]).length>0));
}

export function safeSource(url){try{return ['https:','http:'].includes(new URL(url).protocol)?url:''}catch{return ''}}

export function validateOpportunity(item){
  if(!String(item.title||'').trim()||item.title.length>180)throw Error('Give the lead a name (up to 180 characters).');
  if(item.officialUrl&&!safeSource(item.officialUrl))throw Error('The link should start with https:// (copy it from the funder\'s page).');
  if((item.externalId||'').length>100)throw Error('The lead ID can be at most 100 characters.');
  if(item.deadlineKind==='confirmed'&&!item.deadline)throw Error('Pick the deadline date, or choose "Rolling" or "Not sure".');
  if(item.deadline&&(!/^\d{4}-\d{2}-\d{2}$/.test(item.deadline)||!Number.isFinite(Date.parse(item.deadline))||new Date(item.deadline).toISOString().slice(0,10)!==item.deadline))throw Error('That deadline is not a real date.');
  for(const k of ['fundingMin','fundingMax'])if(item[k]!=null&&(!Number.isFinite(item[k])||item[k]<0||item[k]>1e9))throw Error('Amounts go from $0 to $1 billion.');
  if(item.fundingMin!=null&&item.fundingMax!=null&&item.fundingMin>item.fundingMax)throw Error('The smallest amount is bigger than the largest. Swap them?');
  if((item.owner||'').length>120)throw Error('The owner name can be at most 120 characters.');
  return item;
}

export function researchBrief(p){return `Area: ${p.geography.join(', ')||'Anywhere'}\nTopics: ${p.interests.join(', ')||'Any'}\nWho can apply: ${p.applicantTypes.join(', ')||'Any'}\nAmount: $${p.minimumAmount}–$${p.maximumAmount}\nLooking ahead: ${p.deadlineHorizon} days\nSkip: ${p.exclusions.join(', ')||'Nothing'}\nWords: ${p.keywords}`}

export function searchLinks(p){
  const words=String(p.keywords||'').split(',').map(s=>s.trim()).filter(Boolean).slice(0,3);
  const topic=(words.length?words:p.interests.slice(0,2)).join(' OR ');
  const area=p.geography.find(g=>g!=='United States')||'';
  const q=s=>encodeURIComponent(s);
  return [
    {label:'Search the web',hint:`${topic} grant ${area}`.trim(),url:`https://www.google.com/search?q=${q(`(${topic}) grant ${area} nonprofit`)}`},
    {label:'Search federal grants (Grants.gov)',hint:'Federal funding, all states',url:`https://www.grants.gov/search-grants?keywords=${q(words[0]||'mental health')}`},
    {label:'Greater Milwaukee Foundation',hint:'Local funding opportunities',url:'https://www.greatermilwaukeefoundation.org/grantseekers/funding-opportunities/'},
    {label:'Wisconsin foundations',hint:`${area||'Wisconsin'} community foundation grants`,url:`https://www.google.com/search?q=${q(`${area||'Wisconsin'} community foundation grant ${words[0]||'mental health'}`)}`}
  ];
}

// ---- Grant Dashboard hand-off ---------------------------------------------
// The Dashboard's importer (lib/records.ts validate + api/records import)
// accepts schemaVersion 1-3, 1-100 records, and REFUSES THE WHOLE FILE if any
// one record matches an existing kind + title + source. That is why the app
// remembers sentAt and leaves sent leads out by default.

const DASHBOARD_STATUS={New:'New','Verification needed':'Reviewing',Reviewing:'Reviewing',Shortlisted:'Reviewing',Declined:'Declined',Archived:'Archived',Closed:'Archived'};

export function toGrantDashboardRecord(item,today=localToday()){
  const lines=[
    `Grant Radar ID: ${item.externalId||item.id}`,
    `Radar status: ${STATUS_LABEL[item.status]||item.status}`,
    `Kind of lead: ${item.recordType==='sample'?'PRACTICE (made up)':'Real, public lead. Eligibility not confirmed.'}`,
    `Funder: ${item.funder||'Unknown'}`,
    `Area: ${item.geography||'Unknown'}`,
    `Who can apply: ${item.applicantEligibility||'Unknown'}`,
    `Fit: ${item.programFit||'Not looked at yet'}`,
    `Why it might fit: ${(item.fitReasons||[]).join('; ')||'None noted'}`,
    `Still to find out: ${(item.gaps||[]).join('; ')||'None noted'}`,
    `Deal-breakers: ${(item.disqualifiers||[]).join('; ')||'None noted'}`,
    `Deadline: ${item.deadlineKind==='confirmed'?item.deadline:item.deadlineKind==='rolling'?'Rolling':'Not sure'}${item.deadlineTimezone?` (${item.deadlineTimezone})`:''}`,
    `How to apply: ${item.applicationRoute||'Unknown'}`,
    `Matching funds: ${item.matchingFunds||'Unknown'}`,
    `Restrictions: ${item.restrictions||'None noted'}`,
    `Funding range: ${item.fundingMin??'?'} to ${item.fundingMax??'?'} USD`,
    `Last checked: ${item.checkedAt?item.checkedAt.slice(0,10):'Never'}`,
    `Description: ${item.description||''}`,
    `Next step: ${item.nextAction||'Not set'}`,
    '', item.notes||''
  ];
  const notes=lines.join('\n');
  if(notes.length>10000)throw Error(`"${item.title}" has more notes than the Dashboard accepts (10,000 characters). Shorten its notes and try again.`);
  validateOpportunity(item);
  const checked=(item.checkedAt||'').slice(0,10);
  return {id:String(item.externalId||item.id).slice(0,100),kind:'opportunity',title:item.title.trim(),owner:item.owner||'',grant:'',
    due:item.deadlineKind==='confirmed'?item.deadline:'',status:DASHBOARD_STATUS[item.status]||'Reviewing',
    amount:Number(item.fundingMax??item.fundingMin??0),spent:0,source:safeSource(item.officialUrl||'')?item.officialUrl.trim():'',notes,
    demo:item.recordType==='sample',updated:'',verifiedOn:checked&&checked<=today?checked:''};
}
export function buildExport(items){
  if(!items.length)throw Error('Pick at least one lead to send.');
  if(items.length>100)throw Error('The Dashboard takes up to 100 leads at a time. Pick fewer.');
  if(new Set(items.map(i=>i.recordType)).size>1)throw Error('Send practice leads on their own, so they land in the Dashboard\'s Sample workspace.');
  const records=items.map(i=>toGrantDashboardRecord(i));
  if(new Set(records.map(r=>r.id)).size!==records.length)throw Error('Two picked leads share an ID. Open one and change its ID under More details.');
  const keys=records.map(r=>r.kind+'|'+r.title.toLowerCase()+'|'+r.source);
  if(new Set(keys).size!==keys.length)throw Error('Two picked leads have the same name and link. The Dashboard would refuse the file.');
  return {schemaVersion:2,demo:items[0].recordType==='sample',exportedAt:new Date().toISOString(),sourceSystem:'Nami Grant Radar',sourceVersion:VERSION,records};
}
export function exportFileName(items,today=localToday()){
  return `grant-radar-${items[0]?.recordType==='sample'?'practice-':''}${items.length}-lead${items.length===1?'':'s'}-${today}.json`;
}

// ---- Backups and bringing leads in ----------------------------------------

export function makeBackup(state){
  return {app:APP_ID,kind:'backup',version:VERSION,savedAt:new Date().toISOString(),
    opportunities:state.items,preferences:state.preferences,activity:state.activity||[]};
}

function fromDashboardRecord(r){
  const lead=blankLead();
  const status={New:'New',Reviewing:'Reviewing',Applying:'Shortlisted',Declined:'Declined',Archived:'Archived'}[r.status]||'New';
  const idLine=/Grant Radar(?: external)? ID: (.+)/.exec(r.notes||'');
  return {...lead,externalId:(idLine?idLine[1].trim():'').slice(0,100),title:String(r.title||'').trim(),officialUrl:r.source||'',owner:r.owner||'',
    deadline:r.due||'',deadlineKind:r.due?'confirmed':'unknown',fundingMax:Number(r.amount)>0?Number(r.amount):null,status,
    notes:String(r.notes||''),recordType:r.demo?'sample':'public',checkedAt:r.verifiedOn?r.verifiedOn+'T12:00:00Z':'',
    sourceState:r.verifiedOn?'CURRENT':'UNKNOWN',
    // A lead that came FROM the Dashboard is already there: sending it back
    // would make the Dashboard refuse the whole file.
    sentAt:new Date().toISOString()};
}

// Reads a Radar backup, a Radar export, or a Grant Dashboard export/template.
// Adds what is new, never overwrites, and says what it skipped and why.
export function readImport(text, existing, makeId=()=>crypto.randomUUID()){
  let data;
  try{data=JSON.parse(text)}catch{throw Error('This file is not one Grant Radar can read. Choose a .json file saved from Grant Radar or the Grant Dashboard.')}
  let incoming=[], kind='leads', preferences=null;
  if(data&&data.app===APP_ID&&Array.isArray(data.opportunities)){incoming=data.opportunities;kind='backup';preferences=data.preferences||null}
  else if(data&&Array.isArray(data.records)){
    const opp=data.records.filter(r=>r&&r.kind==='opportunity');
    if(!opp.length)throw Error('This file has no grant leads in it. (Awards and tasks from the Dashboard stay in the Dashboard.)');
    incoming=opp.map(fromDashboardRecord);kind=data.sourceSystem==='Nami Grant Radar'?'export':'dashboard';
  }
  else if(Array.isArray(data)){incoming=data}
  else throw Error('This file has no grant leads in it.');
  const added=[],skipped=[],problems=[];
  const pool=[...existing];
  for(const raw of incoming){
    if(!raw||typeof raw!=='object'){problems.push('One entry was not a lead.');continue}
    const item={...blankLead(),...raw};
    for(const k of ['fitReasons','gaps','disqualifiers','history','changeFlags'])if(!Array.isArray(item[k]))item[k]=[];
    for(const k of ['title','funder','officialUrl','externalId','owner','notes','nextAction','description'])item[k]=item[k]==null?'':String(item[k]);
    for(const k of ['fundingMin','fundingMax'])item[k]=item[k]===''||item[k]==null?null:Number(item[k]);
    if(!statuses.includes(item.status))item.status='New';
    if(!['public','sample'].includes(item.recordType))item.recordType='public';
    try{validateOpportunity(item)}catch(e){problems.push(`${item.title||'A lead with no name'}: ${e.message}`);continue}
    if(findDuplicate(pool,item)||(item.id&&pool.some(x=>x.id===item.id&&normalize(x.title)===normalize(item.title)))){skipped.push(item.title);continue}
    if(!item.id||pool.some(x=>x.id===item.id))item.id=makeId();
    pool.push(item);added.push(item);
  }
  return {kind,added,skipped,problems,preferences};
}

export function mergeRefresh(existing, incoming){
  const changed=[];
  const watched=['deadline','deadlineKind','deadlineTimezone','fundingMin','fundingMax','restrictions','applicationRoute','sourceState','sourceAvailability'];
  for(const key of watched) if(JSON.stringify(existing[key]??null)!==JSON.stringify(incoming[key]??null)) changed.push(key);
  return {...existing,...incoming,id:existing.id,owner:existing.owner,status:existing.status,notes:existing.notes,nextAction:existing.nextAction,
    history:[...(existing.history||[]),...(changed.length?[{at:new Date().toISOString(),type:'source-refresh',changed,previous:Object.fromEntries(changed.map(k=>[k,existing[k]]))}]:[])],
    changeFlags:[...new Set([...(existing.changeFlags||[]),...changed])]
  };
}
export const FIELD_LABEL={deadline:'deadline',deadlineKind:'deadline type',deadlineTimezone:'time zone',fundingMin:'smallest amount',fundingMax:'largest amount',restrictions:'restrictions',applicationRoute:'how to apply',sourceState:'page status',sourceAvailability:'open or closed'};
