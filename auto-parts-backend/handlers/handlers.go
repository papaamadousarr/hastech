package handlers

import (
	"auto-parts-backend/auth"
	"auto-parts-backend/db"
	"auto-parts-backend/models"
	"context"
	"net/http"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
)

// GetCategoriesHandler returns all categories
func GetCategoriesHandler(c *gin.Context) {
	collection := db.Client.Database("Ecommerce").Collection("Categories")
	cursor, err := collection.Find(context.TODO(), bson.M{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer cursor.Close(context.TODO())

	var categories []models.MainCategory
	if err = cursor.All(context.TODO(), &categories); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, categories)
}

// GetSubCategoriesHandler returns subcategories for a specific category
func GetSubCategoriesHandler(c *gin.Context) {
	categoryID := c.Param("id")
	if categoryID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Category ID is required"})
		return
	}

	collection := db.Client.Database("Ecommerce").Collection("Categories")
	var category models.MainCategory
	err := collection.FindOne(context.TODO(), bson.M{"id": categoryID}).Decode(&category)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, category.SubCategories)
}

// GetPartsHandler returns parts for a specific subcategory
func GetPartsHandler(c *gin.Context) {
	subCategoryID := c.Param("id")
	if subCategoryID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "SubCategory ID is required"})
		return
	}

	collection := db.Client.Database("Ecommerce").Collection("Categories")
	var category models.MainCategory
	err := collection.FindOne(context.TODO(), bson.M{"subcategories.id": subCategoryID}).Decode(&category)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	for _, subCategory := range category.SubCategories {
		if subCategory.ID == subCategoryID {
			c.JSON(http.StatusOK, subCategory.Parts)
			return
		}
	}

	c.JSON(http.StatusNotFound, gin.H{"error": "SubCategory not found"})
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

	c.JSON(http.StatusOK, vehicles)
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
	collection := db.Client.Database("Ecommerce").Collection("Products")
	cursor, err := collection.Find(context.TODO(), bson.M{})
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

// SearchProducts handles product search with various filters
func SearchProducts(c *gin.Context) {
	vehicleGroup := c.Query("vehicleGroup")
	model := c.Query("model")
	engine := c.Query("engine")
	year := c.Query("year")

	filter := bson.M{}
	if vehicleGroup != "" {
		filter["vehiclegroup"] = vehicleGroup
	}
	if model != "" {
		filter["model"] = model
	}
	if engine != "" {
		filter["engine"] = engine
	}
	if year != "" {
		filter["year"] = year
	}

	collection := db.Client.Database("Ecommerce").Collection("Products")
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

// GetProductByID returns a specific product by ID
func GetProductByID(c *gin.Context) {
	id := c.Param("id")

	collection := db.Client.Database("Ecommerce").Collection("Products")
	var product models.Product
	err := collection.FindOne(context.TODO(), bson.M{"_id": id}).Decode(&product)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}

	c.JSON(http.StatusOK, product)
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
