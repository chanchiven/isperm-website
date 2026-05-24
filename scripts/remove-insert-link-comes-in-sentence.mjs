import fs from 'fs';
import path from 'path';

const ROOT = path.resolve(import.meta.dirname, '..');
const MESSAGES = path.join(ROOT, 'messages');

// Standalone "comes in" sentence only — not "With [Insert Link], you can..." paragraphs.
const COMES_IN_AFTER_LINK =
  /(?: comes in|ins Spiel|om de hoek komt kijken|の出番です|xuất hiện|entra o \[Insert Link|приходит \[Insert Link|interviene \[Insert Link|giữa chỗ cho \[Insert Link)/;
const COMES_IN_SENTENCE =
  /<br\/><br\/>[^<]*\[Insert Link: isperm\.com \/ Your Product Page\][^<]*?<br\/><br\/>/g;

function removeComesInSentence(text) {
  return text.replace(COMES_IN_SENTENCE, (match) =>
    COMES_IN_AFTER_LINK.test(match) ? '<br/><br/>' : match
  );
}

function collectJsonFiles(dir, files = []) {
  for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'en') continue;
      collectJsonFiles(full, files);
    } else if (entry.name === 'faq.json' || (dir.endsWith('articles') && entry.name.endsWith('.json'))) {
      files.push(full);
    }
  }
  return files;
}

const enFaq = path.join(MESSAGES, 'en', 'faq.json');
const files = [enFaq, ...collectJsonFiles(MESSAGES)];

let total = 0;
for (const file of files) {
  const original = fs.readFileSync(file, 'utf8');
  const updated = removeComesInSentence(original);
  const count =
    (original.match(COMES_IN_SENTENCE) || []).filter((m) =>
      COMES_IN_AFTER_LINK.test(m)
    ).length;
  if (count > 0) {
    fs.writeFileSync(file, updated);
    console.log(`${path.relative(ROOT, file)}: removed ${count}`);
    total += count;
  }
}

console.log(`\nTotal removed: ${total}`);
