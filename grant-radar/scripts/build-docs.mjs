// Makes the PDF and Word copies of the quick start and manual from the same
// words the app shows (src/guides.mjs). Run after scripts/build.mjs.
// Needs Playwright + Chromium (PDF) and the `docx` package (Word). Set
// PLAYWRIGHT_PATH / CHROMIUM_PATH / DOCX_PATH if they are installed elsewhere.
import {writeFileSync,existsSync} from 'node:fs';
import {dirname,join} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {createRequire} from 'node:module';

const root=join(dirname(fileURLToPath(import.meta.url)),'..');
const dist=f=>join(root,'dist',f);
const {QUICK_START,MANUAL,GLOSSARY}=await import(pathToFileURL(join(root,'src','guides.mjs')).href);
const {VERSION,REVISION_DATE}=await import(pathToFileURL(join(root,'src','core.mjs')).href);

// ---- PDF ------------------------------------------------------------------
let chromium=null;
for(const p of [process.env.PLAYWRIGHT_PATH,'playwright','/opt/node22/lib/node_modules/playwright/index.mjs'].filter(Boolean)){try{({chromium}=await import(p.startsWith('/')?pathToFileURL(p).href:p));break}catch{}}
if(chromium){
  const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||(existsSync('/opt/pw-browsers/chromium')?'/opt/pw-browsers/chromium':undefined)});
  const page=await browser.newPage();
  await page.route(/fonts\.(googleapis|gstatic)\.com/,r=>r.abort());
  for(const [html,pdf] of [['quickstart.html','Nami_Grant_Radar_Quick_Start.pdf'],['manual.html','Nami_Grant_Radar_User_Manual.pdf']]){
    await page.goto(pathToFileURL(dist(html)).href);await page.emulateMedia({media:'print',colorScheme:'light'});
    await page.pdf({path:dist(pdf),format:'Letter',margin:{top:'0.7in',bottom:'0.7in',left:'0.8in',right:'0.8in'},printBackground:true});
    console.log('wrote dist/'+pdf);
  }
  await browser.close();
}else console.log('skipped PDF: Playwright not found');

// ---- Word -----------------------------------------------------------------
let docx=null;
const req=createRequire(import.meta.url);
for(const p of [process.env.DOCX_PATH,'docx','/opt/node22/lib/node_modules/docx'].filter(Boolean)){try{docx=req(p);break}catch{}}
if(docx){
  const {Document,Packer,Paragraph,TextRun,HeadingLevel,LevelFormat,AlignmentType}=docx;
  // Tiny reader for the small HTML subset guides.mjs uses.
  const runs=s=>{const out=[];const re=/<(strong|em)>(.*?)<\/\1>|([^<]+)/g;let m;while((m=re.exec(s))){if(m[3])out.push(new TextRun(m[3].replace(/&amp;/g,'&')));else out.push(new TextRun({text:m[2],bold:m[1]==='strong',italics:m[1]==='em'}))}return out};
  const blocks=html=>{const out=[];const re=/<p>([\s\S]*?)<\/p>|<(ul|ol)>([\s\S]*?)<\/\2>/g;let m;
    while((m=re.exec(html))){if(m[1]!=null)out.push(new Paragraph({children:runs(m[1].trim()),spacing:{after:120}}));
      else for(const li of m[3].matchAll(/<li>([\s\S]*?)<\/li>/g))out.push(new Paragraph({children:runs(li[1].trim()),numbering:{reference:m[2]==='ol'?'num':'bul',level:0},spacing:{after:60}}))}
    return out};
  const numbering={config:[{reference:'bul',levels:[{level:0,format:LevelFormat.BULLET,text:'•',alignment:AlignmentType.LEFT,style:{paragraph:{indent:{left:540,hanging:270}}}}]},{reference:'num',levels:[{level:0,format:LevelFormat.DECIMAL,text:'%1.',alignment:AlignmentType.LEFT,style:{paragraph:{indent:{left:540,hanging:300}}}}]}]};
  const styles={default:{document:{run:{font:'Calibri',size:23}}},paragraphStyles:[{id:'Title',name:'Title',basedOn:'Normal',run:{font:'Georgia',size:44,color:'2E6A60'}},{id:'Heading2',name:'Heading 2',basedOn:'Normal',next:'Normal',quickFormat:true,run:{size:28,bold:true,color:'232E29'},paragraph:{spacing:{before:280,after:100},keepNext:true}}]};
  const meta=new Paragraph({children:[new TextRun({text:`Grant Radar ${VERSION} · ${REVISION_DATE}. Use public information only.`,italics:true,color:'5B6862',size:18})],spacing:{before:300}});
  const save=async(name,children)=>{const doc=new Document({creator:'Grant Radar',title:name,styles,numbering,sections:[{properties:{page:{margin:{top:1000,bottom:1000,left:1150,right:1150}}},children}]});writeFileSync(dist(name),await Packer.toBuffer(doc));console.log('wrote dist/'+name)};
  await save('Nami_Grant_Radar_Quick_Start.docx',[
    new Paragraph({text:QUICK_START.title,heading:HeadingLevel.TITLE}),
    new Paragraph({text:QUICK_START.intro,spacing:{after:200}}),
    ...QUICK_START.steps.map(([t,d])=>new Paragraph({children:[new TextRun({text:t+'. ',bold:true}),new TextRun(d)],numbering:{reference:'num',level:0},spacing:{after:100}})),
    new Paragraph({children:[new TextRun({text:QUICK_START.safety,italics:true})],spacing:{before:200}}),meta]);
  await save('Nami_Grant_Radar_User_Manual.docx',[
    new Paragraph({text:'Grant Radar manual',heading:HeadingLevel.TITLE}),
    new Paragraph({text:'Everything Grant Radar does, in plain words. The same words are in the app under Help.',spacing:{after:200}}),
    ...MANUAL.flatMap(m=>[new Paragraph({text:m.title,heading:HeadingLevel.HEADING_2}),...blocks(m.html)]),
    new Paragraph({text:'Words',heading:HeadingLevel.HEADING_2}),
    ...GLOSSARY.map(([w,d])=>new Paragraph({children:[new TextRun({text:w+': ',bold:true}),new TextRun(d)],spacing:{after:80}})),meta]);
}else console.log('skipped Word: the docx package was not found');
