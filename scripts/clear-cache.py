import subprocess, os

cache_dir = "/vercel/share/v0-next-shadcn/.next/cache"

if os.path.exists(cache_dir):
    result = subprocess.run(["rm", "-rf", cache_dir], capture_output=True, text=True)
    print(f"Deleted cache dir: {cache_dir}")
    print(f"stdout: {result.stdout}")
    print(f"stderr: {result.stderr}")
    print(f"returncode: {result.returncode}")
else:
    print(f"Cache dir not found: {cache_dir}")

# Also check the file around the old line 1206
path = "/vercel/share/v0-next-shadcn/components/onboarding/onboarding-chat.tsx"
with open(path, "rb") as f:
    lines = f.readlines()

print(f"\nTotal lines: {len(lines)}")
print(f"\nLines 1203-1212 (raw bytes preview):")
for i, line in enumerate(lines[1202:1212], start=1203):
    preview = line[:80]
    has_bad = any(b > 127 and b not in [0xE2, 0x95, 0x91, 0x80, 0x82, 0x83, 0x84, 0x85, 0x86, 0x87, 0x88, 0x89, 0x8A, 0x8B, 0x8C, 0x8D, 0x8E, 0x8F, 0x90, 0x91, 0x92, 0x93, 0x94, 0x95, 0x96, 0x97, 0x98, 0x99, 0x9A, 0x9B, 0x9C, 0x9D, 0x9E, 0x9F, 0xA0] for b in preview)
    print(f"  {i}: {preview[:60]}  {'<-- HAS_UNUSUAL_BYTES' if has_bad else ''}")
