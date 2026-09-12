const fs = require('fs');  
const fraudFile = 'C:/Users/LENOVO/Desktop/veakay-handoff/backend-repo/src/modules/fraud/fraud.service.spec.ts';  
let fraudContent = fs.readFileSync(fraudFile, 'utf8');  
fraudContent = fraudContent.replace('type: FraudFlagType.payment_method_mismatch,\n        description: " "Test,', 'type: FraudFlagType.payment_method_mismatch,\n        severity: FraudFlagSeverity.low,\n        description: Test,');  
fraudContent = fraudContent.replace('type: FraudFlagType.frequent_profile_changes,\n        description: Test,\n        metadata: JSON.stringify({ key: value }),', 'type: FraudFlagType.frequent_profile_changes,\n        severity: FraudFlagSeverity.low,\n        description: Test,\n        metadata: JSON.stringify({ key: value }),');  
fs.writeFileSync(fraudFile, fraudContent);  
console.log('Fixed fraud.service.spec.ts'); 
