def read_requirements(file_path):
    with open(file_path) as file:
        return file.readlines()

def merge_requirements(reqs1, reqs2):
    merged = {}
    for line in reqs1 + reqs2:
        if line.strip() and not line.startswith("#"):
            package, version = line.split('==') if '==' in line else (line, None)
            package = package.strip()
            version = version.strip() if version else version
            if package in merged:
                if merged[package] != version and version is not None:
                    print(f"Conflict for {package}: {merged[package]} vs {version}")
                    decision = input(f"Enter the chosen version for {package}: ")
                    merged[package] = decision.strip()
            else:
                merged[package] = version
    return merged

def write_requirements(merged, output_path):
    with open(output_path, 'w') as file:
        for package, version in merged.items():
            line = f"{package}=={version}\n" if version else f"{package}\n"
            file.write(line)

reqs1 = read_requirements("/Users/adityadubey/heycoach/asr_python/requirement.txt")
reqs2 = read_requirements("/Users/adityadubey/heycoach/asr_python/asr_whisper/requirement.txt")

merged_reqs = merge_requirements(reqs1, reqs2)
write_requirements(merged_reqs, "/Users/adityadubey/heycoach/asr_python/combined_requirements.txt")

print("Combined requirements.txt has been created/updated.")
