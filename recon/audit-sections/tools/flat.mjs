import fs from 'fs';
const [i, o] = process.argv.slice(2); const D = JSON.parse(fs.readFileSync(i)); const R = {};
for (const w in D) { R[w] = { docH: 0, docW: 0 }; for (const st in D[w]) for (const s in D[w][st]) if (s !== 'scrollY') R[w][st + '/' + s] = D[w][st][s]; }
fs.writeFileSync(o, JSON.stringify(R));
