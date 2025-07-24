#!/usr/bin/env python3
"""
Script to automatically execute vehicle brand image updates
"""

import os
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Brand name mappings to handle different naming conventions
BRAND_MAPPINGS = {
    'mercedes': 'mercedes',
    'mercedez benz': 'mercedes',
    'mercedes-benz': 'mercedes',
    'bmw': 'bmw',
    'vw': 'volkswagen',
    'volkswagen': 'volkswagen',
    'audi': 'audi',
    'ford': 'ford',
    'toyota': 'toyota',
    'honda': 'honda',
    'nissan': 'nissan',
    'hyundai': 'hyundai',
    'kia': 'kia',
    'chevrolet': 'chevrolet',
    'peugeot': 'peugeot',
    'renault': 'renault',
    'citroen': 'citroen',
    'fiat': 'fiat',
    'opel': 'opel',
    'mitsubishi': 'mitsubishi',
    'jeep': 'jeep',
    'dodge': 'dodge',
    'chrysler': 'chrysler',
    'dacia': 'dacia',
    'porsche': 'porsche',
    'chery': None  # No matching local image
}

def connect_to_mongodb():
    """Connect to MongoDB Atlas"""
    username = os.getenv('MONGO_USERNAME', 'dbHassan')
    password = os.getenv('MONGO_PASSWORD', '1qDMW6Ps9Rgp0Rs0')
    cluster = os.getenv('MONGO_CLUSTER', 'hastechcluster.ikp2w.mongodb.net')
    
    uri = f"mongodb+srv://{username}:{password}@{cluster}/?retryWrites=true&w=majority&appName=hastechCluster"
    
    try:
        print("Connecting to MongoDB Atlas...")
        client = MongoClient(uri)
        client.admin.command('ping')
        print("Connection successful!")
        return client
    except Exception as e:
        print(f"Connection error: {e}")
        return None

def get_local_image_mapping():
    """Create mapping of available local images"""
    assets_path = "C:/alopieceauto_site/alopieceauto_site/auto-parts-frontend/src/assets/images/vehicle_brand"
    
    if not os.path.exists(assets_path):
        print(f"Assets directory not found: {assets_path}")
        return {}
    
    image_mapping = {}
    for filename in os.listdir(assets_path):
        if filename.endswith('.svg'):
            brand_slug = filename.replace('.svg', '')
            image_path = f"/assets/images/vehicle_brand/{filename}"
            image_mapping[brand_slug] = image_path
    
    return image_mapping

def execute_updates():
    """Execute the vehicle brand image updates"""
    client = connect_to_mongodb()
    if not client:
        return False
    
    try:
        db = client["Ecommerce"]
        collection = db["vehicle_brands"]
        
        # Get local image mapping
        local_images = get_local_image_mapping()
        print(f"Found {len(local_images)} local images")
        
        # Get all brands from database
        brands = list(collection.find({}))
        print(f"Found {len(brands)} brands in database")
        
        updates_made = 0
        no_image_found = []
        
        print("\nExecuting updates:")
        print("-" * 50)
        
        for brand in brands:
            brand_name = brand.get('name', '').strip()
            brand_slug = brand.get('slug', '').lower().strip()
            current_image = brand.get('imageURL', '')
            
            # Try to find matching local image
            local_image_path = None
            
            # First try direct slug match
            if brand_slug in local_images:
                local_image_path = local_images[brand_slug]
            # Then try mapping
            elif brand_slug in BRAND_MAPPINGS and BRAND_MAPPINGS[brand_slug]:
                mapped_slug = BRAND_MAPPINGS[brand_slug]
                if mapped_slug in local_images:
                    local_image_path = local_images[mapped_slug]
            # Try normalized brand name
            elif brand_name.lower().replace(' ', '-') in local_images:
                local_image_path = local_images[brand_name.lower().replace(' ', '-')]
            
            if local_image_path:
                # Update the document
                result = collection.update_one(
                    {"_id": brand["_id"]},
                    {"$set": {"imageURL": local_image_path}}
                )
                
                if result.modified_count > 0:
                    updates_made += 1
                    print(f"[UPDATED] {brand_name} -> {local_image_path}")
                else:
                    print(f"[UNCHANGED] {brand_name} (already up to date)")
            else:
                no_image_found.append(brand_name)
                print(f"[SKIPPED] {brand_name} (no local image found)")
        
        print("\n" + "=" * 50)
        print(f"Update Summary:")
        print(f"  Brands updated: {updates_made}")
        print(f"  Brands skipped (no local image): {len(no_image_found)}")
        print(f"  Total brands in collection: {len(brands)}")
        
        if no_image_found:
            print(f"\nBrands without matching local images:")
            for brand in no_image_found:
                print(f"  - {brand}")
        
        print(f"\n[SUCCESS] Vehicle brand images updated successfully!")
        
        client.close()
        return True
        
    except Exception as e:
        print(f"Error updating vehicle brand images: {e}")
        if client:
            client.close()
        return False

def main():
    print("Vehicle Brand Image Updater - Execute Mode")
    print("=" * 50)
    
    success = execute_updates()
    
    if not success:
        print("Update failed. Please check your connection and try again.")

if __name__ == "__main__":
    main()