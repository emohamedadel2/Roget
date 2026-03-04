"""Find the actual location of onboarding-chat.tsx"""
import subprocess
result = subprocess.run(["find", "/", "-name", "onboarding-chat.tsx", "-not", "-path", "*/node_modules/*"], 
                      capture_output=True, text=True, timeout=15)
print(result.stdout)
print(result.stderr[:500] if result.stderr else "")
