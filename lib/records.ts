export type TrackingField={id:string;label:string;type:'number'|'text'|'longtext'|'date'|'link';value:string;target:string;owner:string;collect:string;due:string;hidden:boolean};
export type GrantTracking={funder:string;awardedOn:string;startOn:string;assessment:string;reviewedOn:string;fields:TrackingField[];zipCodes:{zip:string;families:string;people:string}[];payments:{date:string;recipient:string;purpose:string;amount:string;source:string}[];stories:{title:string;text:string;photo:string}[]};
export function emptyTracking():GrantTracking{return {funder:'',awardedOn:'',startOn:'',assessment:'Not reviewed',reviewedOn:'',fields:[],zipCodes:[],payments:[],stories:[]};}
export function validateTracking(v:any):GrantTracking|undefined{
 if(v===undefined)return undefined;
 const text=(x:any,max=2000)=>{if(typeof x!=='string'||x.length>max)throw Error('Invalid grant tracking text.');return x;};
 const date=(x:any)=>{text(x,10);if(x&&(!/^\d{4}-\d{2}-\d{2}$/.test(x)||!Number.isFinite(Date.parse(x))||new Date(x).toISOString().slice(0,10)!==x))throw Error('Invalid tracking date.');return x;};
 const num=(x:any)=>{text(x,40);if(x!==''&&(!Number.isFinite(Number(x))||Number(x)<0||Number(x)>1e9))throw Error('Tracking amounts and counts must be between 0 and 1 billion.');return x;};
 const url=(x:any)=>{text(x);if(x){let u;try{u=new URL(x)}catch{throw Error('Use a valid tracking link.')}if(!['https:','http:'].includes(u.protocol))throw Error('Tracking links must use HTTP or HTTPS.');}return x;};
 const list=(x:any)=>{if(!Array.isArray(x)||x.length>100)throw Error('Use at most 100 entries per tracking section.');return x;};
 if(!v||typeof v!=='object')throw Error('Invalid grant tracking.');
 const fields=list(v.fields).map((f:any)=>{const id=text(f.id,100),label=text(f.label,180);if(!id||!label.trim()||!['number','text','longtext','date','link'].includes(f.type)||typeof f.hidden!=='boolean')throw Error('Each custom field needs an ID, label, valid type, and visibility.');return {id,label,type:f.type,value:f.type==='number'?num(f.value):f.type==='date'?date(f.value):f.type==='link'?url(f.value):text(f.value,10000),target:num(f.target),owner:text(f.owner,120),collect:text(f.collect),due:date(f.due),hidden:f.hidden};});
 if(new Set(fields.map(f=>f.id)).size!==fields.length)throw Error('Custom field IDs must be unique.');
 if(!['Not reviewed','On track','Needs attention','At risk'].includes(v.assessment))throw Error('Choose a valid progress assessment.');
 const reviewedOn=date(v.reviewedOn);if(reviewedOn>new Date().toISOString().slice(0,10))throw Error('Review date cannot be in the future.');
 return {funder:text(v.funder,180),awardedOn:date(v.awardedOn),startOn:date(v.startOn),assessment:v.assessment,reviewedOn,fields,zipCodes:list(v.zipCodes).map((z:any)=>{const zip=text(z.zip,10);if(!/^\d{5}(-\d{4})?$/.test(zip))throw Error('Use a five-digit ZIP code, optionally ZIP+4.');const families=num(z.families),people=num(z.people);if([families,people].some(x=>x!==''&&!Number.isInteger(Number(x))))throw Error('ZIP counts must be whole numbers.');return {zip,families,people};}),payments:list(v.payments).map((p:any)=>({date:date(p.date),recipient:text(p.recipient,180),purpose:text(p.purpose),amount:num(p.amount),source:url(p.source)})),stories:list(v.stories).map((s:any)=>({title:text(s.title,180),text:text(s.text,10000),photo:url(s.photo)}))};
}
export function grantProgress(g:GrantRecord,all:GrantRecord[],today=new Date().toISOString().slice(0,10)){
 const requirements=all.filter(r=>r.grant===g.id&&r.kind==='requirement'&&r.status!=='Archived');
 const overdue=requirements.filter(r=>r.status!=='Complete'&&r.due&&r.due<today).length;
 const t=g.tracking;const stale=!!t?.reviewedOn&&(Date.parse(today)-Date.parse(t.reviewedOn))/86400000>30;
 const lateTargets=t?.fields.filter(f=>!f.hidden&&f.type==='number'&&f.target!==''&&f.due&&f.due<today&&(f.value===''||Number(f.value)<Number(f.target))).length||0;
 return {total:requirements.length,complete:requirements.filter(r=>r.status==='Complete').length,overdue,label:g.status==='Archived'?'Archived':g.status==='Closed'?'Closed':g.status==='Pending'?'Pending award':overdue||lateTargets?'Needs attention':!t?.reviewedOn||t.assessment==='Not reviewed'?'Not reviewed':stale?'Review due':t.assessment,stale};
}
export type GrantRecord={id:string;kind:string;title:string;grant:string;owner:string;due:string;status:string;amount:number;spent:number;source:string;notes:string;demo:boolean;updated:string;dependsOn?:string;financialAsOf?:string;verifiedOn?:string;severity?:string;escalationOwner?:string;tracking?:GrantTracking};
export const statuses:Record<string,string[]>={task:['Open','In progress','Blocked','Complete','Archived'],issue:['Open','Escalated','Resolved','Archived'],grant:['Active','Pending','Closed','Archived'],requirement:['Open','In progress','Blocked','Complete','Archived'],opportunity:['New','Reviewing','Applying','Declined','Archived']};
export function validate(v:any):GrantRecord{
 if(!v||!statuses[v.kind])throw Error('Record type must be grant, requirement, task, issue, or opportunity.');
 for(const [key,max] of Object.entries({title:180,owner:120,due:10,source:2000,notes:10000,grant:100,id:100,updated:50,dependsOn:100,financialAsOf:10,verifiedOn:10,severity:20,escalationOwner:120}))if(v[key]!==undefined&&(typeof v[key]!=='string'||v[key].length>max))throw Error('Invalid '+key+'.');
 if(!v.title?.trim())throw Error('A title is required.');
 if(!statuses[v.kind].includes(v.status))throw Error('Choose a valid status.');
 if(v.due&&(!/^\d{4}-\d{2}-\d{2}$/.test(v.due)||!Number.isFinite(Date.parse(v.due))||new Date(v.due).toISOString().slice(0,10)!==v.due))throw Error('Choose a valid date.');
 for(const k of ['amount','spent'])if(typeof v[k]!=='number'||!Number.isFinite(v[k])||v[k]<0||v[k]>1e9)throw Error('Amounts must be between 0 and 1 billion.');
 for(const k of ['financialAsOf','verifiedOn'])if(v[k]&&(!/^\d{4}-\d{2}-\d{2}$/.test(v[k])||!Number.isFinite(Date.parse(v[k]))||new Date(v[k]).toISOString().slice(0,10)!==v[k]||v[k]>new Date().toISOString().slice(0,10)))throw Error('Verification dates must be valid and not in the future.');
 if(v.severity&&!['Low','Medium','High','Critical'].includes(v.severity))throw Error('Choose a valid severity.');
 if(v.kind==='issue'&&v.status==='Escalated'&&!v.escalationOwner?.trim())throw Error('Assign an escalation owner.');
 if(v.source){let url;try{url=new URL(v.source)}catch{throw Error('Use a valid source URL.')}if(!['https:','http:'].includes(url.protocol))throw Error('Sources must use HTTP or HTTPS.');}
 if(v.kind==='requirement'&&v.status==='Complete'&&!v.source)throw Error('Add a source or evidence link before completing this requirement.');
 if(typeof v.demo!=='boolean')throw Error('Choose the sample or agency workspace.');
 const tracking=validateTracking(v.tracking);if(tracking&&v.kind!=='grant')throw Error('Tracking belongs to a grant.');if(tracking?.startOn&&v.due&&tracking.startOn>v.due)throw Error('Grant end date must follow its start date.');
 return {...(tracking?{tracking}:{}),id:v.id||'',kind:v.kind,title:v.title.trim(),grant:v.grant||'',owner:v.owner?.trim()||'',due:v.due||'',status:v.status,amount:Math.round(v.amount*100)/100,spent:Math.round(v.spent*100)/100,source:v.source||'',notes:v.notes||'',demo:v.demo,updated:v.updated||'',dependsOn:v.dependsOn||'',financialAsOf:v.financialAsOf||'',verifiedOn:v.verifiedOn||'',severity:v.severity||'Medium',escalationOwner:v.escalationOwner?.trim()||''};
}
export function samples():GrantRecord[]{const date=(n:number)=>{const d=new Date();d.setUTCDate(d.getUTCDate()+n);return d.toISOString().slice(0,10)};const base={grant:'',owner:'Program director',due:date(120),status:'Active',amount:0,spent:0,source:'',notes:'Illustrative sample only. Replace with actual award terms and source documents.',demo:true,updated:''};return [
 {...base,id:'sample-peer',kind:'grant',title:'Peer support expansion',amount:85000,spent:32600},
 {...base,id:'sample-family',kind:'grant',title:'Family education access',owner:'Associate director',amount:42000,spent:18900,due:date(90)},
 {...base,id:'sample-outreach',kind:'grant',title:'Community outreach initiative',owner:'Development lead',amount:28000,spent:8500,due:date(180)},
 {...base,id:'sample-report',kind:'requirement',title:'Quarterly progress report',grant:'sample-peer',status:'In progress',due:date(6)},
 {...base,id:'sample-reconcile',kind:'requirement',title:'Expense reconciliation',grant:'sample-family',owner:'Finance lead',status:'Open',due:date(-3)},
 {...base,id:'sample-attendance',kind:'requirement',title:'Verify attendance totals',grant:'sample-peer',status:'Open',due:date(12)},
 {...base,id:'sample-insurance',kind:'requirement',title:'Upload insurance evidence',grant:'sample-outreach',owner:'',status:'Open',due:''},
 {...base,id:'sample-closeout',kind:'requirement',title:'Final narrative and outcomes',grant:'sample-family',status:'Open',due:date(45)},
 {...base,id:'sample-lead',kind:'opportunity',title:'Community wellbeing funding lead',status:'Reviewing',amount:50000,due:date(30),notes:'Fictional lead for demonstration. Research and verify actual opportunities before applying.'}
 ,{...base,id:'sample-government',kind:'grant',title:'Government demonstration award — aggregate outreach',amount:160000,spent:92000,financialAsOf:date(-45),verifiedOn:date(-40)},
 {...base,id:'sample-troubled',kind:'grant',title:'Troubled demonstration award — recovery plan',amount:20000,spent:22500,due:date(20)},
 {...base,id:'sample-data-task',kind:'task',title:'Finance staff: deliver aggregate expense schedule',grant:'sample-government',status:'Blocked',owner:'Finance lead',due:date(-4)},
 {...base,id:'sample-gov-report',kind:'requirement',title:'Government monthly expenditure report',grant:'sample-government',status:'Open',due:date(4),dependsOn:'sample-data-task'},
 {...base,id:'sample-issue',kind:'issue',title:'Overspend requires leadership review',grant:'sample-troubled',status:'Escalated',due:date(-1),severity:'Critical',escalationOwner:'Associate director'},
 {...base,id:'sample-simple',kind:'requirement',title:'Simple award acknowledgement',grant:'sample-outreach',status:'Complete',source:'https://example.org/synthetic-acknowledgement',verifiedOn:date(-1),due:date(-2)}
 ];}
