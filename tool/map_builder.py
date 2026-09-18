import json
import os

def build_level() :
    print("=== CodeQuest Map Builder ===")
    level_id = int(input("Level ID (e.g. 2): "))
    title = input("Level Title:")
    start_x = int(input("Player Start X: "))
    hole_start = int(input("Hole Start X: "))
    req_len = int(input("Required Plank Lenght: "))
    exit_x = int(input("Exit Portal X: "))
    concept = input("Concept (e.g., string , variables):")
    req_var = input("Required Variable Name (leave blank if none ):")
    objective = input("Objective description: ")

    level_data = {
        "level_id": level_id,
        "title" : title,
        "player_start": {"x": start_x, "y": 0 },
        "hole" : {
            "start_x" : hole_start,
            "required_lenght" : req_len
        },
        "exit_x": exit_x,
        "concept": concept,
        "required_variable": req_var if req_var else None,
        "objective" : objective
    }

    os.makedirs("core", exist_ok=True)
    file_path = f"core/level_{level_id}.json"
    with open(file_path, 'w') as f :
        json.dump(level_data, f, indent=4)
    print(f"\n Saved level to {file_path}!!!")


if __name__ == "___main___" :
    build_level()