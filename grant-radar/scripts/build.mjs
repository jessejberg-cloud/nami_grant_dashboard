// Builds Grant Radar from src/ into:
//   dist/index.html          the whole app in ONE file: host it, or double-click it
//   dist/manual.html         the manual as a printable page
//   dist/quickstart.html     the one-page quick start
//   artifact/grant-radar.html  the same app, as page content for a Claude link
//   USER_MANUAL.md, QUICKSTART.md  the guides for GitHub readers
// Run: node scripts/build.mjs        (no dependencies)
// Then, for PDF and Word copies: node scripts/build-docs.mjs
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {dirname,join} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';

const root=join(dirname(fileURLToPath(import.meta.url)),'..');
const src=f=>readFileSync(join(root,'src',f),'utf8');
const out=(f,s)=>{mkdirSync(dirname(join(root,f)),{recursive:true});writeFileSync(join(root,f),s);console.log('wrote',f,`${(s.length/1024).toFixed(1)} KB`)};

// ES modules become plain declarations inside one closure, so the single file
// runs from a double-click (file://), where browsers refuse module imports.
const strip=s=>s.replace(/^import[^\n]*\n/gm,'').replace(/^export\s+(?=(const|function|let|async)\b)/gm,'');
const bundle=`(function(){'use strict';\n${strip(src('core.mjs'))}\n${strip(src('guides.mjs'))}\n${strip(src('app.js'))}\n})();`.replace(/<\/script/gi,'<\\/script');
const css=src('style.css');
const favicon=`data:image/svg+xml,${encodeURIComponent(src('favicon.svg').trim())}`;
const logo=src('favicon.svg').trim().replace('<svg ','<svg aria-hidden="true" ');
const FONTS='<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400&family=Young+Serif&display=swap">';

const headPart=`<title>Grant Radar</title>
${FONTS}
<style>${css}</style>`;
const body=`<div class="gr-root">
<a class="skip-link" href="#main">Skip to main content</a>
<div class="shell">
  <aside class="rail" aria-label="Main">
    <div class="brand">${logo}<span>Grant Radar</span></div>
    <nav class="nav" id="nav" aria-label="Pages"></nav>
    <div class="rail-foot">NAMI Southeast Wisconsin<br>Saves as you go</div>
  </aside>
  <main id="main" tabindex="-1"><div id="content"><p style="padding:2rem">Loading Grant Radar…</p></div></main>
</div>
<div id="dialog-root"></div>
<div id="toast" class="toast" role="status" aria-live="polite"></div>
</div>
<noscript><p style="padding:2rem">Grant Radar needs JavaScript turned on in your browser.</p></noscript>
<script>${bundle}</script>`;

const page=(title,inner,extraHead='')=>`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="description" content="Grant Radar: a calm list of grant leads for NAMI Southeast Wisconsin.">
<link rel="icon" href="${favicon}">
${extraHead}
</head>
<body>
${inner}
</body>
</html>
`;

out('dist/index.html',page('Grant Radar',body,headPart));
out('artifact/grant-radar.html',headPart+'\n'+body+'\n');

