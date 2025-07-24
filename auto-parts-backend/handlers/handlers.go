package handlers

import (
	"auto-parts-backend/auth"
	"auto-parts-backend/db"
	"auto-parts-backend/models"
	"context"
	"log"
	"net/http"
	"strconv"
	"strings"
	"time"

	"math"
	"regexp"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// GetCategoriesHandler returns all categories
func GetCategoriesHandler(c *gin.Context) {
	collection := db.Client.Database("Ecommerce").Collection("categories")

	// Ajouter un timeout context
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	cursor, err := collection.Find(ctx, bson.M{})
	if err != nil {
		log.Printf("Error finding categories: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to retrieve categories",
			"details": err.Error(),
		})
		return
	}
	defer cursor.Close(ctx)

	var categories []models.MainCategory
	if err = cursor.All(ctx, &categories); err != nil {
		log.Printf("Error decoding categories: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to decode categories",
			"details": err.Error(),
		})
		return
	}

	// Vérifier et nettoyer les données avant de les envoyer
	for i := range categories {
		// S'assurer que les champs requis sont présents
		if categories[i].Name == "" {
			categories[i].Name = "Unknown Category"
		}
		if categories[i].Slug == "" {
			categories[i].Slug = strings.ToLower(strings.ReplaceAll(categories[i].Name, " ", "-"))
		}
		if categories[i].ID == "" {
			categories[i].ID = categories[i].Slug
		}
	}

	log.Printf("Successfully retrieved %d categories", len(categories))
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    categories,
		"count":   len(categories),
	})
}

// GetSubCategoriesHandler returns subcategories for a specific category
func GetSubCategoriesHandler(c *gin.Context) {
	categorySlug := c.Param("id")
	if categorySlug == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "Category slug is required",
		})
		return
	}

	collection := db.Client.Database("Ecommerce").Collection("categories")

	// Normaliser l'ID de catégorie : convertir les espaces en tirets et en minuscules
	normalizedSlug := strings.ReplaceAll(strings.ToLower(categorySlug), " ", "-")

	// Ajouter un timeout context
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Essayer d'abord de trouver par slug normalisé
	var category models.MainCategory
	err := collection.FindOne(ctx, bson.M{"slug": normalizedSlug}).Decode(&category)
	if err != nil {
		log.Printf("Category not found by slug '%s', trying by id...", normalizedSlug)
		// Si pas trouvé par slug, essayer par id normalisé
		err = collection.FindOne(ctx, bson.M{"id": normalizedSlug}).Decode(&category)
		if err != nil {
			log.Printf("Category not found by id '%s', trying original slug...", normalizedSlug)
			// Si pas trouvé par id, essayer avec l'ID original
			err = collection.FindOne(ctx, bson.M{"id": categorySlug}).Decode(&category)
			if err != nil {
				log.Printf("Category not found by original slug '%s'", categorySlug)
				c.JSON(http.StatusNotFound, gin.H{
					"success":         false,
					"error":           "Category not found",
					"searched_slug":   categorySlug,
					"normalized_slug": normalizedSlug,
				})
				return
			}
		}
	}

	log.Printf("Found category '%s' with %d subcategories", category.Name, len(category.SubCategories))
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    category.SubCategories,
		"category": gin.H{
			"id":   category.ID,
			"name": category.Name,
			"slug": category.Slug,
		},
		"count": len(category.SubCategories),
	})
}

