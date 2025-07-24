#!/usr/bin/env python3
"""
Script de test pour vérifier la connexion à MongoDB Atlas
et lister les bases de données et collections disponibles
"""

import os
from pymongo import MongoClient
from dotenv import load_dotenv

# Charger les variables d'environnement
load_dotenv()

def test_mongodb_connection():
    """Tester la connexion à MongoDB Atlas"""
    # Récupérer les credentials
    username = os.getenv('MONGO_USERNAME', 'dbHassan')
    password = os.getenv('MONGO_PASSWORD', '1qDMW6Ps9Rgp0Rs0')
    cluster = os.getenv('MONGO_CLUSTER', 'hastechcluster.ikp2w.mongodb.net')
    
    # Construire l'URI de connexion
    uri = f"mongodb+srv://{username}:{password}@{cluster}/?retryWrites=true&w=majority&appName=hastechCluster"
    
    try:
        print("🔌 Test de connexion à MongoDB Atlas...")
        client = MongoClient(uri)
        
        # Tester la connexion
        client.admin.command('ping')
        print("✅ Connexion réussie!")
        
        # Lister les bases de données
        print("\n📊 Bases de données disponibles:")
        databases = client.list_database_names()
        for db_name in databases:
            print(f"   - {db_name}")
        
        # Vérifier spécifiquement les bases de données d'intérêt
        source_db = "auto_parts_db"
        target_db = "Ecommerce"
        
        print(f"\n🔍 Vérification des bases de données d'intérêt:")
        
        if source_db in databases:
            print(f"✅ {source_db} existe")
            # Lister les collections de la base source
            source_collections = client[source_db].list_collection_names()
            print(f"   Collections dans {source_db}:")
            if source_collections:
                for coll in source_collections:
                    try:
                        count = client[source_db][coll].count_documents({})
                        print(f"     📦 {coll}: {count} documents")
                    except Exception as e:
                        print(f"     ❌ {coll}: erreur lors du comptage - {e}")
            else:
                print(f"     ⚠️  Aucune collection trouvée")
        else:
            print(f"❌ {source_db} n'existe pas")
        
        if target_db in databases:
            print(f"✅ {target_db} existe")
            # Lister les collections de la base destination
            target_collections = client[target_db].list_collection_names()
            print(f"   Collections dans {target_db}:")
            for coll in target_collections:
                count = client[target_db][coll].count_documents({})
                print(f"     - {coll}: {count} documents")
        else:
            print(f"❌ {target_db} n'existe pas")
        
        # Vérifier la collection products dans la destination
        if target_db in databases:
            print(f"\n🔍 Vérification de la collection 'products' dans {target_db}:")
            try:
                target_products = client[target_db]['products']
                target_count = target_products.count_documents({})
                print(f"   📦 Collection 'products' (destination): {target_count} documents")
            except:
                print(f"   ❌ Collection 'products' (destination): n'existe pas")
        
        client.close()
        return True
        
    except Exception as e:
        print(f"❌ Erreur de connexion: {e}")
        return False

def main():
    """Fonction principale"""
    print("🧪 Test de connexion MongoDB Atlas")
    print("=" * 40)
    
    success = test_mongodb_connection()
    
    if success:
        print("\n✅ Test réussi! Vous pouvez procéder à la migration.")
    else:
        print("\n❌ Test échoué! Vérifiez vos credentials MongoDB.")
        print("\n💡 Vérifiez que:")
        print("   - Vos credentials sont corrects")
        print("   - Votre IP est autorisée dans MongoDB Atlas")
        print("   - Le cluster est accessible")

if __name__ == "__main__":
    main() 