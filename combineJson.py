import json
import glob

def merge_json_files(input_folder, output_file):
    combined_data = []
    
    # Trouver tous les fichiers JSON dans le dossier spécifié
    json_files = glob.glob(f"{input_folder}/*.json")
    
    for file in json_files:
        with open(file, 'r', encoding='utf-8') as f:
            data = json.load(f)
            if isinstance(data, list):
                combined_data.extend(data)
            else:
                combined_data.append(data)
    
    # Écrire les données combinées dans un nouveau fichier JSON
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(combined_data, f, indent=4, ensure_ascii=False)

    print(f"Fichier combiné enregistré sous : {output_file}")

# Exemple d'utilisation
merge_json_files("AllProduct", "fichier_combine.json")
