import json
import glob
import os
import re

combine_folder = "CombineJson"
output_file = "auto-parts-frontend/src/assets/data/vehicle_details.json"

# Load existing vehicle_details.json
with open(output_file, "r", encoding="utf-8") as f:
    vehicle_details = json.load(f)

# Helper to extract brand from title or filename
def extract_brand_from_title_or_filename(filename, title):
    # Try from filename first
    match = re.match(r"([A-Za-z\-]+)", filename)
    if match:
        return match.group(1).replace("-", " ").replace("_", " ").strip().lower()
    # Fallback: try from title
    return title.split()[0].lower()

BRAND_MAP = {
    "audi": "audi",
    "bmw": "bmw",
    "citroen": "citroen",
    "citroën": "citroen",
    "fiat": "fiat",
    "ford": "ford",
    "hyundai": "hyundai",
    "mercedes": "mercedes",
    "mercedes-benz": "mercedes",
    "mercedez-benz": "mercedes",
    "opel": "opel",
    "peugeot": "peugeot",
    "renault": "renault",
    "volkswagen": "volkswagen",
    "vw": "volkswagen",
    "toyota": "toyota",
    # Add more mappings as needed
}

def normalize_brand(brand):
    return BRAND_MAP.get(brand.lower(), brand.lower())

# Process all files in CombineJson
for file_path in glob.glob(os.path.join(combine_folder, "*.json")):
    with open(file_path, "r", encoding="utf-8") as f:
        data = json.load(f)
        filename = os.path.basename(file_path)
        # Brand model files (e.g., ToyotaModels.json)
        if "models" in data:
            brand = normalize_brand(extract_brand_from_title_or_filename(filename, data.get("title", "")))
            for model in data["models"]:
                entry = {
                    "brand": brand,
                    "model_name": model["name"],
                    "image_url": model["image"]
                }
                if entry not in vehicle_details:
                    vehicle_details.append(entry)
        # Detailed model files (e.g., Audi_A4.json)
        elif "titles" in data:
            for title_obj in data.get("titles", []):
                title = title_obj.get("title", "")
                brand = normalize_brand(extract_brand_from_title_or_filename(filename, title))
                # Try to extract model name from title (e.g., "AUDI A4 B9 Sedan..." -> "A4")
                model_name = ""
                title_parts = title.split()
                if len(title_parts) > 1:
                    model_name = title_parts[1].upper()
                model_variant = title.replace(brand.upper(), "").strip() if model_name else title
                # Collect all engine types
                engine_types = []
                for cat in title_obj.get("categories", []):
                    for engine in cat.get("engines", []):
                        engine_types.append(engine["name"])
                engine_types_str = " ; ".join(engine_types)
                entry = {
                    "brand": brand,
                    "model_name": model_name,
                    "model_variant": model_variant,
                    "Engine_types": engine_types_str,
                }
                if "image" in title_obj:
                    entry["image_url"] = title_obj["image"]
                if entry not in vehicle_details:
                    vehicle_details.append(entry)

# Save the updated vehicle_details.json
with open(output_file, "w", encoding="utf-8") as f:
    json.dump(vehicle_details, f, indent=2, ensure_ascii=False)

print("✅ All models and detailed variants from CombineJson have been added to vehicle_details.json")