// GetPartsHandler returns parts for a specific subcategory
func GetPartsHandler(c *gin.Context) {
	subCategorySlug := c.Param("id")
	if subCategorySlug == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "SubCategory slug is required"})
		return
	}

	log.Printf("GetPartsHandler called with subCategorySlug: %s", subCategorySlug)

	// Normaliser le slug de sous-catégorie : convertir les espaces en tirets et en minuscules
	normalizedSubCategorySlug := strings.ReplaceAll(strings.ToLower(subCategorySlug), " ", "-")
	log.Printf("Normalized subCategorySlug: %s", normalizedSubCategorySlug)

	// Utiliser la collection products
	collection := db.Client.Database("Ecommerce").Collection("products")

	// Vérifier d'abord combien de produits il y a dans la collection
	totalCount, err := collection.CountDocuments(context.TODO(), bson.M{})
	if err != nil {
		log.Printf("Error counting products: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}
	log.Printf("Total products in collection: %d", totalCount)

	// Filtrer les produits par subcategory_slug
	filter := bson.M{"subcategory_slug": normalizedSubCategorySlug}
	log.Printf("Using filter: %v", filter)

	cursor, err := collection.Find(context.TODO(), filter)
	if err != nil {
		log.Printf("Error querying products: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}
	defer cursor.Close(context.TODO())

	var products []bson.M
	if err = cursor.All(context.TODO(), &products); err != nil {
		log.Printf("Error decoding products: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	log.Printf("Found %d products with normalized slug", len(products))

	// Si aucun produit trouvé avec le slug normalisé, essayer avec le slug original
	if len(products) == 0 {
		log.Printf("No products found with normalized slug, trying with original slug")
		filter = bson.M{"subcategory_slug": subCategorySlug}
		log.Printf("Using fallback filter: %v", filter)

		cursor, err = collection.Find(context.TODO(), filter)
		if err != nil {
			log.Printf("Error querying products with fallback: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
			return
		}
		defer cursor.Close(context.TODO())

		if err = cursor.All(context.TODO(), &products); err != nil {
			log.Printf("Error decoding products with fallback: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
			return
		}

		log.Printf("Found %d products with original slug", len(products))
	}

	// Si toujours aucun produit trouvé, essayer avec le champ subcategory (sans _slug)
	if len(products) == 0 {
		log.Printf("No products found with slug, trying with subcategory field")
		filter = bson.M{"subcategory": normalizedSubCategorySlug}
		log.Printf("Using subcategory filter: %v", filter)

		cursor, err = collection.Find(context.TODO(), filter)
		if err != nil {
			log.Printf("Error querying products with subcategory: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
			return
		}
		defer cursor.Close(context.TODO())

		if err = cursor.All(context.TODO(), &products); err != nil {
			log.Printf("Error decoding products with subcategory: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
			return
		}

		log.Printf("Found %d products with subcategory field", len(products))
	}

	log.Printf("Returning %d products", len(products))
	c.JSON(http.StatusOK, products)
}

// GetVehiclesHandler returns all vehicles
func GetVehiclesHandler(c *gin.Context) {
	collection := db.Client.Database("Ecommerce").Collection("Vehicles")
	cursor, err := collection.Find(context.TODO(), bson.M{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer cursor.Close(context.TODO())

	var vehicles []models.Vehicle
	if err = cursor.All(context.TODO(), &vehicles); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, vehicles)
}

// GetVehicleBrandsHandler returns all vehicle brands
func GetVehicleBrandsHandler(c *gin.Context) {
	// Try to get from database first
	collection := db.Client.Database("Ecommerce").Collection("vehicle_brands")

	cursor, err := collection.Find(context.Background(), bson.M{})
	if err != nil {
		// If database connection fails, return static data
		log.Printf("Database connection failed, returning static brands: %v", err)

		staticBrands := []map[string]interface{}{
			{
				"_id":       "static_audi",
				"name":      "Audi",
				"slug":      "audi",
				"imageURL":  "https://bcdn.aloparca.com/car-images/4dfI91linA4MOJgY6ZsDm8jmNA7dQPvtLo43Oc2e.png?width=219",
				"isActive":  true,
				"sortOrder": 2,
			},
			{
				"_id":       "static_bmw",
				"name":      "BMW",
				"slug":      "bmw",
				"imageURL":  "https://bcdn.aloparca.com/car-images/Ot3fIWRhFx4mztqViSbnuhv6IPUbYAEDmVZO7P3V.png?width=219",
				"isActive":  true,
				"sortOrder": 3,
			},
			{
				"_id":       "static_mercedes",
				"name":      "Mercedes",
				"slug":      "mercedes",
				"imageURL":  "https://bcdn.aloparca.com/car-images/5fyJZdZW3Ke8XQJfLzRa1PQkDydEKK8ZVPvy8aNv.png?width=219",
				"isActive":  true,
				"sortOrder": 15,
			},
			{
				"_id":       "static_volkswagen",
				"name":      "Volkswagen",
				"slug":      "volkswagen",
				"imageURL":  "https://bcdn.aloparca.com/car-images/IACaev3KuJwAwH1CeXnrmA9BPPsa02GIWt2IEWZE.png?width=219",
				"isActive":  true,
				"sortOrder": 23,
			},
			{
				"_id":       "static_toyota",
				"name":      "Toyota",
				"slug":      "toyota",
				"imageURL":  "https://bcdn.aloparca.com/car-images/Geu85wpFcFmW9I3s4VJjSVz1z5aYzaRPRW4aocRd.png?width=219",
				"isActive":  true,
				"sortOrder": 22,
			},
		}

		c.JSON(http.StatusOK, staticBrands)
		return
	}
	defer cursor.Close(context.Background())

	var brands []map[string]interface{}
	if err = cursor.All(context.Background(), &brands); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, brands)
}

// GetVehiclesByBrandHandler returns vehicles for a specific brand
func GetVehiclesByBrandHandler(c *gin.Context) {
	brand := c.Param("brand")
	if brand == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Brand is required"})
		return
	}

	collection := db.Client.Database("Ecommerce").Collection("Vehicles")
	cursor, err := collection.Find(context.TODO(), bson.M{"vehiclebrand": brand})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer cursor.Close(context.TODO())

	var vehicles []models.Vehicle
	if err = cursor.All(context.TODO(), &vehicles); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Extraire les modèles uniques pour cette marque
	modelsMap := make(map[string]bool)
	var uniqueModels []gin.H

	for _, vehicle := range vehicles {
		for _, model := range vehicle.Model {
			if !modelsMap[model] {
				modelsMap[model] = true
				uniqueModels = append(uniqueModels, gin.H{
					"id":    model,
					"name":  model,
					"years": vehicle.Years,
				})
			}
		}
	}

	c.JSON(http.StatusOK, uniqueModels)
}

/*
// GetVehicleImagesHandler returns images for a specific vehicle
func GetVehicleImagesHandler(c *gin.Context) {
	brand := c.Query("brand")
	model := c.Query("model")

	if brand == "" || model == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Brand and model are required"})
		return
	}

	collection := db.Client.Database("Ecommerce").Collection("Vehicles")
	var vehicle models.Vehicle
	err := collection.FindOne(context.TODO(), bson.M{
		"vehiclebrand": brand,
		"model":        model,
	}).Decode(&vehicle)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Vehicle not found"})
		return
	}

	// Return the vehicle images in the expected format
	c.JSON(http.StatusOK, gin.H{
		"images": vehicle.Images,
	})
}

// GetVehicleDetailHandler returns detailed information for a specific vehicle
func GetVehicleDetailHandler(c *gin.Context) {
	brand := c.Query("brand")
	model := c.Query("model")
	engine := c.Query("engine")

	if brand == "" || model == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Brand and model are required"})
		return
	}

	collection := db.Client.Database("Ecommerce").Collection("Vehicles")
	filter := bson.M{"vehiclebrand": brand, "model": model}
	if engine != "" {
		filter["engine"] = engine
	}

	var vehicle models.Vehicle
	err := collection.FindOne(context.TODO(), filter).Decode(&vehicle)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Vehicle not found"})
		return
	}

	c.JSON(http.StatusOK, vehicle)
}
*/
// GetProductBrands returns all product brands
func GetProductBrands(c *gin.Context) {
	collection := db.Client.Database("Ecommerce").Collection("ProductBrands")

	cursor, err := collection.Find(context.TODO(), bson.M{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer cursor.Close(context.TODO())

	var brands []models.ProductBrand
	if err = cursor.All(context.TODO(), &brands); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, brands)
}

// HealthCheck returns the API status
func HealthCheck(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"status": "healthy",
	})
}

// GetProducts returns all products
func GetProducts(c *gin.Context) {
	collection := db.Client.Database("Ecommerce").Collection("products")

	// Pagination
	pageStr := c.DefaultQuery("page", "1")
	limitStr := c.DefaultQuery("limit", "20")
	page, err := strconv.Atoi(pageStr)
	if err != nil || page < 1 {
		page = 1
	}
	limit, err := strconv.Atoi(limitStr)
	if err != nil || limit < 1 || limit > 100 {
		limit = 20
	}
	skip := (page - 1) * limit

	findOptions := options.Find()
	findOptions.SetLimit(int64(limit))
	findOptions.SetSkip(int64(skip))

	cursor, err := collection.Find(context.TODO(), bson.M{}, findOptions)
	if err != nil {
		// Fallback: return static products if DB is unavailable
		staticProducts := []map[string]interface{}{
			{
				"_id":         "static_1",
				"name":        "Filtre à huile Audi A4",
				"brand":       "Audi",
				"sku":         "AUDI-A4-OIL-001",
				"price":       19.99,
				"imageURL":    "https://bcdn.aloparca.com/product-images/filtre-huile-audi-a4.png",
				"description": "Filtre à huile compatible Audi A4 2015-2020.",
			},
			{
				"_id":         "static_2",
				"name":        "Plaquettes de frein BMW Série 3",
				"brand":       "BMW",
				"sku":         "BMW-3-BRAKE-002",
				"price":       49.90,
				"imageURL":    "https://bcdn.aloparca.com/product-images/plaquette-frein-bmw-serie3.png",
				"description": "Jeu de 4 plaquettes de frein pour BMW Série 3 (2012-2018).",
			},
			{
				"_id":         "static_3",
				"name":        "Batterie 12V 70Ah Mercedes",
				"brand":       "Mercedes",
				"sku":         "MERC-12V-70AH-003",
				"price":       109.00,
				"imageURL":    "https://bcdn.aloparca.com/product-images/batterie-mercedes-12v.png",
				"description": "Batterie 12V 70Ah compatible Mercedes Classe C/E/S.",
			},
		}
		c.JSON(http.StatusOK, staticProducts)
		return
	}
	defer cursor.Close(context.TODO())

	var products []models.Product
	if err = cursor.All(context.TODO(), &products); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"products": products,
		"page":     page,
		"limit":    limit,
		"count":    len(products),
	})
}

// SearchProducts handles product search with various filters
func SearchProducts(c *gin.Context) {
	vehicleBrand := c.Query("vehicleBrand")
	vehicleModel := c.Query("vehicleModel")
	vehicleEngine := c.Query("vehicleEngine")
	yearRange := c.Query("yearRange")
	category := c.Query("category")
	subcategory := c.Query("subcategory")
	availability := c.Query("availability")
	priceMin := c.Query("priceMin")
	priceMax := c.Query("priceMax")

	filter := bson.M{}

	// Normaliser les slugs
	normalizedCategory := strings.ReplaceAll(strings.ToLower(category), " ", "-")
	normalizedSubcategory := strings.ReplaceAll(strings.ToLower(subcategory), " ", "-")

	// Filtres de base
	if category != "" {
		filter["category_slug"] = normalizedCategory
	}
	if subcategory != "" {
		filter["subcategory_slug"] = normalizedSubcategory
	}
	if availability != "" {
		filter["availability"] = availability
	}

	// Filtre par prix
	if priceMin != "" || priceMax != "" {
		priceFilter := bson.M{}
		if priceMin != "" {
			priceFilter["$gte"] = parseFloat(priceMin)
		}
		if priceMax != "" {
			priceFilter["$lte"] = parseFloat(priceMax)
		}
		filter["price"] = priceFilter
	}

	// Filtre par véhicule compatible
	if vehicleBrand != "" || vehicleModel != "" || vehicleEngine != "" || yearRange != "" {
		compatibleFilter := bson.M{}

		if vehicleBrand != "" {
			compatibleFilter["compatibleCars.vehicle"] = bson.M{
				"$regex":   vehicleBrand,
				"$options": "i",
			}
		}
		if vehicleModel != "" {
			compatibleFilter["compatibleCars.vehicle"] = bson.M{
				"$regex":   vehicleModel,
				"$options": "i",
			}
		}
		if yearRange != "" {
			compatibleFilter["compatibleCars.vehicle"] = bson.M{
				"$regex":   yearRange,
				"$options": "i",
			}
		}

		if len(compatibleFilter) > 0 {
			filter["$and"] = []bson.M{compatibleFilter}
		}
	}

	collection := db.Client.Database("Ecommerce").Collection("products")
	cursor, err := collection.Find(context.TODO(), filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer cursor.Close(context.TODO())

	var products []models.Product
	if err = cursor.All(context.TODO(), &products); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if products == nil {
		products = []models.Product{}
	}
	c.JSON(http.StatusOK, gin.H{
		"products": products,
		"total":    len(products),
		"filters": gin.H{
			"category":    category,
			"subcategory": subcategory,
		},
	})
}

// Fonction utilitaire pour parser les floats
func parseFloat(s string) float64 {
	if f, err := strconv.ParseFloat(s, 64); err == nil {
		return f
	}
	return 0
}

// GetProductByID returns a specific product by ID or slug
func GetProductByID(c *gin.Context) {
	id := c.Param("id")
	log.Printf("GetProductByID called with id: %s", id)

	collection := db.Client.Database("Ecommerce").Collection("products")
	var product models.Product

	// Essayer d'abord de chercher par ObjectId
	objectID, err := primitive.ObjectIDFromHex(id)
	if err == nil {
		log.Printf("Valid ObjectId, searching by _id: %s", objectID.Hex())
		// Si c'est un ObjectId valide, chercher par _id
		err = collection.FindOne(context.TODO(), bson.M{"_id": objectID}).Decode(&product)
		if err != nil {
			log.Printf("Product not found by ObjectId: %v", err)
			// Essayer de chercher par slug comme fallback
			err = collection.FindOne(context.TODO(), bson.M{"slug": id}).Decode(&product)
			if err != nil {
				log.Printf("Product not found by slug either: %v", err)
				// Essayer par code
				err = collection.FindOne(context.TODO(), bson.M{"code": id}).Decode(&product)
				if err != nil {
					log.Printf("Product not found by code either: %v", err)
					// Essayer par oe
					err = collection.FindOne(context.TODO(), bson.M{"oe": id}).Decode(&product)
					if err != nil {
						log.Printf("Product not found by oe either: %v", err)
						// Essayer par nom du produit (recherche insensible à la casse)
						err = collection.FindOne(context.TODO(), bson.M{"name": bson.M{"$regex": "^" + id + "$", "$options": "i"}}).Decode(&product)
						if err != nil {
							log.Printf("Product not found by name either: %v", err)
							c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
							return
						}
						log.Printf("Product found by name")
					} else {
						log.Printf("Product found by oe")
					}
				} else {
					log.Printf("Product found by code")
				}
			} else {
				log.Printf("Product found by slug")
			}
		} else {
			log.Printf("Product found by ObjectId")
		}
	} else {
		log.Printf("Invalid ObjectId, searching by slug: %s", id)
		// Si ce n'est pas un ObjectId, chercher par slug
		err = collection.FindOne(context.TODO(), bson.M{"slug": id}).Decode(&product)
		if err != nil {
			log.Printf("Product not found by slug: %v", err)
			// Si pas trouvé par slug, essayer par code (si le champ existe)
			err = collection.FindOne(context.TODO(), bson.M{"code": id}).Decode(&product)
			if err != nil {
				log.Printf("Product not found by code: %v", err)
				// Essayer par oe
				err = collection.FindOne(context.TODO(), bson.M{"oe": id}).Decode(&product)
				if err != nil {
					log.Printf("Product not found by oe: %v", err)
					// Essayer par nom du produit (recherche insensible à la casse)
					err = collection.FindOne(context.TODO(), bson.M{"name": bson.M{"$regex": "^" + id + "$", "$options": "i"}}).Decode(&product)
					if err != nil {
						log.Printf("Product not found by name either: %v", err)
						// Essayer une recherche partielle par nom
						err = collection.FindOne(context.TODO(), bson.M{"name": bson.M{"$regex": id, "$options": "i"}}).Decode(&product)
						if err != nil {
							log.Printf("Product not found by partial name either: %v", err)
							c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
							return
						}
						log.Printf("Product found by partial name")
					} else {
						log.Printf("Product found by name")
					}
				} else {
					log.Printf("Product found by oe")
				}
			} else {
				log.Printf("Product found by code")
			}
		} else {
			log.Printf("Product found by slug")
		}
	}

	log.Printf("Returning product: %s", product.Name)
	c.JSON(http.StatusOK, product)
}

// GetProductsByCategory returns products by category and subcategory
func GetProductsByCategory(c *gin.Context) {
	category := c.Param("category")
	subcategory := c.Param("subcategory")

	// Normaliser les paramètres : convertir les espaces en tirets et en minuscules
	normalizedCategory := strings.ReplaceAll(strings.ToLower(category), " ", "-")
	normalizedSubcategory := strings.ReplaceAll(strings.ToLower(subcategory), " ", "-")

	filter := bson.M{}
	if category != "" {
		filter["category_slug"] = normalizedCategory
	}
	if subcategory != "" {
		filter["subcategory_slug"] = normalizedSubcategory
	}

	collection := db.Client.Database("Ecommerce").Collection("products")
	cursor, err := collection.Find(context.TODO(), filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer cursor.Close(context.TODO())

	var products []models.Product
	if err = cursor.All(context.TODO(), &products); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, products)
}

// GetCompatibleVehicles returns compatible vehicles for a product
func GetCompatibleVehicles(c *gin.Context) {
	productID := c.Param("id")

	collection := db.Client.Database("Ecommerce").Collection("products")
	var product models.Product
	err := collection.FindOne(context.TODO(), bson.M{"_id": productID}).Decode(&product)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}

	c.JSON(http.StatusOK, product.CompatibleCars)
}

// GetProductOemNumbers returns OEM numbers for a product
func GetProductOemNumbers(c *gin.Context) {
	productID := c.Param("id")

	collection := db.Client.Database("Ecommerce").Collection("products")
	var product models.Product
	err := collection.FindOne(context.TODO(), bson.M{"_id": productID}).Decode(&product)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}

	c.JSON(http.StatusOK, product.Specifications.OemNumbers)
}

// GET /api/vehicle_brands
func GetVehicleBrandsCollectionHandler(c *gin.Context) {
	collection := db.Client.Database("Ecommerce").Collection("vehicle_brands")
	cursor, err := collection.Find(context.TODO(), bson.M{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer cursor.Close(context.TODO())

	var brands []bson.M
	if err = cursor.All(context.TODO(), &brands); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, brands)
}

// GET /api/vehicle_models/:brandId
func GetVehicleModelsByBrandHandler(c *gin.Context) {
	brandId := c.Param("brandId")
	if brandId == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Brand ID is required"})
		return
	}

	// Essayer d'abord de convertir en ObjectID
	var brandIdObj primitive.ObjectID
	var err error

	// Vérifier si c'est un ObjectID valide
	if len(brandId) == 24 {
		brandIdObj, err = primitive.ObjectIDFromHex(brandId)
		if err == nil {
			// C'est un ObjectID valide, chercher directement les modèles
			collection := db.Client.Database("Ecommerce").Collection("vehicle_models")
			filter := bson.M{"brandId": brandIdObj}
			cursor, err := collection.Find(context.TODO(), filter)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}
			defer cursor.Close(context.TODO())
			var models []bson.M
			if err = cursor.All(context.TODO(), &models); err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}
			c.JSON(http.StatusOK, models)
			return
		}
	}

	// Si ce n'est pas un ObjectID valide, traiter comme un slug
	// Normaliser le slug (minuscules et remplacer les espaces par des tirets)
	normalizedSlug := strings.ToLower(strings.ReplaceAll(brandId, " ", "-"))

	// D'abord, trouver la marque par son slug
	brandCollection := db.Client.Database("Ecommerce").Collection("vehicle_brands")
	var brand bson.M
	err = brandCollection.FindOne(context.TODO(), bson.M{"slug": normalizedSlug}).Decode(&brand)
	if err != nil {
		// Si pas trouvé par slug, essayer par nom (case insensitive)
		err = brandCollection.FindOne(context.TODO(), bson.M{"name": bson.M{"$regex": "^" + brandId + "$", "$options": "i"}}).Decode(&brand)
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Brand not found"})
			return
		}
	}

	// Récupérer l'ID de la marque
	brandIdFromBrand, ok := brand["_id"].(primitive.ObjectID)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid brand ID"})
		return
	}

	// Maintenant récupérer les modèles pour cette marque
	collection := db.Client.Database("Ecommerce").Collection("vehicle_models")
	filter := bson.M{"brandId": brandIdFromBrand}
	cursor, err := collection.Find(context.TODO(), filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer cursor.Close(context.TODO())
	var models []bson.M
	if err = cursor.All(context.TODO(), &models); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, models)
}

