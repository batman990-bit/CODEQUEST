import json
import glob
import os

def validate_levels():
    level_files = glob.glob("core/level_*.json")
    if not level_files:
        print("no level files found in core/")
        return
    required_keys = ["level_id" , "title" , "player_start" , "hole", "exit_x" , "concept" , "objective"]

    for file_path in level_files:
        try:
            with open(file_path, "r") as f :
                data = json.load(f)

            misssing = [key for key in required_keys if key not in data]
            if misssing:
                print(f"{file_path}: Missing Keys {misssing}")
                continue
            if "start_x" not in data["hole"] or "required_length" not in data["hole"]:
                print(f"{file_path}: 'hole' object missing 'start_x' or 'required_lenght'")
                continue
            print(f"{file_path}: Valid!")

        except Exception as e:
            print(f"{file_path}: JSON Error -> {e}")

if __name__ == "__main__":
    validate_levels()
