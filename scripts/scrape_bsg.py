import requests
from bs4 import BeautifulSoup
import json

api_key = "88af05a014ec170a1ec296ac590ed41b"
BASE_URL = "https://aloparca.com/yedek-parca-markalari/bsg"
products = []

def get_with_scraperapi(url):
    scraperapi_url = f"http://api.scraperapi.com/?api_key={api_key}&render=true&url={url}"
    try:
        resp = requests.get(scraperapi_url, timeout=30)
        resp.raise_for_status()
        return resp
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return None

def parse_product(card):
    a_tag = card.select_one('a')
    link = a_tag['href'] if a_tag else ''
    img_tag = card.select_one('img')
    image = img_tag['src'] if img_tag else ''
    name = card.select_one('h3.text-sm.font-medium.text-gray-900').get_text(strip=True) if card.select_one('h3.text-sm.font-medium.text-gray-900') else ''
    price = card.select_one('span.text-lg.font-bold.text-orange-600').get_text(strip=True) if card.select_one('span.text-lg.font-bold.text-orange-600') else ''
    stock = card.select_one('span.text-sm.text-green-600').get_text(strip=True) if card.select_one('span.text-sm.text-green-600') else ''
    return {
        "name": name,
        "price": price,
        "image": image,
        "stock": stock,
        "link": link
    }

print("Scraping page 1...")
url = f"{BASE_URL}?page=1"
resp = get_with_scraperapi(url)
if not resp or not resp.text:
    print("Failed to fetch the page.")
else:
    print(resp.text[:2000])  # Print the first 2000 characters for debugging
    soup = BeautifulSoup(resp.text, "html.parser")
    cards = soup.select('div.bg-white.rounded-lg.shadow-md')
    print(f"Found {len(cards)} product cards on page 1")
    for card in cards[:2]:  # Only process the first 2 products
        product = parse_product(card)
        print("Scraped product:", product)
        products.append(product)

print(f"Final products count: {len(products)}")
if products:
    print("Sample product:", products[0])
else:
    print("No products scraped!")

with open("bsg_products.json", "w", encoding="utf-8") as f:
    json.dump(products, f, ensure_ascii=False, indent=2)

print(f"Scraped {len(products)} products and wrote to bsg_products.json.")
