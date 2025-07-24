#!/usr/bin/env python3
"""
Script de migration pour copier la collection products 
de auto_parts_db vers Ecommerce dans MongoDB Atlas
"""

import os
from pymongo import MongoClient
from dotenv import load_dotenv
import json
from datetime import datetime
import time

# Charger les variables d'environnement
load_dotenv()

def connect_to_mongodb():
    """Connexion à MongoDB Atlas"""
    # Récupérer les credentials depuis les variables d'environnement
    username = os.getenv('MONGO_USERNAME', 'dbHassan')
    password = os.getenv('MONGO_PASSWORD', '1qDMW6Ps9Rgp0Rs0')
    cluster = os.getenv('MONGO_CLUSTER', 'hastechcluster.ikp2w.mongodb.net')
    
    # Construire l'URI de connexion
    uri = f"mongodb+srv://{username}:{password}@{cluster}/?retryWrites=true&w=majority&appName=hastechCluster"
    
    try:
        client = MongoClient(uri)
        # Tester la connexion
        client.admin.command('ping')
        print("✅ Connexion à MongoDB Atlas réussie")
        return client
    except Exception as e:
        print(f"❌ Erreur de connexion à MongoDB: {e}")
        return None

def migrate_products():
    """Migration de la collection products"""
    client = connect_to_mongodb()
    if not client:
        return False
    
    try:
        # Accéder aux bases de données
        source_db = client['auto_parts_db']
        target_db = client['Ecommerce']
        
        # Accéder aux collections (essayer Products puis products)
        source_collection = None
        target_collection = None
        collection_name = None
        
        # Lister toutes les collections disponibles dans la source
        print(f"\n📋 Collections disponibles dans {source_db}:")
        source_collections = source_db.list_collection_names()
        
        if not source_collections:
            print(f"   ❌ Aucune collection trouvée dans {source_db}")
            return False
        
        # Afficher toutes les collections avec leur nombre de documents
        collections_info = []
        for coll_name in source_collections:
            try:
                count = source_db[coll_name].count_documents({})
                collections_info.append((coll_name, count))
                print(f"   📦 {coll_name}: {count} documents")
            except Exception as e:
                print(f"   ❌ {coll_name}: erreur lors du comptage - {e}")
        
        # Demander à l'utilisateur de choisir la collection
        print(f"\n🔍 Choisissez la collection source à migrer:")
        for i, (name, count) in enumerate(collections_info, 1):
            print(f"   {i}. {name} ({count} documents)")
        
        try:
            choice = input(f"\nEntrez le numéro de la collection (1-{len(collections_info)}): ").strip()
            choice_index = int(choice) - 1
            
            if 0 <= choice_index < len(collections_info):
                collection_name, count = collections_info[choice_index]
                source_collection = source_db[collection_name]
                print(f"✅ Collection sélectionnée: {collection_name} ({count} documents)")
            else:
                print("❌ Choix invalide")
                return False
        except (ValueError, IndexError):
            print("❌ Choix invalide")
            return False
        
        # Toujours utiliser 'products' (minuscule) pour la destination
        target_collection = target_db['products']
        
        print(f"📊 Migration de la collection '{collection_name}'")
        print(f"   Source: auto_parts_db.{collection_name}")
        print(f"   Destination: Ecommerce.products")
        
        # Compter les documents dans la source
        source_count = source_collection.count_documents({})
        print(f"   Documents dans la source: {source_count}")
        
        if source_count == 0:
            print("⚠️  Aucun document trouvé dans la collection source")
            return False
        
        # Vérifier si la collection de destination existe et compter les documents
        target_count = target_collection.count_documents({})
        print(f"   Documents existants dans la destination: {target_count}")
        
        # Demander confirmation si des documents existent déjà
        if target_count > 0:
            response = input(f"⚠️  La collection de destination contient déjà {target_count} documents. Voulez-vous continuer? (y/N): ")
            if response.lower() != 'y':
                print("❌ Migration annulée")
                return False
        
        # Options pour la migration
        print("\nOptions de migration:")
        print("1. Remplacer complètement (supprimer tous les documents existants)")
        print("2. Ajouter seulement (ignorer les doublons)")
        print("3. Fusionner (mettre à jour les documents existants, ajouter les nouveaux)")
        
        choice = input("Choisissez une option (1/2/3): ").strip()
        
        if choice == "1":
            # Supprimer tous les documents existants
            result = target_collection.delete_many({})
            print(f"🗑️  {result.deleted_count} documents supprimés de la destination")
            
            # Copier tous les documents par lots de 1000
            batch_size = 1000
            total_docs = source_count
            copied_count = 0
            
            print(f"🔄 Copie de {total_docs} documents par lots de {batch_size}...")
            
            for skip in range(0, total_docs, batch_size):
                batch = list(source_collection.find({}).skip(skip).limit(batch_size))
                if batch:
                    result = target_collection.insert_many(batch)
                    copied_count += len(result.inserted_ids)
                    
                    # Afficher le progrès
                    progress = (copied_count / total_docs) * 100
                    print(f"   Progression: {copied_count}/{total_docs} ({progress:.1f}%)")
            
            print(f"✅ {copied_count} documents copiés avec succès")
            
        elif choice == "2":
            # Ajouter seulement les nouveaux documents
            # Utiliser un identifiant unique pour éviter les doublons
            source_docs = list(source_collection.find({}))
            inserted_count = 0
            total_docs = len(source_docs)
            
            print(f"🔄 Traitement de {total_docs} documents...")
            
            for i, doc in enumerate(source_docs, 1):
                # Afficher le progrès tous les 100 documents
                if i % 100 == 0 or i == total_docs:
                    progress = (i / total_docs) * 100
                    print(f"   Progression: {i}/{total_docs} ({progress:.1f}%)")
                
                # Vérifier si le document existe déjà (par exemple par SKU ou nom)
                existing = None
                if 'sku' in doc:
                    existing = target_collection.find_one({'sku': doc['sku']})
                elif 'name' in doc:
                    existing = target_collection.find_one({'name': doc['name']})
                
                if not existing:
                    target_collection.insert_one(doc)
                    inserted_count += 1
            
            print(f"✅ {inserted_count} nouveaux documents ajoutés sur {total_docs} traités")
            
        elif choice == "3":
            # Fusionner les documents
            source_docs = list(source_collection.find({}))
            updated_count = 0
            inserted_count = 0
            total_docs = len(source_docs)
            
            print(f"🔄 Traitement de {total_docs} documents...")
            
            for i, doc in enumerate(source_docs, 1):
                # Afficher le progrès tous les 100 documents
                if i % 100 == 0 or i == total_docs:
                    progress = (i / total_docs) * 100
                    print(f"   Progression: {i}/{total_docs} ({progress:.1f}%)")
                
                # Déterminer l'identifiant unique
                filter_criteria = {}
                if 'sku' in doc:
                    filter_criteria['sku'] = doc['sku']
                elif 'name' in doc:
                    filter_criteria['name'] = doc['name']
                else:
                    # Si aucun identifiant unique, ajouter comme nouveau
                    target_collection.insert_one(doc)
                    inserted_count += 1
                    continue
                
                # Mettre à jour ou insérer
                result = target_collection.replace_one(filter_criteria, doc, upsert=True)
                if result.matched_count > 0:
                    updated_count += 1
                else:
                    inserted_count += 1
            
            print(f"✅ {updated_count} documents mis à jour, {inserted_count} nouveaux documents ajoutés sur {total_docs} traités")
        
        else:
            print("❌ Option invalide")
            return False
        
        # Vérifier le résultat final
        final_count = target_collection.count_documents({})
        print(f"\n📊 Résultat final:")
        print(f"   Documents dans la destination: {final_count}")
        
        # Sauvegarder un rapport de migration
        migration_report = {
            "timestamp": datetime.now().isoformat(),
            "source_db": "auto_parts_db",
            "target_db": "Ecommerce",
            "source_collection": collection_name,
            "target_collection": "products",
            "source_count": source_count,
            "final_count": final_count,
            "migration_type": choice
        }
        
        with open("migration_report.json", "w", encoding="utf-8") as f:
            json.dump(migration_report, f, indent=2, ensure_ascii=False)
        
        print("✅ Migration terminée avec succès!")
        print("📄 Rapport de migration sauvegardé dans 'migration_report.json'")
        
        return True
        
    except Exception as e:
        print(f"❌ Erreur lors de la migration: {e}")
        return False
    
    finally:
        client.close()

def main():
    """Fonction principale"""
    print("🚀 Script de migration MongoDB Atlas")
    print("=" * 50)
    
    # Vérifier les variables d'environnement
    if not os.getenv('MONGO_USERNAME') and not os.getenv('MONGO_PASSWORD'):
        print("ℹ️  Utilisation des credentials par défaut")
        print("   Pour utiliser des variables d'environnement, créez un fichier .env avec:")
        print("   MONGO_USERNAME=votre_username")
        print("   MONGO_PASSWORD=votre_password")
        print("   MONGO_CLUSTER=votre_cluster")
    
    # Lancer la migration
    success = migrate_products()
    
    if success:
        print("\n🎉 Migration réussie!")
    else:
        print("\n💥 Migration échouée!")
        exit(1)

if __name__ == "__main__":
    main() 