export const VERSION = '1.0.0';
export const REVISION_DATE = '2026-09-12';
export const STORAGE = {
  opportunities: 'nami-radar-opportunities-v1',
  preferences: 'nami-radar-preferences-v1',
  onboarding: 'nami-radar-onboarding-v1',
  activity: 'nami-radar-activity-v1'
};

export const statuses = ['New','Verification needed','Reviewing','Shortlisted','Declined','Archived','Closed'];
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

const base = {
  description: '', geography: '', applicantEligibility: '', programFit: '', fitReasons: [],
  gaps: [], disqualifiers: [], fundingMin: null, fundingMax: null, deadline: '',
  deadlineKind: 'unknown', deadlineTimezone: '', applicationRoute: '', matchingFunds: 'Unknown',
  restrictions: '', owner: '', status: 'New', notes: '', nextAction: '', checkedAt: '',
  sourceState: 'UNKNOWN', sourceType: 'official', recordType: 'public', changeFlags: [], history: []
};

export const initialOpportunities = [
  {...base,
    id:'pub-gmf-west-bend-2026-cycle-2', externalId:'gmf-west-bend-charitable-fund-2026-cycle-2',
    title:"West Bend Insurance Company's Charitable Fund - Cycle 2", funder:'Greater Milwaukee Foundation / West Bend Insurance Company Charitable Fund',
    officialUrl:'https://www.greatermilwaukeefoundation.org/grantseekers/funding-opportunities/west-bend-insurance-companys-charitable-fund-cycle-2',
    description:'Official fund page lists mental health among its priorities and a fall 2026 application cycle.',
    geography:'Washington County, Wisconsin', applicantEligibility:'Not fully stated on the opportunity page; verify fund and Foundation eligibility rules.',
    programFit:'Possible subject-matter fit; geographic eligibility is unverified.',
    fitReasons:['Mental health is an explicit priority','Southeastern Wisconsin geography'],
    gaps:['Confirm NAMI Southeast Wisconsin serves eligible Washington County residents','Confirm applicant and board requirements','Confirm award amount and portal requirements'],
    disqualifiers:[], fundingMin:null, fundingMax:null, deadline:'2026-10-09', deadlineKind:'confirmed', deadlineTimezone:'Not stated on official page',
    applicationRoute:'Greater Milwaukee Foundation grant application portal', matchingFunds:'Unknown',
    restrictions:'The official page says the fund serves Washington County. Other restrictions require review.', owner:'', status:'Verification needed',
    notes:'REAL PUBLIC OPPORTUNITY. Agency eligibility has not been established.', nextAction:'Verify geographic and applicant eligibility before considering shortlist.',
    checkedAt:'2026-09-12T11:20:00Z', sourceState:'CURRENT', recordType:'public'
  },
  {...base,
    id:'pub-gmf-2026-cycle-2', externalId:'gmf-general-cycle-2-2026', title:'Greater Milwaukee Foundation 2026 grant cycle 2', funder:'Greater Milwaukee Foundation',
    officialUrl:'https://www.greatermilwaukeefoundation.org/grantseekers/2026-grant-guidelines-cycle-2/',
    description:'General competitive cycle serving Milwaukee, Ozaukee, Washington and Waukesha counties. The published 2026 cycle is closed.',
    geography:'Milwaukee, Ozaukee, Washington and Waukesha counties', applicantEligibility:'Official page states 501(c)(3), board composition, and unrelated-board-member requirements.',
    programFit:'Mental health appears within the Foundation community wellness portfolio, but this cycle is closed.',
    fitReasons:['Regional coverage overlaps the research profile','Mental health is a Foundation community wellness priority'],
    gaps:['Confirm organizational eligibility before a future cycle','Watch for a future published cycle'], disqualifiers:['Application closed June 12, 2026'],
    deadline:'2026-06-12', deadlineKind:'confirmed', deadlineTimezone:'Not stated on official page', applicationRoute:'Foundation grant portal',
    restrictions:'One application per organization per grant cycle; additional eligibility criteria apply.', status:'Closed',
    notes:'REAL PUBLIC OPPORTUNITY. Retained as a closed-cycle monitoring record, not an open application.', nextAction:'Monitor the official funding-opportunities page for a future cycle.',
    checkedAt:'2026-09-12T11:24:00Z', sourceState:'CURRENT', recordType:'public'
  },
  {...base,
    id:'pub-gmf-community-bridge', externalId:'gmf-community-bridge-directory', title:'Greater Milwaukee Foundation Community Bridge directory', funder:'Greater Milwaukee Foundation',
    officialUrl:'https://greatermilwaukeefoundation.org/community-bridge',
    description:'An official nonprofit directory where organizations can share funding needs with donors. It is not represented here as an open competitive grant.',
    geography:'Greater Milwaukee area', applicantEligibility:'Nonprofit directory submission requirements require agency review.',
    programFit:'Potential visibility and donor-discovery route rather than a confirmed grant application.',
    fitReasons:['Local donor-discovery channel','Could surface mental-health and family-support work'],
    gaps:['Confirm whether the agency is already listed','Review submission terms and internal approval','Determine whether this belongs in development outreach rather than grant pipeline'],
    disqualifiers:['Not a confirmed open grant application'], deadline:'', deadlineKind:'rolling', deadlineTimezone:'Not applicable',
    applicationRoute:'Official Community Bridge directory submission', matchingFunds:'Not applicable', restrictions:'Foundation reviews listings and does not guarantee donor funding.',
    status:'Verification needed', notes:'REAL PUBLIC RESEARCH LEAD. Not an open grant application.', nextAction:'Decide whether to review as a donor-discovery channel.',
    checkedAt:'2026-09-12T11:28:00Z', sourceState:'CURRENT', recordType:'public'
  },
  {...base,
    id:'pub-bader-grantmaking', externalId:'bader-philanthropies-grantmaking', title:'Bader Philanthropies grantmaking programs', funder:'Bader Philanthropies',
    officialUrl:'https://bader.org/', description:'Official site describes grantmaking in areas including addiction recovery, neighborhood engagement and other Milwaukee-focused interests.',
    geography:'Milwaukee and other program-specific geographies', applicantEligibility:'Unknown from the reviewed landing page; program-specific requirements must be verified.',
    programFit:'Possible adjacency to peer support, recovery and community engagement; no open application was confirmed.',
    fitReasons:['Milwaukee-focused philanthropy','Addiction recovery and neighborhood engagement may overlap research interests'],
    gaps:['Find the current application guidance','Confirm whether proposals are accepted or invitation-only','Confirm eligible programs and applicant types','Confirm deadline and funding range'],
    disqualifiers:['No open application confirmed'], deadline:'', deadlineKind:'unknown', deadlineTimezone:'Unknown', applicationRoute:'Unknown; verify with official funder guidance',
    matchingFunds:'Unknown', restrictions:'Program-specific and currently unverified.', status:'Verification needed',
    notes:'REAL PUBLIC RESEARCH LEAD. The initial review did not establish an open application.', nextAction:'Locate current official grantmaking guidance before further review.',
    checkedAt:'2026-09-12T11:31:00Z', sourceState:'CURRENT', recordType:'public'
  },
  {...base,
    id:'sample-peer-wellbeing', externalId:'sample-peer-wellbeing-2027', title:'Community Peer Wellbeing Innovation Fund', funder:'Fictional Harbor Community Trust',
    officialUrl:'https://example.org/fictional-grant', description:'Fictional lead used to practice verification, assignment, shortlisting and export.',
    geography:'Milwaukee County', applicantEligibility:'Fictional 501(c)(3) community organizations.', programFit:'Strong fictional match for peer-support expansion.',
    fitReasons:['Peer support is a selected interest','Local geography','Illustrative flexible program support'], gaps:['Practice confirming tax status','Practice reading exclusions'],
    disqualifiers:[], fundingMin:25000, fundingMax:75000, deadline:'2027-01-15', deadlineKind:'confirmed', deadlineTimezone:'Central Time (fictional)',
    applicationRoute:'Fictional online form', matchingFunds:'No fictional match required', restrictions:'Fictional: no capital purchases.', owner:'Associate Director', status:'Reviewing',
    notes:'FICTIONAL SAMPLE - safe for practice. This funder and opportunity do not exist.', nextAction:'Practice opening the source and recording eligibility gaps.',
    checkedAt:'2026-09-12T11:35:00Z', sourceState:'CURRENT', sourceType:'sample', recordType:'sample'
  }
];