export function financeState(r:GrantRecord,today=new Date().toISOString().slice(0,10)){return !r.financialAsOf?'UNKNOWN':(Date.parse(today)-Date.parse(r.financialAsOf))/86400000>30?'STALE':'Current manual snapshot';}
export function attentionReasons(r:GrantRecord,all:GrantRecord[],today=new Date().toISOString().slice(0,10)){
 if(['Complete','Resolved','Closed','Archived','Declined'].includes(r.status))return [];
 const reasons:string[]=[];
 if(r.kind==='issue')reasons.push(r.status==='Escalated'?'Escalated issue':'Open issue');
 if(!r.due)reasons.push('UNKNOWN deadline');else if(r.due<today)reasons.push('Overdue');else if((Date.parse(r.due)-Date.parse(today))/86400000<=14)reasons.push('Due within 14 days');
 if(r.status==='Blocked')reasons.push('Blocked');
 if(r.dependsOn){const d=all.find(x=>x.id===r.dependsOn);if(!d)reasons.push('UNKNOWN dependency');else if(!['Complete','Resolved'].includes(d.status))reasons.push(d.due&&d.due<today?'Overdue dependency':'Waiting on dependency');}
 if(!r.owner)reasons.push('Unassigned');
 if(r.kind==='requirement'&&!r.source)reasons.push('Evidence missing');
 if(r.kind==='grant'){if(r.spent>r.amount)reasons.push('Overspent');const f=financeState(r,today);if(f!=='Current manual snapshot')reasons.push(f+' finances');}
 if(!r.verifiedOn)reasons.push('UNKNOWN source verification');else if((Date.parse(today)-Date.parse(r.verifiedOn))/86400000>30)reasons.push('STALE source verification');
 return reasons;
}
export function attentionRank(r:GrantRecord,all:GrantRecord[]){const reasons=attentionReasons(r,all);return reasons.length? (r.severity==='Critical'&&r.kind==='issue'?100:0)+reasons.reduce((n,s)=>n+(/Overdue|Overspent|Escalated/.test(s)?30:/UNKNOWN|Blocked|dependency/.test(s)?15:5),0):0;}

