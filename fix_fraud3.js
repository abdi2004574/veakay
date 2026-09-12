const fs = require('fs');  
const file = 'C:/Users/LENOVO/Desktop/veakay-handoff/backend-repo/src/modules/fraud/fraud.service.spec.ts';  
let content = fs.readFileSync(file, 'utf8');  
content = content.replace(\" type: FraudFlagType.payment_method_mismatch,\\n description: Test,"\, \type:" FraudFlagType.payment_method_mismatch,\\n severity: FraudFlagSeverity.low,\\n description: Test,"\);  
content = content.replace(\type:" FraudFlagType.frequent_profile_changes,\\n description: Test,\\n metadata: JSON.stringify " key: 'value' ",\,type: FraudFlagType.frequent_profile_changes,\\n severity: FraudFlagSeverity.low,\\n description: Test,\\n metadata: JSON.stringify " key: 'value' ","\));  
fs.writeFileSync(file, content);  
console.log('Fixed fraud.service.spec.ts'); 
