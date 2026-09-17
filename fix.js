const fs = require('fs');
const p = process.argv[1];
let c = fs.readFileSync(p, 'utf8');
const f = 
const s = 
if (c.includes(s)) { console.log('already'); } else { c = c.replace(f, f + '\n\n' + s); fs.writeFileSync(p, c); console.log('added'); }
const f = 'import { FraudModule } from ''./modules/fraud/fraud.module'';
const s = 'import { SettingsModule } from ''./modules/settings/settings.module'';
