from bs4 import BeautifulSoup
import json

html = """ 
     """
from bs4 import BeautifulSoup
import json

# Assuming html is the raw HTML content you have.
soup = BeautifulSoup(html, 'html.parser')

# Initialisation des données
data = {"titles": []}

# Recherche de tous les titres h2
main_titles = soup.find_all("h2")

for main_title in main_titles:
    title_text = main_title.text.strip()
    
    # Trouver la section des catégories juste après chaque h2
    parent_div = main_title.find_parent("div", class_="bg-white p-4 rounded-[3px] shadow mb-6 mt-3")
    category_list = []

    if parent_div:
        # Trouver toutes les catégories pour ce titre
        categories = parent_div.find_all("div", class_="col-span-full")
        
        for category in categories:
            category_title = category.find("h3").text.strip()
            engines = []

            # Recherche des moteurs dans chaque catégorie
            engine_divs = category.find_all("div", class_="bg-white p-2 rounded-lg text-center shadow hover:shadow-md transition duration-300")
            
            for engine_div in engine_divs:
                engine_name = engine_div.find("h3").text.strip()
                link_tag = engine_div.find_parent("a")
                engine_link = link_tag["href"] if link_tag else ""

                engines.append({"name": engine_name, "url": engine_link})

            # Ajout des informations de catégorie à la liste
            category_list.append({"category": category_title, "engines": engines})

    # Ajout de chaque titre h2 et de ses catégories à la structure JSON
    data["titles"].append({"title": title_text, "categories": category_list})

# Conversion en JSON et affichage
json_data = json.dumps(data, indent=4, ensure_ascii=False)
with open("output.json", "w", encoding="utf-8") as file:
    json.dump(data, file, indent=4, ensure_ascii=False)

print("Les données ont été enregistrées dans output.json")
