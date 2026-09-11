export type GrantRecord={id:string;kind:string;title:string;grant:string;owner:string;due:string;status:string;amount:number;spent:number;source:string;notes:string;demo:boolean;updated:string};
const statuses:Record<string,string[]>={grant:['Active','Pending','Closed','Archived'],requirement:['Open','In progress','Blocked','Complete','Archived'],opportunity:['New','Reviewing','Applying','Declined','Archived']};
export function validate(v:any):GrantRecord{
 if(!v||!statuses[v.kind])throw Error('Record type must be grant, requirement, or opportunity.');
 for(const [key,max] of Object.entries({title:180,owner:120,due:10,source:2000,notes:10000,grant:100,id:100,updated:50}))if(v[key]!==undefined&&(typeof v[key]!=='string'||v[key].length>max))throw Error('Invalid '+key+'.');
 if(!v.title?.trim())throw Error('A title is required.');
 if(!statuses[v.kind].includes(v.status))throw Error('Choose a valid status.');
 if(v.due&&(!/^\d{4}-\d{2}-\d{2}$/.test(v.due)||!Number.isFinite(Date.parse(v.due))||new Date(v.due).toISOString().slice(0,10)!==v.due))throw Error('Choose a valid date.');
 for(const k of ['amount','spent'])if(typeof v[k]!=='number'||!Number.isFinite(v[k])||v[k]<0||v[k]>1e9)throw Error('Amounts must be between 0 and 1 billion.');
 if(v.source){let url;try{url=new URL(v.source)}catch{throw Error('Use a valid source URL.')}if(!['https:','http:'].includes(url.protocol))throw Error('Sources must use HTTP or HTTPS.');}
 if(v.kind==='requirement'&&v.status==='Complete'&&!v.source)throw Error('Add a source or evidence link before completing this requirement.');
 if(typeof v.demo!=='boolean')throw Error('Choose the sample or agency workspace.');
 return {id:v.id||'',kind:v.kind,title:v.title.trim(),grant:v.grant||'',owner:v.owner?.trim()||'',due:v.due||'',status:v.status,amount:Math.round(v.amount*100)/100,spent:Math.round(v.spent*100)/100,source:v.source||'',notes:v.notes||'',demo:v.demo,updated:v.updated||''};
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
 ];}
