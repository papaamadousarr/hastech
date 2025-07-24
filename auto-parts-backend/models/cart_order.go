package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// CartItem represents an item in the user's cart
type CartItem struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	UserID    string             `bson:"user_id" json:"user_id"`
	ProductID string             `bson:"product_id" json:"product_id"`
	Quantity  int                `bson:"quantity" json:"quantity"`
	Price     float64           `bson:"price" json:"price"`
	Name      string             `bson:"name" json:"name"`
	Image     string             `bson:"image" json:"image"`
	SKU       string             `bson:"sku" json:"sku"`
	CreatedAt time.Time          `bson:"created_at" json:"created_at"`
	UpdatedAt time.Time          `bson:"updated_at" json:"updated_at"`
}

// OrderItem represents an item in an order
type OrderItem struct {
	ProductID string  `bson:"product_id" json:"product_id"`
	Quantity  int     `bson:"quantity" json:"quantity"`
	Price     float64 `bson:"price" json:"price"`
	Name      string  `bson:"name" json:"name"`
	Image     string  `bson:"image" json:"image"`
	SKU       string  `bson:"sku" json:"sku"`
}

// ShippingAddress represents the shipping address for an order
type ShippingAddress struct {
	FirstName string `bson:"first_name" json:"first_name"`
	LastName  string `bson:"last_name" json:"last_name"`
	Email     string `bson:"email" json:"email"`
	Phone     string `bson:"phone" json:"phone"`
	Address   string `bson:"address" json:"address"`
	City      string `bson:"city" json:"city"`
	State     string `bson:"state" json:"state"`
	ZipCode   string `bson:"zip_code" json:"zip_code"`
	Country   string `bson:"country" json:"country"`
}

// Order represents a customer order
type Order struct {
	ID             primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	UserID         string             `bson:"user_id" json:"user_id"`
	OrderNumber    string             `bson:"order_number" json:"order_number"`
	Status         string             `bson:"status" json:"status"`
	Items          []OrderItem        `bson:"items" json:"items"`
	Subtotal       float64           `bson:"subtotal" json:"subtotal"`
	ShippingCost   float64           `bson:"shipping_cost" json:"shipping_cost"`
	Tax            float64           `bson:"tax" json:"tax"`
	Total          float64           `bson:"total" json:"total"`
	ShippingAddress ShippingAddress   `bson:"shipping_address" json:"shipping_address"`
	PaymentMethod  string             `bson:"payment_method" json:"payment_method"`
	PaymentStatus  string             `bson:"payment_status" json:"payment_status"`
	Notes          string             `bson:"notes" json:"notes"`
	CreatedAt      time.Time          `bson:"created_at" json:"created_at"`
	UpdatedAt      time.Time          `bson:"updated_at" json:"updated_at"`
}

// Favorite represents a user's favorite product
type Favorite struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	UserID    string             `bson:"user_id" json:"user_id"`
	ProductID string             `bson:"product_id" json:"product_id"`
	Name      string             `bson:"name" json:"name"`
	Price     float64           `bson:"price" json:"price"`
	Image     string             `bson:"image" json:"image"`
	SKU       string             `bson:"sku" json:"sku"`
	CreatedAt time.Time          `bson:"created_at" json:"created_at"`
}

// SearchFilters represents search parameters for advanced search
type SearchFilters struct {
	Query       string   `json:"query"`
	Categories  []string `json:"categories"`
	Brands      []string `json:"brands"`
	PriceMin    float64  `json:"price_min"`
	PriceMax    float64  `json:"price_max"`
	InStock     *bool    `json:"in_stock"`
	SortBy      string   `json:"sort_by"`
	SortOrder   string   `json:"sort_order"`
	Page        int      `json:"page"`
	Limit       int      `json:"limit"`
}

// SearchResponse represents the response from advanced search
type SearchResponse struct {
	Products  []Product `json:"products"`
	Pagination struct {
		Page       int `json:"page"`
		Limit      int `json:"limit"`
		Total      int64 `json:"total"`
		TotalPages int `json:"total_pages"`
	} `json:"pagination"`
}

// CartSummary represents a summary of the cart
type CartSummary struct {
	Items      []CartItem `json:"items"`
	Total      float64    `json:"total"`
	ItemCount  int        `json:"item_count"`
	Shipping   float64    `json:"shipping"`
	Tax        float64    `json:"tax"`
	GrandTotal float64    `json:"grand_total"`
}

// OrderStatus represents the status of an order
const (
	OrderStatusPending   = "pending"
	OrderStatusConfirmed = "confirmed"
	OrderStatusShipped   = "shipped"
	OrderStatusDelivered = "delivered"
	OrderStatusCancelled = "cancelled"
)

// PaymentStatus represents the payment status
const (
	PaymentStatusPending = "pending"
	PaymentStatusPaid    = "paid"
	PaymentStatusFailed  = "failed"
	PaymentStatusRefunded = "refunded"
)

// PaymentMethod represents payment methods
const (
	PaymentMethodCreditCard = "credit_card"
	PaymentMethodPayPal     = "paypal"
	PaymentMethodBankTransfer = "bank_transfer"
	PaymentMethodCash       = "cash"
) 