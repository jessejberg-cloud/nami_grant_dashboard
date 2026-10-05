// Makes the double-click copy of the app from src/app.html.
// src/app.html is the page as published to the shared link (the host adds <html>, <head> and <body>);
// Volunteers-and-Events.html is the same page as a complete file that opens in any browser.
import {readFileSync,writeFileSync} from 'node:fs';
const page=readFileSync(new URL('./src/app.html',import.meta.url),'utf8');
const doc='<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"></head><body>\n'+page+'\n</body></html>\n';
writeFileSync(new URL('./Volunteers-and-Events.html',import.meta.url),doc);
console.log('Wrote Volunteers-and-Events.html');
