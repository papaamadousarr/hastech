# 🚀 Migration MongoDB Atlas - Guide d'utilisation

Ce guide vous explique comment migrer la collection `products` de la base de données `auto_patrs_db` vers `Ecommerce` dans MongoDB Atlas.

## 📋 Prérequis

- Python 3.8 ou supérieur
- Accès à MongoDB Atlas
- Credentials MongoDB valides

## 🛠️ Installation et Configuration

### 1. Vérifier les dépendances

```bash
cd alopieceauto_site/scripts
python check_dependencies.py
```

Ce script va :
- Vérifier votre version de Python
- Installer automatiquement `pymongo` et `python-dotenv` si nécessaire

### 2. Configuration des variables d'environnement (optionnel)

Créez un fichier `.env` dans le dossier `scripts/` :

```bash
# Copiez le contenu de env_example.txt vers .env
cp env_example.txt .env
```

Puis modifiez le fichier `.env` avec vos credentials :

```env
MONGO_USERNAME=votre_username
MONGO_PASSWORD=votre_password
MONGO_CLUSTER=votre_cluster.mongodb.net
```

**Note :** Si vous ne créez pas le fichier `.env`, le script utilisera les credentials par défaut.

### 3. Tester la connexion

```bash
python test_connection.py
```

Ce script va :
- Tester la connexion à MongoDB Atlas
- Lister les bases de données disponibles
- Vérifier l'existence de `auto_patrs_db` et `Ecommerce`
- Compter les documents dans les collections
- Afficher un exemple de document

## 🔄 Exécution de la Migration

### Lancer la migration

```bash
python migrate_products.py
```

### Options de migration disponibles

Le script vous proposera 3 options :

1. **Remplacer complètement** : Supprime tous les documents existants dans la destination et copie tous les documents de la source
2. **Ajouter seulement** : Ajoute uniquement les nouveaux documents (ignore les doublons basés sur SKU ou nom)
3. **Fusionner** : Met à jour les documents existants et ajoute les nouveaux

### Exemple d'exécution

```
🚀 Script de migration MongoDB Atlas
==================================================
✅ Connexion à MongoDB Atlas réussie
📊 Migration de la collection 'products'
   Source: auto_patrs_db.products
   Destination: Ecommerce.products
   Documents dans la source: 1250
   Documents existants dans la destination: 0

Options de migration:
1. Remplacer complètement (supprimer tous les documents existants)
2. Ajouter seulement (ignorer les doublons)
3. Fusionner (mettre à jour les documents existants, ajouter les nouveaux)

Choisissez une option (1/2/3): 1
✅ 1250 documents copiés

📊 Résultat final:
   Documents dans la destination: 1250
✅ Migration terminée avec succès!
📄 Rapport de migration sauvegardé dans 'migration_report.json'
```

## 📊 Rapport de Migration

Après chaque migration, un fichier `migration_report.json` est créé avec les détails :

```json
{
  "timestamp": "2024-01-15T10:30:45.123456",
  "source_db": "auto_patrs_db",
  "target_db": "Ecommerce",
  "collection": "products",
  "source_count": 1250,
  "final_count": 1250,
  "migration_type": "1"
}
```

## 🔧 Dépannage

### Erreur de connexion

Si vous obtenez une erreur de connexion :

1. **Vérifiez vos credentials** dans le fichier `.env` ou dans le script
2. **Vérifiez votre IP** : Assurez-vous que votre adresse IP est autorisée dans MongoDB Atlas
3. **Vérifiez le cluster** : Assurez-vous que le nom du cluster est correct

### Erreur de permissions

Si vous obtenez une erreur de permissions :

1. **Vérifiez les rôles** de votre utilisateur MongoDB
2. **Assurez-vous** que l'utilisateur a les droits de lecture sur `auto_patrs_db` et d'écriture sur `Ecommerce`

### Erreur de mémoire

Pour les grandes collections :

1. **Utilisez l'option 2 ou 3** pour éviter de charger tous les documents en mémoire
2. **Divisez la migration** en plusieurs parties si nécessaire

## 📁 Structure des fichiers

```
scripts/
├── migrate_products.py      # Script principal de migration
├── test_connection.py       # Script de test de connexion
├── check_dependencies.py    # Script de vérification des dépendances
├── env_example.txt         # Exemple de configuration
├── README_MIGRATION.md     # Ce fichier
└── migration_report.json   # Rapport généré après migration
```

## 🆘 Support

Si vous rencontrez des problèmes :

1. **Vérifiez les logs** affichés par les scripts
2. **Testez la connexion** avec `test_connection.py`
3. **Vérifiez les permissions** MongoDB Atlas
4. **Consultez la documentation** MongoDB Atlas

## 🔄 Migration Inverse

Si vous devez migrer de `Ecommerce` vers `auto_patrs_db`, modifiez les variables dans le script :

```python
source_db = client['Ecommerce']
target_db = client['auto_patrs_db']
```

---

**Note :** Ce script est conçu pour être sûr et vous demandera confirmation avant de supprimer des données existantes. 