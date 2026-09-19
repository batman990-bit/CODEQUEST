import json
import glob
import os

def validate_levels():
    level_files = glob.glob("core/levels/level_*.json")
    if not level_files:
        print("no level files found in core/")
        return
    required_keys = ["level_id", "title", "player_start", "exit_x", "concept", "objective"]

    for file_path in level_files:
        try:
            with open(file_path, "r") as f :
                data = json.load(f)

            misssing = [key for key in required_keys if key not in data]
            if misssing:
                print(f"{file_path}: Missing Keys {misssing}")
                continue
            if "hole" in data:
                if "start_x" not in data["hole"] or "required_length" not in data["hole"]:
                    print(f"{file_path}: 'hole' missing required keys")
                    continue
            elif "obstacle" in data:
                if "x" not in data["obstacle"] or "required_length" not in data["obstacle"]:
                    print(f"{file_path}: 'obstacle' missing required keys")
                    continue
            else:
                print(f"{file_path}: missing both 'hole' and 'obstacle'")
                continue


            print(f"{file_path}: Valid!")

        except Exception as e:
            print(f"{file_path}: JSON Error -> {e}")

if __name__ == "__main__":
    validate_levels()
