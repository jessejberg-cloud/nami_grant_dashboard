import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import * as core from '../dist/core.mjs';
const require=createRequire(import.meta.url);
const {JSDOM}=require(process.env.JSDOM_PATH||'../../audit-tools/node_modules/jsdom');
function boot(storage={}){
 const dom=new JSDOM(readFileSync(new URL('../dist/index.html',import.meta.url),'utf8'),{url:'https://radar.test/',runScripts:'outside-only'});
 const w=dom.window;Object.assign(w,core);for(const [k,v] of Object.entries(storage))w.localStorage.setItem(k,v);
 const errors=[];w.addEventListener('error',e=>errors.push(e.error));
 w.eval(readFileSync(new URL('../dist/app.js',import.meta.url),'utf8').replace(/^import[^\n]+\n/,''));
 const click=id=>{const n=w.document.getElementById(id);assert.ok(n,id);n.click()};
 const nav=tab=>w.document.querySelector(`[data-nav="${tab}"]`).click();
 return {dom,w,click,nav,errors};
}
test('onboarding first visit navigation skip reopen finish and returning visit',()=>{
 const t=boot();assert.ok(t.w.document.getElementById('onboard-next'));
 t.nav('Opportunities');assert.equal(t.errors.length,0);
 t.nav('Home');t.click('onboard-skip');assert.ok(t.w.localStorage.getItem(core.STORAGE.onboarding));
 t.nav('Help');t.click('reopen-onboarding');t.click('onboard-next');t.click('onboard-back');
 for(let i=0;i<7;i++)t.click('onboard-next');
 const storage={[core.STORAGE.onboarding]:t.w.localStorage.getItem(core.STORAGE.onboarding)};
 const returning=boot(storage);assert.equal(returning.w.document.getElementById('onboard-next'),null);
 assert.equal(t.errors.length,0);t.dom.window.close();returning.dom.window.close();
});
test('record create edit source refresh duplicate block archive and preference persistence',()=>{
 const t=boot({[core.STORAGE.onboarding]:'{"result":"completed"}'});
 const set=(name,v)=>{t.w.document.querySelector(`[name="${name}"]`).value=v};
 const submit=id=>t.w.document.getElementById(id).dispatchEvent(new t.w.Event('submit',{bubbles:true,cancelable:true}));
 t.click('add-top');set('title','Audit fictional lead');set('externalId','audit-only');set('officialUrl','https://example.org/audit');set('notes','Preserve staff note');submit('record-form');
 assert.match(t.w.document.body.textContent,/Audit fictional lead/);
 t.click('edit-item');set('owner','Reviewer');set('status','Shortlisted');submit('record-form');
 t.click('source-check');set('checkNote','Deadline checked for test');set('deadlineKind','confirmed');set('deadline','2027-06-01');submit('check-form');
 let rows=JSON.parse(t.w.localStorage.getItem(core.STORAGE.opportunities));let row=rows.find(r=>r.externalId==='audit-only');
 assert.equal(row.notes,'Preserve staff note');assert.equal(row.owner,'Reviewer');assert.equal(row.status,'Shortlisted');assert.ok(row.changeFlags.includes('deadline'));
 t.click('archive-item');rows=JSON.parse(t.w.localStorage.getItem(core.STORAGE.opportunities));assert.equal(rows.find(r=>r.externalId==='audit-only').status,'Archived');
 t.click('add-top');set('title','Audit fictional lead');set('externalId','new-id');set('officialUrl','https://example.org/audit');submit('record-form');assert.match(t.w.document.getElementById('form-error').textContent,/duplicate/);t.click('cancel-dialog');
 t.nav('Search profile');set('keywords','peer education');submit('profile-form');
 const prefs=t.w.localStorage.getItem(core.STORAGE.preferences);assert.equal(JSON.parse(prefs).keywords,'peer education');
 assert.match(t.w.document.body.textContent,/Manual research brief/);
 t.nav('Search health');assert.match(t.w.document.body.textContent,/FICTIONAL RUN/);assert.match(t.w.document.body.textContent,/Not running/);
 t.nav('Help');t.click('start-demo');t.w.document.dispatchEvent(new t.w.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));assert.equal(t.w.document.querySelector('.dialog'),null);
 assert.equal(t.errors.length,0);t.dom.window.close();
});
