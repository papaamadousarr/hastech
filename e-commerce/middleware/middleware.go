package middleware

import (
	token "commerce/tokens"
	"net/http"
	"os"
	"strings"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
)

func Authentification() gin.HandlerFunc {
	return func(c *gin.Context) {
		ClientToken := c.Request.Header.Get("token")

		if ClientToken == "" {
			c.JSON(http.StatusInternalServerError, gin.H{"Error": "No authorization head"})
			c.Abort()
			return

		}

		claims, msg := token.ValidateToken(ClientToken)

		if msg != "" {
			c.JSON(http.StatusInternalServerError, gin.H{"Error": msg})
			c.Abort()
			return

		}

		c.Set("email", claims.Email)
		c.Set("uid", claims.Uid)
		c.Next()

	}

}

// Middleware d'authentification pour vérifier si l'utilisateur est authentifié et admin
func AdminAuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Récupérer le token depuis les en-têtes de la requête
		tokenString := c.GetHeader("Authorization")
		if tokenString == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization token is required"})
			c.Abort()
			return
		}

		// Retirer le préfixe "Bearer " du token
		tokenString = strings.TrimPrefix(tokenString, "Bearer ")

		// Définir la clé secrète pour valider le JWT
		secretKey := os.Getenv("JWT_SECRET_KEY")
		// Déclarer la structure du jeton
		claims := jwt.MapClaims{}

		// Parser et valider le jeton
		token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
			return []byte(secretKey), nil
		})

		if err != nil || !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
			c.Abort()
			return
		}

		// Vérifier le rôle de l'utilisateur
		if claims["role"] != "seller" {
			c.JSON(http.StatusForbidden, gin.H{"error": "You are not authorized to access this resource"})
			c.Abort()
			return
		}

		// Si le rôle est admin, continuer la requête
		c.Next()
	}
}
