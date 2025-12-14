import os

root_dir = r"c:\Users\dell\.gemini\antigravity\scratch\AI_Voice"
target = "boldss"

for dirpath, dirnames, filenames in os.walk(root_dir):
    if "node_modules" in dirpath or ".next" in dirpath or ".git" in dirpath:
        continue
    for filename in filenames:
        if filename.endswith((".tsx", ".ts", ".js", ".jsx")):
            filepath = os.path.join(dirpath, filename)
            try:
                with open(filepath, "r", encoding="utf-8") as f:
                    content = f.read()
                    if target in content:
                        print(f"FOUND in: {filepath}")
                        # print context
                        lines = content.splitlines()
                        for i, line in enumerate(lines):
                            if target in line:
                                print(f"Line {i+1}: {line.strip()}")
            except Exception as e:
                pass
print("Search complete.")
