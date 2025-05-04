// cart/cart.go
package cart

import (
	"auto-parts-backend/db" // Adjust the import path based on your project structure
	"context"
	"encoding/json"
	"net/http"
)

type Cart struct {
	UserID   string   `json:"user_id"`  // Reference to the User
	Products []string `json:"products"` // List of product IDs in the cart
	Total    float64  `json:"total"`    // Total price of the cart
}

// AddToCartHandler handles adding products to the user's cart
func AddToCartHandler(w http.ResponseWriter, r *http.Request) {
	var cart Cart
	if err := json.NewDecoder(r.Body).Decode(&cart); err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	// Save or update the cart in the Cart collection
	_, err := db.Collection("Cart").InsertOne(context.TODO(), cart)
	if err != nil {
		http.Error(w, "Failed to save cart", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(cart)
}
