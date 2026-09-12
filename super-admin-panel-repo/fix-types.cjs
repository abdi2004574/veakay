/* eslint-disable no-undef */
const fs = require('fs');
const path = require('path');

const filesToFix = [
  'src/components/shared/AuditLogViewer.tsx',
  'src/components/ui/select.tsx',
];

filesToFix.forEach((file) => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    // Fix any remaining issues
    content = content.replace(/import \{ format \} from 'date-fns';\nimport \{ Eye \} from 'lucide-react';/g, "import { format } from 'date-fns';");
    fs.writeFileSync(filePath, content);
    console.log(`Fixed: ${file}`);
  }
});

console.log('Type fixes applied');
