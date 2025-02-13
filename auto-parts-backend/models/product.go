package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Product struct {
	ID             primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Name           string             `bson:"name" json:"name"`
	SKU            string             `bson:"sku" json:"sku"`
	Description    string             `bson:"description" json:"description"`
	Price          float64            `bson:"price" json:"price"`
	DiscountPrice  float64            `bson:"discount_price,omitempty" json:"discountPrice,omitempty"`
	CategoryID     primitive.ObjectID `bson:"category_id" json:"categoryId"`
	Brand          string             `bson:"brand" json:"brand"`
	StockQuantity  int                `bson:"stock_quantity" json:"stockQuantity"`
	Images         []string           `bson:"images" json:"images"`
	Specifications map[string]string  `bson:"specifications" json:"specifications"`
	CompatibleCars []string           `bson:"compatible_cars" json:"compatibleCars"`
	CreatedAt      time.Time          `bson:"created_at" json:"createdAt"`
	UpdatedAt      time.Time          `bson:"updated_at" json:"updatedAt"`
}
