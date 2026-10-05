// Drives the real app in a headless browser through what a coordinator does in a week.
// Run: node tests/flow.test.mjs   (needs the `playwright` package; set PW_CHROMIUM to a Chromium binary if it is not on the default path)
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const require=createRequire(import.meta.url);
let pw;try{pw=require('playwright')}catch{pw=require(process.env.PLAYWRIGHT_PATH||'/opt/node-tools/node_modules/playwright')}
const file='file://'+fileURLToPath(new URL('../Volunteers-and-Events.html',import.meta.url));
const shots=process.env.SHOTS||'';
const browser=await pw.chromium.launch(process.env.PW_CHROMIUM?{executablePath:process.env.PW_CHROMIUM}:{});
const ctx=await browser.newContext({acceptDownloads:true,viewport:{width:1100,height:900}});
const page=await ctx.newPage();
const errors=[];page.on('pageerror',e=>errors.push(e.message));if(process.env.LOG)page.on('console',m=>{if(/ACT|RENDER|CLICK/.test(m.text()))console.log('   ',m.text())});page.on('console',m=>{if(m.type()==='error'&&!/Failed to load resource/.test(m.text()))errors.push(m.text())});
const step=async(name,fn)=>{await fn();console.log('ok -',name)};
const wait=ms=>page.waitForTimeout(ms);
const today=new Date();const iso=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
const daysAgo=n=>{const d=new Date();d.setDate(d.getDate()-n);return iso(d)};

