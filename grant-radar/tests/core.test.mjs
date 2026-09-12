import test from 'node:test';
import assert from 'node:assert/strict';
import {initialOpportunities,findDuplicate,dateState,fitExplanation,buildExport,mergeRefresh} from '../dist/core.mjs';

test('conservative duplicate matching uses stable external ID',()=>{
  const candidate={...initialOpportunities[0],id:'different',title:'Changed display title'};
  assert.equal(findDuplicate(initialOpportunities,candidate)?.id,initialOpportunities[0].id);
});

test('fallback duplicate matching uses normalized title and source',()=>{
  const items=[{id:'one',externalId:'',title:' Example Lead ',officialUrl:'https://example.org/grant'}];
  assert.equal(findDuplicate(items,{id:'two',externalId:'',title:'example   lead',officialUrl:'https://example.org/grant'})?.id,'one');
});

test('deadline states distinguish confirmed, rolling, unknown and closed',()=>{
  assert.equal(dateState({deadlineKind:'confirmed',deadline:'2026-10-09',status:'Reviewing'}),'APPROACHING');
  assert.equal(dateState({deadlineKind:'rolling',deadline:'',status:'Reviewing'}),'ROLLING');
  assert.equal(dateState({deadlineKind:'unknown',deadline:'',status:'Reviewing'}),'UNKNOWN');
  assert.equal(dateState({deadlineKind:'confirmed',deadline:'2026-06-12',status:'Closed'}),'CLOSED');
});

test('fit is explained rather than hidden in a score',()=>{
  assert.deepEqual(fitExplanation({fitReasons:['a','b'],gaps:['x'],disqualifiers:[]}),{positives:2,unknowns:1,blocks:0,label:'Promising, verify'});
});

test('refresh preserves staff decisions and notes while flagging changes',()=>{
  const old={...initialOpportunities[0],owner:'Jesse',status:'Shortlisted',notes:'Keep this note',history:[],changeFlags:[]};
  const next={...old,deadline:'2026-10-15',fundingMax:50000,owner:'Overwrite',status:'Closed',notes:'Overwrite'};
  const merged=mergeRefresh(old,next);
  assert.equal(merged.owner,'Jesse');assert.equal(merged.status,'Shortlisted');assert.equal(merged.notes,'Keep this note');
  assert.ok(merged.changeFlags.includes('deadline'));assert.ok(merged.changeFlags.includes('fundingMax'));assert.equal(merged.history.length,1);
});

test('dashboard export is schema v2 and accepted opportunity shape',()=>{
  const data=buildExport([initialOpportunities[0],initialOpportunities[4]]);
  assert.equal(data.schemaVersion,2);assert.equal(data.records.length,2);
  for(const r of data.records){assert.equal(r.kind,'opportunity');assert.ok(['New','Reviewing','Applying','Declined','Archived'].includes(r.status));assert.equal(r.spent,0);assert.equal(typeof r.amount,'number');assert.ok(r.notes.includes('Grant Radar external ID:'));}
  assert.equal(data.records[0].status,'Reviewing');assert.equal(data.records[1].demo,true);
});

