'use client';
import {useEffect,useRef,useState} from 'react';
import {GrantRecord,GrantTracking,TrackingField,emptyTracking,grantProgress,localDay} from '@/lib/records';
import {Dots,done,kindName,nice,when,whenTone} from '@/components/guide';
const today=()=>localDay();
const dollars=(n:number)=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(n);
const field=(label:string,type:TrackingField['type']='number'):TrackingField=>({id:Array.from(crypto.getRandomValues(new Uint8Array(16)),b=>b.toString(16).padStart(2,'0')).join(''),label,type,value:'',target:'',owner:'',collect:'',due:'',hidden:false});
export function newLocalGrant(demo:boolean):GrantRecord{return {id:'',kind:'grant',title:'',grant:'',owner:'',due:'',status:'Active',amount:0,spent:0,source:'',notes:'',demo,updated:'',tracking:{...emptyTracking(),fields:[field('Families served'),field('People served'),field('Outcome data','longtext')]}};}
// The grant's state in calm words. A staff member's own assessment is shown as they chose it.
function standing(g:GrantRecord,rows:GrantRecord[]):[string,string]{const l=grantProgress(g,rows).label;return l==='Needs attention'?['Something is waiting','soon']:l==='Review due'?['Time for a check-in','']:l==='Not reviewed'?['','']:l==='At risk'?['At risk','soon']:[l,''];}
const nextUp=(g:GrantRecord,rows:GrantRecord[])=>rows.filter(r=>r.grant===g.id&&['requirement','task'].includes(r.kind)&&!done(r)&&r.due).sort((a,b)=>a.due.localeCompare(b.due))[0];
export function GrantCards({grants,rows,open}:{grants:GrantRecord[];rows:GrantRecord[];open:(g:GrantRecord)=>void}){
 return <div className="grant-cards">{grants.map(g=>{const [label,tone]=standing(g,rows),next=nextUp(g,rows),counts=g.tracking?.fields.filter(f=>!f.hidden&&f.type==='number'&&f.value!=='').slice(0,2)||[];
  return <button className="panel grant-card" key={g.id} onClick={()=>open(g)}>
   {g.tracking?.funder&&<span className="eyebrow">{g.tracking.funder}</span>}<h2>{g.title}</h2>
   {label&&<span className={'badge '+tone}>{label}</span>}
   <p>{dollars(g.amount)}{g.due?' · ends '+nice(g.due):''}</p>
   <p>{next?<>Next: <b>{next.title}</b> · {nice(next.due)}</>:'Nothing with a date yet'}</p>
   {counts.length>0&&<p>{counts.map(f=>f.label+': '+f.value).join(' · ')}</p>}
   <small>Open grant →</small></button>;})}</div>;
}
export function LocalGrantDetail({grant,rows,more,edit,open,add,back}:{grant:GrantRecord;rows:GrantRecord[];more:boolean;edit:()=>void;open:(r:GrantRecord)=>void;add:(kind:string)=>void;back:()=>void}){
 const t=grant.tracking||emptyTracking(),[label,tone]=standing(grant,rows),linked=rows.filter(r=>r.grant===grant.id&&r.status!=='Archived').sort((a,b)=>(a.due||'9999').localeCompare(b.due||'9999'));
 const openWork=linked.filter(r=>!done(r)),finished=linked.filter(done),measures=t.fields.filter(f=>!f.hidden);
 const facts=([['Award',dollars(grant.amount)],['Ends',nice(grant.due)],['Started',nice(t.startOn)],['Who is in charge',grant.owner],['Status',grant.status==='Active'?'':grant.status]] as [string,string][]).filter(([,v])=>v);
 const row=(r:GrantRecord)=><button className="record" key={r.id} onClick={()=>open(r)}><span><b>{r.title}</b><small>{kindName[r.kind]}{r.owner?' · '+r.owner:''}</small></span><span className={'badge '+whenTone(r)}>{when(r)}</span><span>{nice(r.due)}</span></button>;
 return <div className="local-grant"><button className="text-button" onClick={back}>← Back to grants</button>
  <section className="panel"><div className="section-head"><div>{t.funder&&<p className="eyebrow">{t.funder}</p>}<h2>At a glance</h2></div><button onClick={edit}>Edit grant</button></div>
   {label&&<p><span className={'badge '+tone}>{label}</span></p>}
   <div className="grant-summary">{facts.map(([k,v])=><div key={k}><small>{k}</small><strong>{v}</strong></div>)}</div>
   {t.assessment!=='Not reviewed'&&<p>Last check-in: <b>{t.assessment}</b>{t.reviewedOn?' on '+nice(t.reviewedOn):''}.</p>}
   {grant.source&&<p><a href={grant.source} target="_blank" rel="noreferrer">Open the award terms ↗</a></p>}
   {grant.notes&&<p className="prewrap">{grant.notes}</p>}</section>
  <section className="panel"><div className="section-head"><h2>Reports &amp; due dates</h2></div>
   {openWork.length?openWork.map(row):<p>Nothing here yet. Check the award letter for each report the funder asks for.</p>}
   <div className="onboarding-actions"><button className="primary" onClick={()=>add('requirement')}>Add a report or due date</button><button onClick={()=>add('task')}>Add a staff task</button>{more&&<button onClick={()=>add('issue')}>Note a problem</button>}</div>
   {finished.length>0&&<details><summary>Finished</summary>{finished.map(row)}</details>}</section>
  <section className="panel"><div className="section-head"><h2>What you collect</h2></div>
   {measures.length?<div className="grant-cards">{measures.map(f=><article className="collection-card" key={f.id}><h3>{f.label}</h3>
    {f.type==='link'&&f.value?<a href={f.value} target="_blank" rel="noreferrer">Open the link ↗</a>:f.value?<p className="prewrap measure-value">{f.type==='date'?nice(f.value):f.value}</p>:null}
    {f.type==='number'&&f.target!==''&&<p>Goal: {f.target}</p>}
    {f.collect&&<p>{f.collect}</p>}
    {(f.owner||f.due)&&<small>{[f.owner,f.due&&'by '+nice(f.due)].filter(Boolean).join(' · ')}</small>}</article>)}</div>
   :<p>Nothing chosen yet. Press Edit grant to choose what this funder wants to know.</p>}</section>
  {!!t.zipCodes.length&&<section className="panel"><h2>ZIP codes served</h2><div className="table-scroll"><table><thead><tr><th>ZIP code</th><th>Families</th><th>People</th></tr></thead><tbody>{t.zipCodes.map((z,i)=><tr key={i}><td>{z.zip}</td><td>{z.families}</td><td>{z.people}</td></tr>)}</tbody></table></div><p>Totals only. These are not added to the counts above.</p></section>}
  {!!t.payments.length&&<section className="panel"><h2>Where the money went</h2><p>Payments listed here: {dollars(t.payments.reduce((n,p)=>n+Number(p.amount||0),0))}.</p>{t.payments.map((v,i)=><article className="collection-card" key={i}><h3>{v.recipient||'Payment'}{v.amount===''?'':' · '+dollars(Number(v.amount))}</h3>{(v.date||v.purpose)&&<p>{[nice(v.date),v.purpose].filter(Boolean).join(' · ')}</p>}{v.source&&<a href={v.source} target="_blank" rel="noreferrer">Open the receipt ↗</a>}</article>)}</section>}
  {!!t.stories.length&&<section className="panel"><h2>Stories &amp; photos</h2>{t.stories.map((s,i)=><article className="collection-card" key={i}>{s.title&&<h3>{s.title}</h3>}<p className="prewrap">{s.text}</p>{s.photo&&<a href={s.photo} target="_blank" rel="noreferrer">See the photo ↗</a>}</article>)}</section>}
 </div>;
}
const stepNames=['The basics','What the funder wants to know','Reports & due dates'];
const stepHelp=['Have the award letter handy. Only the grant’s name is needed — the rest can wait.','Tick what this funder asks you to report. Leave anything you don’t need.','Add each report the funder asks for. A final report is filled in to start you off.'];
export function GrantSetup({initial,busy,error,save,close}:{initial:GrantRecord;busy:boolean;error:string;save:(r:GrantRecord,requirements:Partial<GrantRecord>[])=>Promise<boolean>;close:()=>void}){
 const [g,setG]=useState<GrantRecord>(()=>structuredClone({...initial,tracking:initial.tracking||emptyTracking()})),[step,setStep]=useState(0),[requirements,setRequirements]=useState<Partial<GrantRecord>[]|null>(null);
 const t=g.tracking!;
 const [show,setShow]=useState(()=>({fields:true,zip:t.zipCodes.length>0,pay:t.payments.length>0,stories:t.stories.length>0}));
 const ref=useRef<HTMLElement>(null),heading=useRef<HTMLHeadingElement>(null),form=useRef<HTMLFormElement>(null);
 // Capture the opener before any effect moves focus, and read busy/close through a ref so a parent re-render
 // (close is a fresh arrow each time) does not tear the listener down and throw focus out of the dialog.
 const [prior]=useState(()=>typeof document==='undefined'?null:document.activeElement as HTMLElement|null),latest=useRef({busy,close});useEffect(()=>{latest.current={busy,close}});
 useEffect(()=>{heading.current?.focus()},[step]);
 useEffect(()=>{if(!busy&&!ref.current?.contains(document.activeElement))(ref.current?.querySelector<HTMLElement>('[role=alert]')||heading.current)?.focus()},[busy]);
 useEffect(()=>{const key=(e:KeyboardEvent)=>{if(e.key==='Escape'&&!latest.current.busy)latest.current.close();if(e.key==='Tab'){const els=ref.current?.querySelectorAll<HTMLElement>('button:not(:disabled),input,textarea,select,a[href],summary');if(!els?.length)return;const first=els[0],last=els[els.length-1];if(e.shiftKey&&(document.activeElement===first||document.activeElement===heading.current)){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}};document.addEventListener('keydown',key);return()=>{document.removeEventListener('keydown',key);prior?.focus()}},[prior]);
 const update=(patch:Partial<GrantTracking>)=>setG({...g,tracking:{...t,...patch}});
 const changeField=(id:string,patch:Partial<TrackingField>)=>update({fields:t.fields.map(f=>f.id===id?{...f,...patch}:f)});
 // A new grant starts with one real answer filled in: a final report due when the grant ends.
 const reqs=requirements??(initial.id?[]:[{title:'Final report',due:g.due,owner:g.owner,notes:'',source:''}]);
 const setReqs=(r:Partial<GrantRecord>[])=>setRequirements(r);
 async function finish(){if(form.current&&!form.current.reportValidity())return;if(await save(g,initial.id?[]:reqs))close();}
 return <div className="modal-backdrop"><section ref={ref} className="modal grant-setup" role="dialog" aria-modal="true" aria-labelledby="setup-title">
  <div className="section-head"><div><Dots at={step} of={3}/><h2 id="setup-title" tabIndex={-1} ref={heading}>{initial.id?'Edit grant':'Add a grant'}: {stepNames[step]}</h2></div><button disabled={busy} aria-label="Close" onClick={close}>×</button></div>
  <p>{initial.id&&step===2?'Add or change reports from the grant’s page.':stepHelp[step]}</p>
  <form ref={form} onSubmit={async e=>{e.preventDefault();if(step<2){setStep(step+1);return;}await finish();}}>
  {step===0&&<>
   <label>Grant name<input required maxLength={180} value={g.title} onChange={e=>setG({...g,title:e.target.value})}/></label>
   <div className="form-grid">
    <label>Who gave it? (foundation or funder)<input maxLength={180} value={t.funder} onChange={e=>update({funder:e.target.value})}/></label>
    <label>Amount ($)<input type="number" min="0" max="1000000000" step=".01" value={g.amount} onChange={e=>setG({...g,amount:Number(e.target.value)})}/></label>
    <label>Grant ends on<input type="date" value={g.due} onChange={e=>setG({...g,due:e.target.value})}/></label>
    <label>Who is in charge?<input maxLength={120} value={g.owner} onChange={e=>setG({...g,owner:e.target.value})}/></label></div>
   <details className="more-options"><summary>More details (optional)</summary><div className="form-grid">
    <label>Awarded on<input type="date" value={t.awardedOn} onChange={e=>update({awardedOn:e.target.value})}/></label>
    <label>Starts on<input type="date" value={t.startOn} onChange={e=>update({startOn:e.target.value})}/></label>
    <label>Status<select value={g.status} onChange={e=>setG({...g,status:e.target.value})}>{['Pending','Active','Closed','Archived'].map(x=><option key={x}>{x}</option>)}</select></label></div>
    <label>Link to the award letter or terms<input type="url" value={g.source} onChange={e=>setG({...g,source:e.target.value})}/></label>
    <label>Notes<textarea value={g.notes} maxLength={10000} onChange={e=>setG({...g,notes:e.target.value})}/></label></details></>}
  {step===1&&<>
   <fieldset className="choose"><legend>This funder wants to know about…</legend>
    {([['fields','Numbers and outcomes (people served, results)'],['zip','ZIP codes served'],['pay','Where the money went'],['stories','Stories and photos']] as const).map(([k,l])=><label className="check-label" key={k}><input type="checkbox" checked={show[k]} onChange={e=>setShow({...show,[k]:e.target.checked})}/> {l}</label>)}
    <small className="hint">Unticking only hides a section here; anything already typed is kept.</small></fieldset>
   {show.fields&&<><h3>Numbers and outcomes</h3>
    {t.fields.map(f=><fieldset className="collection-card" key={f.id}><legend>{f.label||'New measure'}{f.hidden?' · hidden':''}</legend><div className="form-grid">
     <label>Name<input required maxLength={180} value={f.label} onChange={e=>changeField(f.id,{label:e.target.value})}/></label>
     <label>So far{f.type==='longtext'?<textarea value={f.value} maxLength={10000} onChange={e=>changeField(f.id,{value:e.target.value})}/>:<input type={f.type==='number'?'number':f.type==='date'?'date':f.type==='link'?'url':'text'} min={f.type==='number'?0:undefined} step="any" value={f.value} onChange={e=>changeField(f.id,{value:e.target.value})}/>}</label>
     {f.type==='number'&&<label>Goal (optional)<input type="number" min="0" step="any" value={f.target} onChange={e=>changeField(f.id,{target:e.target.value})}/></label>}</div>
     <details className="more-options"><summary>More about this measure</summary><div className="form-grid">
      <label>Kind of answer<select value={f.type} disabled={!!f.value} onChange={e=>changeField(f.id,{type:e.target.value as TrackingField['type'],target:''})}>{[['number','A number'],['text','A few words'],['longtext','A paragraph'],['date','A date'],['link','A link']].map(([v,l])=><option value={v} key={v}>{l}</option>)}</select>{!!f.value&&<small className="hint">Clear “So far” first to change this.</small>}</label>
      <label>Who collects it?<input maxLength={120} value={f.owner} onChange={e=>changeField(f.id,{owner:e.target.value})}/></label>
      <label>Needed by<input type="date" value={f.due} onChange={e=>changeField(f.id,{due:e.target.value})}/></label></div>
      <label>How to count it, and how often<textarea maxLength={2000} value={f.collect} onChange={e=>changeField(f.id,{collect:e.target.value})}/></label>
      <label className="check-label"><input type="checkbox" checked={f.hidden} onChange={e=>changeField(f.id,{hidden:e.target.checked})}/> Hide this measure (what’s typed is kept)</label></details></fieldset>)}
    <button type="button" disabled={t.fields.length>=100} onClick={()=>update({fields:[...t.fields,field('New measure','text')]})}>Add a measure</button></>}
   {show.zip&&<><h3>ZIP codes served</h3><p>Totals only — no names.</p>
    {t.zipCodes.map((z,i)=><fieldset className="collection-card" key={i}><div className="form-grid">{(['zip','families','people'] as const).map(k=><label key={k}>{k==='zip'?'ZIP code':k==='families'?'Families':'People'}<input type={k==='zip'?'text':'number'} inputMode="numeric" min="0" step="1" required={k==='zip'} value={z[k]} onChange={e=>update({zipCodes:t.zipCodes.map((x,j)=>j===i?{...x,[k]:e.target.value}:x)})}/></label>)}</div><button type="button" onClick={()=>update({zipCodes:t.zipCodes.filter((_,j)=>j!==i)})}>Remove</button></fieldset>)}
    <button type="button" disabled={t.zipCodes.length>=100} onClick={()=>update({zipCodes:[...t.zipCodes,{zip:'',families:'',people:''}]})}>Add a ZIP code</button></>}
   {show.pay&&<><h3>Where the money went</h3>
    {t.payments.map((p,i)=><fieldset className="collection-card" key={i}><div className="form-grid">{(['recipient','amount','date','purpose','source'] as const).map(k=><label key={k}>{{date:'Date',recipient:'Paid to',purpose:'What for',amount:'Amount ($)',source:'Link to the receipt'}[k]}<input type={k==='date'?'date':k==='amount'?'number':k==='source'?'url':'text'} min="0" step=".01" value={p[k]} onChange={e=>update({payments:t.payments.map((x,j)=>j===i?{...x,[k]:e.target.value}:x)})}/></label>)}</div><button type="button" onClick={()=>update({payments:t.payments.filter((_,j)=>j!==i)})}>Remove</button></fieldset>)}
    <button type="button" disabled={t.payments.length>=100} onClick={()=>update({payments:[...t.payments,{date:'',recipient:'',purpose:'',amount:'',source:''}]})}>Add a payment</button></>}
   {show.stories&&<><h3>Stories and photos</h3><p>Photos are links; nothing is uploaded.</p>
    {t.stories.map((s,i)=><fieldset className="collection-card" key={i}><label>Title<input maxLength={180} value={s.title} onChange={e=>update({stories:t.stories.map((x,j)=>j===i?{...x,title:e.target.value}:x)})}/></label><label>The story<textarea maxLength={10000} value={s.text} onChange={e=>update({stories:t.stories.map((x,j)=>j===i?{...x,text:e.target.value}:x)})}/></label><label>Link to a photo<input type="url" value={s.photo} onChange={e=>update({stories:t.stories.map((x,j)=>j===i?{...x,photo:e.target.value}:x)})}/></label><button type="button" onClick={()=>update({stories:t.stories.filter((_,j)=>j!==i)})}>Remove</button></fieldset>)}
    <button type="button" disabled={t.stories.length>=100} onClick={()=>update({stories:[...t.stories,{title:'',text:'',photo:''}]})}>Add a story</button></>}
  </>}
  {step===2&&<>
   {!initial.id&&<>{reqs.map((r,i)=><fieldset className="collection-card" key={i}>
     <label>Report name<input required maxLength={180} value={r.title||''} onChange={e=>setReqs(reqs.map((x,j)=>j===i?{...x,title:e.target.value}:x))}/></label>
     <div className="form-grid"><label>Due date<input type="date" value={r.due||''} onChange={e=>setReqs(reqs.map((x,j)=>j===i?{...x,due:e.target.value}:x))}/></label><label>Who is doing it?<input maxLength={120} value={r.owner||''} onChange={e=>setReqs(reqs.map((x,j)=>j===i?{...x,owner:e.target.value}:x))}/></label></div>
     <button type="button" onClick={()=>setReqs(reqs.filter((_,j)=>j!==i))}>Remove</button></fieldset>)}
    <button type="button" disabled={reqs.length>=25} onClick={()=>setReqs([...reqs,{title:'',due:'',owner:g.owner,notes:'',source:''}])}>Add another report</button></>}
   <details className="more-options"><summary>Check-in and spending (optional)</summary><div className="form-grid">
    <label>How is it going?<select value={t.assessment} onChange={e=>update({assessment:e.target.value})}>{['Not reviewed','On track','Needs attention','At risk'].map(x=><option key={x}>{x}</option>)}</select></label>
    <label>Checked on<input type="date" max={today()} value={t.reviewedOn} onChange={e=>update({reviewedOn:e.target.value})}/></label>
    <label>Spent so far ($)<input type="number" min="0" step=".01" value={g.spent} onChange={e=>setG({...g,spent:Number(e.target.value)})}/></label>
    <label>Spending as of<input type="date" max={today()} value={g.financialAsOf||''} onChange={e=>setG({...g,financialAsOf:e.target.value})}/></label>
    <label>Award terms checked on<input type="date" max={today()} value={g.verifiedOn||''} onChange={e=>setG({...g,verifiedOn:e.target.value})}/></label></div>
    <small className="hint">Typed-in totals. They don’t come from accounting.</small></details></>}
  {error&&<p role="alert" tabIndex={-1} className="error">{error}</p>}
  <div className="form-actions"><button type="button" disabled={busy} onClick={close}>Cancel</button>{step>0&&<button type="button" disabled={busy} onClick={()=>setStep(step-1)}>Back</button>}
   {step<2&&<button type="button" disabled={busy} onClick={finish}>{busy?'Saving…':'Save now'}</button>}
   <button className="primary" disabled={busy}>{busy?'Saving…':step===2?'Save grant':'Next'}</button></div>
  </form></section></div>;
}
