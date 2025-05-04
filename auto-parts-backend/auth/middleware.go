package auth

import (
	"os"
	"strings"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
)

var jwtKey = []byte(os.Getenv("JWT_SECRET"))

func AuthMiddleware() gin.HandlerFunc {

	return func(c *gin.Context) {
		// Public routes don't need authentication
		if isPublicRoute(c.Request.URL.Path) {
			c.Next()
			return
		}
		// Get token from header
		tokenString := c.GetHeader("Authorization")
		if tokenString == "" {
			c.JSON(401, gin.H{
				"message":  "Authentication required",
				"redirect": "/login-signup",
			})
			c.Abort()
			return
		}
		// Remove 'Bearer ' prefix
		tokenString = strings.Replace(tokenString, "Bearer ", "", 1)
		// Validate token
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, jwt.ErrSignatureInvalid
			}
			return jwtKey, nil
		})
		if err != nil || !token.Valid {
			c.JSON(401, gin.H{
				"message":  "Invalid or expired token",
				"redirect": "/login-signup",
			})
			c.Abort()
			return
		}
		// Extract claims
		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			c.JSON(401, gin.H{
				"message":  "Invalid token claims",
				"redirect": "/login-signup",
			})
			c.Abort()
			return
		}
		// Set user ID in context
		c.Set("user_id", claims["user_id"])
		c.Next()
	}

}

func isPublicRoute(path string) bool {
	publicRoutes := []string{
		"/api/login",
		"/api/signup",
		"/api/categories",
		"/api/vehicles",
		"/api/productbrands",
		"/api/verify-token",
	}
	for _, route := range publicRoutes {
		if strings.HasPrefix(path, route) {
			return true
		}
	}
	return false
}
