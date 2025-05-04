package models

type ProductBrand struct {
	ID      string `json:"id" bson:"id"`
	Name    string `json:"name" bson:"name"`
	LogoURL string `json:"logoUrl" bson:"logoUrl"`
}
