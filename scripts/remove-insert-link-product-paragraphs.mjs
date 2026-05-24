import fs from 'fs';
import path from 'path';

const ROOT = path.resolve(import.meta.dirname, '..');
const MESSAGES = path.join(ROOT, 'messages');

// Biomarker + crisis chapters: remove full <br/><br/>…Insert Link…<br/><br/> blocks.
const INSERT_LINK_PARAGRAPH =
  /<br\/><br\/>[^<]*\[Insert Link: isperm\.com \/ Your Product Page\][^<]*<br\/><br\/>/g;

function removeParagraphs(text) {
  return text.replace(INSERT_LINK_PARAGRAPH, '<br/><br/>');
}

function collectJsonFiles(dir, files = []) {
  for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectJsonFiles(full, files);
    } else if (
      entry.name === 'faq.json' ||
      (dir.endsWith('articles') && entry.name.endsWith('.json'))
    ) {
      files.push(full);
    }
  }
  return files;
}

const files = collectJsonFiles(MESSAGES);
let total = 0;

for (const file of files) {
  const original = fs.readFileSync(file, 'utf8');
  const matches = original.match(INSERT_LINK_PARAGRAPH);
  if (!matches?.length) continue;
  const updated = removeParagraphs(original);
  fs.writeFileSync(file, updated);
  console.log(`${path.relative(ROOT, file)}: removed ${matches.length}`);
  total += matches.length;
}

console.log(`\nTotal removed: ${total}`);
