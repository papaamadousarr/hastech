package models

type Part struct {
	ID   string `json:"id" bson:"id"`
	Name string `json:"name" bson:"name"`
}

type SubCategory struct {
	ID    string `json:"id" bson:"id"`
	Name  string `json:"name" bson:"name"`
	Parts []Part `json:"parts" bson:"parts"`
}

type MainCategory struct {
	ID            string        `json:"id" bson:"id"`
	Name          string        `json:"name" bson:"name"`
	Icon          string        `json:"icon" bson:"icon"`
	IsExpanded    bool          `json:"isExpanded" bson:"isExpanded"`
	SubCategories []SubCategory `json:"subCategories" bson:"subCategories"`
}