// GET /api/vehicle_variants/:modelId
func GetVehicleVariantsByModelHandler(c *gin.Context) {
	modelId := c.Param("modelId")
	if modelId == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Model ID is required"})
		return
	}

	// Essayer d'abord de convertir en ObjectID
	var modelIdObj primitive.ObjectID
	var err error

	// Vérifier si c'est un ObjectID valide
	if len(modelId) == 24 {
		modelIdObj, err = primitive.ObjectIDFromHex(modelId)
		if err == nil {
			// C'est un ObjectID valide, chercher directement les variants
			collection := db.Client.Database("Ecommerce").Collection("vehicle_variants")
			filter := bson.M{"modelId": modelIdObj}
			cursor, err := collection.Find(context.TODO(), filter)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}
			defer cursor.Close(context.TODO())
			var variants []bson.M
			if err = cursor.All(context.TODO(), &variants); err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}
			c.JSON(http.StatusOK, variants)
			return
		}
	}

	// Si ce n'est pas un ObjectID valide, traiter comme un slug
	// Normaliser le slug (minuscules et remplacer les espaces par des tirets)
	normalizedSlug := strings.ToLower(strings.ReplaceAll(modelId, " ", "-"))

	// D'abord, trouver le modèle par son slug
	modelCollection := db.Client.Database("Ecommerce").Collection("vehicle_models")
	var model bson.M
	err = modelCollection.FindOne(context.TODO(), bson.M{"slug": normalizedSlug}).Decode(&model)
	if err != nil {
		// Si pas trouvé par slug, essayer par nom (case insensitive)
		err = modelCollection.FindOne(context.TODO(), bson.M{"name": bson.M{"$regex": "^" + modelId + "$", "$options": "i"}}).Decode(&model)
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Model not found"})
			return
		}
	}

	// Récupérer l'ID du modèle
	modelIdFromModel, ok := model["_id"].(primitive.ObjectID)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid model ID"})
		return
	}

	// Maintenant récupérer les variants pour ce modèle
	collection := db.Client.Database("Ecommerce").Collection("vehicle_variants")
	filter := bson.M{"modelId": modelIdFromModel}
	cursor, err := collection.Find(context.TODO(), filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer cursor.Close(context.TODO())
	var variants []bson.M
	if err = cursor.All(context.TODO(), &variants); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, variants)
}

// GET /api/vehicle_engines/:variantId
func GetVehicleEnginesByVariantHandler(c *gin.Context) {
	variantId := c.Param("variantId")
	objID, err := primitive.ObjectIDFromHex(variantId)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid variantId"})
		return
	}
	collection := db.Client.Database("Ecommerce").Collection("vehicle_engines")
	filter := bson.M{"variantId": objID}
	cursor, err := collection.Find(context.TODO(), filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer cursor.Close(context.TODO())
	var engines []bson.M
	if err = cursor.All(context.TODO(), &engines); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, engines)
}

// SomeAdminHandler handles admin-specific operations
func SomeAdminHandler(c *gin.Context) {
	userID, _ := c.Get("user_id")
	var user auth.User
	err := db.Collection("Users").FindOne(c.Request.Context(), bson.M{"_id": userID}).Decode(&user)
	if err != nil || !user.IsAdmin {
		c.JSON(http.StatusForbidden, gin.H{"error": "Access denied"})
		return
	}
	// Admin logic here
}

