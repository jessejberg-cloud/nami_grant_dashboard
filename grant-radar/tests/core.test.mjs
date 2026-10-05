// Logic tests. No dependencies: node --test tests/core.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import * as C from '../src/core.mjs';

const lead=(o={})=>({...C.blankLead(),id:'x1',title:'Example Fund',officialUrl:'https://example.org/a',...o});

test('a new lead is a real lead unless marked practice (1.0.1 defaulted to fictional sample)',()=>{
  assert.equal(C.blankLead().recordType,'public');
  assert.equal(C.blankLead().sentAt,'');
});

test('duplicates: same external ID, or same name and link; missing link never crashes',()=>{
  const items=[lead({externalId:'abc'}),{id:'old',title:'No link lead'}];
  assert.equal(C.findDuplicate(items,lead({id:'n',externalId:'ABC',title:'Other'}))?.id,'x1');
  assert.equal(C.findDuplicate(items,lead({id:'n',externalId:'',title:'  example   FUND '}))?.id,'x1');
  assert.equal(C.findDuplicate(items,lead({id:'n',externalId:'',title:'No link lead',officialUrl:'https://e.org'})),null);
  assert.equal(C.findDuplicate(items,lead({id:'x1'}),'x1'),null,'editing a lead is not a duplicate of itself');
});

test('deadline states and days left use the local calendar day',()=>{
  assert.equal(C.dateState({deadlineKind:'confirmed',deadline:'2026-10-09',status:'Reviewing'},'2026-10-05'),'APPROACHING');
  assert.equal(C.dateState({deadlineKind:'confirmed',deadline:'2027-01-15',status:'Reviewing'},'2026-10-05'),'CONFIRMED');
  assert.equal(C.dateState({deadlineKind:'rolling',status:'Reviewing'}),'ROLLING');
  assert.equal(C.dateState({deadlineKind:'unknown',status:'Reviewing'}),'UNKNOWN');
  assert.equal(C.dateState({deadlineKind:'confirmed',deadline:'2026-06-12',status:'Reviewing'},'2026-10-05'),'CLOSED');
  assert.equal(C.dateState({deadlineKind:'rolling',status:'Closed'}),'CLOSED');
  assert.equal(C.daysLeft({deadlineKind:'confirmed',deadline:'2026-10-09'},'2026-10-05'),4);
  assert.equal(C.daysLeft({deadlineKind:'confirmed',deadline:'2026-10-05'},'2026-10-05'),0);
  assert.equal(C.daysLeft({deadlineKind:'rolling'},'2026-10-05'),null);
  assert.equal(C.localToday(new Date(2026,9,5,23,30)),'2026-10-05','late evening is still today');
});

test('page freshness: recent, time for a fresh look, never checked',()=>{
  const i=C.initialOpportunities[0];
  assert.equal(C.sourceFreshness(i,'2026-09-20'),'CURRENT');
  assert.equal(C.sourceFreshness(i,'2026-10-13'),'STALE');
  assert.equal(C.sourceFreshness({...i,checkedAt:''}),'UNKNOWN');
  assert.ok(C.needsChecking({...i,status:'Reviewing',changeFlags:['deadline']}));
});

test('fit is spelled out, never scored',()=>{
  assert.deepEqual(C.fitExplanation({fitReasons:['a','b'],gaps:['x'],disqualifiers:[]}),{positives:2,unknowns:1,blocks:0,label:'Promising, with questions'});
  assert.equal(C.fitExplanation({fitReasons:['a'],gaps:[],disqualifiers:['closed']}).label,'Has a deal-breaker');
});

test('validation explains how to fix each problem',()=>{
  assert.throws(()=>C.validateOpportunity(lead({title:' '})),/name/);
  assert.throws(()=>C.validateOpportunity(lead({officialUrl:'javascript:alert(1)'})),/https/);
  assert.throws(()=>C.validateOpportunity(lead({fundingMin:10,fundingMax:5})),/Swap/);
  assert.throws(()=>C.validateOpportunity(lead({deadlineKind:'confirmed',deadline:''})),/Rolling/);
  assert.throws(()=>C.validateOpportunity(lead({deadline:'2026-02-30'})),/real date/);
  assert.ok(C.validateOpportunity(lead()));
});

