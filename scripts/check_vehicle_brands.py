#!/usr/bin/env python3
"""
Script to check current vehicle_brands collection and update image links
"""

import os
from pymongo import MongoClient
from dotenv import load_dotenv
import json

# Load environment variables
load_dotenv()

def connect_to_mongodb():
    """Connect to MongoDB Atlas"""
    # Get credentials
    username = os.getenv('MONGO_USERNAME', 'dbHassan')
    password = os.getenv('MONGO_PASSWORD', '1qDMW6Ps9Rgp0Rs0')
    cluster = os.getenv('MONGO_CLUSTER', 'hastechcluster.ikp2w.mongodb.net')
    
    # Build connection URI
    uri = f"mongodb+srv://{username}:{password}@{cluster}/?retryWrites=true&w=majority&appName=hastechCluster"
    
    try:
        print("Connecting to MongoDB Atlas...")
        client = MongoClient(uri)
        
        # Test connection
        client.admin.command('ping')
        print("Connection successful!")
        
        return client
        
    except Exception as e:
        print(f"Connection error: {e}")
        return None

def check_vehicle_brands_collection():
    """Check current structure of vehicle_brands collection"""
    client = connect_to_mongodb()
    if not client:
        return False
    
    try:
        db = client["Ecommerce"]
        collection = db["vehicle_brands"]
        
        # Count documents
        count = collection.count_documents({})
        print(f"\nTotal vehicle brands in collection: {count}")
        
        if count > 0:
            # Get a sample document to see the structure
            sample = collection.find_one()
            print("\nSample document structure:")
            print(json.dumps(sample, indent=2, default=str))
            
            # Check for existing image fields
            print("\nChecking for documents with image fields:")
            with_images = collection.count_documents({"imageURL": {"$exists": True}})
            print(f"Documents with imageURL: {with_images}")
            
            with_image_path = collection.count_documents({"imagePath": {"$exists": True}})
            print(f"Documents with imagePath: {with_image_path}")
            
            # List all brand names
            print("\nAll brand names in collection:")
            brands = collection.find({}, {"name": 1, "slug": 1, "imageURL": 1})
            for brand in brands:
                image_info = brand.get('imageURL', 'No image URL')
                print(f"  - {brand.get('name', 'N/A')} (slug: {brand.get('slug', 'N/A')}) -> {image_info}")
        
        client.close()
        return True
        
    except Exception as e:
        print(f"Error checking vehicle_brands collection: {e}")
        return False

def get_available_brand_images():
    """Get list of available brand images from assets folder"""
    assets_path = "C:/alopieceauto_site/alopieceauto_site/auto-parts-frontend/src/assets/images/vehicle_brand"
    
    if not os.path.exists(assets_path):
        print(f"Assets directory not found: {assets_path}")
        return []
    
    images = []
    for filename in os.listdir(assets_path):
        if filename.endswith('.svg'):
            brand_name = filename.replace('.svg', '').replace('-', ' ').title()
            images.append({
                'filename': filename,
                'brand_name': brand_name,
                'slug': filename.replace('.svg', ''),
                'path': f"/assets/images/vehicle_brand/{filename}"
            })
    
    print(f"\nFound {len(images)} brand images:")
    for img in images:
        print(f"  - {img['brand_name']} -> {img['filename']}")
    
    return images

def main():
    print("Vehicle Brands Collection Check")
    print("=" * 50)
    
    # Check current collection
    success = check_vehicle_brands_collection()
    
    if success:
        # List available images
        print("\n" + "=" * 50)
        print("Available Brand Images")
        print("=" * 50)
        get_available_brand_images()

if __name__ == "__main__":
    main()