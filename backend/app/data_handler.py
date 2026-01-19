import json
import os
from typing import List, Dict, Any

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")

FILES = {
    "books": os.path.join(DATA_DIR, "books.json"),
    "members": os.path.join(DATA_DIR, "members.json"),
    "transactions": os.path.join(DATA_DIR, "transactions.json"),
}

def _ensure_data_dir():
    if not os.path.exists(DATA_DIR):
        os.makedirs(DATA_DIR)
    for key, path in FILES.items():
        if not os.path.exists(path):
            with open(path, "w") as f:
                json.dump([], f)

_ensure_data_dir()

def read_data(file_key: str) -> List[Dict[str, Any]]:
    path = FILES.get(file_key)
    if not path or not os.path.exists(path):
        return []
    try:
        with open(path, "r") as f:
            return json.load(f)
    except json.JSONDecodeError:
        return []

def write_data(file_key: str, data: List[Dict[str, Any]]):
    path = FILES.get(file_key)
    if path:
        with open(path, "w") as f:
            json.dump(data, f, indent=4)
