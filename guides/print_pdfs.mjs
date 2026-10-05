// Prints the two suite guides in guides/dist/ to PDF in a headless Chromium. Run after guides/build.py.
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
const require=createRequire(import.meta.url);
let pw;try{pw=require('playwright')}catch{pw=require(process.env.PLAYWRIGHT_PATH||'/opt/node-tools/node_modules/playwright')}
const dist=new URL('./dist/',import.meta.url);
const browser=await pw.chromium.launch(process.env.PW_CHROMIUM?{executablePath:process.env.PW_CHROMIUM}:{});
const page=await browser.newPage();
for(const [src,n] of [['dist/NAMI_Dashboard_Suite_Quick_Start_Guides.html','NAMI_Dashboard_Suite_Quick_Start_Guides'],['dist/NAMI_Dashboard_Suite_User_Manuals.html','NAMI_Dashboard_Suite_User_Manuals'],['../docs/project-map.html','NAMI_Dashboard_Suite_Project_Map']]){
  await page.goto('file://'+fileURLToPath(new URL(src,import.meta.url)),{waitUntil:'load'});await page.emulateMedia({media:'print',colorScheme:'light'});
  const m=n.includes('Project_Map')?'0.45in':'0.7in',ml=n.includes('Project_Map')?'0.5in':'0.8in';await page.pdf({path:fileURLToPath(new URL(n+'.pdf',dist)),format:'Letter',margin:{top:m,bottom:m,left:ml,right:ml},printBackground:true});
  console.log('wrote guides/dist/'+n+'.pdf');
}
await browser.close();
