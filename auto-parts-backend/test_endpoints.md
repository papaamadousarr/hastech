# Test des endpoints backend

## 🧪 **Endpoints à tester**

### **1. Test des catégories**
```bash
# Test de récupération des catégories
curl -X GET http://localhost:3000/api/categories

# Test de récupération des sous-catégories
curl -X GET http://localhost:3000/api/categories/brakes/subcategories
```

### **2. Test des véhicules**
```bash
# Test de récupération des marques de véhicules
curl -X GET http://localhost:3000/api/vehicles/brands

# Test de récupération des véhicules par marque
curl -X GET http://localhost:3000/api/vehicles/brand/BMW
```

### **3. Test des produits**
```bash
# Test de récupération de tous les produits
curl -X GET http://localhost:3000/api/products

# Test de recherche de produits
curl -X GET "http://localhost:3000/api/products/search?category=brakes&subcategory=abs-sensor"

# Test de récupération d'un produit par ID
curl -X GET http://localhost:3000/api/products/6866f956e046059b1912cbb9
```

### **4. Test de santé**
```bash
# Test de santé de l'API
curl -X GET http://localhost:3000/api/health
```

## 🔧 **Corrections apportées**

### **1. Endpoints ajoutés**
- ✅ `GET /api/vehicles/brands` - Récupération des marques de véhicules
- ✅ Amélioration de `GET /api/categories/:id/subcategories` - Support des slugs

### **2. Gestion d'erreurs améliorée**
- ✅ Gestion des erreurs 404 et 500
- ✅ Parsing JSON sécurisé
- ✅ Fallback pour les données manquantes

### **3. Modèles mis à jour**
- ✅ Ajout du champ `Slug` dans `MainCategory`
- ✅ Support des structures MongoDB Atlas

## 🚀 **Instructions de démarrage**

### **1. Démarrer le backend**
```bash
cd auto-parts-backend
go run main.go
```

### **2. Vérifier que le serveur fonctionne**
```bash
curl -X GET http://localhost:3000/api/health
```

### **3. Tester les endpoints critiques**
```bash
# Test des catégories
curl -X GET http://localhost:3000/api/categories

# Test des marques de véhicules
curl -X GET http://localhost:3000/api/vehicles/brands
```

## 📊 **Structure de données attendue**

### **Réponse des catégories**
```json
[
  {
    "id": "1",
    "name": "Brakes",
    "slug": "brakes",
    "icon": "brake-icon",
    "isExpanded": false,
    "subCategories": [
      {
        "id": "1",
        "name": "ABS Sensor",
        "parts": []
      }
    ]
  }
]
```

### **Réponse des marques de véhicules**
```json
[
  {
    "brand": "BMW",
    "logoUrl": "https://example.com/bmw.svg"
  },
  {
    "brand": "Audi",
    "logoUrl": "https://example.com/audi.svg"
  }
]
```

## ⚠️ **Points d'attention**

1. **Base de données** : S'assurer que MongoDB est démarré
2. **Collections** : Vérifier que les collections existent dans la base "Ecommerce"
3. **Données** : S'assurer que les données sont présentes dans les collections
4. **CORS** : Vérifier que CORS est configuré pour le frontend 