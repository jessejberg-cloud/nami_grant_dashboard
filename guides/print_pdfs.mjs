// Prints the two suite guides in guides/dist/ to PDF in a headless Chromium. Run after guides/build.py.
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
const require=createRequire(import.meta.url);
let pw;try{pw=require('playwright')}catch{pw=require(process.env.PLAYWRIGHT_PATH||'/opt/node-tools/node_modules/playwright')}
const dist=new URL('./dist/',import.meta.url);
const browser=await pw.chromium.launch(process.env.PW_CHROMIUM?{executablePath:process.env.PW_CHROMIUM}:{});
const page=await browser.newPage();
for(const n of ['NAMI_Dashboard_Suite_Quick_Start_Guides','NAMI_Dashboard_Suite_User_Manuals']){
  await page.goto('file://'+fileURLToPath(new URL(n+'.html',dist)),{waitUntil:'load'});
  await page.pdf({path:fileURLToPath(new URL(n+'.pdf',dist)),format:'Letter',margin:{top:'0.7in',bottom:'0.7in',left:'0.8in',right:'0.8in'},printBackground:true});
  console.log('wrote guides/dist/'+n+'.pdf');
}
await browser.close();
