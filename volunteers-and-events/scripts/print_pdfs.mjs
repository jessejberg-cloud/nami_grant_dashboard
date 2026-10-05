// Prints dist/manual.html and dist/quickstart.html to PDF in a headless Chromium. Run after scripts/build_docs.py.
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
const require=createRequire(import.meta.url);
let pw;try{pw=require('playwright')}catch{pw=require(process.env.PLAYWRIGHT_PATH||'/opt/node-tools/node_modules/playwright')}
const dist=new URL('../dist/',import.meta.url);
const browser=await pw.chromium.launch(process.env.PW_CHROMIUM?{executablePath:process.env.PW_CHROMIUM}:{});
const page=await browser.newPage();
for(const [html,pdf] of [['manual.html','Volunteers_and_Events_User_Manual.pdf'],['quickstart.html','Volunteers_and_Events_Quick_Start.pdf']]){
  await page.goto('file://'+fileURLToPath(new URL(html,dist)),{waitUntil:'load'});
  await page.pdf({path:fileURLToPath(new URL(pdf,dist)),format:'Letter',margin:{top:'0.7in',bottom:'0.7in',left:'0.8in',right:'0.8in'},printBackground:false});
  console.log('wrote dist/'+pdf);
}
await browser.close();
