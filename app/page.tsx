'use client';
import {GrantCards,LocalGrantDetail,GrantSetup,newLocalGrant} from '@/components/local-grants';
import {Tip,NextStep,Dots,useTips,when,whenTone,notes,needsYou,nice,done,kindName} from '@/components/guide';
import {useEffect,useState,useRef} from 'react';
import {House,FolderOpen,CalendarDays,Wallet,ShieldCheck,Radio,Settings,Plus,ArrowUpRight,Download,Check,Search,AlertTriangle,X,FileText,CircleHelp,ChevronDown,ChevronUp} from 'lucide-react';
import {GrantRecord as RecordItem,statuses,financeState,attentionRank,localDay} from '@/lib/records';

// The everyday pages: four, so there is never a wall of choices. Everything else waits
// behind "More tools" and is remembered in this browser once opened.
const everyday=[['Overview','Home',House],['Grants','Grants',FolderOpen],['Deadlines','To-do list',CalendarDays],['Help','Help',CircleHelp]] as const;
const extra=[['Finances','Money',Wallet],['Compliance','Reports & proof',ShieldCheck],['Tasks','Staff tasks',Check],['Issues','Problems',AlertTriangle],['Grant Radar','Grant Radar',Radio],['Activity','Recent changes',FileText],['Settings','Settings & backup',Settings]] as const;
const nameOf=(tab:string)=>[...everyday,...extra].find(s=>s[0]===tab)?.[1]||tab;
const isExtra=(tab:string)=>extra.some(s=>s[0]===tab);
// One line per page, shown until put away. Never more than one on a page.
const pageTips:Record<string,string>={
 Overview:'Start with Your next step. It always shows one thing to do.',
 Grants:'Each card is one grant. Click a card to see its reports and what you collect.',
 Deadlines:'Everything with a date, soonest first. Click one, then press Mark done when it’s finished.',
 Finances:'These are totals you type in. They don’t connect to accounting.',
 Compliance:'A funder requirement is done when it has a link to what you sent.',
 Tasks:'Staff tasks are your team’s work. Finishing one doesn’t finish the report it helps with.',
 Issues:'Note a problem here, and who will decide what to do about it.',
 'Grant Radar':'Funding leads are possibilities, not money yet. Open one to move it to Grants.',
 Activity:'Recent saves, newest first.',
 Settings:'Download a backup before big changes.',
};
const money=(v:number)=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(v);
const blank=(kind:string):RecordItem=>({id:'',kind,title:'',grant:'',owner:'',due:'',status:kind==='grant'?'Active':kind==='opportunity'?'New':'Open',amount:0,spent:0,source:'',notes:'',demo:false,updated:''});
const day=()=>localDay();
const addLabel:Record<string,[string,string]>={Overview:['grant','Add a grant'],Grants:['grant','Add a grant'],Finances:['grant','Add a grant'],Deadlines:['requirement','Add a report or due date'],Compliance:['requirement','Add a report or due date'],Tasks:['task','Add a staff task'],Issues:['issue','Note a problem'],'Grant Radar':['opportunity','Add a funding lead']};
const formTitle:Record<string,string>={requirement:'Add a report or due date',task:'Add a staff task',issue:'Note a problem',opportunity:'Add a funding lead'};
const titleLabel:Record<string,[string,string]>={requirement:['What does the funder need?','For example: Final report'],task:['What needs doing?','For example: Collect sign-in sheets'],issue:['What is the problem?',''],opportunity:['Name of the funding lead',''],grant:['Grant name','']};

