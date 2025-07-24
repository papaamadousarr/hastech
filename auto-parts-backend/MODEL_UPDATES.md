# Mises à jour des modèles backend pour MongoDB Atlas

## 🔄 **Changements effectués**

### **1. Modèle Product mis à jour**

#### **Nouveaux champs ajoutés :**
- `Slug` (string) - Identifiant unique du produit
- `Availability` (string) - Statut de disponibilité
- `Link` (string) - Lien vers le produit
- `Image` (string) - URL de l'image principale
- `Category` (string) - Nom de la catégorie
- `CategorySlug` (string) - Slug de la catégorie
- `Subcategory` (string) - Nom de la sous-catégorie
- `SubcategorySlug` (string) - Slug de la sous-catégorie

#### **Structures ajoutées :**
```go
// CompatibleCar représente un véhicule compatible
type CompatibleCar struct {
    Vehicle string `bson:"vehicle" json:"vehicle"`
    RawText string `bson:"raw_text" json:"raw_text"`
}

// Specifications représente les spécifications du produit
type Specifications struct {
    OemNumbers []string `bson:"oem_numbers" json:"oem_numbers"`
}
```

#### **Champs modifiés :**
- `CompatibleCars` : `[]string` → `[]CompatibleCar`
- `Specifications` : `map[string]string` → `Specifications`
- `CreatedAt` : `created_at` → `createdAt`
- `UpdatedAt` : `updated_at` → `updatedAt`

#### **Champs conservés (optionnels) :**
- `SKU`, `Description`, `DiscountPrice`, `CategoryID`, `Brand`, `StockQuantity`, `Images`

### **2. Nouveaux handlers ajoutés**

#### **GetProductsByCategory**
- **Endpoint** : `GET /api/products/category/:category`
- **Endpoint** : `GET /api/products/category/:category/:subcategory`
- **Fonction** : Récupère les produits par catégorie et sous-catégorie

#### **GetCompatibleVehicles**
- **Endpoint** : `GET /api/products/:id/compatible-vehicles`
- **Fonction** : Récupère les véhicules compatibles d'un produit

#### **GetProductOemNumbers**
- **Endpoint** : `GET /api/products/:id/oem-numbers`
- **Fonction** : Récupère les numéros OEM d'un produit

### **3. Handler SearchProducts amélioré**

#### **Nouveaux paramètres de recherche :**
- `vehicleBrand` - Marque de véhicule
- `vehicleModel` - Modèle de véhicule
- `vehicleEngine` - Moteur de véhicule
- `yearRange` - Gamme d'années
- `category` - Catégorie
- `subcategory` - Sous-catégorie
- `availability` - Disponibilité
- `priceMin` / `priceMax` - Gamme de prix

#### **Filtres avancés :**
- Recherche par véhicules compatibles (regex)
- Filtrage par gamme de prix
- Filtrage par catégorie/sous-catégorie
- Filtrage par disponibilité

## 📊 **Structure MongoDB Atlas supportée**

```json
{
  "_id": "6866f956e046059b1912cbb9",
  "name": "ABS Sensor",
  "slug": "abs-sensor",
  "price": 336.66,
  "availability": "In stock",
  "link": "https://aloparca.com/product/...",
  "image": "https://bcdn.aloparca.com/...",
  "compatibleCars": [
    {
      "vehicle": "{'maker': 'BMW', 'model': '3 Serisi', 'year_range': 'E36', ...}",
      "raw_text": "..."
    }
  ],
  "specifications": {
    "oem_numbers": [
      "{'number': '1181971', 'manufacturer': 'BMW', ...}",
      "{'number': '34521163028', 'manufacturer': 'BMW', ...}"
    ]
  },
  "category": "brakes",
  "category_slug": "brakes",
  "subcategory": "abs sensor",
  "subcategory_slug": "abs-sensor",
  "createdAt": "2025-01-02T10:22:46.555Z",
  "updatedAt": "2025-01-02T23:55:38.833Z"
}
```

## 🔧 **Migration recommandée**

### **1. Mise à jour de la base de données**
```javascript
// Script de migration MongoDB
db.products.updateMany(
  {},
  {
    $set: {
      "category_slug": "$category",
      "subcategory_slug": "$subcategory"
    }
  }
);
```

### **2. Mise à jour du frontend**
- Adapter les appels API pour utiliser les nouveaux endpoints
- Mettre à jour les interfaces TypeScript
- Adapter la logique de filtrage pour utiliser les nouveaux paramètres

### **3. Tests recommandés**
- Tester les nouveaux endpoints
- Vérifier la compatibilité avec l'ancien système
- Tester les filtres avancés
- Valider le parsing des données JSON dans `compatibleCars`

## ✅ **Avantages de cette mise à jour**

1. **Conformité MongoDB Atlas** : Structure exacte correspondant aux données
2. **Filtrage avancé** : Support des véhicules compatibles et OEM
3. **Performance** : Requêtes optimisées avec index MongoDB
4. **Extensibilité** : Structure prête pour de nouvelles fonctionnalités
5. **Compatibilité** : Support des anciens champs en option 