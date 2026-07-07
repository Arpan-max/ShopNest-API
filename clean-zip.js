const fs = require('fs');
const path = require('path');

// 1. Remove adm-zip from package.json
const pkgPath = path.join(__dirname, 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
if (pkg.dependencies && pkg.dependencies['adm-zip']) delete pkg.dependencies['adm-zip'];
if (pkg.devDependencies && pkg.devDependencies['adm-zip']) delete pkg.devDependencies['adm-zip'];
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');

// 2. Load adm-zip and zip everything
const AdmZip = require('adm-zip');
const zip = new AdmZip();

function addDirectory(dir, zipPath) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file === 'node_modules' || file === '.git' || file === 'public' && dir === __dirname) {
      continue;
    }
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      addDirectory(fullPath, zipPath ? `${zipPath}/${file}` : file);
    } else {
      zip.addLocalFile(fullPath, zipPath);
    }
  }
}

addDirectory(__dirname, '');
if (fs.existsSync(path.join(__dirname, 'public'))) {
  const publicFiles = fs.readdirSync(path.join(__dirname, 'public'));
  for (const file of publicFiles) {
    if (file !== 'shopnest-api.zip') {
      const fullPath = path.join(__dirname, 'public', file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        zip.addLocalFolder(fullPath, `public/${file}`);
      } else {
        zip.addLocalFile(fullPath, 'public');
      }
    }
  }
}

zip.writeZip(path.join(__dirname, 'public', 'shopnest-api.zip'));
console.log('Zip created successfully at public/shopnest-api.zip');