export default function Home(){
 const onboardingKey='nami-grants-onboarding-v2',moreKey='nami-grants-more-tools';
 const [onboarding,setOnboarding]=useState(-1),[storageMessage,setStorageMessage]=useState(''),[more,setMore]=useState(false);
 const onboardingHeading=useRef<HTMLHeadingElement>(null);
 const tips=useTips();
 // eslint-disable-next-line react-hooks/set-state-in-effect -- browser storage only exists after hydration
 useEffect(()=>{try{if(!localStorage.getItem(onboardingKey))setOnboarding(0);setMore(localStorage.getItem(moreKey)==='1')}catch{setOnboarding(0);setStorageMessage('This browser can’t save settings, so the welcome may appear again next time.')}},[]);
 useEffect(()=>{if(onboarding>=0)onboardingHeading.current?.focus()},[onboarding]);
 function endOnboarding(result:string){try{localStorage.setItem(onboardingKey,JSON.stringify({result,date:new Date().toISOString()}))}catch{setStorageMessage('This browser can’t save settings, so the welcome may appear again next time.')}setOnboarding(-1);setTab('Overview');setSelected(null)}
 function toggleMore(){const next=!more;setMore(next);try{localStorage.setItem(moreKey,next?'1':'0')}catch{}if(!next&&isExtra(tab)){setTab('Overview');setSelected(null)}}
 const welcome=[
  ['Welcome','This keeps track of your grants and the reports each one needs. You don’t need to learn it all now. It shows you one step at a time.'],
  ['Two places to know','Grants has one card for each grant. To-do list has every report and task, soonest first. Short tips appear as you go; press Got it to put one away.'],
  ['Where would you like to start?','Practice grants are made up, so you can try anything. Your own grants are kept separate. Either way, your next step will be waiting on Home.'],
 ];
 const [setup,setSetup]=useState<RecordItem|null>(null);
 const [loadFailed,setLoadFailed]=useState(false);
 const [tour,setTour]=useState(-1);
 const tourSteps=[['Overview','Home shows your next step, your grants, and what’s coming up.'],['Grants','Click a grant card to see its reports and what you collect.'],['Deadlines','Everything with a date, soonest first. Open one and press Mark done when it’s finished.'],['Help','Answers to common questions, and the user manual.']];
 const modalRef=useRef<HTMLElement>(null),editOpener=useRef<HTMLElement|null>(null),scopeChosen=useRef(false);
 const [tab,setTab]=useState('Overview'),[rows,setRows]=useState<RecordItem[]>([]),[events,setEvents]=useState<{id:string;action:string;title:string;at:string}[]>([]),[loading,setLoading]=useState(true),[error,setError]=useState(''),[notice,setNotice]=useState(''),[query,setQuery]=useState(''),[scope,setScopeState]=useState('demo'),[edit,setEdit]=useState<RecordItem|null>(null),[busy,setBusy]=useState(false),[picked,setSelected]=useState<RecordItem|null>(null),[showDone,setShowDone]=useState(false),[proof,setProof]=useState<string|null>(null);
 const selected=picked&&(rows.find(r=>r.id===picked.id)||picked);
 function setScope(s:string){scopeChosen.current=true;setScopeState(s)}
 async function load(){try{const r=await fetch('/api/records');const d:{records:RecordItem[];events:{id:string;action:string;title:string;at:string}[];error?:string}=await r.json();if(!r.ok)throw Error(d.error);setLoadFailed(false);setRows(d.records);setEvents(d.events);setError('');
  // Open on the agency's own grants once there are any, unless the person already chose.
  if(!scopeChosen.current&&d.records.some((x:RecordItem)=>!x.demo)){scopeChosen.current=true;setScopeState('agency')}
 }catch(e){setLoadFailed(true);setError(e instanceof Error&&e.message?e.message:'Your grants could not be loaded.')}finally{setLoading(false)}}
 // eslint-disable-next-line react-hooks/set-state-in-effect -- the first load
 useEffect(()=>{load()},[]);
 const editing=!!edit,busyRef=useRef(busy);useEffect(()=>{busyRef.current=busy});
 useEffect(()=>{if(!editing)return;const previous=editOpener.current;const handle=(e:KeyboardEvent)=>{if(e.key==='Escape'&&!busyRef.current)setEdit(null);if(e.key==='Tab'){const els=modalRef.current?.querySelectorAll<HTMLElement>('button:not(:disabled),input,select,textarea,summary');if(!els?.length)return;const first=els[0],last=els[els.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}};document.addEventListener('keydown',handle);return()=>{document.removeEventListener('keydown',handle);previous?.focus()}},[editing]);
 useEffect(()=>{if(busy||!editing||modalRef.current?.contains(document.activeElement))return;modalRef.current?.querySelector<HTMLElement>('[role=alert],input')?.focus()},[busy,editing]);
 // The saved line says where the thing went, then goes on its own.
 useEffect(()=>{if(!notice)return;const t=setTimeout(()=>setNotice(''),9000);return()=>clearTimeout(t)},[notice]);
 function openEdit(r:RecordItem){editOpener.current=document.activeElement as HTMLElement|null;setError('');setEdit(r)}
 async function action(payload:object,went='Saved.'){setBusy(true);setError('');try{const r=await fetch('/api/records',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});const d:{error?:string}=await r.json();if(!r.ok)throw Error(d.error);await load();setNotice(went);return true;}catch(e){setError(e instanceof Error&&e.message?e.message:'That didn’t save. Nothing you typed has been lost.');return false;}finally{setBusy(false)}}
 const scoped=rows.filter(r=>r.demo===(scope==='demo'));const grants=scoped.filter(r=>r.kind==='grant');const obligations=scoped.filter(r=>r.kind==='requirement');const active=obligations.filter(r=>r.status!=='Complete'&&r.status!=='Archived');
 const flagged=scoped.filter(r=>attentionRank(r,scoped)>0).length;
 const comingUp=scoped.filter(r=>!done(r)&&needsYou(r,scoped)).sort((a,b)=>(a.due||'9999').localeCompare(b.due||'9999'));
 const filtered=scoped.filter(r=>(r.title+' '+r.owner+' '+r.notes).toLowerCase().includes(query.toLowerCase()));
 function openSetup(r:RecordItem){setError('');setSetup(r)}
 function add(kind:string,grant?:RecordItem){if(kind==='grant'){openSetup(newLocalGrant(scope==='demo'));return;}const g=grant||(selected?.kind==='grant'?selected:null);openEdit({...blank(kind),demo:scope==='demo',grant:kind==='opportunity'?'':g?.id||'',owner:g?.owner||''});}
 function tryLocalSample(){const r=newLocalGrant(true);r.title='Neighborhood Family Fund (practice)';r.amount=5000;r.owner='Associate Director';r.tracking!.funder='Fictional Neighborhood Foundation';r.tracking!.fields[0].target='30';r.tracking!.fields[0].collect='Count each household once during the grant; update monthly.';r.tracking!.fields[1].target='75';setScope('demo');openSetup(r)}
 function download(name:string,value:unknown){const u=URL.createObjectURL(new Blob([JSON.stringify(value,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000)}
 function go(next:string){setTab(next);setSelected(null);setQuery('');setProof(null)}
 const parentGrant=(r:RecordItem)=>r.kind==='grant'?null:grants.find(g=>g.id===r.grant)||null;
 const grantName=(id:string)=>grants.find(g=>g.id===id)?.title||'';
 const wentFor=(r:RecordItem)=>r.kind==='issue'?'Saved to Problems'+(more?'.':' (under More tools).'):r.kind==='opportunity'?'Saved to Grant Radar'+(more?'.':' (under More tools).'):'Saved to the To-do list'+(grantName(r.grant)?' and to '+grantName(r.grant)+'.':'.');
 async function markDone(r:RecordItem,source?:string){if(await action({op:'save',record:{...r,status:'Complete',...(source?{source}:{})}},'Marked done. You’ll find it under Show finished in the To-do list.')){setProof(null);setSelected(parentGrant(r))}}
 function recordRow(r:RecordItem){const n=notes(r,scoped).filter(x=>!/passed|soon/.test(x));return <button className="record" key={r.id} onClick={()=>{setSelected(r);setProof(null)}}><span><b>{r.title}</b><small>{kindName[r.kind]}{grantName(r.grant)?' · '+grantName(r.grant):''}{r.owner?' · '+r.owner:''}</small>{!done(r)&&n.length>0&&<small className="gentle">{n.join(' · ')}</small>}</span><span className={'badge '+whenTone(r)}>{when(r)}</span><span>{nice(r.due)}</span><ArrowUpRight size={18} aria-hidden/></button>}
 const navButton=(id:string,label:string,Icon:typeof House)=><button key={id} className={tab===id?'nav active':'nav'} aria-current={tab===id?'page':undefined} onClick={()=>go(id)}><Icon size={20}/>{label}</button>;
 const [addKind,addText]=addLabel[tab]||['',''];
 return <div className="workspace"><aside className="sidebar"><a className="brand" href="/">N<span> / </span>Grants</a><p className="eyebrow">NAMI WORKSPACE</p>
 <nav aria-label="Pages">{everyday.map(([id,label,Icon])=>navButton(id,label,Icon))}
  <button className="nav more" aria-expanded={more} onClick={toggleMore}>{more?<ChevronUp size={20}/>:<ChevronDown size={20}/>}{more?'Fewer tools':'More tools'}</button>
  {more&&extra.map(([id,label,Icon])=>navButton(id,label,Icon))}</nav>
 <div className="side-bottom"><span className="prototype">WORKING PROTOTYPE</span></div></aside>
 <main><header><div className="breadcrumb">{nameOf(tab)}</div><label className="scope">Showing<select aria-label="Which grants to show" value={scope} onChange={e=>{setScope(e.target.value);setSelected(null)}}><option value="demo">Practice grants (made up)</option><option value="agency">Our grants</option></select></label></header>
 <div className="content">
 {onboarding>=0&&<section className="panel onboarding" aria-label="Welcome"><Dots at={onboarding} of={welcome.length}/><h2 ref={onboardingHeading} tabIndex={-1}>{welcome[onboarding][0]}</h2><p>{welcome[onboarding][1]}</p>{onboarding===0&&<p>This is a public test site, so please don’t type private details about the people you serve.</p>}{storageMessage&&<p role="status">{storageMessage}</p>}
  {onboarding===2?<div className="onboarding-actions"><button className="primary" onClick={async()=>{endOnboarding('practice');setScope('demo');if(!rows.some(r=>r.demo))await action({op:'seed'},'Practice grants are ready. Your next step is below.')}}>Practice with made-up grants</button><button className="primary" onClick={()=>{endOnboarding('agency');setScope('agency');openSetup(newLocalGrant(false))}}>Add our first grant</button><button onClick={()=>setOnboarding(1)}>Back</button></div>
  :<div className="onboarding-actions"><button disabled={onboarding===0} onClick={()=>setOnboarding(onboarding-1)}>Back</button><button className="primary" onClick={()=>setOnboarding(onboarding+1)}>Next</button><button onClick={()=>endOnboarding('skipped')}>Skip</button></div>}</section>}
 <div className="heading"><div><p className="eyebrow">{new Date().toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'})}</p><h1>{selected?selected.title:nameOf(tab)}</h1>{scope==='demo'&&<p className="subtitle">Practice grants, made up, so try anything.</p>}</div>
  {!selected&&addKind&&<button disabled={loading||loadFailed} className="primary" onClick={()=>add(addKind)}><Plus size={18}/> {addText}</button>}</div>
 {tour>=0&&<section className="panel tour" aria-label="Short tour"><Dots at={tour} of={tourSteps.length}/><b>{nameOf(tourSteps[tour][0])}</b><p>{tourSteps[tour][1]}</p><button disabled={tour===0} onClick={()=>{setTour(tour-1);go(tourSteps[tour-1][0])}}>Back</button><button className="primary" onClick={()=>{if(tour===tourSteps.length-1){setTour(-1);go('Overview')}else{setTour(tour+1);go(tourSteps[tour+1][0])}}}>{tour===tourSteps.length-1?'Finish':'Next'}</button><button onClick={()=>setTour(-1)}>Close</button></section>}
 {error&&!edit&&!setup&&<div role="alert" className="error">{error}{loadFailed&&<button onClick={load}>Try again</button>}</div>}
 {notice&&<div role="status" className="notice"><span><Check size={18} aria-hidden/> {notice}</span><button aria-label="Close message" onClick={()=>setNotice('')}><X size={16}/></button></div>}
 {!loading&&!loadFailed&&scope==='demo'&&!scoped.length&&<div className="radar-banner"><div><h2>Practice grants aren’t loaded yet</h2><p>Load a few made-up grants to try everything safely.</p><button className="primary" disabled={busy} onClick={()=>action({op:'seed'},'Practice grants are ready. Your next step is on Home.')}>Load practice grants</button></div></div>}
 {loading&&tab!=='Help'?<div className="panel">Loading your grants…</div>
 :loadFailed&&tab!=='Help'?<section className="panel" role="alert"><h2>Your grants couldn’t be loaded</h2><p>Nothing has been lost. Press Try again above in a moment.</p></section>
 :selected?.kind==='grant'?<>{onboarding<0&&<Tip id="grant" tips={tips}>Add each report the funder asks for under Reports &amp; due dates. Edit grant changes amounts, dates and what you collect.</Tip>}<LocalGrantDetail grant={selected} rows={scoped} more={more} edit={()=>openSetup(selected)} open={setSelected} add={add} back={()=>setSelected(null)}/></>
 :selected?<>
  <button className="text-button" onClick={()=>{setProof(null);setSelected(parentGrant(selected))}}>← Back to {parentGrant(selected)?.title||nameOf(tab)}</button>
  {onboarding<0&&<Tip id="record" tips={tips}>When this is finished, press Mark done.</Tip>}
  <div className="detail-grid"><section className="panel record-detail">
   <p><span className={'badge '+whenTone(selected)}>{when(selected)}</span></p>
   <dl>{([['What it is',kindName[selected.kind]],['Due',nice(selected.due)||'No date yet'],['Who is doing it',selected.owner||'No one yet'],['Grant',grantName(selected.grant)||'Not linked to a grant'],...(selected.kind==='opportunity'?[['Amount to ask for',money(selected.amount)]]:[]),['Status',selected.status],
    ...(more?[['Source checked',!selected.verifiedOn?'Not recorded':(Date.parse(day())-Date.parse(selected.verifiedOn))/86400000>30?'Over 30 days ago':'On '+nice(selected.verifiedOn)],['Waits for',scoped.find(r=>r.id===selected.dependsOn)?.title||'Nothing'],...(selected.kind==='issue'?[['How serious',selected.severity||'Medium'],['Who decides',selected.escalationOwner||'No one yet']]:[]),['Last saved',new Date(selected.updated).toLocaleString()]]:[])] as [string,string][]).map(([k,v])=><div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
   {!done(selected)&&notes(selected,scoped).length>0&&<p className="gentle">{notes(selected,scoped).join(' · ')}</p>}
   {selected.notes&&<><h3>Notes</h3><p className="prewrap">{selected.notes}</p></>}
   {selected.source&&<p><a href={selected.source} target="_blank" rel="noreferrer">Open the linked document ↗</a></p>}
   {proof!==null?<form className="proof" onSubmit={e=>{e.preventDefault();markDone(selected,proof)}}><label>Paste a link to what you sent: an email, a shared-drive file or a web page<input type="url" required autoFocus placeholder="https://…" value={proof} onChange={e=>setProof(e.target.value)}/></label>{error&&<p role="alert" className="error">{error}</p>}<div className="form-actions"><button type="button" onClick={()=>setProof(null)}>Cancel</button><button className="primary" disabled={busy}>{busy?'Saving…':'Save link and mark done'}</button></div></form>
   :<div className="onboarding-actions">{['requirement','task'].includes(selected.kind)&&!done(selected)&&<button className="primary" disabled={busy} onClick={()=>selected.kind==='requirement'&&!selected.source?setProof(''):markDone(selected)}><Check size={18}/> Mark done</button>}
    {selected.kind==='opportunity'&&grants.some(g=>g.notes.includes('Radar lead ID: '+selected.id))?<span className="badge">Already in Grants</span>:selected.kind==='opportunity'&&!done(selected)&&<button className="primary" disabled={busy} onClick={async()=>{if(await action({op:'promote',id:selected.id},'Moved to Grants as a pending award.'))setSelected(null)}}>Awarded: move to Grants</button>}
    <button onClick={()=>openEdit(selected)}>Edit</button></div>}
  </section>
  {selected.dependsOn&&<section className="panel"><h2>Waits for</h2>{scoped.filter(r=>r.id===selected.dependsOn).map(recordRow)}</section>}</div></>
 :tab==='Overview'?<>
  {onboarding<0&&<Tip id="Overview" tips={tips}>{pageTips.Overview}</Tip>}
  <NextStep rows={scoped} open={setSelected} addGrant={()=>add('grant')} addReport={g=>add('requirement',g)}/>
  <div className="section-head"><h2>Your grants</h2>{scope==='demo'&&<button onClick={tryLocalSample}>Try a $5,000 practice grant</button>}</div>
  {grants.some(g=>g.status!=='Archived')?<GrantCards grants={grants.filter(g=>g.status!=='Archived')} rows={scoped} open={setSelected}/>:<Empty text="Your grants will appear here."/>}
  <section className="panel"><div className="section-head"><h2>Coming up</h2><button className="text-button" onClick={()=>go('Deadlines')}>Whole to-do list ↗</button></div>{comingUp.length?comingUp.slice(0,8).map(recordRow):<Empty text="Nothing is due in the next two weeks."/>}</section>
  {more&&<details className="panel"><summary>Totals for administrators</summary><div className="metrics"><div className="metric dark"><span>Active awards</span><strong>{grants.filter(g=>g.status==='Active').length}</strong><small>{money(grants.filter(g=>g.status==='Active').reduce((s,g)=>s+g.amount,0))} awarded</small></div><button className="metric" onClick={()=>go('Deadlines')}><span>Items with a flag</span><strong>{flagged}</strong><small>Dates, problems, missing details</small></button><button className="metric" onClick={()=>go('Compliance')}><span>Requirements without a proof link</span><strong>{obligations.filter(g=>!g.source&&g.status!=='Archived').length}</strong><small>See Reports &amp; proof</small></button><button className="metric" onClick={()=>go('Finances')}><span>Recorded spending</span><strong>{money(grants.reduce((s,g)=>s+g.spent,0))}</strong><small>Typed in · not from accounting</small></button></div>
   <div className="signal"><span>Open requirements with no one assigned</span><b>{active.filter(r=>!r.owner).length}</b></div><div className="signal"><span>Grants without an award-terms link</span><b>{grants.filter(r=>!r.source).length}</b></div></details>}
 </>
 :tab==='Help'?<section className="panel settings help"><h2>Common questions</h2>
  {[['How do I add a grant?','Press Add a grant at the top of Home or Grants. Only the name is needed; the rest can wait.'],
    ['How do I add a report the funder needs?','Open the grant and press Add a report or due date.'],
    ['How do I mark something done?','Open it from the To-do list and press Mark done. A funder requirement asks for a link to what you sent.'],
    ['How do I change a grant?','Open the grant and press Edit grant.'],
    ['Can I practice without touching our real grants?','Yes. At the top of the page, choose Practice grants. Nothing there is real.'],
    ['Where are money, problems and backups?','Press More tools at the bottom of the menu.'],
    ['Is this private?','No. This is a public test site. Please don’t type private details about the people you serve.']].map(([q,a])=><details key={q}><summary>{q}</summary><p>{a}</p></details>)}
  <div className="onboarding-actions"><button onClick={()=>{setTour(-1);setOnboarding(0)}}>Show the welcome again</button><button onClick={()=>{setOnboarding(-1);setScope('demo');setTour(0);go('Overview')}}>Take the short tour</button><button disabled={!tips.hidden} onClick={tips.reset}>{tips.hidden?'Show tips again':'All tips are showing'}</button></div>
  <h3>Guides</h3><ul><li><a href="/quickstart.html">One-page quick start</a></li><li><a href="/manual.html">Full user manual</a></li><li><a href="/Nami_Grant_User_Manual.pdf" download>Manual as PDF</a> · <a href="/Nami_Grant_User_Manual.docx" download>as Word</a></li></ul>
  {storageMessage&&<p>{storageMessage}</p>}</section>
 :tab==='Settings'?<>{onboarding<0&&<Tip id="Settings" tips={tips}>{pageTips.Settings}</Tip>}<section className="panel settings"><h2>Backups</h2>
  <div className="setting"><div><h3>Download a backup</h3><p>Saves every record in {scope==='demo'?'Practice grants':'Our grants'} to a file.</p></div><button onClick={()=>download('grant-workspace-'+scope+'.json',{schemaVersion:3,exportedAt:new Date().toISOString(),workspace:scope,records:scoped})}><Download size={16}/> Download backup</button></div>
  <div className="setting"><div><h3>Add records from a file</h3><p>Adds records from a backup or a Grant Radar file. Nothing already here is changed. Up to 100 at a time.</p></div><label className="file-button">Choose a file<input type="file" accept=".json,application/json" onChange={async e=>{const f=e.target.files?.[0];if(!f)return;try{const d=JSON.parse(await f.text());await action({op:'import',schemaVersion:d.schemaVersion,records:d.records,demo:scope==='demo'},'Added from the file. They’re in Grants and the To-do list.')}catch{setError('That file couldn’t be read. Choose a backup file from this app.')}e.target.value=''}}/></label></div>
  <div className="setting"><div><h3>Start the practice grants over</h3><p>Puts the made-up practice grants back to how they began. Our grants are not touched.</p></div><button disabled={busy} onClick={()=>{if(window.confirm('Put the practice grants back to how they began? Our grants are not touched.'))action({op:'reset',confirm:'RESET SAMPLE'},'Practice grants are back to how they began.')}}>Start practice over</button></div>
  <h3>Connections</h3><p>Nothing is connected yet: no email, calendar, shared drive or accounting. Everything here is typed in by hand. These would need agency setup:</p>
  <ul>{['Microsoft sign-in (Entra ID): who can see and change what','SharePoint / OneDrive: links to the real documents','Outlook, Calendar and Teams: reminders','Excel / Power Automate: bringing data in','Accounting system: real spending totals','Grant Radar: new funding leads','Program totals: aggregate counts only, never people’s records'].map(x=><li key={x}>{x}</li>)}</ul>
  <p>This is a public test site and nothing here is password-protected. Please don’t type private details about the people you serve.</p></section></>
 :tab==='Activity'?<>{onboarding<0&&<Tip id="Activity" tips={tips}>{pageTips.Activity}</Tip>}<section className="panel"><h2>Recent changes</h2>{events.length?events.map(e=><div className="activity" key={e.id}><Check size={16}/><div><b>{e.action}</b><p>{e.title}</p></div><small>{new Date(e.at).toLocaleString()}</small></div>):<Empty text="Saved changes will appear here."/>}</section></>
 :tab==='Finances'?<>{onboarding<0&&<Tip id="Finances" tips={tips}>{pageTips.Finances}</Tip>}<section className="panel"><div className="section-head"><h2>Money by grant</h2><button onClick={()=>download('grant-budget-summary.json',grants)}><Download size={16}/> Download</button></div>
  {grants.length?grants.map(g=><button className="budget-row" key={g.id} onClick={()=>setSelected(g)}><div><b>{g.title}</b><small>{g.owner||'No one assigned yet'}</small><small>Spending typed in {g.financialAsOf?'on '+nice(g.financialAsOf)+(financeState(g)==='STALE'?' (over 30 days ago)':''):', date not recorded'}</small></div><div><small>Award</small>{money(g.amount)}</div><div><small>Spent</small>{money(g.spent)}</div><div><small>Left</small><b className={g.spent>g.amount?'over':''}>{g.spent>g.amount?'Over by '+money(g.spent-g.amount):money(g.amount-g.spent)}</b></div></button>):<Empty text="Each grant’s award and spending will appear here."/>}</section></>
 :<>
  {onboarding<0&&<Tip id={tab} tips={tips}>{pageTips[tab]}</Tip>}
  <div className="toolbar"><label className="search"><Search size={18}/><input aria-label="Search" placeholder="Search by name, person or note…" value={query} onChange={e=>setQuery(e.target.value)}/></label>{tab!=='Grants'&&<label className="check-label"><input type="checkbox" checked={showDone} onChange={e=>setShowDone(e.target.checked)}/> Show finished</label>}</div>
  {tab==='Grant Radar'&&<div className="radar-banner"><Radio size={25}/><div><h2>Funding leads</h2><p>Add leads by hand, or from a file using the template.</p><button onClick={()=>download('grant-radar-template.json',{schemaVersion:3,records:[{...blank('opportunity'),title:'Replace with opportunity name',notes:'Add eligibility and funder details',source:'https://example.org'}]})}><Download size={16}/> Download template</button></div></div>}
  {(()=>{const kinds=tab==='Deadlines'?['requirement','task']:[tab==='Grants'?'grant':tab==='Grant Radar'?'opportunity':tab==='Tasks'?'task':tab==='Issues'?'issue':'requirement'];
   const list=filtered.filter(r=>kinds.includes(r.kind)).sort((a,b)=>(a.due||'9999').localeCompare(b.due||'9999'));
   if(tab==='Grants')return list.length?<GrantCards grants={list} rows={scoped} open={setSelected}/>:<Empty text={query?'No grants match that search.':'Your grants will appear here.'}/>;
   const open=list.filter(r=>!done(r)),finished=list.filter(done);
   return <section className="panel">{open.length?open.map(recordRow):<Empty text={query?'Nothing matches that search.':tab==='Deadlines'?'Reports and tasks with dates will appear here.':'Items will appear here.'}/>}
    {showDone&&finished.length>0&&<><h3>Finished</h3>{finished.map(recordRow)}</>}</section>})()}
 </>}
 <footer>Nami Grant Workspace <span>Public test site: no private details about the people you serve. Check dates and terms against the award letter.</span></footer></div></main>
 {setup&&<GrantSetup initial={setup} busy={busy} error={error} close={()=>setSetup(null)} save={async(record,requirements)=>{const ok=await action(record.id?{op:'save',record}:{op:'setup',record,requirements},record.id?'Saved.':'Saved. '+record.title+' is in Grants'+(requirements.length?', and its reports are in the To-do list.':'.'));if(ok&&!record.id){go('Grants')}return ok}}/>}
 {edit&&<div className="modal-backdrop"><section ref={modalRef} className="modal" role="dialog" aria-modal="true" aria-labelledby="form-title"><div className="section-head"><h2 id="form-title">{edit.id?'Edit':formTitle[edit.kind]}</h2><button aria-label="Close" disabled={busy} onClick={()=>setEdit(null)}><X size={20}/></button></div>
  <form onSubmit={async e=>{e.preventDefault();if(await action({op:'save',record:edit},edit.id?'Saved.':wentFor(edit)))setEdit(null)}}>
   <label>{titleLabel[edit.kind][0]}<input autoFocus required maxLength={180} placeholder={titleLabel[edit.kind][1]} value={edit.title} onChange={e=>setEdit({...edit,title:e.target.value})}/></label>
   {!['grant','opportunity'].includes(edit.kind)&&<label>Which grant is it for?<select value={edit.grant} onChange={e=>setEdit({...edit,grant:e.target.value})}><option value="">Not linked to a grant</option>{grants.map(g=><option key={g.id} value={g.id}>{g.title}</option>)}</select></label>}
   <div className="form-grid"><label>{edit.kind==='opportunity'?'Application due':'Due date'}<input type="date" value={edit.due} onChange={e=>setEdit({...edit,due:e.target.value})}/></label>
    <label>Who is doing it?<input maxLength={120} placeholder="Optional" value={edit.owner} onChange={e=>setEdit({...edit,owner:e.target.value})}/></label></div>
   {edit.kind==='opportunity'&&<label>Amount to ask for ($)<input type="number" min="0" step="0.01" max="1000000000" value={edit.amount} onChange={e=>setEdit({...edit,amount:Number(e.target.value)})}/></label>}
   <details className="more-options"><summary>More options</summary>
    <label>Status<select value={edit.status} onChange={e=>setEdit({...edit,status:e.target.value})}>{statuses[edit.kind].map(s=><option key={s}>{s}</option>)}</select></label>
    <label>Link to a document<input type="url" placeholder="https://…" value={edit.source} onChange={e=>setEdit({...edit,source:e.target.value})}/><small className="hint">{edit.kind==='requirement'?'Needed before it can be marked done, for example the report you sent.':'Optional.'}</small></label>
    <label>Notes<textarea rows={4} maxLength={10000} value={edit.notes} onChange={e=>setEdit({...edit,notes:e.target.value})}/></label>
    {['requirement','task'].includes(edit.kind)&&<label>Waits for<select value={edit.dependsOn||''} onChange={e=>setEdit({...edit,dependsOn:e.target.value})}><option value="">Nothing</option>{scoped.filter(r=>r.id!==edit.id&&['requirement','task'].includes(r.kind)).map(r=><option key={r.id} value={r.id}>{r.title}</option>)}</select><small className="hint">Another item that has to be done first.</small></label>}
    {edit.kind==='issue'&&<div className="form-grid"><label>How serious?<select value={edit.severity||'Medium'} onChange={e=>setEdit({...edit,severity:e.target.value})}>{['Low','Medium','High','Critical'].map(v=><option key={v}>{v}</option>)}</select></label><label>Who decides?<input value={edit.escalationOwner||''} onChange={e=>setEdit({...edit,escalationOwner:e.target.value})}/></label></div>}
    {more&&<label>Source checked on<input type="date" max={day()} value={edit.verifiedOn||''} onChange={e=>setEdit({...edit,verifiedOn:e.target.value})}/></label>}
   </details>
   {error&&<p role="alert" tabIndex={-1} className="error">{error}</p>}
   <div className="form-actions"><button type="button" disabled={busy} onClick={()=>setEdit(null)}>Cancel</button><button className="primary" disabled={busy}>{busy?'Saving…':'Save'}</button></div></form></section></div>}
 </div>;
}
function Empty({text}:{text:string}){return <div className="empty"><p>{text}</p></div>}
