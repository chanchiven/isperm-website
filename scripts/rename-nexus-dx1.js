const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SKIP_DIRS = new Set(['node_modules', '.next', 'out', '.git', 'public_backup_']);
const TEXT_EXT = new Set([
  '.json', '.tsx', '.ts', '.js', '.jsx', '.md', '.txt', '.html', '.xml', '.css', '.py'
]);

const FROM = 'Nexus Dx1';
const TO = 'Nexus DX1';

let filesChanged = 0;
let replacements = 0;

function shouldSkipDir(name) {
  return SKIP_DIRS.has(name) || name.startsWith('public_backup');
}

function walk(dir, callback) {
  for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
    if (entry.isDirectory()) {
      if (shouldSkipDir(entry.name)) continue;
      walk(path.join(dir, entry.name), callback);
      continue;
    }
    const ext = path.extname(entry.name).toLowerCase();
    if (!TEXT_EXT.has(ext)) continue;
    callback(path.join(dir, entry.name));
  }
}

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  if (!content.includes(FROM)) return;

  const next = content.split(FROM).join(TO);
  if (next === content) return;

  const count = (content.match(new RegExp(FROM.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
  fs.writeFileSync(filePath, next, 'utf8');
  filesChanged += 1;
  replacements += count;
  console.log(`${path.relative(ROOT, filePath)} (${count})`);
}

walk(ROOT, replaceInFile);
console.log(`\nDone: ${filesChanged} files, ${replacements} replacements.`);
