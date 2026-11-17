import fs from 'node:fs';
const f = process.argv[2];
let h = fs.readFileSync(f, 'utf8');
h = h.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '').replace(/<svg[\s\S]*?<\/svg>/gi,'');
h = h.replace(/<img[^>]*?(?:data-src|src)="([^"]*)"[^>]*?>/gi, '\n[IMG $1]\n');
h = h.replace(/<\/(p|div|h[1-6]|li|section|tr|a)>/gi, '\n').replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, '');
h = h.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&#39;|&rsquo;/g, "'").replace(/&quot;/g, '"');
console.log(h.split('\n').map(s => s.trim()).filter(Boolean).join('\n'));
