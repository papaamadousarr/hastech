from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup
import json
import time

options = Options()
options.add_argument('--headless')
options.add_argument('--disable-gpu')
driver = webdriver.Chrome(options=options)

url = "https://aloparca.com/yedek-parcalar/kategori"
driver.get(url)
time.sleep(5)  # Wait for JS to render

soup = BeautifulSoup(driver.page_source, "html.parser")
categories = []

# Find the grid container
grid = soup.select_one('div.grid')
if not grid:
    print("Grid not found!")
    driver.quit()
    exit()

for card in grid.find_all('div', recursive=False):
    h2 = card.select_one('h2')
    category_name = h2.text.strip() if h2 else ""
    img = card.select_one('img')
    category_image = img['src'] if img else ""
    subcategories = []
    # Get the first 3 subcategories (visible in card)
    for sub in card.select('ul li'):
        sub_name = sub.text.strip()
        sub_icon = sub.select_one('img')['src'] if sub.select_one('img') else ""
        sub_url = sub.select_one('a')['href'] if sub.select_one('a') else ""
        subcategories.append({
            "name": sub_name,
            "image": sub_icon,
            "url": sub_url
        })
    categories.append({
        "category": category_name,
        "image": category_image,
        "subcategories": subcategories
    })

driver.quit()

with open("auto-parts-frontend/src/assets/data/categories_en.json", "w", encoding="utf-8") as f:
    json.dump(categories, f, ensure_ascii=False, indent=2)