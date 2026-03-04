import os
import subprocess

# Print CWD
print("CWD:", os.getcwd())

# Find the file
result = subprocess.run(
    ["find", "/", "-name", "onboarding-chat.tsx", "-not", "-path", "*/node_modules/*", "-not", "-path", "*/.next/*"],
    capture_output=True, text=True, timeout=15
)
print("Found files:")
print(result.stdout)
print("Errors:", result.stderr[:200] if result.stderr else "none")
