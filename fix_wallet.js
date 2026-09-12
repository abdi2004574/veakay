const fs = require('fs');  
const file = 'C:/Users/LENOVO/Desktop/veakay-handoff/backend-repo/src/modules/wallet/wallet.service.spec.ts';  
let content = fs.readFileSync(file, 'utf8');  
content = content.replace('const logged = JSON.parse(logSpy.mock.calls[0][0]);', 'const logged = JSON.parse(logSpy.mock.calls[0][0] as string);');  
fs.writeFileSync(file, content);  
console.log('Fixed wallet.service.spec.ts'); 