// GET /api/categories
func GetAllCategories(c *gin.Context) {
	collection := db.Client.Database("Ecommerce").Collection("categories")

	// Récupérer les paramètres de pagination
	pageStr := c.DefaultQuery("page", "1")
	limitStr := c.DefaultQuery("limit", "50")

	page, err := strconv.Atoi(pageStr)
	if err != nil || page < 1 {
		page = 1
	}

	limit, err := strconv.Atoi(limitStr)
	if err != nil || limit < 1 || limit > 100 {
		limit = 50
	}

	skip := (page - 1) * limit

	// Ajouter un timeout context
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Debug: vérifier la connexion à la collection
	log.Printf("Attempting to count documents in collection 'categories'")

	// Compter le total de documents
	total, err := collection.CountDocuments(ctx, bson.M{})
	if err != nil {
		log.Printf("Error counting categories: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Failed to count categories",
			"details": err.Error(),
		})
		return
	}

	log.Printf("Found %d total categories in database", total)

	// Récupérer les documents avec pagination
	opts := options.Find().SetLimit(int64(limit)).SetSkip(int64(skip))
	cursor, err := collection.Find(ctx, bson.M{}, opts)
	if err != nil {
		log.Printf("Error finding categories: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Failed to retrieve categories",
			"details": err.Error(),
		})
		return
	}
	defer cursor.Close(ctx)

	// Utiliser Category (nouvelle structure)
	var categories []models.Category
	if err = cursor.All(ctx, &categories); err != nil {
		log.Printf("Error decoding categories: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Failed to decode categories",
			"details": err.Error(),
		})
		return
	}

	log.Printf("Successfully retrieved %d categories (page %d, limit %d)", len(categories), page, limit)
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    categories,
		"pagination": gin.H{
			"page":    page,
			"limit":   limit,
			"total":   total,
			"pages":   int(math.Ceil(float64(total) / float64(limit))),
			"hasNext": page*limit < int(total),
			"hasPrev": page > 1,
		},
		"count": len(categories),
	})
}

// GET /api/categories/:categoryId/subcategories
func GetSubcategoriesByCategory(c *gin.Context) {
	categoryId := c.Param("categoryId")
	if categoryId == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "Category ID is required",
		})
		return
	}

	// Normaliser l'ID de catégorie
	normalizedCategoryId := strings.ReplaceAll(strings.ToLower(categoryId), " ", "-")

	// Ajouter un timeout context
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	catCollection := db.Client.Database("Ecommerce").Collection("categories")
	var cat models.Category

	// Essayer de trouver la catégorie par différents champs
	err := catCollection.FindOne(ctx, bson.M{"slug": normalizedCategoryId}).Decode(&cat)
	if err != nil {
		log.Printf("Category not found by slug '%s', trying by name...", normalizedCategoryId)
		// Essayer de trouver par nom (case insensitive)
		err = catCollection.FindOne(ctx, bson.M{"name": bson.M{"$regex": "^" + categoryId + "$", "$options": "i"}}).Decode(&cat)
		if err != nil {
			log.Printf("Category not found by name '%s'", categoryId)
			c.JSON(http.StatusNotFound, gin.H{
				"success":       false,
				"error":         "Category not found",
				"searched_id":   categoryId,
				"normalized_id": normalizedCategoryId,
			})
			return
		}
	}

	log.Printf("Found category: %s (ID: %s, Slug: %s)", cat.Name, cat.ID.Hex(), cat.Slug)

	// Récupérer les sous-catégories de la collection subcategories
	subcatCollection := db.Client.Database("Ecommerce").Collection("subcategories")

	// D'abord, compter tous les documents dans la collection subcategories
	totalSubcategories, err := subcatCollection.CountDocuments(ctx, bson.M{})
	if err != nil {
		log.Printf("Error counting subcategories: %v", err)
	} else {
		log.Printf("Total subcategories in database: %d", totalSubcategories)
	}

	// Chercher les sous-catégories liées à cette catégorie par categoryId
	filter := bson.M{"categoryId": cat.ID}
	log.Printf("Searching subcategories with categoryId: %s", cat.ID.Hex())

	cursor, err := subcatCollection.Find(ctx, filter)
	if err != nil {
		log.Printf("Error finding subcategories for category %s: %v", cat.Name, err)
		// Fallback vers les sous-catégories générées
		subcategories := generateSubcategoriesForCategory(cat.Slug)
		c.JSON(http.StatusOK, gin.H{
			"success": true,
			"data":    subcategories,
			"category": gin.H{
				"id":   cat.ID.Hex(),
				"name": cat.Name,
				"slug": cat.Slug,
			},
			"count": len(subcategories),
		})
		return
	}
	defer cursor.Close(ctx)

	var subcategories []models.Subcategory
	if err = cursor.All(ctx, &subcategories); err != nil {
		log.Printf("Error decoding subcategories: %v", err)
		// Fallback vers les sous-catégories générées
		generatedSubcategories := generateSubcategoriesForCategory(cat.Slug)
		c.JSON(http.StatusOK, gin.H{
			"success": true,
			"data":    generatedSubcategories,
			"category": gin.H{
				"id":   cat.ID.Hex(),
				"name": cat.Name,
				"slug": cat.Slug,
			},
			"count": len(generatedSubcategories),
		})
		return
	}

	log.Printf("Found category '%s' with %d subcategories from database", cat.Name, len(subcategories))
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    subcategories,
		"category": gin.H{
			"id":   cat.ID.Hex(),
			"name": cat.Name,
			"slug": cat.Slug,
		},
		"count": len(subcategories),
	})
}

// Fonction helper pour générer des sous-catégories basées sur la catégorie
func generateSubcategoriesForCategory(categorySlug string) []models.SubCategory {
	switch categorySlug {
	case "filters":
		return []models.SubCategory{
			{ID: "oil-filter", Name: "Oil Filter", Parts: []models.Part{{ID: "oil-filter-001", Name: "Engine Oil Filter"}}},
			{ID: "air-filter", Name: "Air Filter", Parts: []models.Part{{ID: "air-filter-001", Name: "Engine Air Filter"}}},
			{ID: "fuel-filter", Name: "Fuel Filter", Parts: []models.Part{{ID: "fuel-filter-001", Name: "Fuel System Filter"}}},
		}
	case "clutch":
		return []models.SubCategory{
			{ID: "clutch-kit", Name: "Clutch Kit", Parts: []models.Part{{ID: "clutch-kit-001", Name: "Complete Clutch Kit"}}},
			{ID: "flywheel", Name: "Flywheel", Parts: []models.Part{{ID: "flywheel-001", Name: "Dual Mass Flywheel"}}},
		}
	case "brakes":
		return []models.SubCategory{
			{ID: "brake-pads", Name: "Brake Pads", Parts: []models.Part{{ID: "brake-pads-001", Name: "Front Brake Pads"}}},
			{ID: "brake-discs", Name: "Brake Discs", Parts: []models.Part{{ID: "brake-discs-001", Name: "Front Brake Discs"}}},
		}
	default:
		return []models.SubCategory{
			{ID: "general", Name: "General Parts", Parts: []models.Part{{ID: "general-001", Name: "Miscellaneous Part"}}},
		}
	}
}

// Fonctions utilitaires pour la validation et normalisation
func normalizeSlug(slug string) string {
	return strings.ReplaceAll(strings.ToLower(slug), " ", "-")
}

func createErrorResponse(status int, message string, details ...string) gin.H {
	response := gin.H{
		"success": false,
		"error":   message,
	}
	if len(details) > 0 {
		response["details"] = details[0]
	}
	return response
}

func createSuccessResponse(data interface{}, count int) gin.H {
	return gin.H{
		"success": true,
		"data":    data,
		"count":   count,
	}
}

// Cart handlers
func AddToCartHandler(c *gin.Context) {
	var cartItem models.CartItem
	if err := c.ShouldBindJSON(&cartItem); err != nil {
		c.JSON(http.StatusBadRequest, createErrorResponse(http.StatusBadRequest, "Invalid cart item data", err.Error()))
		return
	}

	// Validate cart item
	if cartItem.ProductID == "" || cartItem.Quantity <= 0 {
		c.JSON(http.StatusBadRequest, createErrorResponse(http.StatusBadRequest, "Product ID and quantity are required"))
		return
	}

	// Get user ID from context (assuming authentication middleware sets it)
	userID := c.GetString("user_id")
	if userID == "" { // For guest users
		userID = "anonymous"
	}

	collection := db.Client.Database("Ecommerce").Collection("cart")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Check if item already exists in cart
	filter := bson.M{"user_id": userID, "product_id": cartItem.ProductID}
	var existingItem models.CartItem
	err := collection.FindOne(ctx, filter).Decode(&existingItem)

	if err == nil {
		// Update quantity
		update := bson.M{"$set": bson.M{"quantity": existingItem.Quantity + cartItem.Quantity}}
		_, err = collection.UpdateOne(ctx, filter, update)
	} else { // Insert new item
		cartItem.UserID = userID
		cartItem.CreatedAt = time.Now()
		cartItem.UpdatedAt = time.Now()
		_, err = collection.InsertOne(ctx, cartItem)
	}

	if err != nil {
		log.Printf("Error adding to cart: %v", err)
		c.JSON(http.StatusInternalServerError, createErrorResponse(http.StatusInternalServerError, "Failed to add item to cart", err.Error()))
		return
	}

	c.JSON(http.StatusOK, createSuccessResponse(gin.H{"message": "Item added to cart"}, 1))
}

