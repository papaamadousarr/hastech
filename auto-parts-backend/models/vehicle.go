package models

type Vehicle struct {
	VehicleBrand string   `json:"vehicleBrand" bson:"vehicleBrand"`
	ID           string   `json:"id" bson:"id"`
	Name         string   `json:"name" bson:"name"`
	LogoURL      string   `json:"logoUrl" bson:"logoUrl"`
	Years        []int    `json:"years" bson:"years"`
	Model        []string `json:"model" bson:"model"`
	// Add new fields for images
	Images struct {
		Main    string   `json:"main" bson:"main"`
		Gallery []string `json:"gallery,omitempty" bson:"gallery,omitempty"`
	} `json:"images" bson:"images"`
	SubModel string `json:"subModel,omitempty" bson:"subModel,omitempty"`
	Engine   string `json:"engine,omitempty" bson:"engine,omitempty"`
}
