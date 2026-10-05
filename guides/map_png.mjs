// Makes guides/dist/project-map.png: the one-page plan (docs/project-map.html) as it prints,
// so the handbook carries the same page in PDF and Word without a second copy of its words.
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
const require=createRequire(import.meta.url);
let pw;try{pw=require('playwright')}catch{pw=require(process.env.PLAYWRIGHT_PATH||'/opt/node-tools/node_modules/playwright')}
const browser=await pw.chromium.launch(process.env.PW_CHROMIUM?{executablePath:process.env.PW_CHROMIUM}:{});
const page=await browser.newPage({viewport:{width:720,height:900},deviceScaleFactor:2});
await page.emulateMedia({media:'print',colorScheme:'light'});
await page.goto('file://'+fileURLToPath(new URL('../docs/project-map.html',import.meta.url)),{waitUntil:'load'});
await page.screenshot({path:fileURLToPath(new URL('./dist/project-map.png',import.meta.url)),fullPage:true});
console.log('wrote guides/dist/project-map.png');
await browser.close();