func GetCartHandler(c *gin.Context) {
	userID := c.GetString("user_id")
	if userID == "" {
		c.JSON(http.StatusBadRequest, createErrorResponse(http.StatusBadRequest, "User ID is required"))
		return
	}

	collection := db.Client.Database("Ecommerce").Collection("cart")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	cursor, err := collection.Find(ctx, bson.M{"user_id": userID})
	if err != nil {
		log.Printf("Error getting cart: %v", err)
		c.JSON(http.StatusInternalServerError, createErrorResponse(http.StatusInternalServerError, "Failed to get cart", err.Error()))
		return
	}
	defer cursor.Close(ctx)

	var cartItems []models.CartItem
	if err = cursor.All(ctx, &cartItems); err != nil {
		log.Printf("Error decoding cart items: %v", err)
		c.JSON(http.StatusInternalServerError, createErrorResponse(http.StatusInternalServerError, "Failed to decode cart items", err.Error()))
		return
	}

	// Calculate totals
	var total float64
	var itemCount int
	for _, item := range cartItems {
		total += item.Price * float64(item.Quantity)
		itemCount += item.Quantity
	}

	c.JSON(http.StatusOK, createSuccessResponse(gin.H{
		"items":      cartItems,
		"total":      total,
		"item_count": itemCount,
	}, len(cartItems)))
}

func UpdateCartItemHandler(c *gin.Context) {
	itemID := c.Param("id")
	if itemID == "" {
		c.JSON(http.StatusBadRequest, createErrorResponse(http.StatusBadRequest, "Item ID is required"))
		return
	}

	var updateData struct {
		Quantity int `json:"quantity"`
	}
	if err := c.ShouldBindJSON(&updateData); err != nil {
		c.JSON(http.StatusBadRequest, createErrorResponse(http.StatusBadRequest, "Invalid update data", err.Error()))
		return
	}

	if updateData.Quantity <= 0 {
		c.JSON(http.StatusBadRequest, createErrorResponse(http.StatusBadRequest, "Quantity must be greater than 0"))
		return
	}

	userID := c.GetString("user_id")
	if userID == "" {
		c.JSON(http.StatusBadRequest, createErrorResponse(http.StatusBadRequest, "User ID is required"))
		return
	}

	collection := db.Client.Database("Ecommerce").Collection("cart")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	objectID, err := primitive.ObjectIDFromHex(itemID)
	if err != nil {
		c.JSON(http.StatusBadRequest, createErrorResponse(http.StatusBadRequest, "Invalid item ID format"))
		return
	}

	filter := bson.M{"_id": objectID, "user_id": userID}
	update := bson.M{"$set": bson.M{
		"quantity":   updateData.Quantity,
		"updated_at": time.Now(),
	}}

	result, err := collection.UpdateOne(ctx, filter, update)
	if err != nil {
		log.Printf("Error updating cart item: %v", err)
		c.JSON(http.StatusInternalServerError, createErrorResponse(http.StatusInternalServerError, "Failed to update cart item", err.Error()))
		return
	}

	if result.MatchedCount == 0 {
		c.JSON(http.StatusNotFound, createErrorResponse(http.StatusNotFound, "Cart item not found"))
		return
	}

	c.JSON(http.StatusOK, createSuccessResponse(gin.H{"message": "Cart item updated"}, 1))
}

func RemoveFromCartHandler(c *gin.Context) {
	itemID := c.Param("id")
	if itemID == "" {
		c.JSON(http.StatusBadRequest, createErrorResponse(http.StatusBadRequest, "Item ID is required"))
		return
	}

	userID := c.GetString("user_id")
	if userID == "" {
		c.JSON(http.StatusBadRequest, createErrorResponse(http.StatusBadRequest, "User ID is required"))
		return
	}

	collection := db.Client.Database("Ecommerce").Collection("cart")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	objectID, err := primitive.ObjectIDFromHex(itemID)
	if err != nil {
		c.JSON(http.StatusBadRequest, createErrorResponse(http.StatusBadRequest, "Invalid item ID format"))
		return
	}

	filter := bson.M{"_id": objectID, "user_id": userID}
	result, err := collection.DeleteOne(ctx, filter)
	if err != nil {
		log.Printf("Error removing cart item: %v", err)
		c.JSON(http.StatusInternalServerError, createErrorResponse(http.StatusInternalServerError, "Failed to remove cart item", err.Error()))
		return
	}

	if result.DeletedCount == 0 {
		c.JSON(http.StatusNotFound, createErrorResponse(http.StatusNotFound, "Cart item not found"))
		return
	}

	c.JSON(http.StatusOK, createSuccessResponse(gin.H{"message": "Item removed from cart"}, 1))
}

// Order handlers
func CreateOrderHandler(c *gin.Context) {
	var order models.Order
	if err := c.ShouldBindJSON(&order); err != nil {
		c.JSON(http.StatusBadRequest, createErrorResponse(http.StatusBadRequest, "Invalid order data", err.Error()))
		return
	}

	// Validate order
	if len(order.Items) == 0 {
		c.JSON(http.StatusBadRequest, createErrorResponse(http.StatusBadRequest, "Order must contain at least one item"))
		return
	}

	userID := c.GetString("user_id")
	if userID == "" {
		c.JSON(http.StatusBadRequest, createErrorResponse(http.StatusBadRequest, "User ID is required"))
		return
	}

	order.UserID = userID
	order.Status = "pending"
	order.CreatedAt = time.Now()
	order.UpdatedAt = time.Now()

	// Calculate totals
	var subtotal float64
	for i := range order.Items {
		subtotal += order.Items[i].Price * float64(order.Items[i].Quantity)
	}
	order.Subtotal = subtotal
	order.Total = subtotal + order.ShippingCost + order.Tax

	collection := db.Client.Database("Ecommerce").Collection("orders")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	result, err := collection.InsertOne(ctx, order)
	if err != nil {
		log.Printf("Error creating order: %v", err)
		c.JSON(http.StatusInternalServerError, createErrorResponse(http.StatusInternalServerError, "Failed to create order", err.Error()))
		return
	}

	order.ID = result.InsertedID.(primitive.ObjectID)

	c.JSON(http.StatusCreated, createSuccessResponse(order, 1))
}

func GetOrdersHandler(c *gin.Context) {
	userID := c.GetString("user_id")
	if userID == "" {
		c.JSON(http.StatusBadRequest, createErrorResponse(http.StatusBadRequest, "User ID is required"))
		return
	}

	collection := db.Client.Database("Ecommerce").Collection("orders")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	cursor, err := collection.Find(ctx, bson.M{"user_id": userID})
	if err != nil {
		log.Printf("Error getting orders: %v", err)
		c.JSON(http.StatusInternalServerError, createErrorResponse(http.StatusInternalServerError, "Failed to get orders", err.Error()))
		return
	}
	defer cursor.Close(ctx)

	var orders []models.Order
	if err = cursor.All(ctx, &orders); err != nil {
		log.Printf("Error decoding orders: %v", err)
		c.JSON(http.StatusInternalServerError, createErrorResponse(http.StatusInternalServerError, "Failed to decode orders", err.Error()))
		return
	}

	c.JSON(http.StatusOK, createSuccessResponse(orders, len(orders)))
}

func GetOrderHandler(c *gin.Context) {
	orderID := c.Param("id")
	if orderID == "" {
		c.JSON(http.StatusBadRequest, createErrorResponse(http.StatusBadRequest, "Order ID is required"))
		return
	}

	userID := c.GetString("user_id")
	if userID == "" {
		c.JSON(http.StatusBadRequest, createErrorResponse(http.StatusBadRequest, "User ID is required"))
		return
	}

	collection := db.Client.Database("Ecommerce").Collection("orders")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	objectID, err := primitive.ObjectIDFromHex(orderID)
	if err != nil {
		c.JSON(http.StatusBadRequest, createErrorResponse(http.StatusBadRequest, "Invalid order ID format"))
		return
	}

	var order models.Order
	filter := bson.M{"_id": objectID, "user_id": userID}
	err = collection.FindOne(ctx, filter).Decode(&order)
	if err != nil {
		if err.Error() == "mongo: no documents in result" {
			c.JSON(http.StatusNotFound, createErrorResponse(http.StatusNotFound, "Order not found"))
		} else {
			log.Printf("Error getting order: %v", err)
			c.JSON(http.StatusInternalServerError, createErrorResponse(http.StatusInternalServerError, "Failed to get order", err.Error()))
		}
		return
	}

	c.JSON(http.StatusOK, createSuccessResponse(order, 1))
}

// Favorites handlers
func AddToFavoritesHandler(c *gin.Context) {
	var favorite models.Favorite
	if err := c.ShouldBindJSON(&favorite); err != nil {
		c.JSON(http.StatusBadRequest, createErrorResponse(http.StatusBadRequest, "Invalid favorite data", err.Error()))
		return
	}

	if favorite.ProductID == "" {
		c.JSON(http.StatusBadRequest, createErrorResponse(http.StatusBadRequest, "Product ID is required"))
		return
	}

	userID := c.GetString("user_id")
	if userID == "" {
		c.JSON(http.StatusBadRequest, createErrorResponse(http.StatusBadRequest, "User ID is required"))
		return
	}

	favorite.UserID = userID
	favorite.CreatedAt = time.Now()

	collection := db.Client.Database("Ecommerce").Collection("favorites")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Check if already in favorites
	filter := bson.M{"user_id": userID, "product_id": favorite.ProductID}
	var existing models.Favorite
	err := collection.FindOne(ctx, filter).Decode(&existing)
	if err == nil {
		c.JSON(http.StatusConflict, createErrorResponse(http.StatusConflict, "Product already in favorites"))
		return
	}

	_, err = collection.InsertOne(ctx, favorite)
	if err != nil {
		log.Printf("Error adding to favorites: %v", err)
		c.JSON(http.StatusInternalServerError, createErrorResponse(http.StatusInternalServerError, "Failed to add to favorites", err.Error()))
		return
	}

	c.JSON(http.StatusOK, createSuccessResponse(gin.H{"message": "Added to favorites"}, 1))
}