await page.goto(file);
await step('opens on the welcome when empty',async()=>{await page.locator('main').getByText('Keep your events and helpers in one place').waitFor()});
await step('a new event takes a name with the cursor already in it',async()=>{
  await page.getByRole('button',{name:'Add my first event'}).click();
  await page.keyboard.type('Spring Walk');
  assert.equal(await page.locator('#ev-name').inputValue(),'Spring Walk');
});
let evUrl=page.url();
await step('date and times save',async()=>{
  const id=evUrl.split('event.')[1];
  await page.locator(`#f-events-${id}-date`).fill(daysAgo(2));
  await page.locator(`#f-events-${id}-start`).fill('09:00');
  await page.locator(`#f-events-${id}-end`).fill('12:00');
  await page.locator(`#f-events-${id}-place`).fill('Lakefront');
});
await step('typing the name then pressing a button still works (no swallowed tap)',async()=>{
  await page.locator('#ev-name').fill('Spring Walk 2026');
  await page.getByRole('button',{name:'Add a job'}).click();
  await wait(50);
  assert.equal(await page.locator('.job').count(),1);
});
await step('a job takes a name and a headcount',async()=>{
  await page.keyboard.type('Greeter');
  const need=page.locator('input[id$="-k"]');await need.fill('3');await need.blur();
});
await step('typing a new name under a job signs them up and makes them a volunteer',async()=>{
  const add=page.locator('.adder input[list]').first();
  await add.fill('Ana Gomez');await add.press('Enter');
  await add.fill('Ben Ortiz');await add.press('Enter');
  await page.locator('main').getByText('Ana Gomez').first().waitFor();
  assert.equal(await page.locator('.who').count(),2);
});
await step('the same name twice does not sign them up twice',async()=>{
  const add=page.locator('.adder input[list]').first();await add.fill('ana gomez');await add.press('Enter');
  assert.equal(await page.locator('.who').count(),2);
});
await step('Everyone came marks both, and hours come from the event times',async()=>{
  await page.getByRole('button',{name:'Everyone came'}).click();await wait(80);
  assert.equal(await page.locator('.seg button[aria-pressed="true"]',{hasText:'Came'}).count(),2);
  assert.equal(await page.locator('input.hours').first().getAttribute('placeholder'),'3');
});
await step('one person\'s hours can be changed',async()=>{const h=page.locator('input.hours').nth(1);await h.fill('2.5');await h.blur()});
await step('the same start and end time gives no hours, not a whole day',async()=>{
  const id=evUrl.split('event.')[1];
  await page.locator(`#f-events-${id}-end`).fill('09:00');await wait(80);
  assert.equal(await page.locator('input.hours').first().getAttribute('placeholder'),'hours');
  await page.locator(`#f-events-${id}-end`).fill('12:00');await wait(80);
  assert.equal(await page.locator('input.hours').first().getAttribute('placeholder'),'3');
});
await step('a half-typed name survives a redraw',async()=>{
  const add=page.locator('.adder input[list]').first();await add.fill('Zo');
  const need=page.locator('input[id$="-k"]');await need.fill('4');await wait(700);
  assert.equal(await add.inputValue(),'Zo');await add.fill('');
});
await step('a to-do adds on Enter and ticks off',async()=>{
  await page.locator('#todo-new').fill('Thank-you cards');await page.locator('#todo-new').press('Enter');
  await page.locator('.todo input[type=checkbox]').first().check();await wait(50);
  assert.equal(await page.locator('.todo.done').count(),1);
});
await step('Volunteer hours adds it up',async()=>{
  await page.goto(file+'#hours');await wait(100);
  const t=await page.locator('table').innerText();
  assert.match(t,/Ana Gomez\s+1\s+3/);assert.match(t,/Ben Ortiz\s+1\s+2\.5/);assert.match(t,/Total\s+5\.5/);
});
await step('the spreadsheet file downloads and starts with the header row',async()=>{
  const [dl]=await Promise.all([page.waitForEvent('download'),page.getByRole('button',{name:'Download spreadsheet file'}).click()]);
  const txt=fs.readFileSync(await dl.path(),'utf8');assert.match(txt,/Volunteer,Events,Hours/);
});
await step('everything is still there after closing and reopening',async()=>{
  await page.reload();await page.goto(file+'#people');await page.locator('main').getByText('Ben Ortiz').waitFor();
});
await step('add many at once skips names already there',async()=>{
  await page.goto(file+'#addmany');
  await page.locator('#many').fill('Chris Wu, 414-555-0100, chris@example.org\nBen Ortiz\nDana Patel,,dana@example.org');
  await page.getByRole('button',{name:'Add these volunteers'}).click();
  await page.locator('#toast').getByText('2 volunteers added, 1 already there.').waitFor();
});
await step('delete has Undo, and Recently deleted brings it back',async()=>{
  await page.locator('main').getByText('Chris Wu').click();
  await page.getByRole('button',{name:'Delete volunteer'}).click();
  await page.locator('#toast').getByRole('button',{name:'Undo'}).click();await wait(80);
  await page.goto(file+'#people');await page.locator('main').getByText('Chris Wu').waitFor();
  await page.locator('main').getByText('Chris Wu').click();await page.getByRole('button',{name:'Delete volunteer'}).click();
  await page.goto(file+'#deleted');await page.getByRole('button',{name:'Bring back'}).click();
  await page.goto(file+'#people');await page.locator('main').getByText('Chris Wu').waitFor();
});
await step('a new gift starts as food or goods, and money asks for its event',async()=>{
  await page.goto(file+'#supporters');await page.getByRole('button',{name:'New supporter'}).click();
  await page.keyboard.type('Corner Bakery');
  await page.getByRole('button',{name:'Add a gift'}).click();await wait(60);
  const kind=page.locator('select[id$="-t"]').last();assert.equal(await kind.inputValue(),'items');
  await kind.selectOption('money');await wait(80);
  await page.locator('main').getByText('Money is recorded here only when it is for an event').waitFor();
  await page.locator('input[id$="-a"]').last().fill('300');
  {const sel=page.locator('select[id$="-e"]').last();const v=await sel.locator('option',{hasText:'Spring Walk 2026'}).first().getAttribute('value');await sel.selectOption(v)}await wait(80);
  await page.locator('main').getByText("Also record this gift in NAMI's donor system").waitFor();
  await page.getByRole('button',{name:'Received'}).click();await wait(50);
  await page.goto(file+'#gifts');await wait(80);
  assert.match(await page.locator('.totals').innerText(),/\$300\s+money received for events/);
});
let backupPath;
await step('backup saves a file',async()=>{
  await page.goto(file+'#backup');
  const [dl]=await Promise.all([page.waitForEvent('download'),page.getByRole('button',{name:'Save a backup file'}).click()]);
  backupPath=await dl.path();const j=JSON.parse(fs.readFileSync(backupPath,'utf8'));assert.equal(j.app,'nami-volunteers-events');
});
await step('a fresh browser brings the backup back',async()=>{
  const p2=await ctx.browser().newContext().then(c=>c.newPage());
  await p2.goto(file+'#backup');await p2.locator('#restore').setInputFiles(backupPath);
  await p2.getByRole('button',{name:'Add them here'}).click();
  await p2.goto(file+'#people');await p2.locator('main').getByText('Dana Patel').waitFor();
  await p2.close();
});
await step('a file that is not a backup is refused in plain words',async()=>{
  const bad=new URL('./bad.json',import.meta.url);fs.writeFileSync(bad,'{"hello":1}');
  await page.goto(file+'#backup');await page.locator('#restore').setInputFiles(fileURLToPath(bad));
  await page.locator('main').getByText('That file is not a backup from this app').waitFor();fs.unlinkSync(bad);
});
await step('examples come in and go out in one tap each',async()=>{
  await page.goto(file+'#settings');await page.getByRole('button',{name:'Add example records'}).click();
  await page.goto(file+'#events');await page.locator('main').getByText('Community Resource Fair').waitFor();
  await page.goto(file+'#settings');await page.getByRole('button',{name:'Remove the example records'}).click();
  await page.goto(file+'#events');assert.equal(await page.locator('main').getByText('Community Resource Fair').count(),0);
  await page.locator('main').getByText('Spring Walk 2026').waitFor();
});
await step('home asks once, gently, about a past event with people not marked',async()=>{
  await page.goto(file+'#settings');await page.getByRole('button',{name:'Add example records'}).click();
  await page.goto(file+'#home');await page.locator('main').getByText('Mark who came to Family Support Picnic').waitFor();
  await page.locator('main').getByText('Next up').waitFor();
  if(shots)await page.screenshot({path:shots+'/home-desktop.png',fullPage:true});
});
await step('the value of a volunteer hour, once set, shows on the hours report and for the board',async()=>{
  await page.goto(file+'#settings');const hv=page.locator('#hour-value');await hv.fill('10');await hv.blur();await wait(700);
  await page.goto(file+'#hours');await wait(100);assert.match(await page.locator('.totals').innerText(),/\$85\s+worth, at \$10 an hour/);
  await page.goto(file+'#board');await wait(100);const t=await page.locator('main').innerText();
  assert.match(t,/8\.5 volunteer hours given by 3 volunteers, worth \$85 at \$10 an hour/);assert.match(t,/events held/);assert.match(t,/\$550 received for events, plus 1 gift of food, goods or time/);
  await page.goto(file+'#settings');await hv.fill('');await hv.blur();await wait(700);
});
await step('a sign-in sheet has the jobs, the names and blank lines for walk-ins',async()=>{
  await page.goto(file+'#events');await page.locator('main').getByText('Community Resource Fair').click();await wait(80);
  await page.getByRole('link',{name:'Print a sign-in sheet'}).click();await wait(80);
  const t=await page.locator('.sheet').innerText();for(const w of ['Community Resource Fair','Greeter','Setup','Sam Rivera','Jordan Lee','Walk-ins'])assert.ok(t.includes(w),w+' missing from the sheet');
  assert.ok(await page.locator('.sheet-t').count()>=3);
});
await step('Help and More have the way home to the landing page',async()=>{
  await page.goto(file+'#help');await wait(60);assert.ok((await page.locator('a[href*="github.io"]').count())>=1);
  await page.goto(file+'#more');await wait(60);assert.ok((await page.locator('a[href*="github.io"]').count())>=1);
});
await step('the short tour walks the five tabs with a row of dots and ends on Home',async()=>{
  await page.goto(file+'#settings');await page.getByRole('button',{name:'Take the short tour'}).click();
  await page.locator('main').getByText('A short tour').waitFor();
  assert.ok(page.url().endsWith('#home'));
  for(const tab of ['events','people','supporters','more']){await page.getByRole('button',{name:'Next'}).click();await wait(60);assert.ok(page.url().endsWith('#'+tab),'tour did not reach '+tab)}
  assert.equal(await page.locator('.dots i.on').count(),5);
  await page.getByRole('button',{name:'Done'}).click();await wait(60);
  assert.equal(await page.locator('main').getByText('A short tour').count(),0);assert.ok(page.url().endsWith('#home'));
});
await step('a tip has Got it and Later, and Later puts it away for today',async()=>{
  await page.goto(file+'#settings');await page.getByRole('button',{name:'Show the tips again'}).click();
  await page.goto(file+'#home');await page.locator('.tip').first().waitFor();
  await page.locator('.tip').first().getByRole('button',{name:'Later'}).click();await wait(60);
  assert.equal(await page.locator('.tip').count(),0);
  await page.reload();await wait(100);assert.equal(await page.locator('.tip').count(),0);
});
await step('the welcome can be shown again even with records, and closes',async()=>{
  await page.goto(file+'#settings');await page.getByRole('button',{name:'Show the welcome again'}).click();
  await page.locator('main').getByText('Keep your events and helpers in one place').waitFor();
  await page.locator('main').getByText('Next up').waitFor();
  await page.getByRole('button',{name:'Close'}).click();await wait(60);
  assert.equal(await page.locator('main').getByText('Keep your events and helpers in one place').count(),0);
});
await step('no shaming words anywhere on the main pages',async()=>{
  for(const h of ['home','events','people','supporters','more','hours','gifts','board','help']){await page.goto(file+'#'+h);await wait(40);const t=(await page.locator('main').innerText()).toLowerCase();for(const w of ['overdue','late','failed','missed','no-show','deadline','unknown'])assert.ok(!new RegExp('\\b'+w+'\\b').test(t),`"${w}" on ${h}`)}
});
await step('phone width has no sideways scroll',async()=>{
  await page.setViewportSize({width:390,height:844});
  for(const h of ['home','events','people','hours','gifts','settings']){await page.goto(file+'#'+h);await wait(40);const w=await page.evaluate(()=>document.documentElement.scrollWidth);assert.ok(w<=390,`${h} is ${w}px wide`)}
  const ev=await page.evaluate(()=>{const a=[...document.querySelectorAll('a.item')].find(x=>x.href.includes('#event.'));return a&&a.getAttribute('href')});
  await page.goto(file+'#events');await page.locator('main').getByText('Community Resource Fair').click();await wait(60);
  const w=await page.evaluate(()=>document.documentElement.scrollWidth);assert.ok(w<=390,'event page is '+w+'px wide');
  if(shots){await page.screenshot({path:shots+'/event-phone.png',fullPage:true});await page.emulateMedia({colorScheme:'dark'});await page.goto(file+'#home');await page.screenshot({path:shots+'/home-phone-dark.png',fullPage:true})}
});
assert.deepEqual(errors,[],'browser errors: '+errors.join(' | '));
console.log('\nall checks passed');
await browser.close();
