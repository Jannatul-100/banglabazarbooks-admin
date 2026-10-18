const fs = require('fs');
const path = require('path');

const directory = '/Users/softlabit/Documents/banglabook/admin/src/app/pages';
let results = [];

function walkDir(dir) {
    fs.readdirSync(dir).forEach(file => {
        let fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walkDir(fullPath);
        } else if (fullPath.endsWith('.ts')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            if (content.includes('pagination: null')) {
                let hasCurrent = content.includes('currentPage =') || content.includes('currentPage:');
                let match = content.match(/(\w+PerPage)\s*=/);
                
                if (hasCurrent && match) {
                    results.push({
                        file: fullPath,
                        perPageVar: match[1]
                    });
                }
            }
        }
    });
}

walkDir(directory);
console.log(JSON.stringify(results, null, 2));