func GetFavoritesHandler(c *gin.Context) {
	userID := c.GetString("user_id")
	if userID == "" {
		c.JSON(http.StatusBadRequest, createErrorResponse(http.StatusBadRequest, "User ID is required"))
		return
	}

	collection := db.Client.Database("Ecommerce").Collection("favorites")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	cursor, err := collection.Find(ctx, bson.M{"user_id": userID})
	if err != nil {
		log.Printf("Error getting favorites: %v", err)
		c.JSON(http.StatusInternalServerError, createErrorResponse(http.StatusInternalServerError, "Failed to get favorites", err.Error()))
		return
	}
	defer cursor.Close(ctx)

	var favorites []models.Favorite
	if err = cursor.All(ctx, &favorites); err != nil {
		log.Printf("Error decoding favorites: %v", err)
		c.JSON(http.StatusInternalServerError, createErrorResponse(http.StatusInternalServerError, "Failed to decode favorites", err.Error()))
		return
	}

	c.JSON(http.StatusOK, createSuccessResponse(favorites, len(favorites)))
}

func RemoveFromFavoritesHandler(c *gin.Context) {
	productID := c.Param("id")
	if productID == "" {
		c.JSON(http.StatusBadRequest, createErrorResponse(http.StatusBadRequest, "Product ID is required"))
		return
	}

	userID := c.GetString("user_id")
	if userID == "" {
		c.JSON(http.StatusBadRequest, createErrorResponse(http.StatusBadRequest, "User ID is required"))
		return
	}

	collection := db.Client.Database("Ecommerce").Collection("favorites")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	filter := bson.M{"user_id": userID, "product_id": productID}
	result, err := collection.DeleteOne(ctx, filter)
	if err != nil {
		log.Printf("Error removing from favorites: %v", err)
		c.JSON(http.StatusInternalServerError, createErrorResponse(http.StatusInternalServerError, "Failed to remove from favorites", err.Error()))
		return
	}

	if result.DeletedCount == 0 {
		c.JSON(http.StatusNotFound, createErrorResponse(http.StatusNotFound, "Favorite not found"))
		return
	}

	c.JSON(http.StatusOK, createSuccessResponse(gin.H{"message": "Removed from favorites"}, 1))
}

// Advanced search handler
func AdvancedSearchHandler(c *gin.Context) {
	var searchParams struct {
		Query      string   `json:"query"`
		Categories []string `json:"categories"`
		Brands     []string `json:"brands"`
		PriceMin   float64  `json:"price_min"`
		PriceMax   float64  `json:"price_max"`
		InStock    *bool    `json:"in_stock"`
		SortBy     string   `json:"sort_by"`
		SortOrder  string   `json:"sort_order"`
		Page       int      `json:"page"`
		Limit      int      `json:"limit"`
	}

	if err := c.ShouldBindJSON(&searchParams); err != nil {
		c.JSON(http.StatusBadRequest, createErrorResponse(http.StatusBadRequest, "Invalid search parameters", err.Error()))
		return
	}

	// Set defaults
	if searchParams.Page <= 0 {
		searchParams.Page = 1
	}
	if searchParams.Limit <= 0 {
		searchParams.Limit = 20
	}
	if searchParams.SortBy == "" {
		searchParams.SortBy = "name"
	}
	if searchParams.SortOrder == "" {
		searchParams.SortOrder = "asc"
	}

	collection := db.Client.Database("Ecommerce").Collection("products")
	ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
	defer cancel()

	// Build filter
	filter := bson.M{}

	if searchParams.Query != "" {
		filter["$or"] = []bson.M{
			{"name": bson.M{"$regex": searchParams.Query, "$options": "i"}},
			{"description": bson.M{"$regex": searchParams.Query, "$options": "i"}},
			{"oem_numbers": bson.M{"$regex": searchParams.Query, "$options": "i"}},
		}
	}

	if len(searchParams.Categories) > 0 {
		filter["category_slug"] = bson.M{"$in": searchParams.Categories}
	}

	if len(searchParams.Brands) > 0 {
		filter["brand"] = bson.M{"$in": searchParams.Brands}
	}

	if searchParams.PriceMin > 0 || searchParams.PriceMax > 0 {
		priceFilter := bson.M{}
		if searchParams.PriceMin > 0 {
			priceFilter["$gte"] = searchParams.PriceMin
		}
		if searchParams.PriceMax > 0 {
			priceFilter["$lte"] = searchParams.PriceMax
		}
		filter["price"] = priceFilter
	}

	if searchParams.InStock != nil {
		filter["availability"] = *searchParams.InStock
	}

	// Build sort
	sortOrder := 1
	if searchParams.SortOrder == "desc" {
		sortOrder = -1
	}
	sort := bson.M{searchParams.SortBy: sortOrder}

	// Pagination
	skip := (searchParams.Page - 1) * searchParams.Limit
	options := options.Find().SetSort(sort).SetSkip(int64(skip)).SetLimit(int64(searchParams.Limit))

	cursor, err := collection.Find(ctx, filter, options)
	if err != nil {
		log.Printf("Error in advanced search: %v", err)
		c.JSON(http.StatusInternalServerError, createErrorResponse(http.StatusInternalServerError, "Failed to search products", err.Error()))
		return
	}
	defer cursor.Close(ctx)

	var products []models.Product
	if err = cursor.All(ctx, &products); err != nil {
		log.Printf("Error decoding search results: %v", err)
		c.JSON(http.StatusInternalServerError, createErrorResponse(http.StatusInternalServerError, "Failed to decode search results", err.Error()))
		return
	}

	// Get total count
	total, err := collection.CountDocuments(ctx, filter)
	if err != nil {
		log.Printf("Error counting search results: %v", err)
	}

	c.JSON(http.StatusOK, createSuccessResponse(gin.H{
		"products": products,
		"pagination": gin.H{
			"page":        searchParams.Page,
			"limit":       searchParams.Limit,
			"total":       total,
			"total_pages": int(math.Ceil(float64(total) / float64(searchParams.Limit))),
		},
	}, len(products)))
}

// SearchSuggestionsHandler returns search suggestions
func SearchSuggestionsHandler(c *gin.Context) {
	query := c.Query("q")
	limit := c.Query("limit")

	if query == "" {
		c.JSON(http.StatusOK, []interface{}{})
		return
	}

	limitInt := 10
	if limit != "" {
		if l, err := strconv.Atoi(limit); err == nil {
			limitInt = l
		}
	}

	collection := db.Client.Database("Ecommerce").Collection("products")

	// Recherche dans les noms de produits, descriptions et numéros OEM
	filter := bson.M{
		"$or": []bson.M{
			{"name": bson.M{"$regex": query, "$options": "i"}},
			{"description": bson.M{"$regex": query, "$options": "i"}},
			{"sku": bson.M{"$regex": query, "$options": "i"}},
			{"brand": bson.M{"$regex": query, "$options": "i"}},
		},
	}

	options := options.Find().SetLimit(int64(limitInt))
	cursor, err := collection.Find(context.TODO(), filter, options)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer cursor.Close(context.TODO())

	var products []models.Product
	if err = cursor.All(context.TODO(), &products); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Créer des suggestions basées sur les résultats
	suggestions := []map[string]interface{}{}
	for _, product := range products {
		suggestions = append(suggestions, map[string]interface{}{
			"text":  product.Name,
			"type":  "product",
			"count": 1,
		})
	}

	c.JSON(http.StatusOK, suggestions)
}

// QuickSearchHandler returns quick search results
func QuickSearchHandler(c *gin.Context) {
	query := c.Query("q")
	limit := c.Query("limit")

	if query == "" {
		c.JSON(http.StatusOK, []interface{}{})
		return
	}

	limitInt := 5
	if limit != "" {
		if l, err := strconv.Atoi(limit); err == nil {
			limitInt = l
		}
	}

	collection := db.Client.Database("Ecommerce").Collection("products")

	// Recherche rapide avec moins de champs
	filter := bson.M{
		"$or": []bson.M{
			{"name": bson.M{"$regex": query, "$options": "i"}},
			{"sku": bson.M{"$regex": query, "$options": "i"}},
			{"brand": bson.M{"$regex": query, "$options": "i"}},
		},
	}

	options := options.Find().SetLimit(int64(limitInt))
	cursor, err := collection.Find(context.TODO(), filter, options)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer cursor.Close(context.TODO())

	var products []models.Product
	if err = cursor.All(context.TODO(), &products); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Retourner des résultats simplifiés pour la recherche rapide
	results := []map[string]interface{}{}
	for _, product := range products {
		results = append(results, map[string]interface{}{
			"id":    product.ID,
			"name":  product.Name,
			"brand": product.Brand,
			"sku":   product.SKU,
			"price": product.Price,
		})
	}

	c.JSON(http.StatusOK, results)
}

