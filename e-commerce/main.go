package main

import (
	"commerce/controllers"
	"commerce/database"
	"commerce/middleware"
	"commerce/routes"

	"log"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	port := os.Getenv("PORT")

	router := gin.New()

	// Enable CORS middleware
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:4200"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	// router.OPTIONS("*", func(c *gin.Context) {
	// 	c.Header("Access-Control-Allow-Origin", "http://localhost:4200")
	// 	c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE")
	// 	c.Header("Access-Control-Allow-Headers", "Content-Type, Authorization")
	// 	c.Status(200)
	// })

	if port == "" {
		port = "8080"
	}

	app := controllers.NewApplication(database.ProductData(database.Client, "Products"), database.UserData(database.Client, "Users"))

	router.Use(gin.Logger())

	routes.UserRoutes(router, app.ProdCollection, app.UserCollection)

	router.Use(middleware.Authentification())

	router.GET("/addtocart", app.AddToCart())
	router.GET("/removefromcart", app.RemoveItem())
	router.GET("/cartcheckout", app.BuyFromCart())
	router.GET("/instantBuy", app.InstantBuy())

	log.Fatal(router.Run(":" + port))

}
