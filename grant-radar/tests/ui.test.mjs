// Real-browser tests of the BUILT single file (dist/index.html), opened the
// way a person opens it: by double-click (file://). Needs Playwright and a
// Chromium; set PLAYWRIGHT_PATH / CHROMIUM_PATH if they are not found.
//   node scripts/build.mjs && node --test tests/ui.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {fileURLToPath,pathToFileURL} from 'node:url';

const page=pathToFileURL(fileURLToPath(new URL('../dist/index.html',import.meta.url))).href;
let chromium=null;
for(const p of [process.env.PLAYWRIGHT_PATH,'playwright','/opt/node22/lib/node_modules/playwright/index.mjs'].filter(Boolean)){
  try{({chromium}=await import(p.startsWith('/')?pathToFileURL(p).href:p));break}catch{}
}
const exe=process.env.CHROMIUM_PATH||(existsSync('/opt/pw-browsers/chromium')?'/opt/pw-browsers/chromium':undefined);
const skip=!chromium&&'Playwright not installed';

async function open(t,{viewport={width:1280,height:860},storage=null,tour=false}={}){
  const browser=await chromium.launch({executablePath:exe});
  const ctx=await browser.newContext({viewport,acceptDownloads:true});
  const p=await ctx.newPage();
  const errors=[];p.on('pageerror',e=>errors.push(e.message));
  // Fonts come from Google; block them so tests run offline and fast.
  await p.route(/fonts\.(googleapis|gstatic)\.com/,r=>r.abort());
  await p.goto(page);
  if(storage!==null||!tour){await p.evaluate(s=>{localStorage.clear();if(s)for(const[k,v]of Object.entries(s))localStorage.setItem(k,v)},{...(tour?{}:{'nami-radar-onboarding-v1':'{"result":"skipped"}'}),...(storage||{})});await p.reload()}
  await p.waitForSelector('#nav button');
  t.after(async()=>{assert.deepEqual(errors,[],'no page errors');await browser.close()});
  return p;
}
const nav=(p,tab)=>p.click(`#nav [data-arg="${tab}"]`);
const stored=async p=>JSON.parse(await p.evaluate(()=>localStorage.getItem('nami-radar-opportunities-v1'))||'null');

test('first visit: the tour runs, points at real things, can be skipped, and does not return',{skip},async t=>{
  const p=await open(t,{tour:true,storage:{}});
  await p.waitForSelector('.tour-card');
  assert.match(await p.textContent('.tour-card'),/Welcome/);
  await p.click('#tour-next');
  assert.ok(await p.isVisible('.tour-ring'),'step 2 rings the Leads button');
  await p.click('#tour-next');await p.click('#tour-back');
  assert.match(await p.textContent('.tour-card h2'),/Your leads/);
  await p.keyboard.press('Escape');
  assert.equal(await p.$('.tour-card'),null);
  await p.reload();await p.waitForSelector('#nav button');await p.waitForTimeout(400);
  assert.equal(await p.$('.tour-card'),null,'returning visit: no tour');
  await nav(p,'Help');await p.click('[data-act="tour"]');
  for(let i=0;i<6;i++)await p.click('#tour-next');
  assert.equal(await p.$('.tour-card'),null);
  assert.match(await p.textContent('#toast'),/practice lead/);
});

test('adding a lead: only a name needed, real by default, duplicates caught, draft kept',{skip},async t=>{
  const p=await open(t);
  await p.click('[data-act="add"]');
  await p.click('#lead-form button.primary');
  assert.match(await p.textContent('#form-error'),/name/);
  await p.fill('[name=title]','Half typed');await p.keyboard.press('Escape');
  await p.click('[data-act="add"]');
  assert.equal(await p.inputValue('[name=title]'),'Half typed','closing keeps what was typed');
  await p.fill('[name=title]','Bader Philanthropies grantmaking programs');await p.fill('[name=officialUrl]','https://bader.org/');
  await p.click('#lead-form button.primary');
  assert.match(await p.textContent('#form-error'),/already here/);
  await p.fill('[name=title]','Lakeshore Mental Health Fund');
  await p.check('input[name=deadlineKind][value=confirmed]');await p.fill('[name=deadline]','2026-12-01');await p.fill('[name=fundingMax]','15000');
  await p.click('#lead-form button.primary');
  assert.equal(await p.textContent('#page-title'),'Lakeshore Mental Health Fund');
  const saved=(await stored(p)).find(i=>i.title==='Lakeshore Mental Health Fund');
  assert.equal(saved.recordType,'public');assert.equal(saved.fundingMax,15000);assert.equal(saved.deadline,'2026-12-01');
});