// GeneralSearchHandler handles general search requests
func GeneralSearchHandler(c *gin.Context) {
	// Récupérer tous les paramètres de recherche
	query := c.Query("q")
	category := c.Query("category")
	subcategory := c.Query("subcategory")
	brand := c.Query("brand")
	minPrice := c.Query("minPrice")
	maxPrice := c.Query("maxPrice")
	inStock := c.Query("inStock")
	vehicleBrand := c.Query("vehicleBrand")
	vehicleModel := c.Query("vehicleModel")
	year := c.Query("year")
	sortBy := c.Query("sortBy")
	sortOrder := c.Query("sortOrder")
	page := c.Query("page")
	limit := c.Query("limit")

	// Paramètres de pagination
	pageInt := 1
	limitInt := 20
	if page != "" {
		if p, err := strconv.Atoi(page); err == nil {
			pageInt = p
		}
	}
	if limit != "" {
		if l, err := strconv.Atoi(limit); err == nil {
			limitInt = l
		}
	}

	// Construire le filtre
	filter := bson.M{}

	// Recherche textuelle
	if query != "" {
		filter["$or"] = []bson.M{
			{"name": bson.M{"$regex": query, "$options": "i"}},
			{"description": bson.M{"$regex": query, "$options": "i"}},
			{"sku": bson.M{"$regex": query, "$options": "i"}},
			{"brand": bson.M{"$regex": query, "$options": "i"}},
		}
	}

	// Filtres de catégorie
	if category != "" {
		filter["category_slug"] = strings.ToLower(strings.ReplaceAll(category, " ", "-"))
	}
	if subcategory != "" {
		filter["subcategory_slug"] = strings.ToLower(strings.ReplaceAll(subcategory, " ", "-"))
	}

	// Filtre de marque
	if brand != "" {
		filter["brand"] = bson.M{"$regex": brand, "$options": "i"}
	}

	// Filtre de prix
	if minPrice != "" || maxPrice != "" {
		priceFilter := bson.M{}
		if minPrice != "" {
			if min, err := strconv.ParseFloat(minPrice, 64); err == nil {
				priceFilter["$gte"] = min
			}
		}
		if maxPrice != "" {
			if max, err := strconv.ParseFloat(maxPrice, 64); err == nil {
				priceFilter["$lte"] = max
			}
		}
		filter["price"] = priceFilter
	}

	// Filtre de stock
	if inStock != "" {
		if inStock == "true" {
			filter["inStock"] = true
		} else if inStock == "false" {
			filter["inStock"] = false
		}
	}

	// Filtres de véhicule
	if vehicleBrand != "" || vehicleModel != "" || year != "" {
		compatibleFilter := bson.M{}
		if vehicleBrand != "" {
			compatibleFilter["compatibleCars.vehicle"] = bson.M{
				"$regex":   vehicleBrand,
				"$options": "i",
			}
		}
		if vehicleModel != "" {
			compatibleFilter["compatibleCars.vehicle"] = bson.M{
				"$regex":   vehicleModel,
				"$options": "i",
			}
		}
		if year != "" {
			compatibleFilter["compatibleCars.vehicle"] = bson.M{
				"$regex":   year,
				"$options": "i",
			}
		}
		filter["$and"] = []bson.M{compatibleFilter}
	}

	collection := db.Client.Database("Ecommerce").Collection("products")

	// Options de tri
	findOptions := options.Find()
	if sortBy != "" {
		sortDirection := 1
		if sortOrder == "desc" {
			sortDirection = -1
		}
		findOptions.SetSort(bson.D{{Key: sortBy, Value: sortDirection}})
	}

	// Pagination
	findOptions.SetSkip(int64((pageInt - 1) * limitInt))
	findOptions.SetLimit(int64(limitInt))

	// Compter le total
	total, err := collection.CountDocuments(context.TODO(), filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Exécuter la recherche
	cursor, err := collection.Find(context.TODO(), filter, findOptions)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer cursor.Close(context.TODO())

	var products []models.Product
	if err = cursor.All(context.TODO(), &products); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Calculer le nombre total de pages
	totalPages := int(math.Ceil(float64(total) / float64(limitInt)))

	// Construire la réponse
	response := map[string]interface{}{
		"products":   products,
		"total":      total,
		"page":       pageInt,
		"totalPages": totalPages,
		"filters": map[string]interface{}{
			"query":        query,
			"category":     category,
			"subcategory":  subcategory,
			"brand":        brand,
			"minPrice":     minPrice,
			"maxPrice":     maxPrice,
			"inStock":      inStock,
			"vehicleBrand": vehicleBrand,
			"vehicleModel": vehicleModel,
			"year":         year,
			"sortBy":       sortBy,
			"sortOrder":    sortOrder,
		},
		"suggestions": []string{}, // À implémenter si nécessaire
	}

	c.JSON(http.StatusOK, response)
}

// UnifiedSearchHandler - Recherche unifiée intelligente OEM/Code/Mot-clé
func UnifiedSearchHandler(c *gin.Context) {
	query := c.Query("q")
	if query == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Query parameter 'q' is required"})
		return
	}

	// Paramètres optionnels
	page := c.DefaultQuery("page", "1")
	limit := c.DefaultQuery("limit", "20")
	sortBy := c.DefaultQuery("sortBy", "relevance")
	sortOrder := c.DefaultQuery("sortOrder", "asc")

	pageInt, _ := strconv.Atoi(page)
	limitInt, _ := strconv.Atoi(limit)

	// Analyser le type de recherche
	searchType := detectSearchType(query)
	
	collection := db.Client.Database("Ecommerce").Collection("products")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var filter bson.M
	var results []models.Product
	var total int64

	// Construire les filtres selon le type de recherche détecté
	switch searchType {
	case "oem":
		// Recherche par numéro OEM
		filter = buildOEMFilter(query)
	case "product_code":
		// Recherche par code produit
		filter = buildProductCodeFilter(query)
	case "keyword":
		// Recherche par mot-clé
		filter = buildKeywordFilter(query)
	case "mixed":
		// Recherche mixte - essayer tous les types
		filter = buildMixedFilter(query)
	default:
		// Fallback sur recherche générale
		filter = buildGeneralFilter(query)
	}

	// Ajouter d'autres filtres si présents
	category := c.Query("category")
	subcategory := c.Query("subcategory")
	brand := c.Query("brand")
	minPrice := c.Query("minPrice")
	maxPrice := c.Query("maxPrice")
	inStock := c.Query("inStock")
	vehicleBrand := c.Query("vehicleBrand")
	vehicleModel := c.Query("vehicleModel")

	filter = addAdditionalFilters(filter, category, subcategory, brand, minPrice, maxPrice, inStock, vehicleBrand, vehicleModel)

	// Options de tri
	findOptions := options.Find()
	if sortBy == "relevance" {
		// Tri par pertinence selon le type de recherche
		findOptions.SetSort(getRelevanceSort(searchType))
	} else {
		sortDirection := 1
		if sortOrder == "desc" {
			sortDirection = -1
		}
		findOptions.SetSort(bson.D{{Key: sortBy, Value: sortDirection}})
	}

	// Pagination
	findOptions.SetSkip(int64((pageInt - 1) * limitInt))
	findOptions.SetLimit(int64(limitInt))

	// Exécuter la recherche
	cursor, err := collection.Find(ctx, filter, findOptions)
	if err != nil {
		log.Printf("Error executing unified search: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Search failed"})
		return
	}
	defer cursor.Close(ctx)

	if err = cursor.All(ctx, &results); err != nil {
		log.Printf("Error decoding search results: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode results"})
		return
	}

	// Compter le total
	total, err = collection.CountDocuments(ctx, filter)
	if err != nil {
		log.Printf("Error counting search results: %v", err)
		total = int64(len(results))
	}

	// Générer des suggestions intelligentes
	suggestions := generateIntelligentSuggestions(query, searchType, results)

	// Calculer le nombre de pages
	totalPages := int(math.Ceil(float64(total) / float64(limitInt)))

	// Construire la réponse
	response := map[string]interface{}{
		"products":     results,
		"total":        total,
		"page":         pageInt,
		"totalPages":   totalPages,
		"searchType":   searchType,
		"query":        query,
		"suggestions":  suggestions,
		"filters": map[string]interface{}{
			"category":     category,
			"subcategory":  subcategory,
			"brand":        brand,
			"minPrice":     minPrice,
			"maxPrice":     maxPrice,
			"inStock":      inStock,
			"vehicleBrand": vehicleBrand,
			"vehicleModel": vehicleModel,
			"sortBy":       sortBy,
			"sortOrder":    sortOrder,
		},
	}

	log.Printf("Unified search completed: query='%s', type='%s', found=%d results", query, searchType, len(results))
	c.JSON(http.StatusOK, response)
}

// detectSearchType - Détecter intelligemment le type de recherche
func detectSearchType(query string) string {
	query = strings.TrimSpace(query)
	
	// Patterns pour OEM (numéros typiques)
	oemPatterns := []string{
		`^\d{10,}$`,                    // Numéros longs (10+ chiffres)
		`^[A-Z0-9]{8,}$`,              // Codes alphanumériques longs
		`^\d+[A-Z]+\d+$`,              // Pattern mixte chiffres-lettres-chiffres
		`^[A-Z]+\d+[A-Z]*\d*$`,       // Pattern lettres-chiffres
		`^\d+\.\d+\.\d+$`,             // Pattern avec points
		`^\d+-\d+-\d+$`,               // Pattern avec tirets
	}

	// Patterns pour codes produits
	productCodePatterns := []string{
		`^[A-Z]{2,4}-?\d{3,6}$`,       // Codes courts avec lettres et chiffres
		`^[A-Z]{1,3}\d{4,8}$`,         // Codes simples
		`^\d{4,8}[A-Z]{1,3}$`,         // Chiffres puis lettres
		`^BSG\s*\d+$`,                 // Codes BSG spécifiques
		`^[A-Z]+\s*\d{3,6}$`,         // Pattern avec espaces
	}

	// Vérifier si c'est un OEM
	for _, pattern := range oemPatterns {
		if matched, _ := regexp.MatchString(pattern, strings.ToUpper(query)); matched {
			return "oem"
		}
	}

	// Vérifier si c'est un code produit
	for _, pattern := range productCodePatterns {
		if matched, _ := regexp.MatchString(pattern, strings.ToUpper(query)); matched {
			return "product_code"
		}
	}

	// Si ça contient des chiffres et lettres mélangés, c'est probablement mixte
	hasLetters, _ := regexp.MatchString(`[A-Za-z]`, query)
	hasNumbers, _ := regexp.MatchString(`\d`, query)
	
	if hasLetters && hasNumbers && len(query) >= 4 {
		return "mixed"
	}

	// Sinon, c'est une recherche par mot-clé
	return "keyword"
}

