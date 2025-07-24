package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// CompatibleCar représente un véhicule compatible avec le produit
type CompatibleCar struct {
	Vehicle string `bson:"vehicle" json:"vehicle"`
	RawText string `bson:"raw_text" json:"raw_text"`
}

// Specifications représente les spécifications du produit
type Specifications struct {
	OemNumbers []string `bson:"oem_numbers" json:"oem_numbers"`
}

// Product représente un produit selon la structure MongoDB Atlas
type Product struct {
	ID              primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Name            string             `bson:"name" json:"name"`
	Slug            string             `bson:"slug" json:"slug"`
	Price           float64            `bson:"price" json:"price"`
	Availability    string             `bson:"availability" json:"availability"`
	Link            string             `bson:"link" json:"link"`
	Image           string             `bson:"image" json:"image"`
	CompatibleCars  []CompatibleCar    `bson:"compatibleCars" json:"compatibleCars"`
	Specifications  Specifications     `bson:"specifications" json:"specifications"`
	Category        string             `bson:"category" json:"category"`
	CategorySlug    string             `bson:"category_slug" json:"category_slug"`
	Subcategory     string             `bson:"subcategory" json:"subcategory"`
	SubcategorySlug string             `bson:"subcategory_slug" json:"subcategory_slug"`
	CreatedAt       time.Time          `bson:"createdAt" json:"createdAt"`
	UpdatedAt       time.Time          `bson:"updatedAt" json:"updatedAt"`

	// Champs optionnels pour compatibilité avec l'ancien système
	SKU           string             `bson:"sku,omitempty" json:"sku,omitempty"`
	Description   string             `bson:"description,omitempty" json:"description,omitempty"`
	DiscountPrice float64            `bson:"discount_price,omitempty" json:"discountPrice,omitempty"`
	CategoryID    primitive.ObjectID `bson:"category_id,omitempty" json:"categoryId,omitempty"`
	Brand         string             `bson:"brand,omitempty" json:"brand,omitempty"`
	StockQuantity int                `bson:"stock_quantity,omitempty" json:"stockQuantity,omitempty"`
	Images        []string           `bson:"images,omitempty" json:"images,omitempty"`
}
