// auth.go
package auth

import (
	"context"
	"crypto/rand"
	"encoding/base64"
	"fmt"
	"log"
	"time"

	"github.com/gin-gonic/gin"

	"auto-parts-backend/db"

	"github.com/dgrijalva/jwt-go"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"golang.org/x/crypto/bcrypt"
	"gopkg.in/gomail.v2"
)

type User struct {
	ID                string    `json:"id,omitempty" bson:"_id,omitempty"`
	Name              string    `json:"name"`
	Email             string    `json:"email"`
	Password          string    `json:"password"`
	Phone             string    `json:"phone"`
	IsConfirmed       bool      `json:"is_confirmed"`
	ConfirmationToken string    `json:"confirmation_token"`
	CreatedAt         time.Time `json:"created_at"`
	LastLogin         time.Time `json:"last_login"`
	Address           []Address `json:"addresses"`
	IsAdmin           bool      `json:"isAdmin" bson:"isAdmin"`
}

type Address struct {
	ID          string `json:"id,omitempty" bson:"_id,omitempty"`
	Title       string `json:"title"` // Home, Work, etc.
	FullName    string `json:"full_name"`
	PhoneNumber string `json:"phone_number"`
	City        string `json:"city"`
	District    string `json:"district"`
	FullAddress string `json:"full_address"`
	IsDefault   bool   `json:"is_default"`
}

func InitDatabase() error {
	// Create a unique index on the email field
	indexModel := mongo.IndexModel{
		Keys:    bson.M{"email": 1},
		Options: options.Index().SetUnique(true),
	}

	_, err := db.Collection("Users").Indexes().CreateOne(context.Background(), indexModel)
	return err
}

func SignupHandler(c *gin.Context) {
	var user User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(400, gin.H{"error": "Invalid request body"})
		return
	}
	var existingUser User
	err := db.Collection("Users").FindOne(c.Request.Context(), bson.M{"email": user.Email}).Decode(&existingUser)
	if err == nil {
		c.JSON(409, gin.H{"error": "Email already exists"})
		return
	}
	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(user.Password), 10)
	user.Password = string(hashedPassword)
	user.IsConfirmed = false
	user.ConfirmationToken = generateToken()
	user.CreatedAt = time.Now()
	user.IsAdmin = false // Set isAdmin to false for new users
	_, err = db.Collection("Users").InsertOne(c.Request.Context(), user)
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to save user"})
		return
	}
	go func() {
		if err := sendConfirmationEmail(user.Email, user.ConfirmationToken); err != nil {
			log.Printf("Failed to send confirmation email: %v", err)
		}
	}()
	c.JSON(201, gin.H{
		"message": "Registration successful! Please check your email for confirmation.",
	})
}

func LoginHandler(c *gin.Context) {
	var credentials struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	if err := c.ShouldBindJSON(&credentials); err != nil {
		c.JSON(400, gin.H{"error": "Invalid request"})
		return
	}
	var user User
	err := db.Collection("Users").FindOne(c.Request.Context(), bson.M{"email": credentials.Email}).Decode(&user)
	if err != nil {
		c.JSON(401, gin.H{"error": "User not found"})
		return
	}
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(credentials.Password)); err != nil {
		c.JSON(401, gin.H{"error": "Invalid password"})
		return
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id":  user.ID,
		"email":    user.Email,
		"is_admin": user.IsAdmin, // Include isAdmin in the token claims
		"exp":      time.Now().Add(time.Hour * 24).Unix(),
	})
	tokenString, err := token.SignedString(jwtKey)
	if err != nil {
		c.JSON(500, gin.H{"error": "Error generating token"})
		return
	}
	c.JSON(200, gin.H{"token": tokenString, "is_admin": user.IsAdmin})

}

// Function to generate a random token
func generateToken() string {
	token := make([]byte, 32)
	_, err := rand.Read(token)
	if err != nil {
		return ""
	}
	return base64.URLEncoding.EncodeToString(token)
}

