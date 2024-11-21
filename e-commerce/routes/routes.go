package routes

import (
	"commerce/controllers"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/mongo"
)

func UserRoutes(incomingRoutes *gin.Engine, prodCollection, userCollection *mongo.Collection) {
	// Créez une instance de Application
	app := controllers.NewApplication(prodCollection, userCollection)
	// Routes pour l'authentification des utilisateurs
	incomingRoutes.POST("/api/auth/signup", controllers.SignUp()) // Inscription
	incomingRoutes.POST("/api/auth/login", controllers.Login())   // Connexion

	// Routes pour la gestion des produits
	incomingRoutes.GET("/api/users/productview", controllers.GetAllProducts()) // Lister les produits
	// incomingRoutes.POST("/api/products", controllers.AddProduct())          // Ajouter un produit
	incomingRoutes.PUT("/api/products/:id", controllers.UpdateProduct())    // Mettre à jour un produit
	incomingRoutes.DELETE("/api/products/:id", controllers.DeleteProduct()) // Supprimer un produit

	// Routes pour l'administration
	incomingRoutes.POST("/api/users/productview", controllers.ProductViewerAdmin())

	// Routes pour la recherche de produits (par utilisateur)
	// incomingRoutes.GET("/api/users/productview", controllers.SearchProduct())         // Afficher les produits
	incomingRoutes.GET("/api/users/search", controllers.SearchProductByQueryByName()) // Rechercher un produit par nom
	incomingRoutes.GET("/api/users/searchno", controllers.SearchProductByQueryByNo()) // Rechercher un produit par numéro

	// Route pour ajouter un produit au panier
	incomingRoutes.POST("/api/cart/addtocart", app.AddToCart()) // Ajouter au panier

	// Nouvelle route pour récupérer les articles du panier
	incomingRoutes.GET("/api/cart/items", controllers.GetItemFromCart()) // Récupérer les articles du panier
}
