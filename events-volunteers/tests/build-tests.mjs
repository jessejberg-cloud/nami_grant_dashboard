import {createRequire} from 'node:module';import path from 'node:path';import fs from 'node:fs';
const tools=process.env.TEST_TOOLS||'/workspace/scratch/423d5b95e6b1/test-tools/node_modules';const require=createRequire(path.join(tools,'package.json'));const {build}=require('esbuild');fs.mkdirSync('tests/generated',{recursive:true});
await build({entryPoints:['tests/entry.ts'],bundle:true,format:'esm',platform:'node',outfile:'tests/generated/domain.mjs'});
await build({entryPoints:['tests/ui-entry.tsx'],bundle:true,format:'esm',platform:'browser',outfile:'tests/generated/ui.mjs',define:{'process.env.NODE_ENV':'"test"'}});