// Function to send confirmation email
func sendConfirmationEmail(email, token string) error {
	m := gomail.NewMessage()
	m.SetHeader("From", "lohassan123@gmail.com") // Your Gmail address
	m.SetHeader("To", email)
	m.SetHeader("Subject", "Email Confirmation from Alopieceauto")
	m.SetBody("text/html", fmt.Sprintf(`
        <h2>Welcome to Alopieceauto!</h2>
        <p>Thank you for registering. Please confirm your email by clicking the link below:</p>
        <a href="http://localhost:4200/confirm-email?token=%s">Confirm Email</a>
        <p>If you didn't create this account, please ignore this email.</p>
    `, token))

	// Update these settings with your Gmail and App Password
	d := gomail.NewDialer(
		"smtp.gmail.com",
		587,
		"lohassan123@gmail.com", // Your Gmail address
		"iffp yuty dpyn glpx",   // Your 16-character App Password
	)

	// Add error logging
	if err := d.DialAndSend(m); err != nil {
		log.Printf("Error sending email: %v", err)
		return err
	}

	log.Printf("Confirmation email sent successfully to %s", email)
	return nil
}

// findUserByToken retrieves a user from the database using the confirmation token.
func findUserByToken(token string, c *gin.Context) (*User, error) {
	var user User

	// Query the database to find the user by confirmation token
	filter := bson.M{"confirmation_token": token}
	err := db.Collection("Users").FindOne(c.Request.Context(), filter).Decode(&user)

	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, fmt.Errorf("no user found with this token")
		}
		return nil, fmt.Errorf("database error: %v", err)
	}

	return &user, nil
}

func ConfirmEmailHandler(c *gin.Context) {
	token := c.Query("token")
	// Validate the token
	if token == "" {
		c.JSON(400, gin.H{
			"error":   "Invalid token",
			"message": "No confirmation token provided",
		})
		return
	}

	// Use the findUserByToken function
	user, err := findUserByToken(token, c)
	if err != nil {
		c.JSON(404, gin.H{
			"error":   "User not found",
			"message": "Invalid or expired confirmation token",
		})
		return
	}

	// Check if already confirmed
	if user.IsConfirmed {
		c.JSON(200, gin.H{
			"message":  "Email already confirmed",
			"redirect": "/login",
		})
		return
	}

	// Update user's IsConfirmed status to true
	update := bson.M{
		"$set": bson.M{
			"is_confirmed":       true,
			"confirmation_token": "", // Clear the token after confirmation
		},
	}

	result, err := db.Collection("Users").UpdateOne(
		c.Request.Context(),
		bson.M{"email": user.Email},
		update,
	)
	if err != nil {
		c.JSON(500, gin.H{
			"error":   "Update failed",
			"message": "Failed to confirm email",
		})
		return
	}
	if result.ModifiedCount == 0 {
		c.JSON(400, gin.H{
			"error":   "No update",
			"message": "Failed to confirm email",
		})
		return
	}
	// Success response
	c.JSON(200, gin.H{
		"message":  "Email confirmed successfully!",
		"redirect": "/login",
	})
}

func ResendConfirmationEmailHandler(c *gin.Context) {
	var request struct {
		Email string `json:"email"`
	}
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(400, gin.H{"error": "Invalid request"})
		return
	}
	// Find user by email
	var user User
	err := db.Collection("Users").FindOne(c.Request.Context(), bson.M{"email": request.Email}).Decode(&user)
	if err != nil {
		c.JSON(404, gin.H{"error": "User not found"})
		return
	}
	// Generate new token if needed
	if user.ConfirmationToken == "" {
		user.ConfirmationToken = generateToken()
		// Update user in database with new token
		_, err = db.Collection("Users").UpdateOne(
			c.Request.Context(),
			bson.M{"email": user.Email},
			bson.M{"$set": bson.M{"confirmationtoken": user.ConfirmationToken}},
		)
		if err != nil {
			c.JSON(500, gin.H{"error": "Failed to update user"})
			return
		}
	}
	// Resend confirmation email
	if err := sendConfirmationEmail(user.Email, user.ConfirmationToken); err != nil {
		log.Printf("Failed to resend confirmation email: %v", err)
		c.JSON(500, gin.H{"error": "Failed to send confirmation email"})
		return
	}
	c.JSON(200, gin.H{
		"message": "Confirmation email has been resent. Please check your inbox.",
	})
}

func GetProfileHandler(c *gin.Context) {
	userID, _ := c.Get("user_id")

	var user User
	err := db.Collection("Users").FindOne(
		c.Request.Context(),
		bson.M{"_id": userID},
	).Decode(&user)

	if err != nil {
		c.JSON(404, gin.H{"error": "User not found"})
		return
	}
	// Remove sensitive information
	user.Password = ""
	user.ConfirmationToken = ""

	c.JSON(200, gin.H{
		"user": user,
	})
}

