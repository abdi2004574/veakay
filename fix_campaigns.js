const fs = require('fs');  
const file = 'C:/Users/LENOVO/Desktop/veakay-handoff/backend-repo/src/modules/campaigns/campaigns.service.spec.ts';  
let content = fs.readFileSync(file, 'utf8');  
content = content.replace('service = new CampaignsService(\\n      prisma,\\n      mediaAssetsService,\\n      adminAuditLogService,\\n      verifiedBadgesService,\\n    );', 'const mockNotificationsService = { create: jest.fn().mockResolvedValue({}) };\\n    service = new CampaignsService(\\n      prisma,\\n      mediaAssetsService,\\n      adminAuditLogService,\\n      verifiedBadgesService,\\n      mockNotificationsService as any,\\n    );');  
fs.writeFileSync(file, content);  
console.log('Fixed campaigns.service.spec.ts'); 
