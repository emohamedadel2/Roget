import { readFileSync, writeFileSync } from 'fs'

const filePath = './components/onboarding/onboarding-chat.tsx'
let content = readFileSync(filePath, 'utf-8')

const oldCode = `<span className="text-xs font-bold text-white">{"R"}</span>`
const newCode = `<img src="/images/roget-icon.png" alt="Roget" className="h-5 w-5 rounded-full" />`

if (content.includes(oldCode)) {
  content = content.replace(oldCode, newCode)
  
  // Also fix the parent div to use the same style as chat-components.tsx
  content = content.replace(
    `className="flex h-8 w-8 items-center justify-center rounded-full"\n              style={{ background: BRAND_GRADIENT }}`,
    `className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20"`
  )
  
  writeFileSync(filePath, content)
  console.log('[v0] Successfully replaced R letter with Roget icon image')
} else {
  console.log('[v0] R letter span not found - may already be fixed')
  // Check if it's already using the icon
  if (content.includes('roget-icon.png')) {
    console.log('[v0] File already uses roget-icon.png')
  }
}
