package models

import (
	"time"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Part struct {
	ID   string `json:"id" bson:"id"`
	Name string `json:"name" bson:"name"`
}

type SubCategory struct {
	ID    string `json:"id" bson:"id"`
	Name  string `json:"name" bson:"name"`
	Parts []Part `json:"parts" bson:"parts"`
}

// Original structure for nested subcategories
type MainCategory struct {
	ID            string        `json:"id" bson:"id"`
	Name          string        `json:"name" bson:"name"`
	Slug          string        `json:"slug" bson:"slug"`
	Icon          string        `json:"icon" bson:"icon"`
	IsExpanded    bool          `json:"isExpanded" bson:"isExpanded"`
	SubCategories []SubCategory `json:"subCategories" bson:"subCategories"`
}

// New structure matching your database format
type Category struct {
	ID        primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	Name      string             `json:"name" bson:"name"`
	Slug      string             `json:"slug" bson:"slug"`
	Image     string             `json:"image" bson:"image"`
	IsActive  bool               `json:"isActive" bson:"isActive"`
	SortOrder int                `json:"sortOrder" bson:"sortOrder"`
	CreatedAt time.Time          `json:"createdAt" bson:"createdAt"`
	UpdatedAt time.Time          `json:"updatedAt" bson:"updatedAt"`
}

// Subcategory structure matching your database format
type Subcategory struct {
	ID         primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	CategoryID primitive.ObjectID `json:"categoryId" bson:"categoryId"`
	Name       string             `json:"name" bson:"name"`
	Slug       string             `json:"slug" bson:"slug"`
	Image      string             `json:"image" bson:"image"`
	IsActive   bool               `json:"isActive" bson:"isActive"`
	SortOrder  int                `json:"sortOrder" bson:"sortOrder"`
	CreatedAt  time.Time          `json:"createdAt" bson:"createdAt"`
	UpdatedAt  time.Time          `json:"updatedAt" bson:"updatedAt"`
}
