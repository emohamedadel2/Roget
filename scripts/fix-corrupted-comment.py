"""
Remove the corrupted box-drawing comment block from onboarding-chat.tsx.
Lines around 1204-1207 contain a corrupted Unicode character (U+FFFD replacement
character) that causes a TypeScript syntax error. We find the file via glob and fix it.
"""
import re
import glob
import os

# Find the file dynamically
matches = glob.glob("/vercel/**/*.tsx", recursive=True)
hits = [m for m in matches if m.endswith("onboarding-chat.tsx")]
print(f"[v0] Found files: {hits}")

if not hits:
    # Try from cwd
    hits = glob.glob("**/*onboarding-chat.tsx", recursive=True)
    print(f"[v0] Relative glob found: {hits}")

if not hits:
    print("[v0] ERROR: Could not find onboarding-chat.tsx")
    raise SystemExit(1)

path = hits[0]
print(f"[v0] Using path: {path}")

with open(path, "rb") as f:
    raw = f.read()

text = raw.decode("utf-8", errors="replace")

# Count occurrences before
count_before = text.count("\ufffd")
print(f"[v0] Replacement chars (U+FFFD) in file: {count_before}")

# Remove the entire corrupted comment block (=== lines + RENDER header)
cleaned = re.sub(
    r"[ \t]*//[ \t]*[\u2550\ufffd=\-]{3,}.*\n[ \t]*// RENDER\s*\n[ \t]*//[ \t]*[\u2550\ufffd=\-]{3,}.*\n\n?",
    "\n",
    text,
    count=1
)

count_after = cleaned.count("\ufffd")
print(f"[v0] Replacement chars after fix: {count_after}")

# Write back
with open(path, "w", encoding="utf-8") as f:
    f.write(cleaned)

print(f"[v0] File written: {path}")

# Verify context around return (
idx = cleaned.find("  return (")
if idx > 0:
    snippet = cleaned[max(0, idx-150):idx+20]
    print(f"[v0] Context before 'return (':\n{repr(snippet)}")