test('a source check keeps notes, owner, status and next step, and flags what changed',()=>{
  const old={...C.initialOpportunities[0],owner:'Jesse',status:'Shortlisted',notes:'Keep this',nextAction:'Call',history:[],changeFlags:[]};
  const merged=C.mergeRefresh(old,{...old,deadline:'2026-10-15',fundingMax:50000,owner:'X',status:'Closed',notes:'X',nextAction:'X'});
  assert.equal(merged.owner,'Jesse');assert.equal(merged.status,'Shortlisted');assert.equal(merged.notes,'Keep this');assert.equal(merged.nextAction,'Call');
  assert.deepEqual(merged.changeFlags.sort(),['deadline','fundingMax']);assert.equal(merged.history.length,1);
  assert.equal(C.mergeRefresh(old,{...old}).history.length,0,'no change, no history line');
});

test('export: shape, practice kept apart, and limits the Dashboard enforces',()=>{
  const data=C.buildExport([C.initialOpportunities[0]]);
  assert.equal(data.schemaVersion,2);assert.equal(data.demo,false);
  const r=data.records[0];
  assert.equal(r.kind,'opportunity');assert.equal(r.status,'Reviewing');assert.equal(r.spent,0);assert.equal(r.due,'2026-10-09');
  assert.match(r.notes,/Grant Radar ID: gmf-west-bend/);
  assert.equal(C.buildExport([C.initialOpportunities[4]]).demo,true);
  assert.throws(()=>C.buildExport([C.initialOpportunities[0],C.initialOpportunities[4]]),/practice/);
  assert.throws(()=>C.buildExport([]),/at least one/);
  assert.throws(()=>C.buildExport(Array.from({length:101},(_,n)=>lead({id:'i'+n,title:'L'+n}))),/100/);
  assert.throws(()=>C.buildExport([lead({notes:'x'.repeat(11000)})]),/Shorten/);
  assert.throws(()=>C.buildExport([lead({id:'a'}),lead({id:'b'})]),/same name and link/);
  const future=C.toGrantDashboardRecord(lead({checkedAt:'2099-01-01T00:00:00Z'}),'2026-10-05');
  assert.equal(future.verifiedOn,'','a future check date is dropped, because the Dashboard refuses it');
  assert.match(C.exportFileName([lead()],'2026-10-05'),/^grant-radar-1-lead-2026-10-05\.json$/);
});

test('opening a file: backup, Dashboard export, Radar export, bad input',()=>{
  const ids=(()=>{let n=0;return()=>'new'+(++n)})();
  const existing=[C.initialOpportunities[0]];
  const backup=C.makeBackup({items:[C.initialOpportunities[0],C.initialOpportunities[1]],preferences:C.defaultPreferences});
  const r1=C.readImport(JSON.stringify(backup),existing,ids);
  assert.equal(r1.kind,'backup');assert.equal(r1.added.length,1);assert.deepEqual(r1.skipped,[C.initialOpportunities[0].title]);

  const dash={schemaVersion:3,records:[{kind:'grant',title:'An award'},{kind:'opportunity',title:'Dashboard lead',status:'Applying',source:'https://d.org',amount:5000,due:'2027-03-01',demo:false,notes:''}]};
  const r2=C.readImport(JSON.stringify(dash),existing,ids);
  assert.equal(r2.added.length,1);const d=r2.added[0];
  assert.equal(d.status,'Shortlisted');assert.equal(d.fundingMax,5000);assert.equal(d.deadlineKind,'confirmed');assert.ok(d.sentAt,'already in the Dashboard, so marked sent');

  const exp=C.buildExport([C.initialOpportunities[0]]);
  const r3=C.readImport(JSON.stringify(exp),existing,ids);
  assert.equal(r3.added.length,0);assert.equal(r3.skipped.length,1,'re-importing our own export finds the original by ID');

  assert.throws(()=>C.readImport('not json',existing),/cannot read|can read/);
  assert.throws(()=>C.readImport(JSON.stringify({records:[{kind:'grant'}]}),existing),/no grant leads/);
  const r4=C.readImport(JSON.stringify([{title:''},{title:'Fine',officialUrl:'ftp://x'},null,{title:'Good one'}]),[],ids);
  assert.equal(r4.added.length,1);assert.equal(r4.problems.length,3);
});

test('search links are built from preferences',()=>{
  const links=C.searchLinks(C.defaultPreferences);
  assert.equal(links.length,4);
  for(const l of links)assert.ok(C.safeSource(l.url),l.url);
  assert.match(decodeURIComponent(links[0].url),/mental health/);
});
