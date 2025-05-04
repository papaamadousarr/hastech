package routes

import (
	"auto-parts-backend/auth"
	"auto-parts-backend/handlers"

	"github.com/gin-gonic/gin"
)

func RegisterRoutes(router *gin.Engine) {
	// API group
	api := router.Group("/api")
	{
		//es
		api.GET("/categories", handlers.GetCategoriesHandler)
		api.GET("/categories/:id/subcategories", handlers.GetSubCategoriesHandler)
		api.GET("/subcategories/:id/parts", handlers.GetPartsHandler)
		api.GET("/vehicles", handlers.GetVehiclesHandler)
		api.GET("/productbrands", handlers.GetProductBrands)
		api.GET("/health", handlers.HealthCheck)
		// New Vehicle routes
		api.GET("/vehicles/brand/:brand", handlers.GetVehiclesByBrandHandler)
		//	api.GET("/vehicle-images", handlers.GetVehicleImagesHandler) // Get vehicle images by brand and model
		//	api.GET("/vehicle-detail", handlers.GetVehicleDetailHandler) // Get detailed vehicle information
		// Auth routes
		api.POST("/signup", auth.SignupHandler)
		api.POST("/login", auth.LoginHandler)

		api.GET("/confirm", auth.ConfirmEmailHandler)
		// Protected routes group
		user := api.Group("/user")
		user.Use(auth.AuthMiddleware())
		{
			user.GET("/profile", auth.GetProfileHandler)
			user.PUT("/profile", auth.UpdateProfileHandler)
			user.GET("/orders", auth.GetUserOrdersHandler)
			user.POST("/address", auth.AddAddressHandler)
			user.PUT("/address/:id", auth.UpdateAddressHandler)
			user.DELETE("/address/:id", auth.DeleteAddressHandler)
			user.PUT("/password", auth.ChangePasswordHandler)
		}
		// Product routes
		products := api.Group("/products")
		{
			products.GET("", handlers.GetProducts)
			products.GET("/search", handlers.SearchProducts)
			products.GET("/:id", handlers.GetProductByID)
		}
	}
}
