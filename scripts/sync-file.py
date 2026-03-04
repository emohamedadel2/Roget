import shutil
import os
import glob

# Find the source (clean) file
src = "/vercel/share/v0-project/components/onboarding/onboarding-chat.tsx"

# Find all possible destination paths
candidates = [
    "/vercel/share/v0-next-shadcn/components/onboarding/onboarding-chat.tsx",
]

# Also search dynamically
for root, dirs, files in os.walk("/vercel/share"):
    for f in files:
        if f == "onboarding-chat.tsx":
            full = os.path.join(root, f)
            if full != src:
                candidates.append(full)
    # Don't recurse into node_modules or .next
    dirs[:] = [d for d in dirs if d not in ("node_modules", ".next", ".git")]

print(f"Source: {src}")
print(f"Source exists: {os.path.exists(src)}")

for dest in candidates:
    if os.path.exists(dest):
        print(f"Copying to: {dest}")
        shutil.copy2(src, dest)
        print(f"  Done.")
    else:
        print(f"Dest not found: {dest}")