test('a lead: notes save by themselves, status and archive can be undone, page checks flag changes',{skip},async t=>{
  const p=await open(t);
  await nav(p,'Leads');await p.click('[data-act="open"][data-arg="pub-bader-grantmaking"]');
  await p.fill('[data-live="nextAction"]','Email the program officer');await p.click('h1');
  await p.reload();await nav(p,'Leads');await p.click('[data-act="open"][data-arg="pub-bader-grantmaking"]');
  assert.equal(await p.inputValue('[data-live="nextAction"]'),'Email the program officer','kept after a reload');
  await p.click('[data-act="status"][data-arg="Shortlisted"]');
  await p.click('#toast-act');
  assert.equal((await stored(p)).find(i=>i.id==='pub-bader-grantmaking').status,'Verification needed','undo puts it back');
  await p.click('[data-act="check"]');
  await p.check('input[name=deadlineKind][value=confirmed]');await p.fill('#check-form [name=deadline]','2027-02-01');await p.fill('#check-form [name=fundingMax]','40000');
  await p.click('#check-form button.primary');
  assert.match(await p.textContent('.changed'),/deadline.*largest amount|largest amount.*deadline/);
  await p.click('[data-act="ack"]');assert.equal(await p.$('.changed'),null);
  await p.click('[data-act="archive"]');
  assert.equal((await stored(p)).find(i=>i.id==='pub-bader-grantmaking').status,'Archived');
  await p.click('#toast-act');
  assert.equal((await stored(p)).find(i=>i.id==='pub-bader-grantmaking').status,'Verification needed');
});

test('leads: search filters as you type and keeps focus; filters work',{skip},async t=>{
  const p=await open(t);
  await nav(p,'Leads');
  await p.click('#q');await p.keyboard.type('milwaukee');
  assert.equal(await p.evaluate(()=>document.activeElement.id),'q');
  assert.equal(await p.locator('#lead-list .lead').count(),3,'West Bend, Community Bridge, Bader (closed cycle is put away)');
  await p.fill('#q','');await p.click('[data-act="filter"][data-arg="Put away"]');
  assert.equal(await p.locator('#lead-list .lead').count(),1,'the closed cycle');
  await nav(p,'Home');await p.click('[data-act="see"][data-arg="Needs checking"]');
  assert.equal(await p.getAttribute('[data-act="filter"][data-arg="Needs checking"]','aria-pressed'),'true');
});

test('send: picks, saves a file the Dashboard accepts, marks Sent, and leaves Sent out next time',{skip},async t=>{
  const p=await open(t);
  await nav(p,'Leads');await p.click('[data-act="open"][data-arg="pub-gmf-west-bend-2026-cycle-2"]');
  await p.click('[data-act="status"][data-arg="Shortlisted"]');
  await nav(p,'Send');
  assert.equal(await p.isChecked('[data-pick="pub-gmf-west-bend-2026-cycle-2"]'),true,'shortlisted is ticked for you');
  const [dl]=await Promise.all([p.waitForEvent('download'),p.click('[data-act="save-file"]')]);
  const file=JSON.parse(readFileSync(await dl.path(),'utf8'));
  assert.equal(file.schemaVersion,2);assert.equal(file.records.length,1);assert.equal(file.records[0].title,"West Bend Insurance Company's Charitable Fund - Cycle 2");
  assert.ok((await stored(p)).find(i=>i.id==='pub-gmf-west-bend-2026-cycle-2').sentAt);
  await nav(p,'Home');await nav(p,'Send');
  assert.equal(await p.isChecked('[data-pick="pub-gmf-west-bend-2026-cycle-2"]'),false,'sent leads are not ticked again');
  await p.check('[data-pick="pub-gmf-west-bend-2026-cycle-2"]');
  assert.match(await p.textContent('#pick-count'),/already sent/);
  await p.click('[data-act="send-kind"][data-arg="sample"]');
  assert.equal(await p.locator('[data-pick]').count(),1,'practice leads are sent on their own');
});

