const fs = require('fs');  
const file = 'C:/Users/LENOVO/Desktop/veakay-handoff/backend-repo/src/modules/users/admin-users.service.spec.ts';  
let content = fs.readFileSync(file, 'utf8');  
content = content.replace('{ getFriendIds: jest.fn() }', '{ getFriendIds: jest.fn(), areFriends: jest.fn(), getConnectionStatus: jest.fn(), sendRequest: jest.fn(), acceptRequest: jest.fn(), declineRequest: jest.fn(), cancelRequest: jest.fn(), removeFriend: jest.fn(), getFriendIds: jest.fn(), getPendingRequests: jest.fn() }');  
fs.writeFileSync(file, content);  
console.log('Fixed admin-users.service.spec.ts'); 
