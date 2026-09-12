import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {stripTypeScriptTypes} from 'node:module';
import {initialOpportunities,buildExport,sourceFreshness,findDuplicate,validateOpportunity,dateState} from '../dist/core.mjs';

test('stale source aging and unknown check date',()=>{
 assert.equal(sourceFreshness(initialOpportunities[0],'2026-10-13'),'STALE');
 assert.equal(sourceFreshness({...initialOpportunities[0],checkedAt:''}),'UNKNOWN');
 assert.equal(dateState({deadlineKind:'rolling',status:'Closed'}),'CLOSED');
});
test('different external IDs still trigger exact source and title duplicate',()=>{
 assert.ok(findDuplicate(initialOpportunities,{...initialOpportunities[0],id:'other',externalId:'different'}));
});
test('invalid URLs, funding ranges and oversized exports fail visibly',()=>{
 assert.throws(()=>validateOpportunity({...initialOpportunities[0],officialUrl:'javascript:alert(1)'}),/HTTP/);
 assert.throws(()=>validateOpportunity({...initialOpportunities[0],fundingMin:10,fundingMax:5}),/Minimum/);
 assert.throws(()=>buildExport([]),/1–100/);
 assert.throws(()=>buildExport([{...initialOpportunities[0],notes:'x'.repeat(11000)}]),/nothing was truncated/);
});
test('real dashboard validator accepts isolated synthetic Radar export',async()=>{
 // Exact inspected upstream validator, supplied as a read-only checkout or explicit path.
 const path=process.env.GRANT_DASHBOARD_RULES||'../reference-grant-dashboard/lib/records.ts';
 const source=stripTypeScriptTypes(readFileSync(path,'utf8'));
 const rules=await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
 const payload=buildExport([initialOpportunities[4]]);
 const accepted=payload.records.map(r=>rules.validate({...r,demo:payload.demo}));
 assert.equal(accepted[0].kind,'opportunity');assert.equal(accepted[0].demo,true);
 assert.equal(accepted[0].status,'Reviewing');assert.equal(accepted[0].spent,0);
 assert.ok(accepted[0].notes.includes('FICTIONAL SAMPLE'));
});