func UpdateProfileHandler(c *gin.Context) {
	userID, _ := c.Get("user_id")

	var updateData struct {
		Name  string `json:"name"`
		Phone string `json:"phone"`
	}
	if err := c.ShouldBindJSON(&updateData); err != nil {
		c.JSON(400, gin.H{"error": "Invalid request data"})
		return
	}
	update := bson.M{
		"$set": bson.M{
			"name":  updateData.Name,
			"phone": updateData.Phone,
		},
	}
	result, err := db.Collection("Users").UpdateOne(
		c.Request.Context(),
		bson.M{"_id": userID},
		update,
	)
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to update profile"})
		return
	}
	if result.ModifiedCount == 0 {
		c.JSON(404, gin.H{"error": "User not found"})
		return
	}
	c.JSON(200, gin.H{"message": "Profile updated successfully"})

}

func AddAddressHandler(c *gin.Context) {
	// TODO: Implement address addition logic
	c.JSON(200, gin.H{"message": "Address added successfully"})
}

func UpdateAddressHandler(c *gin.Context) {
	userID, _ := c.Get("user_id")
	addressID := c.Param("id")
	var address Address
	if err := c.ShouldBindJSON(&address); err != nil {
		c.JSON(400, gin.H{"error": "Invalid address data"})
		return
	}
	update := bson.M{
		"$set": bson.M{
			"addresses.$[elem]": address,
		},
	}
	arrayFilters := options.Update().SetArrayFilters(options.ArrayFilters{
		Filters: []interface{}{
			bson.M{"elem._id": addressID},
		},
	})
	result, err := db.Collection("Users").UpdateOne(
		c.Request.Context(),
		bson.M{"_id": userID},
		update,
		arrayFilters,
	)
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to update address"})
		return
	}
	if result.ModifiedCount == 0 {
		c.JSON(404, gin.H{"error": "Address not found"})
		return
	}
	c.JSON(200, gin.H{"message": "Address updated successfully"})

}

func DeleteAddressHandler(c *gin.Context) {
	userID, _ := c.Get("user_id")
	addressID := c.Param("id")
	update := bson.M{
		"$pull": bson.M{
			"addresses": bson.M{"_id": addressID},
		},
	}
	result, err := db.Collection("Users").UpdateOne(
		c.Request.Context(),
		bson.M{"_id": userID},
		update,
	)
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to delete address"})
		return
	}
	if result.ModifiedCount == 0 {
		c.JSON(404, gin.H{"error": "Address not found"})
		return
	}
	c.JSON(200, gin.H{"message": "Address deleted successfully"})

}

func ChangePasswordHandler(c *gin.Context) {
	userID, _ := c.Get("user_id")

	var passwordData struct {
		CurrentPassword string `json:"current_password"`
		NewPassword     string `json:"new_password"`
	}
	if err := c.ShouldBindJSON(&passwordData); err != nil {
		c.JSON(400, gin.H{"error": "Invalid request data"})
		return
	}
	// Get user from database
	var user User
	err := db.Collection("Users").FindOne(
		c.Request.Context(),
		bson.M{"_id": userID},
	).Decode(&user)
	if err != nil {
		c.JSON(404, gin.H{"error": "User not found"})
		return
	}
	// Verify current password
	if err := bcrypt.CompareHashAndPassword(
		[]byte(user.Password),
		[]byte(passwordData.CurrentPassword),
	); err != nil {
		c.JSON(400, gin.H{"error": "Current password is incorrect"})
		return
	}
	// Hash new password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(passwordData.NewPassword), 10)
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to process new password"})
		return
	}
	// Update password in database
	update := bson.M{
		"$set": bson.M{"password": string(hashedPassword)},
	}
	result, err := db.Collection("Users").UpdateOne(
		c.Request.Context(),
		bson.M{"_id": userID},
		update,
	)
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to update password"})
		return
	}
	if result.ModifiedCount == 0 {
		c.JSON(404, gin.H{"error": "User not found"})
		return
	}
	c.JSON(200, gin.H{"message": "Password changed successfully"})
}

func GetUserOrdersHandler(c *gin.Context) {
	// For now, return empty orders array
	c.JSON(200, gin.H{
		"orders": []interface{}{},
	})
}
