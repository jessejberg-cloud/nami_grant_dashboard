'use client';
// The pieces that teach the app while it is used, and the calm words it speaks in.
// Built to the suite's ADHD design law: one thing at a time, one-line hints that can be
// put away, no counts of what was not done, no red, and plain words.
import {useEffect,useState,type ReactNode} from 'react';
import {Lightbulb} from 'lucide-react';
import {GrantRecord,attentionReasons,localDay} from '@/lib/records';

export const done=(r:GrantRecord)=>['Complete','Resolved','Closed','Archived','Declined'].includes(r.status);
export const kindName:Record<string,string>={grant:'Grant',requirement:'Funder requirement',task:'Staff task',issue:'Problem',opportunity:'Funding lead'};

export function nice(d:string){if(!d)return '';const x=new Date(d+'T12:00:00');return x.toLocaleDateString('en-US',{month:'short',day:'numeric',...(x.getFullYear()!==new Date().getFullYear()?{year:'numeric'}:{})});}
const daysAway=(d:string)=>Math.round((Date.parse(d)-Date.parse(localDay()))/86400000);

// When a thing is due, said calmly. Never "overdue", never a count of days behind.
export function when(r:GrantRecord){if(r.status==='Archived')return 'Put away';if(done(r))return 'Done';if(!r.due)return 'No date yet';const n=daysAway(r.due);const end=r.kind==='grant';return n<0?(end?'End date has passed':'Date has passed'):n===0?(end?'Ends today':'Due today'):n===1?(end?'Ends tomorrow':'Due tomorrow'):n<=14?(end?'Ends soon':'Due soon'):'Coming up';}
export const whenTone=(r:GrantRecord)=>{const w=when(r);return /passed/.test(w)?'passed':/today|tomorrow|soon/.test(w)?'soon':'';};

// The record checks in lib/records.ts, in words a person can act on. Freshness and
// verification checks are for administrators and stay on the More tools pages.
const gentle:Record<string,string>={'Overdue':'Date has passed','Due within 14 days':'Due soon','UNKNOWN deadline':'No date yet','Blocked':'Stuck','Waiting on dependency':'Waiting on another item','Overdue dependency':'Waiting on another item','Unassigned':'No one assigned yet','Evidence missing':'No proof link yet','Overspent':'Spending is over the award','Escalated issue':'Problem needs a decision','Open issue':'Problem noted'};
export function notes(r:GrantRecord,all:GrantRecord[]){return [...new Set(attentionReasons(r,all).flatMap(x=>gentle[x]?[gentle[x]]:[]))].filter(x=>!(x==='No date yet'&&r.kind==='grant'));}
// What belongs on Home under Coming up: a near or passed date, stuck work, a problem, overspending.
// A missing detail on its own does not; it shows quietly on the item instead.
export function needsYou(r:GrantRecord,all:GrantRecord[]){const n=notes(r,all);return r.kind==='grant'?n.includes('Spending is over the award'):n.some(x=>/passed|soon|Stuck|Waiting|Problem/.test(x));}

// One-line hints. "Got it" puts one away for good; "Later" brings it back tomorrow.
const TIPS_KEY='nami-grants-tips-v1';
export type Tips={shows:(id:string)=>boolean;gotIt:(id:string)=>void;later:(id:string)=>void;reset:()=>void;hidden:boolean};
export function useTips():Tips{
 const [state,setState]=useState<Record<string,number>|null>(null);
 // eslint-disable-next-line react-hooks/set-state-in-effect -- browser storage only exists after hydration
 useEffect(()=>{try{setState(JSON.parse(localStorage.getItem(TIPS_KEY)||'{}'))}catch{setState({})}},[]);
 const store=(next:Record<string,number>)=>{setState(next);try{localStorage.setItem(TIPS_KEY,JSON.stringify(next))}catch{}};
 return {shows:id=>!!state&&(!(id in state)||(state[id]>0&&Date.now()>state[id])),gotIt:id=>store({...state,[id]:0}),later:id=>store({...state,[id]:Date.now()+86400000}),reset:()=>store({}),hidden:!!state&&Object.keys(state).length>0};
}
export function Tip({id,tips,children}:{id:string;tips:Tips;children:ReactNode}){
 if(!tips.shows(id))return null;
 return <aside className="tip" aria-label="Tip"><Lightbulb size={22} aria-hidden/><p>{children}</p><span><button onClick={()=>tips.later(id)}>Later</button><button className="primary" onClick={()=>tips.gotIt(id)}>Got it</button></span></aside>;
}

// Progress through a few steps as a row of marks, never "3 of 7".
export function Dots({at,of}:{at:number;of:number}){return <span className="dots" role="img" aria-label={'Step '+(at+1)+' of '+of}>{Array.from({length:of},(_,i)=><i key={i} className={i<=at?'on':''}/>)}</span>;}

// The one thing to do now. Home opens on this, so the first question is always answered.
export function NextStep({rows,open,addGrant,addReport}:{rows:GrantRecord[];open:(r:GrantRecord)=>void;addGrant:()=>void;addReport:(g:GrantRecord)=>void}){
 const grants=rows.filter(r=>r.kind==='grant'&&!['Archived','Closed'].includes(r.status));
 const work=rows.filter(r=>['requirement','task'].includes(r.kind)&&!done(r)&&r.due).sort((a,b)=>a.due.localeCompare(b.due));
 const today=localDay();const passed=work.find(r=>r.due<today);const soon=work.find(r=>r.due>=today&&daysAway(r.due)<=14);
 // Never "all caught up" while something is stuck or a problem is open: Coming up lists both, so the card must too.
 const stuck=rows.find(r=>['requirement','task'].includes(r.kind)&&r.status==='Blocked');
 const problem=rows.filter(r=>r.kind==='issue'&&!done(r)).sort((a,b)=>(b.status==='Escalated'?1:0)-(a.status==='Escalated'?1:0))[0];
 const bare=grants.find(g=>!rows.some(r=>r.grant===g.id&&r.kind==='requirement'&&r.status!=='Archived'));
 let title:string,text:string,go:[string,()=>void]|null=null;
 if(!grants.length){title='Add your first grant';text='Have the award letter handy. Only the grant’s name is needed to start; the rest can wait.';go=['Add a grant',addGrant];}
 else if(passed){title=passed.title;text='Its date ('+nice(passed.due)+') has passed. Open it to finish it, or to change the date.';go=['Open it',()=>open(passed)];}
 else if(soon){title=soon.title;text=when(soon)+', on '+nice(soon.due)+'.';go=['Open it',()=>open(soon)];}
 else if(stuck){title=stuck.title;text='This is marked as stuck. Open it to see what it is waiting on, or to change it.';go=['Open it',()=>open(stuck)];}
 else if(problem){title=problem.title;text='A problem was noted'+(problem.escalationOwner?' for '+problem.escalationOwner+' to decide':'')+'. Open it to see where it stands.';go=['Open it',()=>open(problem)];}
 else if(bare){title='Add the reports for '+bare.title;text='Check the award letter for each report the funder asks for, and add it with its due date.';go=['Add a report',()=>addReport(bare)];}
 else {title='You’re all caught up';text='Nothing is due in the next two weeks, and nothing is stuck.';}
 return <section className="panel next-step" aria-live="polite"><p className="eyebrow">YOUR NEXT STEP</p><h2>{title}</h2><p>{text}</p>{go&&<button className="primary" onClick={go[1]}>{go[0]}</button>}</section>;
}