// ---- guides -------------------------------------------------------------
const guides=await import(pathToFileURL(join(root,'src','guides.mjs')).href);
const core=await import(pathToFileURL(join(root,'src','core.mjs')).href);
const {QUICK_START,MANUAL,GLOSSARY}=guides;
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const docCss=`:root{--bg:#fafbf7;--ink:#232e29;--muted:#5b6862;--accent:#2e6a60;--soft:#dcebe5;--line:#d3dacf}
@media (prefers-color-scheme: dark){:root:not([data-theme="light"]){--bg:#1d2420;--ink:#e2e8e3;--muted:#9ba8a1;--accent:#86bcaf;--soft:#273a33;--line:#313b36;color-scheme:dark}}
:root[data-theme="dark"]{--bg:#1d2420;--ink:#e2e8e3;--muted:#9ba8a1;--accent:#86bcaf;--soft:#273a33;--line:#313b36;color-scheme:dark}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:17px/1.6 "Atkinson Hyperlegible","Segoe UI",system-ui,sans-serif}
main{max-width:46rem;margin:0 auto;padding-block:2.5rem 4rem;padding-inline:16px}
h1{font:400 2.1rem/1.15 "Young Serif",Georgia,serif;margin:0 0 .4rem;text-wrap:balance}h2{font-size:1.2rem;margin:2rem 0 .4rem;text-wrap:balance}
.lede{color:var(--muted);margin-top:0}a{color:var(--accent)}li{margin:.3rem 0}
ol.qs{list-style:none;padding:0;counter-reset:q;display:grid;gap:.7rem}ol.qs li{counter-increment:q;display:grid;grid-template-columns:2rem 1fr;gap:.6rem}
ol.qs li::before{content:counter(q);width:2rem;height:2rem;border-radius:50%;background:var(--soft);color:var(--accent);display:grid;place-items:center;font-weight:700}
nav.toc{columns:2 14rem;background:var(--soft);border-radius:12px;padding:1rem 1.2rem}nav.toc a{display:block;padding:.15rem 0;text-decoration:none}
dl{display:grid;grid-template-columns:minmax(8rem,12rem) 1fr;gap:.4rem 1rem}dt{font-weight:700}dd{margin:0}
.meta{color:var(--muted);font-size:.85rem;border-top:1px solid var(--line);margin-top:2.5rem;padding-top:.8rem}
@media print{body{font-size:11pt;background:#fff;color:#000}main{padding:0;max-width:none}nav.toc{background:none;border:1px solid #ccc}h2{break-after:avoid}a{color:#000}}`;
const docPage=(title,inner)=>page(title,`<main>${inner}<p class="meta">Grant Radar ${core.VERSION} · ${core.REVISION_DATE}. Use public information only.</p></main>`,`<title>${esc(title)}</title>${FONTS}<style>${docCss}</style>`);

const qsHtml=`<h1>${esc(QUICK_START.title)}</h1><p class="lede">${esc(QUICK_START.intro)}</p><ol class="qs">${QUICK_START.steps.map(([t,d])=>`<li><span><strong>${esc(t)}.</strong> ${esc(d)}</span></li>`).join('')}</ol><p><em>${esc(QUICK_START.safety)}</em></p>`;
out('dist/quickstart.html',docPage('Grant Radar quick start',qsHtml));

const manHtml=`<h1>Grant Radar manual</h1><p class="lede">Everything Grant Radar does, in plain words. Short on time? Read the <a href="quickstart.html">quick start</a>.</p>
<nav class="toc" aria-label="Contents">${MANUAL.map(m=>`<a href="#${m.id}">${esc(m.title)}</a>`).join('')}<a href="#words">Words</a></nav>
${MANUAL.map(m=>`<section id="${m.id}"><h2>${esc(m.title)}</h2>${m.html.trim()}</section>`).join('\n')}
<section id="words"><h2>Words</h2><dl>${GLOSSARY.map(([w,d])=>`<dt>${esc(w)}</dt><dd>${esc(d)}</dd>`).join('')}</dl></section>`;
out('dist/manual.html',docPage('Grant Radar manual',manHtml));

// ---- Markdown, from the same words --------------------------------------
const md=h=>h.replace(/<p>/g,'').replace(/<\/p>/g,'\n\n').replace(/<strong>(.*?)<\/strong>/g,'**$1**').replace(/<em>(.*?)<\/em>/g,'*$1*')
  .replace(/<ol>([\s\S]*?)<\/ol>/g,(_,l)=>{let n=0;return l.replace(/<li>([\s\S]*?)<\/li>/g,(__,x)=>`${++n}. ${x}\n`)+'\n'})
  .replace(/<ul>([\s\S]*?)<\/ul>/g,(_,l)=>l.replace(/<li>([\s\S]*?)<\/li>/g,'- $1\n')+'\n').replace(/<[^>]+>/g,'').replace(/\n{3,}/g,'\n\n').trim();
out('QUICKSTART.md',`# ${QUICK_START.title}\n\n_Grant Radar ${core.VERSION}, ${core.REVISION_DATE}_\n\n${QUICK_START.intro}\n\n${QUICK_START.steps.map(([t,d],i)=>`${i+1}. **${t}.** ${d}`).join('\n')}\n\n*${QUICK_START.safety}*\n`);
out('USER_MANUAL.md',`# Grant Radar manual\n\n_Grant Radar ${core.VERSION}, ${core.REVISION_DATE}. The same words are in the app under Help._\n\n${MANUAL.map(m=>`## ${m.title}\n\n${md(m.html)}`).join('\n\n')}\n\n## Words\n\n${GLOSSARY.map(([w,d])=>`- **${w}**: ${d}`).join('\n')}\n`);
