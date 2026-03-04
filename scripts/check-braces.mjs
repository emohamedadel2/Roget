import { readFileSync } from 'fs'

const code = readFileSync('/vercel/share/v0-project/components/onboarding/onboarding-chat.tsx', 'utf-8')
const lines = code.split('\n')

let braces = 0, parens = 0, brackets = 0
for (let i = 0; i < lines.length; i++) {
  const line = lines[i]
  // Skip string contents and comments roughly
  const cleaned = line.replace(/\/\/.*$/, '').replace(/'[^']*'/g, '""').replace(/"[^"]*"/g, '""').replace(/`[^`]*`/g, '""')
  for (const ch of cleaned) {
    if (ch === '{') braces++
    if (ch === '}') braces--
    if (ch === '(') parens++
    if (ch === ')') parens--
    if (ch === '[') brackets++
    if (ch === ']') brackets--
  }
  // Report if any goes negative
  if (braces < 0 || parens < 0 || brackets < 0) {
    console.log(`[v0] NEGATIVE at line ${i+1}: braces=${braces} parens=${parens} brackets=${brackets}`)
  }
}

console.log(`[v0] Final: braces=${braces} parens=${parens} brackets=${brackets}`)

// Also check for lines where the line starts with arrow/comparison that could confuse SWC
for (let i = 0; i < lines.length; i++) {
  const trimmed = lines[i].trim()
  // Check for pattern: arrow function body followed by < comparison on same line
  if (/=>\s*{/.test(trimmed) && /<\s*[A-Z]/.test(trimmed) && !/<\//.test(trimmed) && !/useState|useRef|useCallback/.test(trimmed)) {
    console.log(`[v0] Suspicious arrow+< on line ${i+1}: ${trimmed.substring(0, 80)}`)
  }
}
