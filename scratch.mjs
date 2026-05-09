import fs from 'fs';
import path from 'path';

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      if (!file.includes('node_modules') && !file.includes('.next') && !file.includes('.git')) {
        results = results.concat(walk(file));
      }
    } else {
      if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.jsx')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk(process.cwd());

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;
  
  // Replace pliny/something with pliny/something.js
  content = content.replace(/from ['"]pliny\/([^'"]+)['"]/g, (match, p1) => {
    if (p1.endsWith('.js') || p1.endsWith('.css')) return match;
    // if it's just 'pliny/search' or 'pliny/analytics' or 'pliny/newsletter', use index.js
    if (['search', 'analytics', 'newsletter'].includes(p1)) {
      return `from 'pliny/${p1}/index.js'`;
    }
    return `from 'pliny/${p1}.js'`;
  });

  // Also replace import 'pliny/something' for side effects? We have 'pliny/search/algolia.css', which is ignored above.

  if (content !== fs.readFileSync(file, 'utf8')) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated ' + file);
  }
});
