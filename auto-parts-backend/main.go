package main

import (
	"auto-parts-backend/auth"
	"auto-parts-backend/db"
	"auto-parts-backend/routes"
	"log"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func setupCORS() gin.HandlerFunc {
	return cors.New(cors.Config{
		AllowOrigins: []string{"http://localhost:4200"},
		AllowMethods: []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders: []string{
			"Origin",
			"Content-Type",
			"Content-Length",
			"Accept-Encoding",
			"X-CSRF-Token",
			"Authorization",
			"Accept",
			"Cache-Control",
			"X-Requested-With",
		},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * 60 * 60,
	})
}

func main() {
	// Initialize Gin router
	router := gin.Default()

	router.Use(gin.Logger())
	// Apply CORS middleware BEFORE routes
	router.Use(setupCORS())
	router.Use(gin.Recovery())

	// Connect to database
	if err := db.ConnectDB(); err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// Initialize auth system
	if err := auth.InitDatabase(); err != nil {
		log.Fatal("Failed to initialize auth system:", err)
	}

	// Register all routes
	routes.RegisterRoutes(router)

	// Start the server
	port := ":3000"
	log.Printf("Server is running on port%s", port)
	if err := router.Run(port); err != nil {
		log.Fatal("Server failed to start:", err)
	}
}
