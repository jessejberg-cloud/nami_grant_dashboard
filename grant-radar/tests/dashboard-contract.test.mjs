// Runs Radar's send file through the Grant Dashboard's OWN validator
// (../lib/records.ts in this repository), and mirrors the import rules in
// ../app/api/records/route.ts (op 'import'), so a change on either side that
// breaks the hand-off fails here.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import * as module from 'node:module';
import * as C from '../src/core.mjs';

const rulesPath=process.env.GRANT_DASHBOARD_RULES||fileURLToPath(new URL('../../lib/records.ts',import.meta.url));
const routePath=fileURLToPath(new URL('../../app/api/records/route.ts',import.meta.url));
const can=existsSync(rulesPath)&&typeof module.stripTypeScriptTypes==='function';

async function dashboard(){
  const src=module.stripTypeScriptTypes(readFileSync(rulesPath,'utf8'));
  return import('data:text/javascript;base64,'+Buffer.from(src).toString('base64'));
}
// The route's import step, as written there: schema 1-3, 1-100 records, no
// repeated ids, every record validated, and the WHOLE file refused when one
// record matches an existing kind + lower-cased title + exact source.
function importLikeDashboard(rules,payload,existing,demo){
  if(payload.schemaVersion!==undefined&&![1,2,3].includes(payload.schemaVersion))throw Error('Unsupported schemaVersion.');
  if(!Array.isArray(payload.records)||payload.records.length<1||payload.records.length>100)throw Error('Import 1–100 records in a records array.');
  const ids=new Set();for(const r of payload.records){if(r.id){if(ids.has(r.id))throw Error('Duplicate IDs in import.');ids.add(r.id)}}
  const items=payload.records.map(v=>rules.validate({...v,id:v.id||'',demo}));
  const keys=new Set();
  for(const r of items){const key=r.kind+'|'+r.title.toLowerCase()+'|'+r.source;
    if(keys.has(key)||existing.some(e=>e.demo===r.demo&&e.kind===r.kind&&e.title.toLowerCase()===r.title.toLowerCase()&&e.source===r.source))throw Error('A matching record is already present: '+r.title);keys.add(key)}
  return [...existing,...items];
}

test('the route still has the import rules this test mirrors',{skip:!existsSync(routePath)&&'route.ts not found'},()=>{
  const route=readFileSync(routePath,'utf8');
  assert.match(route,/input\.schemaVersion!==1&&input\.schemaVersion!==2&&input\.schemaVersion!==3/);
  assert.match(route,/A matching record is already present/);
  assert.match(route,/input\.records\.length>100/);
});

test('every starting lead, sent as a file, passes the Dashboard validator',{skip:!can&&'Dashboard rules or Node 22.13+ not available'},async()=>{
  const rules=await dashboard();
  const real=C.initialOpportunities.filter(i=>i.recordType==='public'&&i.status!=='Closed');
  const file=C.buildExport(real);
  const after=importLikeDashboard(rules,JSON.parse(JSON.stringify(file)),[],false);
  assert.equal(after.length,real.length);
  for(const r of after){assert.equal(r.kind,'opportunity');assert.ok(rules.statuses.opportunity.includes(r.status))}
  const practice=C.buildExport(C.initialOpportunities.filter(i=>i.recordType==='sample'));
  const p=importLikeDashboard(rules,practice,[],true);
  assert.equal(p[0].demo,true);assert.match(p[0].notes,/PRACTICE/);
});

test('every Radar status maps to a Dashboard status',{skip:!can&&'Dashboard rules not available'},async()=>{
  const rules=await dashboard();
  for(const s of C.statuses){
    const r=rules.validate({...C.toGrantDashboardRecord({...C.initialOpportunities[4],status:s}),demo:true});
    assert.ok(rules.statuses.opportunity.includes(r.status),s);
  }
});

test('sending the same lead twice is refused by the Dashboard, which is why Radar remembers Sent',{skip:!can&&'Dashboard rules not available'},async()=>{
  const rules=await dashboard();
  const lead={...C.initialOpportunities[0]};
  const once=importLikeDashboard(rules,C.buildExport([lead]),[],false);
  assert.throws(()=>importLikeDashboard(rules,C.buildExport([lead,C.initialOpportunities[2]]),once,false),/already present/);
  // Radar's default picks leave sent leads out, so the second file is clean.
  const sentAt='2026-10-05T12:00:00Z';
  const pool=[{...lead,sentAt},{...C.initialOpportunities[2],status:'Shortlisted'}];
  const picks=pool.filter(i=>!i.sentAt&&['Shortlisted','Reviewing'].includes(i.status));
  assert.equal(importLikeDashboard(rules,C.buildExport(picks),once,false).length,2);
});

test('a Dashboard export opened in Radar comes back as leads, and is not sent back',{skip:!can&&'Dashboard rules not available'},async()=>{
  const rules=await dashboard();
  const inDashboard=importLikeDashboard(rules,C.buildExport([C.initialOpportunities[3]]),[],false);
  const backup={schemaVersion:3,exportedAt:'2026-10-05T00:00:00Z',workspace:'agency',records:[...inDashboard,...rules.samples().filter(r=>r.kind==='grant')]};
  const r=C.readImport(JSON.stringify(backup),[],()=>'id1');
  assert.equal(r.added.length,1);assert.equal(r.added[0].externalId,'bader-philanthropies-grantmaking');assert.ok(r.added[0].sentAt);
});