// buildOEMFilter - Construire filtre pour recherche OEM
func buildOEMFilter(query string) bson.M {
	normalizedQuery := strings.ToUpper(strings.TrimSpace(query))
	
	return bson.M{
		"$or": []bson.M{
			// Recherche dans specifications.oem_numbers
			{"specifications.oem_numbers": bson.M{
				"$regex": regexp.QuoteMeta(normalizedQuery),
				"$options": "i",
			}},
			// Recherche dans le champ oe (legacy)
			{"oe": bson.M{
				"$regex": regexp.QuoteMeta(normalizedQuery),
				"$options": "i",
			}},
			// Recherche exacte
			{"specifications.oem_numbers": normalizedQuery},
			{"oe": normalizedQuery},
		},
	}
}

// buildProductCodeFilter - Construire filtre pour codes produits
func buildProductCodeFilter(query string) bson.M {
	normalizedQuery := strings.ToUpper(strings.TrimSpace(query))
	
	return bson.M{
		"$or": []bson.M{
			// Recherche par SKU
			{"sku": bson.M{
				"$regex": regexp.QuoteMeta(normalizedQuery),
				"$options": "i",
			}},
			// Recherche par code (legacy)
			{"code": bson.M{
				"$regex": regexp.QuoteMeta(normalizedQuery),
				"$options": "i",
			}},
			// Recherche dans le nom du produit (pour codes inclus dans le nom)
			{"name": bson.M{
				"$regex": regexp.QuoteMeta(normalizedQuery),
				"$options": "i",
			}},
			// Recherche exacte
			{"sku": normalizedQuery},
			{"code": normalizedQuery},
		},
	}
}

// buildKeywordFilter - Construire filtre pour mots-clés
func buildKeywordFilter(query string) bson.M {
	words := strings.Fields(strings.ToLower(query))
	
	if len(words) == 1 {
		// Recherche simple
		word := words[0]
		return bson.M{
			"$or": []bson.M{
				{"name": bson.M{"$regex": word, "$options": "i"}},
				{"description": bson.M{"$regex": word, "$options": "i"}},
				{"category": bson.M{"$regex": word, "$options": "i"}},
				{"subcategory": bson.M{"$regex": word, "$options": "i"}},
				{"brand": bson.M{"$regex": word, "$options": "i"}},
			},
		}
	}

	// Recherche multi-mots avec AND
	andConditions := []bson.M{}
	for _, word := range words {
		andConditions = append(andConditions, bson.M{
			"$or": []bson.M{
				{"name": bson.M{"$regex": word, "$options": "i"}},
				{"description": bson.M{"$regex": word, "$options": "i"}},
				{"category": bson.M{"$regex": word, "$options": "i"}},
				{"subcategory": bson.M{"$regex": word, "$options": "i"}},
			},
		})
	}

	return bson.M{"$and": andConditions}
}

// buildMixedFilter - Construire filtre mixte (essayer tous les types)
func buildMixedFilter(query string) bson.M {
	oemFilter := buildOEMFilter(query)
	codeFilter := buildProductCodeFilter(query)
	keywordFilter := buildKeywordFilter(query)

	return bson.M{
		"$or": []bson.M{
			oemFilter,
			codeFilter,
			keywordFilter,
		},
	}
}

// buildGeneralFilter - Filtre général par défaut
func buildGeneralFilter(query string) bson.M {
	return bson.M{
		"$or": []bson.M{
			{"name": bson.M{"$regex": query, "$options": "i"}},
			{"description": bson.M{"$regex": query, "$options": "i"}},
			{"sku": bson.M{"$regex": query, "$options": "i"}},
			{"brand": bson.M{"$regex": query, "$options": "i"}},
		},
	}
}

// addAdditionalFilters - Ajouter les filtres supplémentaires
func addAdditionalFilters(baseFilter bson.M, category, subcategory, brand, minPrice, maxPrice, inStock, vehicleBrand, vehicleModel string) bson.M {
	filters := []bson.M{baseFilter}

	// Filtres de catégorie
	if category != "" {
		filters = append(filters, bson.M{
			"category_slug": strings.ToLower(strings.ReplaceAll(category, " ", "-")),
		})
	}
	if subcategory != "" {
		filters = append(filters, bson.M{
			"subcategory_slug": strings.ToLower(strings.ReplaceAll(subcategory, " ", "-")),
		})
	}

	// Filtre de marque
	if brand != "" {
		filters = append(filters, bson.M{
			"brand": bson.M{"$regex": brand, "$options": "i"},
		})
	}

	// Filtre de prix
	if minPrice != "" || maxPrice != "" {
		priceFilter := bson.M{}
		if minPrice != "" {
			if min, err := strconv.ParseFloat(minPrice, 64); err == nil {
				priceFilter["$gte"] = min
			}
		}
		if maxPrice != "" {
			if max, err := strconv.ParseFloat(maxPrice, 64); err == nil {
				priceFilter["$lte"] = max
			}
		}
		if len(priceFilter) > 0 {
			filters = append(filters, bson.M{"price": priceFilter})
		}
	}

	// Filtre de stock
	if inStock == "true" {
		filters = append(filters, bson.M{"availability": "En stock"})
	}

	// Filtres de véhicule
	if vehicleBrand != "" || vehicleModel != "" {
		vehicleRegex := ""
		if vehicleBrand != "" && vehicleModel != "" {
			vehicleRegex = vehicleBrand + ".*" + vehicleModel
		} else if vehicleBrand != "" {
			vehicleRegex = vehicleBrand
		} else {
			vehicleRegex = vehicleModel
		}
		
		filters = append(filters, bson.M{
			"compatibleCars.vehicle": bson.M{
				"$regex": vehicleRegex,
				"$options": "i",
			},
		})
	}

	if len(filters) == 1 {
		return baseFilter
	}

	return bson.M{"$and": filters}
}

// getRelevanceSort - Obtenir le tri par pertinence selon le type
func getRelevanceSort(searchType string) bson.D {
	switch searchType {
	case "oem", "product_code":
		// Pour OEM et codes, privilégier les correspondances exactes
		return bson.D{
			{Key: "availability", Value: -1}, // Stock en premier
			{Key: "price", Value: 1},         // Prix croissant
			{Key: "name", Value: 1},          // Puis alphabétique
		}
	case "keyword":
		// Pour mots-clés, privilégier la popularité
		return bson.D{
			{Key: "_score", Value: -1},       // Score de recherche (si disponible)
			{Key: "availability", Value: -1}, // Stock en premier
			{Key: "name", Value: 1},          // Alphabétique
		}
	default:
		// Tri par défaut
		return bson.D{
			{Key: "availability", Value: -1},
			{Key: "name", Value: 1},
		}
	}
}

// generateIntelligentSuggestions - Générer suggestions intelligentes
func generateIntelligentSuggestions(query, searchType string, results []models.Product) []string {
	suggestions := []string{}

	// Suggestions basées sur les résultats trouvés
	categoryMap := make(map[string]bool)
	brandMap := make(map[string]bool)

	for _, product := range results {
		// Ajouter catégories uniques
		if product.Category != "" && !categoryMap[product.Category] {
			if len(suggestions) < 10 {
				suggestions = append(suggestions, product.Category)
				categoryMap[product.Category] = true
			}
		}
		
		// Ajouter marques uniques
		if product.Brand != "" && !brandMap[product.Brand] {
			if len(suggestions) < 10 {
				suggestions = append(suggestions, product.Brand)
				brandMap[product.Brand] = true
			}
		}
	}

	// Suggestions contextuelles selon le type de recherche
	if searchType == "keyword" {
		// Pour mots-clés, suggérer des termes liés
		contextualSuggestions := getContextualSuggestions(query)
		for _, suggestion := range contextualSuggestions {
			if len(suggestions) < 10 {
				suggestions = append(suggestions, suggestion)
			}
		}
	}

	return suggestions
}

// getContextualSuggestions - Suggestions contextuelles pour mots-clés
func getContextualSuggestions(query string) []string {
	query = strings.ToLower(query)
	suggestions := []string{}

	// Dictionnaire de suggestions contextuelles
	contextMap := map[string][]string{
		"frein":       {"plaquettes de frein", "disques de frein", "tambours de frein"},
		"huile":       {"huile moteur", "huile boîte de vitesse", "huile hydraulique"},
		"filtre":      {"filtre à air", "filtre à huile", "filtre à carburant"},
		"pneu":        {"pneus été", "pneus hiver", "pneus 4 saisons"},
		"batterie":    {"batterie 12V", "batterie AGM", "batterie gel"},
		"amortisseur": {"amortisseurs avant", "amortisseurs arrière", "ressorts"},
		"courroie":    {"courroie de distribution", "courroie accessoire", "galet tendeur"},
		"bougie":      {"bougies d'allumage", "bougies de préchauffage", "bobines d'allumage"},
	}

	for key, values := range contextMap {
		if strings.Contains(query, key) {
			suggestions = append(suggestions, values...)
			break
		}
	}

	return suggestions
}