test('your data: backup, start fresh with undo, open a backup, comfort settings',{skip},async t=>{
  const p=await open(t);
  await p.click('[data-act="add"]');await p.fill('[name=title]','Keep me');await p.click('#lead-form button.primary');
  await nav(p,'Help');await p.click('[data-act="help"][data-arg="data"]');
  const [dl]=await Promise.all([p.waitForEvent('download'),p.click('[data-act="backup"]')]);
  const backupPath=await dl.path();
  await p.click('[data-act="fresh"]');await p.click('[data-act="fresh-yes"]');
  assert.equal((await stored(p)).some(i=>i.title==='Keep me'),false);
  await p.click('#toast-act');
  assert.equal((await stored(p)).some(i=>i.title==='Keep me'),true,'undo brings them back');
  await p.click('[data-act="fresh"]');await p.click('[data-act="fresh-yes"]');
  await p.setInputFiles('#import-file',backupPath);
  await p.waitForFunction(()=>/added/.test(document.querySelector('#toast').textContent));
  assert.match(await p.textContent('#toast'),/1 lead added, 5 already here/);
  await p.click('[data-act="large"]');
  assert.ok(await p.evaluate(()=>document.querySelector('.gr-root').classList.contains('gr-large')));
  await p.reload();
  assert.ok(await p.evaluate(()=>document.querySelector('.gr-root').classList.contains('gr-large')),'remembered');
});

test('home: three short lists with names, never a number; tips can wait until tomorrow; five statuses',{skip},async t=>{
  const p=await open(t);
  assert.equal(await p.locator('.page h2').count(),3,'Coming up, Needs checking, Shortlisted');
  assert.equal(await p.$('.glance'),null,'no number cards');
  assert.doesNotMatch(await p.textContent('.page'),/\b\d+ (leads?|picked)\b/,'no count of leads on Home');
  assert.match(await p.textContent('.tip'),/Three short lists/);
  await p.click('[data-act="tip-later"]');
  assert.equal(await p.$('.tip'),null,'Later puts the tip away');
  await p.reload();await p.waitForSelector('#nav button');
  assert.equal(await p.$('.tip'),null,'still away after a reload');
  await p.evaluate(()=>{const s=JSON.parse(localStorage.getItem('nami-radar-settings-v2'));s.tipsLater.Home=Date.now()-1;localStorage.setItem('nami-radar-settings-v2',JSON.stringify(s))});
  await p.reload();await p.waitForSelector('#nav button');
  assert.ok(await p.$('.tip'),'back the next day');
  await nav(p,'Leads');
  assert.deepEqual(await p.$$eval('.chips .chip',n=>n.filter(x=>/\s\d+$/.test(x.textContent.trim())).map(x=>x.textContent)),[],'filter chips carry no counts');
  await p.click('[data-act="open"][data-arg="pub-bader-grantmaking"]');
  assert.equal(await p.locator('[data-act="status"]').count(),5,'five statuses to choose from');
  await p.click('[data-act="archive"]');await p.click('[data-act="open"][data-arg="pub-bader-grantmaking"]').catch(()=>{});
  await nav(p,'Leads');await p.click('[data-act="filter"][data-arg="Put away"]');await p.click('[data-act="open"][data-arg="pub-bader-grantmaking"]');
  assert.equal(await p.locator('[data-act="status"]').count(),6,'an archived lead shows Archived as well');
  assert.equal(await p.getAttribute('[data-act="status"][data-arg="Archived"]','aria-pressed'),'true');
  await p.waitForSelector('.tour-card',{state:'detached'}).catch(()=>{});
});

test('help: manual and quick start read inside the app',{skip},async t=>{
  const p=await open(t);
  await nav(p,'Help');await p.click('[data-act="help"][data-arg="quick"]');
  assert.equal(await p.locator('ol.qs li').count(),8);
  await p.click('[data-act="help"][data-arg="manual"]');
  await p.click('.toc [data-arg="send"]');
  assert.match(await p.textContent('#manual-h'),/Sending leads/);
  await p.click('[data-act="tip-ok"]');
  assert.equal(await p.$('.tip'),null);
});

test('phone width: bottom bar, no sideways scroll, dialogs fit',{skip},async t=>{
  const p=await open(t,{viewport:{width:375,height:740}});
  for(const tab of ['Home','Leads','Find grants','Send','Help']){
    await nav(p,tab);
    assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth),true,tab);
  }
  await nav(p,'Leads');await p.click('[data-act="open"][data-arg="sample-peer-wellbeing"]');
  assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth),true,'lead detail');
  await p.click('[data-act="add"]').catch(()=>{});await nav(p,'Leads');await p.click('[data-act="add"]');
  const box=await p.locator('.dialog').boundingBox();
  assert.ok(box.x>=0&&box.x+box.width<=375);
  await p.keyboard.press('Escape');assert.equal(await p.$('.dialog'),null);
});

test('keyboard: dialogs trap focus and Escape closes them',{skip},async t=>{
  const p=await open(t);
  await p.click('[data-act="add"]');
  for(let i=0;i<40;i++)await p.keyboard.press('Tab');
  assert.ok(await p.evaluate(()=>document.querySelector('.dialog').contains(document.activeElement)));
  await p.keyboard.press('Escape');
  assert.equal(await p.$('.dialog'),null);
});
