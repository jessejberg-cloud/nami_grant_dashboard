// Gathers the landing site in docs/ (served by GitHub Pages from the main branch, folder /docs):
//   docs/index.html          the landing page (edited by hand; its PROGRAMS list is where a program is added)
//   docs/project-map.html    the one-page plan (edited by hand)
//   docs/radar/index.html    Grant Radar, the one-file app, copied from grant-radar/dist
//   docs/volunteers/index.html  Volunteers & Events, the one-file solo copy
//   docs/guides/*.pdf        every guide, copied from where each program builds it
// Run after any program's build: node scripts/build-site.mjs
import {copyFileSync,mkdirSync} from 'node:fs';
import {dirname,join} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=join(dirname(fileURLToPath(import.meta.url)),'..');
const cp=(from,to)=>{mkdirSync(dirname(join(root,'docs',to)),{recursive:true});copyFileSync(join(root,from),join(root,'docs',to));console.log('docs/'+to)};
cp('grant-radar/dist/index.html','radar/index.html');
cp('volunteers-and-events/Volunteers-and-Events.html','volunteers/index.html');
for(const f of ['Nami_Grant_Quick_Start.pdf','Nami_Grant_User_Manual.pdf'])cp('public/'+f,'guides/'+f);
for(const f of ['Nami_Grant_Radar_Quick_Start.pdf','Nami_Grant_Radar_User_Manual.pdf'])cp('grant-radar/dist/'+f,'guides/'+f);
for(const f of ['Volunteers_and_Events_Quick_Start.pdf','Volunteers_and_Events_User_Manual.pdf'])cp('volunteers-and-events/dist/'+f,'guides/'+f);
for(const f of ['NAMI_Dashboard_Suite_Quick_Start_Guides.pdf','NAMI_Dashboard_Suite_User_Manuals.pdf','NAMI_Dashboard_Suite_Project_Map.pdf'])cp('guides/dist/'+f,'guides/'+f);
