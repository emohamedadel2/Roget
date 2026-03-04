const fs = require('fs');
const path = require('path');
console.log('CWD:', process.cwd());
// List all dirs to find it
const { execSync } = require('child_process');
try { console.log(execSync('find / -name "onboarding-chat.tsx" -type f 2>/dev/null').toString()); } catch(e) { console.log('find failed'); }
const tryPaths = [
  path.join(process.cwd(), 'components', 'onboarding', 'onboarding-chat.tsx'),
  '/vercel/share/v0-project/components/onboarding/onboarding-chat.tsx',
  '/vercel/share/v0-next-shadcn/components/onboarding/onboarding-chat.tsx',
];
let src;
for (const p of tryPaths) {
  try { src = fs.readFileSync(p, 'utf8'); console.log('Found at:', p); break; } catch(e) { console.log('Not at:', p); }
}
if (!src) { console.log('FILE NOT FOUND'); process.exit(1); }
const lines = src.split('\n');

// Track brace/paren/bracket balance, ignoring strings and comments
let braces = 0, parens = 0, brackets = 0;
let inString = false, stringChar = '', inLineComment = false, inBlockComment = false, inTemplate = false;

for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
  const line = lines[lineIdx];
  inLineComment = false;
  
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    const next = line[i + 1];
    
    if (inBlockComment) {
      if (ch === '*' && next === '/') { inBlockComment = false; i++; }
      continue;
    }
    if (inLineComment) continue;
    if (inString) {
      if (ch === '\\') { i++; continue; }
      if (ch === stringChar) { inString = false; }
      continue;
    }
    if (inTemplate) {
      if (ch === '\\') { i++; continue; }
      if (ch === '`') { inTemplate = false; }
      continue;
    }
    
    if (ch === '/' && next === '/') { inLineComment = true; continue; }
    if (ch === '/' && next === '*') { inBlockComment = true; i++; continue; }
    if (ch === '"' || ch === "'") { inString = true; stringChar = ch; continue; }
    if (ch === '`') { inTemplate = true; continue; }
    
    if (ch === '{') braces++;
    if (ch === '}') { braces--; if (braces < 0) console.log(`UNMATCHED } at line ${lineIdx + 1}`); }
    if (ch === '(') parens++;
    if (ch === ')') { parens--; if (parens < 0) console.log(`UNMATCHED ) at line ${lineIdx + 1}`); }
    if (ch === '[') brackets++;
    if (ch === ']') { brackets--; if (brackets < 0) console.log(`UNMATCHED ] at line ${lineIdx + 1}`); }
  }
  
  // Print state at key lines
  if (lineIdx + 1 === 508 || lineIdx + 1 === 1202 || lineIdx + 1 === 1205 || lineIdx + 1 === 1550) {
    console.log(`Line ${lineIdx + 1}: braces=${braces} parens=${parens} brackets=${brackets}`);
  }
}

console.log(`\nFinal: braces=${braces} parens=${parens} brackets=${brackets}`);
console.log(`Total lines: ${lines.length}`);
