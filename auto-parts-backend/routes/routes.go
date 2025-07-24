package routes

import (
	"auto-parts-backend/auth"
	"auto-parts-backend/handlers"
	"auto-parts-backend/websocket"

	"github.com/gin-gonic/gin"
)

var hub *websocket.Hub

func RegisterRoutes(router *gin.Engine) {
	// Initialize WebSocket hub
	hub = websocket.NewHub()
	go hub.Run()

	// WebSocket endpoint
	router.GET("/ws", websocket.HandleWebSocket(hub))

	// API group
	api := router.Group("/api")
	{
		// Nouvelles routes dynamiques catégories
		api.GET("/categories", handlers.GetAllCategories)
		api.GET("/categories/:categoryId/subcategories", handlers.GetSubcategoriesByCategory)

		// Anciennes routes (compatibilité)
		api.GET("/subcategories/:id/parts", handlers.GetPartsHandler)
		api.GET("/vehicles", handlers.GetVehiclesHandler)
		api.GET("/vehicles/brands", handlers.GetVehicleBrandsHandler)
		api.GET("/productbrands", handlers.GetProductBrands)
		api.GET("/health", handlers.HealthCheck)
		api.GET("/vehicle_brands", handlers.GetVehicleBrandsCollectionHandler)

		api.GET("/vehicle_models/:brandId", handlers.GetVehicleModelsByBrandHandler)
		api.GET("/vehicle_variants/:modelId", handlers.GetVehicleVariantsByModelHandler)
		api.GET("/vehicle_engines/:variantId", handlers.GetVehicleEnginesByVariantHandler)
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
			products.GET("/category/:category", handlers.GetProductsByCategory)
			products.GET("/category/:category/:subcategory", handlers.GetProductsByCategory)
			products.GET("/:id/compatible-vehicles", handlers.GetCompatibleVehicles)
			products.GET("/:id/oem-numbers", handlers.GetProductOemNumbers)
		}

		// Cart routes
		cart := api.Group("/cart")
		{
			cart.POST("/add", handlers.AddToCartHandler)
			cart.GET("", handlers.GetCartHandler)
			cart.PUT("/:id", handlers.UpdateCartItemHandler)
			cart.DELETE("/:id", handlers.RemoveFromCartHandler)
		}

		// Order routes
		orders := api.Group("/orders")
		{
			orders.POST("/", handlers.CreateOrderHandler)
			orders.GET("", handlers.GetOrdersHandler)
			orders.GET("/:id", handlers.GetOrderHandler)
		}

		// Favorites routes
		favorites := api.Group("/favorites")
		{
			favorites.POST("/add", handlers.AddToFavoritesHandler)
			favorites.GET("", handlers.GetFavoritesHandler)
			favorites.DELETE("/:id", handlers.RemoveFromFavoritesHandler)
		}

		// Search routes
		search := api.Group("/search")
		{
			search.GET("/unified", handlers.UnifiedSearchHandler) // Nouvelle recherche unifiée intelligente
			search.POST("/advanced", handlers.AdvancedSearchHandler)
			search.GET("/suggestions", handlers.SearchSuggestionsHandler)
			search.GET("/quick", handlers.QuickSearchHandler)
			search.GET("", handlers.GeneralSearchHandler)
		}
	}
}
