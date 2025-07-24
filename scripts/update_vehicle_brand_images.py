#!/usr/bin/env python3
"""
Script to update vehicle brand images in MongoDB Atlas
Replace external URLs with local asset paths
"""

import os
from pymongo import MongoClient
from dotenv import load_dotenv
import json

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
            # Convert filename to brand slug (remove .svg, normalize)
            brand_slug = filename.replace('.svg', '')
            image_path = f"/assets/images/vehicle_brand/{filename}"
            image_mapping[brand_slug] = image_path
    
    return image_mapping

def update_vehicle_brand_images():
    """Update vehicle brand images in MongoDB"""
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
        
        print("\nUpdating brands:")
        print("-" * 50)
        
        for brand in brands:
            brand_name = brand.get('name', '').lower().strip()
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
            elif brand_name.replace(' ', '-') in local_images:
                local_image_path = local_images[brand_name.replace(' ', '-')]
            
            if local_image_path:
                # Update the document
                result = collection.update_one(
                    {"_id": brand["_id"]},
                    {"$set": {"imageURL": local_image_path}}
                )
                
                if result.modified_count > 0:
                    updates_made += 1
                    print(f"[UPDATED] {brand['name']}: {local_image_path}")
                else:
                    print(f"[UNCHANGED] {brand['name']}")
            else:
                no_image_found.append(brand['name'])
                print(f"[NO MATCH] {brand['name']} (slug: {brand_slug})")
        
        print("\n" + "=" * 50)
        print(f"Update Summary:")
        print(f"  Brands updated: {updates_made}")
        print(f"  Brands without local images: {len(no_image_found)}")
        
        if no_image_found:
            print(f"\nBrands without matching local images:")
            for brand in no_image_found:
                print(f"  - {brand}")
        
        client.close()
        return True
        
    except Exception as e:
        print(f"Error updating vehicle brand images: {e}")
        if client:
            client.close()
        return False

def preview_updates():
    """Preview what updates will be made without actually updating"""
    client = connect_to_mongodb()
    if not client:
        return False
    
    try:
        db = client["Ecommerce"]
        collection = db["vehicle_brands"]
        
        local_images = get_local_image_mapping()
        brands = list(collection.find({}))
        
        print("Preview of updates that will be made:")
        print("=" * 60)
        
        for brand in brands:
            brand_name = brand.get('name', '')
            brand_slug = brand.get('slug', '').lower().strip()
            current_image = brand.get('imageURL', '')
            
            # Try to find matching local image (same logic as update function)
            local_image_path = None
            
            if brand_slug in local_images:
                local_image_path = local_images[brand_slug]
            elif brand_slug in BRAND_MAPPINGS and BRAND_MAPPINGS[brand_slug]:
                mapped_slug = BRAND_MAPPINGS[brand_slug]
                if mapped_slug in local_images:
                    local_image_path = local_images[mapped_slug]
            elif brand_name.lower().replace(' ', '-') in local_images:
                local_image_path = local_images[brand_name.lower().replace(' ', '-')]
            
            if local_image_path:
                print(f"[UPDATE] {brand_name}:")
                print(f"    FROM: {current_image}")
                print(f"    TO:   {local_image_path}")
            else:
                print(f"[NO MATCH] {brand_name}: No local image found (slug: {brand_slug})")
            print()
        
        client.close()
        return True
        
    except Exception as e:
        print(f"Error previewing updates: {e}")
        if client:
            client.close()
        return False

def main():
    print("Vehicle Brand Image Updater")
    print("=" * 50)
    
    # Show preview first
    print("PREVIEW MODE - No changes will be made")
    print("-" * 50)
    success = preview_updates()
    
    if success:
        print("\n" + "=" * 50)
        response = input("Do you want to proceed with the updates? (y/N): ")
        
        if response.lower() == 'y':
            print("\nPROCEEDING WITH UPDATES")
            print("-" * 50)
            update_vehicle_brand_images()
        else:
            print("Updates cancelled.")
    else:
        print("Preview failed. Please check your connection.")

if __name__ == "__main__":
    main()