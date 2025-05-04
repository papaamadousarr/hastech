from bs4 import BeautifulSoup
from googletrans import Translator
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.action_chains import ActionChains
import json
import time

def setup_driver():
    options = webdriver.ChromeOptions()
    options.add_argument('--disable-dev-shm-usage')
    options.page_load_strategy = 'eager'  # Change page load strategy
    options.add_argument('--no-sandbox')
    options.add_argument('--headless')  # Run in headless mode
    options.add_argument('--disable-gpu')
    options.add_argument('--remote-debugging-port=9222')  # Change port if needed
    return webdriver.Chrome(options=options)

def scrape_page(html_content):
    soup = BeautifulSoup(html_content, "html.parser")
    products = []
    
    for product_card in soup.select(".bg-white.rounded-lg.shadow-md.overflow-hidden"):
        try:
            name_elem = product_card.select_one("h3")
            name = name_elem.get_text(strip=True) if name_elem else "Unknown Product"
            
            price_elem = product_card.select_one("span.text-lg.font-bold.text-orange-600")
            price = price_elem.get_text(strip=True) if price_elem else "Price Not Available"
            
            availability_elem = product_card.select_one("span.text-sm.text-green-600")
            availability = availability_elem.get_text(strip=True) if availability_elem else "Unknown Availability"
            
            link_elem = product_card.select_one("a.block")
            link = link_elem.get("href", "#") if link_elem else "#"
            
            img_elem = product_card.select_one("img")
            image = img_elem.get("src", "") if img_elem else ""
            
            products.append({
                "name": name,
                "price": price,
                "availability": availability,
                "link": link,
                "image": image,
            })
            
        except Exception as e:
            print(f"Error processing product card: {e}")
            continue
    
    return products

def main():
    driver = setup_driver()
    translator = Translator()
    all_products = []
    current_page = 91
    max_retries = 5

    try:
        url = "https://aloparca.com/yedek-parca-markalari/bsg?sortBy=name_asc&page=91"
        driver.get(url)
        
        while True:
            print(f"Scraping page {current_page}")
            
            # Attendre que les produits se chargent
            wait = WebDriverWait(driver, 60)  # Increase wait time
            wait.until(
                EC.presence_of_element_located((By.CSS_SELECTOR, ".bg-white.rounded-lg.shadow-md.overflow-hidden"))
            )
            
            time.sleep(2)
            
            # Scraper la page actuelle
            page_products = scrape_page(driver.page_source)
            
            # Traduire les produits
            for product in page_products:
                retry_count = 0
                while retry_count < 3:
                    try:
                        if product["name"] != "Unknown Product":
                            product["name"] = translator.translate(product["name"], src='tr', dest='en').text
                        if product["availability"] != "Unknown Availability":
                            product["availability"] = translator.translate(product["availability"], src='tr', dest='en').text
                        break
                    except Exception as e:
                        retry_count += 1
                        print(f"Translation retry {retry_count}/3: {e}")
                        time.sleep(2)
            
            all_products.extend(page_products)
            print(f"Added {len(page_products)} products from page {current_page}")
            
            # Sauvegarde régulière
            if current_page % 10 == 0:
                with open(f"products_backup_page_{current_page}.json", "w", encoding="utf-8") as json_file:
                    json.dump(all_products, json_file, indent=4, ensure_ascii=False)
            
            # Pagination
            next_page = current_page + 1
            retry_count = 0
            
            while retry_count < max_retries:
                try:
                    # Chercher le bouton de la page suivante
                    next_button = wait.until(
                        EC.element_to_be_clickable(
                            (By.CSS_SELECTOR, f"button[wire\\:click*='gotoPage({next_page}']")
                        )
                    )
                    
                    # Scroll vers le bas de la page
                    driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
                    time.sleep(2)
                    
                    # Utiliser Actions pour cliquer
                    actions = ActionChains(driver)
                    actions.move_to_element(next_button)
                    actions.click()
                    actions.perform()
                    
                    current_page = next_page
                    time.sleep(3)
                    break
                    
                except Exception as e:
                    retry_count += 1
                    if retry_count == max_retries:
                        print("Fin de la pagination ou erreur lors de la navigation")
                        return all_products
                    print(f"Retry {retry_count}/{max_retries}: {e}")
                    time.sleep(3)
            
    except Exception as e:
        print(f"Une erreur est survenue : {e}")
        
    finally:
        try:
            with open("products.json", "w", encoding="utf-8") as json_file:
                json.dump(all_products, json_file, indent=4, ensure_ascii=False)
            print(f"✅ {len(all_products)} produits ont été sauvegardés'")
        except Exception as e:
            print(f"Erreur lors de la sauvegarde JSON : {e}")
        
        driver.quit()
        
        return all_products

if __name__ == "__main__":
    products = main()