export function clone(value){ return JSON.parse(JSON.stringify(value)); }
export function normalize(value=''){ return String(value).trim().toLowerCase().replace(/\s+/g,' '); }
export function stableKey(item){ return item.externalId ? `id:${normalize(item.externalId)}` : `source:${normalize(item.officialUrl)}|title:${normalize(item.title)}`; }
export function findDuplicate(items, candidate, ignoreId=''){
  const key=stableKey(candidate); return items.find(x=>x.id!==ignoreId && stableKey(x)===key) || null;
}
export function dateState(item, today=new Date().toISOString().slice(0,10)){
  if(item.deadlineKind==='rolling') return 'ROLLING';
  if(item.deadlineKind==='unknown'||!item.deadline) return 'UNKNOWN';
  if(item.deadline<today||item.status==='Closed') return 'CLOSED';
  const days=Math.ceil((Date.parse(item.deadline)-Date.parse(today))/86400000);
  return days<=30 ? 'APPROACHING' : 'CONFIRMED';
}
export function fitExplanation(item){
  const positives=item.fitReasons?.length||0, unknowns=item.gaps?.length||0, blocks=item.disqualifiers?.length||0;
  return {positives,unknowns,blocks,label:blocks?'Not actionable':unknowns?'Promising, verify':'Review-ready'};
}
export function toGrantDashboardRecord(item){
  const statusMap={New:'New','Verification needed':'Reviewing',Reviewing:'Reviewing',Shortlisted:'Reviewing',Declined:'Declined',Archived:'Archived',Closed:'Archived'};
  const lines=[
    `Grant Radar external ID: ${item.externalId||item.id}`,
    `Radar review status: ${item.status}`,
    `Record label: ${item.recordType==='sample'?'FICTIONAL SAMPLE':'REAL PUBLIC RESEARCH LEAD - ELIGIBILITY UNVERIFIED'}`,
    `Funder: ${item.funder}`,
    `Geography: ${item.geography||'Unknown'}`,
    `Applicant eligibility: ${item.applicantEligibility||'Unknown'}`,
    `Program fit: ${item.programFit||'Not assessed'}`,
    `Fit reasons: ${(item.fitReasons||[]).join('; ')||'None recorded'}`,
    `Eligibility gaps: ${(item.gaps||[]).join('; ')||'None recorded'}`,
    `Disqualifiers: ${(item.disqualifiers||[]).join('; ')||'None recorded'}`,
    `Deadline type/time zone: ${item.deadlineKind||'unknown'} / ${item.deadlineTimezone||'Unknown'}`,
    `Application route: ${item.applicationRoute||'Unknown'}`,
    `Matching funds: ${item.matchingFunds||'Unknown'}`,
    `Restrictions: ${item.restrictions||'None recorded'}`,
    `Last checked: ${item.checkedAt||'Never'}`,
    `Next action: ${item.nextAction||'Review needed'}`,
    '', item.notes||''
  ];
  return {id:item.externalId||item.id,kind:'opportunity',title:item.title,owner:item.owner||'',grant:'',due:item.deadlineKind==='confirmed'?item.deadline:'',status:statusMap[item.status]||'Reviewing',amount:Number(item.fundingMax||item.fundingMin||0),spent:0,source:item.officialUrl||'',notes:lines.join('\n').slice(0,10000),demo:item.recordType==='sample',updated:'',verifiedOn:(item.checkedAt||'').slice(0,10)};
}
export function buildExport(items){ return {schemaVersion:2,exportedAt:new Date().toISOString(),sourceSystem:'Nami Grant Radar',sourceVersion:VERSION,records:items.map(toGrantDashboardRecord)}; }
export function mergeRefresh(existing, incoming){
  const changed=[];
  const watched=['deadline','deadlineKind','deadlineTimezone','fundingMin','fundingMax','restrictions','applicationRoute','sourceState'];
  for(const key of watched) if(JSON.stringify(existing[key]??null)!==JSON.stringify(incoming[key]??null)) changed.push(key);
  return {...existing,...incoming,id:existing.id,owner:existing.owner,status:existing.status,notes:existing.notes,nextAction:existing.nextAction,
    history:[...(existing.history||[]),...(changed.length?[{at:new Date().toISOString(),type:'source-refresh',changed,previous:Object.fromEntries(changed.map(k=>[k,existing[k]]))}]:[])],
    changeFlags:[...new Set([...(existing.changeFlags||[]),...changed])]
  };
}
