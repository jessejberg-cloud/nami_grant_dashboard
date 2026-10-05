// Gathers the landing site in docs/ (served by GitHub Pages from the main branch, folder /docs):
//   docs/index.html          the landing page (edited by hand; its PROGRAMS list is where a program is added)
//   docs/project-map.html    the one-page plan (edited by hand)
//   docs/radar/index.html    Grant Radar, the one-file app, copied from grant-radar/dist
//   docs/volunteers/index.html  Volunteers & Events, the one-file solo copy
//   docs/guides/*.pdf        every guide, copied from where each program builds it
// Run after any program's build: node scripts/build-site.mjs
import {copyFileSync,mkdirSync,readFileSync,writeFileSync} from 'node:fs';
import {dirname,join} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=join(dirname(fileURLToPath(import.meta.url)),'..');
const cp=(from,to)=>{mkdirSync(dirname(join(root,'docs',to)),{recursive:true});copyFileSync(join(root,from),join(root,'docs',to));console.log('docs/'+to)};
for(const f of ['index.html','manual.html','quickstart.html','Nami_Grant_Radar_Quick_Start.pdf','Nami_Grant_Radar_User_Manual.pdf','Nami_Grant_Radar_Quick_Start.docx','Nami_Grant_Radar_User_Manual.docx'])cp('grant-radar/dist/'+f,'radar/'+f); // Help links its guides by relative path
cp('volunteers-and-events/Volunteers-and-Events.html','volunteers/index.html');
// On the site every guide is named by its program, the same way, whatever the program's own build calls it.
cp('public/Nami_Grant_Quick_Start.pdf','guides/Grant_Dashboard_Quick_Start.pdf');cp('public/Nami_Grant_User_Manual.pdf','guides/Grant_Dashboard_User_Manual.pdf');
cp('grant-radar/dist/Nami_Grant_Radar_Quick_Start.pdf','guides/Grant_Radar_Quick_Start.pdf');cp('grant-radar/dist/Nami_Grant_Radar_User_Manual.pdf','guides/Grant_Radar_User_Manual.pdf');
for(const f of ['Volunteers_and_Events_Quick_Start.pdf','Volunteers_and_Events_User_Manual.pdf'])cp('volunteers-and-events/dist/'+f,'guides/'+f);
for(const f of ['NAMI_Dashboard_Suite_Quick_Start_Guides.pdf','NAMI_Dashboard_Suite_User_Manuals.pdf','NAMI_Dashboard_Suite_Project_Map.pdf'])cp('guides/dist/'+f,'guides/'+f);
// The landing page's "Updated" line is stamped here, not read from the server, which would say "today" every day.
const ix=join(root,'docs','index.html');const today=new Date().toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'});
writeFileSync(ix,readFileSync(ix,'utf8').replace(/(<span id="stamp">)[^<]*(<\/span>)/,`$1Updated ${today}.$2`));console.log('docs/index.html stamped',today);
