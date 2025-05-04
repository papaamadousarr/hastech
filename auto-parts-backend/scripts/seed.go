package main

import (
	"context"
	"fmt"
	"log"

	"auto-parts-backend/db"
	"auto-parts-backend/models"

	"go.mongodb.org/mongo-driver/mongo"
)

func main() {
	// Connect to MongoDB
	db.ConnectDB()

	if err := seedDatabase(db.Client); err != nil {
		log.Fatal(err)
	}
	log.Println("Database seeded successfully!")
}

func seedDatabase(client *mongo.Client) error {
	if client == nil {
		return fmt.Errorf("MongoDB client is not initialized")
	}
	database := client.Database("Ecommerce")

	// Clear existing collections
	database.Collection("Categories").Drop(context.TODO())
	database.Collection("Vehicles").Drop(context.TODO())
	database.Collection("ProductBrands").Drop(context.TODO())
	// Seed main categories
	categories := []models.MainCategory{
		{
			ID:         "auto-parts",
			Name:       "AUTO PARTS",
			Icon:       "fa-car-alt",
			IsExpanded: false,
			SubCategories: []models.SubCategory{
				{
					// Reference lines 22-96 for all auto parts subcategories
					ID:   "brakes",
					Name: "Brakes",
					Parts: []models.Part{
						{ID: "abs-sensor", Name: "ABS Sensor"},
						{ID: "brake-disc", Name: "Brake Disc"},
						{ID: "brake-pad", Name: "Brake Pad"},
						{ID: "brake-caliper", Name: "Brake Caliper"},
						{ID: "brake-master-cylinder", Name: "Brake Master Cylinder"},
						{ID: "brake-drum", Name: "Brake Drum"},
						{ID: "brake-hose", Name: "Brake Hose"},
						{ID: "brake-shoe", Name: "Brake Shoe"},
					},
				},
				{
					ID:   "clutch",
					Name: "Clutch",
					Parts: []models.Part{
						{ID: "clutch-kit", Name: "Clutch Kit"},
						{ID: "clutch-disc", Name: "Clutch Disc"},
						{ID: "clutch-pressure-plate", Name: "Clutch Pressure Plate"},
						{ID: "clutch-bearing", Name: "Clutch Bearing"},
						{ID: "clutch-master-cylinder", Name: "Clutch Master Cylinder"},
						{ID: "clutch-slave-cylinder", Name: "Clutch Slave Cylinder"},
					},
				},
				{
					ID:   "engine",
					Name: "Engine",
					Parts: []models.Part{
						{ID: "pistons", Name: "Pistons"},
						{ID: "timing-belt", Name: "Timing Belt"},
						{ID: "timing-chain", Name: "Timing Chain"},
						{ID: "engine-bearings", Name: "Engine Bearings"},
						{ID: "valve-cover", Name: "Valve Cover"},
						{ID: "head-gasket", Name: "Head Gasket"},
						{ID: "oil-pump", Name: "Oil Pump"},
						{ID: "engine-mount", Name: "Engine Mount"},
					},
				},
				{
					ID:   "suspension",
					Name: "Suspension",
					Parts: []models.Part{
						{ID: "shock-absorber", Name: "Shock Absorber"},
						{ID: "strut-mount", Name: "Strut Mount"},
						{ID: "control-arm", Name: "Control Arm"},
						{ID: "ball-joint", Name: "Ball Joint"},
						{ID: "tie-rod", Name: "Tie Rod"},
						{ID: "stabilizer-link", Name: "Stabilizer Link"},
						{ID: "wheel-bearing", Name: "Wheel Bearing"},
					},
				},
				{
					ID:   "electrical",
					Name: "Electrical",
					Parts: []models.Part{
						{ID: "alternator", Name: "Alternator"},
						{ID: "starter", Name: "Starter"},
						{ID: "battery", Name: "Battery"},
						{ID: "spark-plug", Name: "Spark Plug"},
						{ID: "ignition-coil", Name: "Ignition Coil"},
						{ID: "sensors", Name: "Sensors"},
					},
				},
				{
					ID:   "filters",
					Name: "Filters",
					Parts: []models.Part{
						{ID: "oil-filter", Name: "Oil Filter"},
						{ID: "air-filter", Name: "Air Filter"},
						{ID: "fuel-filter", Name: "Fuel Filter"},
						{ID: "cabin-filter", Name: "Cabin Filter"},
					},
				},
			},
		},
		{
			ID:         "oils",
			Name:       "OILS",
			Icon:       "fa-oil-can",
			IsExpanded: false,
			SubCategories: []models.SubCategory{
				// Reference lines 111-136 for oils subcategories
				{
					ID:   "engine-oils",
					Name: "Engine Oils",
					Parts: []models.Part{
						{ID: "synthetic-oil", Name: "Synthetic Oil"},
						{ID: "semi-synthetic-oil", Name: "Semi-Synthetic Oil"},
						{ID: "mineral-oil", Name: "Mineral Oil"},
					},
				},
				{
					ID:   "transmission-oils",
					Name: "Transmission Oils",
					Parts: []models.Part{
						{ID: "manual-transmission-oil", Name: "Manual Transmission Oil"},
						{ID: "automatic-transmission-oil", Name: "Automatic Transmission Oil"},
					},
				},
				{
					ID:   "brake-fluids",
					Name: "Brake Fluids",
					Parts: []models.Part{
						{ID: "dot-3", Name: "DOT 3"},
						{ID: "dot-4", Name: "DOT 4"},
						{ID: "dot-5", Name: "DOT 5"},
					},
				},
			},
		},
		{
			ID:         "accessories",
			Name:       "ACCESSORIES",
			Icon:       "fa-cogs",
			IsExpanded: false,
			SubCategories: []models.SubCategory{
				// Reference lines 146-162 for accessories subcategories
				{
					ID:   "car-care",
					Name: "Car Care",
					Parts: []models.Part{
						{ID: "cleaning-products", Name: "Cleaning Products"},
						{ID: "polishing-products", Name: "Polishing Products"},
						{ID: "car-covers", Name: "Car Covers"},
					},
				},
				{
					ID:   "interior-accessories",
					Name: "Interior Accessories",
					Parts: []models.Part{
						{ID: "floor-mats", Name: "Floor Mats"},
						{ID: "seat-covers", Name: "Seat Covers"},
						{ID: "steering-wheel-covers", Name: "Steering Wheel Covers"},
					},
				},
			},
		},
		{
			ID:            "promotions",
			Name:          "PROMOTIONS",
			Icon:          "fa-tag",
			IsExpanded:    false,
			SubCategories: []models.SubCategory{},
		},
	}
	// Insert categories
	interfaceCategories := make([]interface{}, len(categories))
	for i, v := range categories {
		interfaceCategories[i] = v
	}
	_, err := database.Collection("Categories").InsertMany(context.TODO(), interfaceCategories)
	if err != nil {
		return err
	}

	// Seed vehicles
	// Reference lines 201-666 for complete vehicle list
	vehicles := []models.Vehicle{
		{
			VehicleBrand: "alfa-romeo",
			ID:           "alfa-romeo",
			Name:         "Alfa Romeo",
			LogoURL:      "assets/images/vehicle_brand/alfa-romeo.svg",
			Years:        generateYears(2024, 25),
			Model:        []string{"Giulia", "Stelvio", "Tonale", "4C Spider", "8C Competizione", "Brera", "MiTo", "Spider"},
		},
		{
			VehicleBrand: "aston-martin",
			ID:           "aston-martin",
			Name:         "Aston Martin",
			LogoURL:      "assets/images/vehicle_brand/aston-martin.svg",
			Years:        generateYears(2024, 25),
			Model:        []string{"DBX", "DB11", "Vantage", "Rapide", "DB9", "Vanquish", "Virage", "Cygnet"},
		},
		{
			VehicleBrand: "audi",
			ID:           "audi",
			Name:         "Audi",
			LogoURL:      "assets/images/vehicle_brand/audi.svg",
			Years:        generateYears(2024, 25),
			Model: []string{
				"A1", "A3", "A4", "A5", "A6", "A7", "A8",
				"Q2", "Q3", "Q5", "Q7", "Q8",
				"TT", "R8", "RS3", "RS5", "RS6", "RS7", "RS Q8"},
		},
		{
			VehicleBrand: "bentley",
			ID:           "bentley",
			Name:         "Bentley",
			LogoURL:      "assets/images/vehicle_brand/bentley.svg",
			Years:        generateYears(2024, 25),
			Model:        []string{"Continental GT", "Flying Spur", "Bentayga", "Mulsanne", "Arnage", "Azure"},
		},
		{
			VehicleBrand: "bmw",
			ID:           "bmw",
			Name:         "BMW",
			LogoURL:      "assets/images/vehicle_brand/bmw.svg",
			Years:        generateYears(2024, 25),
			Model: []string{
				"1 Series", "2 Series", "3 Series", "4 Series", "5 Series", "6 Series", "7 Series", "8 Series",
				"X1", "X3", "X4", "X5", "X6", "X7",
				"Z4", "i3", "i4", "i7", "iX", "M3", "M4", "M5", "M8"},
		},
		{
			VehicleBrand: "cadillac",
			ID:           "cadillac",
			Name:         "Cadillac",
			LogoURL:      "assets/images/vehicle_brand/cadillac.svg",
			Years:        generateYears(2024, 25),
			Model:        []string{"CT4", "CT5", "Escalade", "XT4", "XT5", "XT6", "Lyriq", "CTS", "SRX", "XLR", "DTS", "ATS"},
		},
		{
			VehicleBrand: "chevrolet",
			ID:           "chevrolet",
			Name:         "Chevrolet",
			LogoURL:      "assets/images/vehicle_brand/chevrolet.svg",
			Years:        generateYears(2024, 25),
			Model:        []string{"Camaro", "Corvette", "Malibu", "Impala", "Silverado", "Equinox", "Traverse", "Tahoe", "Suburban"},
		},
		{
			VehicleBrand: "chrysler",
			ID:           "chrysler",
			Name:         "Chrysler",
			LogoURL:      "assets/images/vehicle_brand/chrysler.svg",
			Years:        generateYears(2024, 25),
			Model:        []string{"300", "Pacifica", "Voyager", "Aspen", "Crossfire", "Sebring", "PT Cruiser", "Town & Country"},
		},
		{
			VehicleBrand: "citroen",
			ID:           "citroen",
			Name:         "Citroën",
			LogoURL:      "assets/images/vehicle_brand/citroen.svg",
			Years:        generateYears(2024, 25),
			Model:        []string{"C1", "C3", "C4", "C5", "C6", "Berlingo", "SpaceTourer", "DS3", "DS4", "DS5"},
		},
		{
			VehicleBrand: "mercedes",
			ID:           "mercedes",
			Name:         "Mercedes-Benz",
			LogoURL:      "assets/images/vehicle_brand/mercedes.svg",
			Years:        generateYears(2024, 25),
			Model: []string{
				"A-Class", "B-Class", "C-Class", "E-Class", "S-Class",
				"GLA", "GLB", "GLC", "GLE", "GLS",
				"G-Class", "AMG GT", "CLA", "CLS",
				"EQC", "EQS", "EQB", "SL", "SLC"},
		},
		{
			VehicleBrand: "dacia",
			ID:           "dacia",
			Name:         "Dacia",
			LogoURL:      "assets/images/vehicle_brand/dacia.svg",
			Years:        generateYears(2024, 25),
			Model:        []string{"Sandero", "Duster", "Logan", "Spring", "Jogger", "Lodgy", "Dokker"},
		},
		{
			VehicleBrand: "daewoo",
			ID:           "daewoo",
			Name:         "Daewoo",
			LogoURL:      "assets/images/vehicle_brand/daewoo.svg",
			Years:        generateYears(2024, 25),
			Model:        []string{"Lanos", "Matiz", "Nubira", "Leganza", "Kalos", "Tacuma", "Evanda", "Espero"},
		},
		{
			VehicleBrand: "daihatsu",
			ID:           "daihatsu",
			Name:         "Daihatsu",
			LogoURL:      "assets/images/vehicle_brand/daihatsu.svg",
			Years:        generateYears(2024, 25),
			Model:        []string{"Terios", "Sirion", "Materia", "Charade", "YRV", "Copen", "Move", "Cuore"},
		},
		{
			VehicleBrand: "dodge",
			ID:           "dodge",
			Name:         "Dodge",
			LogoURL:      "assets/images/vehicle_brand/dodge.svg",
			Years:        generateYears(2024, 25),
			Model:        []string{"Challenger", "Charger", "Durango", "Journey", "Ram", "Viper", "Caliber", "Avenger"},
		},
		{
			VehicleBrand: "ferrari",
			ID:           "ferrari",
			Name:         "Ferrari",
			LogoURL:      "assets/images/vehicle_brand/ferrari.svg",
			Years:        generateYears(2024, 25),
			Model:        []string{"F8 Tributo", "SF90 Stradale", "Roma", "812 Superfast", "Portofino", "F12", "458", "488"},
		},
		{
			VehicleBrand: "fiat",
			ID:           "fiat",
			Name:         "Fiat",
			LogoURL:      "assets/images/vehicle_brand/fiat.svg",
			Years:        generateYears(2024, 25),
			Model:        []string{"500", "Panda", "Tipo", "Punto", "Bravo", "Doblo", "Ducato", "Multipla"},
		},
		{
			VehicleBrand: "ford",
			ID:           "ford",
			Name:         "Ford",
			LogoURL:      "assets/images/vehicle_brand/ford.svg",
			Years:        generateYears(2024, 25),
			Model:        []string{"Fiesta", "Focus", "Mondeo", "Mustang", "Kuga", "Puma", "Explorer", "Ranger", "Transit"},
		},
		{
			VehicleBrand: "honda",
			ID:           "honda",
			Name:         "Honda",
			LogoURL:      "assets/images/vehicle_brand/honda.svg",
			Years:        generateYears(2024, 25),
			Model:        []string{"Civic", "Accord", "CR-V", "HR-V", "Jazz", "NSX", "e", "Insight"},
		},
		{
			VehicleBrand: "hyundai",
			ID:           "hyundai",
			Name:         "Hyundai",
			LogoURL:      "assets/images/vehicle_brand/hyundai.svg",
			Years:        generateYears(2024, 25),
			Model:        []string{"i10", "i20", "i30", "Tucson", "Santa Fe", "IONIQ", "KONA", "Elantra", "Veloster"},
		},
		{
			VehicleBrand: "infiniti",
			ID:           "infiniti",
			Name:         "Infiniti",
			LogoURL:      "assets/images/vehicle_brand/infiniti.svg",
			Years:        generateYears(2024, 25),
			Model:        []string{"Q30", "Q50", "Q60", "QX30", "QX50", "QX70", "QX80"},
		},
		{
			VehicleBrand: "isuzu",
			ID:           "isuzu",
			Name:         "Isuzu",
			LogoURL:      "assets/images/vehicle_brand/isuzu.svg",
			Years:        generateYears(2024, 25),
			Model:        []string{"D-Max", "Trooper", "Rodeo", "N-Series", "F-Series", "MU-X"},
		},
		{
			VehicleBrand: "iveco",
			ID:           "iveco",
			Name:         "Iveco",
			LogoURL:      "assets/images/vehicle_brand/iveco.svg",
			Years:        generateYears(2024, 25),
			Model:        []string{"Daily", "Eurocargo", "Stralis", "Trakker", "S-Way", "Massif"},
		},
		{
			VehicleBrand: "jaguar",
			ID:           "jaguar",
			Name:         "Jaguar",
			LogoURL:      "assets/images/vehicle_brand/jaguar.svg",
			Years:        generateYears(2024, 25),
			Model:        []string{"XE", "XF", "XJ", "F-Type", "F-Pace", "E-Pace", "I-Pace", "XK"},
		},
		{
			VehicleBrand: "jeep",
			ID:           "jeep",
			Name:         "Jeep",
			LogoURL:      "assets/images/vehicle_brand/jeep.svg",
			Years:        generateYears(2024, 25),
			Model:        []string{"Wrangler", "Cherokee", "Grand Cherokee", "Compass", "Renegade", "Gladiator", "Commander"},
		},
		{
			VehicleBrand: "kia",
			ID:           "kia",
			Name:         "Kia",
			LogoURL:      "assets/images/vehicle_brand/kia.svg",
			Years:        generateYears(2024, 25),
			Model:        []string{"Picanto", "Rio", "Ceed", "Sportage", "Sorento", "Stinger", "EV6", "Niro", "Soul"},
		},
		{
			VehicleBrand: "lada",
			ID:           "lada",
			Name:         "Lada",
			LogoURL:      "assets/images/vehicle_brand/lada.svg",
			Years:        generateYears(2024, 25),
			Model:        []string{"Niva", "Vesta", "XRAY", "Granta", "Kalina", "Priora", "4x4"},
		},
		{
			VehicleBrand: "lamborghini",
			ID:           "lamborghini",
			Name:         "Lamborghini",
			LogoURL:      "assets/images/vehicle_brand/lamborghini.svg",
			Years:        generateYears(2024, 25),
			Model:        []string{"Aventador", "Huracán", "Urus", "Gallardo", "Murciélago", "Diablo"},
		},
		{
			VehicleBrand: "land-rover",
			ID:           "land-rover",
			Name:         "Land Rover",
			LogoURL:      "assets/images/vehicle_brand/land-rover.svg",
			Years:        generateYears(2024, 25),
			Model:        []string{"Range Rover", "Range Rover Sport", "Range Rover Evoque", "Discovery", "Discovery Sport", "Defender"},
		},
		{
			VehicleBrand: "lexus",
			ID:           "lexus",
			Name:         "Lexus",
			LogoURL:      "assets/images/vehicle_brand/lexus.svg",
			Years:        generateYears(2024, 25),
			Model:        []string{"IS", "ES", "LS", "NX", "RX", "UX", "LC", "RC", "GX", "LX"},
		},
		{
			VehicleBrand: "maserati",
			ID:           "maserati",
			Name:         "Maserati",
			LogoURL:      "assets/images/vehicle_brand/maserati.svg",
			Years:        generateYears(2024, 25),
			Model:        []string{"Ghibli", "Quattroporte", "Levante", "MC20", "GranTurismo", "GranCabrio"},
		},

		{
			VehicleBrand: "mazda",
			ID:           "mazda",
			Name:         "Mazda",
			LogoURL:      "assets/images/vehicle_brand/mazda.svg",
			Years:        generateYears(2024, 25),
			Model:        []string{"2", "3", "6", "CX-3", "CX-30", "CX-5", "CX-60", "MX-5", "RX-8"},
		},

		{
			VehicleBrand: "mg",
			ID:           "mg",
			Name:         "MG",
			LogoURL:      "assets/images/vehicle_brand/mg.svg",
			Years:        generateYears(2024, 25),
			Model:        []string{"ZS", "HS", "EHS", "3", "5", "6", "GS", "TF"},
		},

		{
			VehicleBrand: "mini",
			ID:           "mini",
			Name:         "MINI",
			LogoURL:      "assets/images/vehicle_brand/mini.svg",
			Years:        generateYears(2024, 25),
			Model:        []string{"Cooper", "Countryman", "Clubman", "Paceman", "Roadster", "Coupe", "Electric"},
		},

		{
			VehicleBrand: "mitsubishi",
			ID:           "mitsubishi",
			Name:         "Mitsubishi",
			LogoURL:      "assets/images/vehicle_brand/mitsubishi.svg",
			Years:        generateYears(2024, 25),
			Model:        []string{"ASX", "Outlander", "Eclipse Cross", "L200", "Space Star", "Pajero", "Lancer"},
		},

		{
			VehicleBrand: "nissan",
			ID:           "nissan",
			Name:         "Nissan",
			LogoURL:      "assets/images/vehicle_brand/nissan.svg",
			Years:        generateYears(2024, 25),
			Model:        []string{"Micra", "Juke", "Qashqai", "X-Trail", "Leaf", "GT-R", "370Z", "Navara", "Ariya"},
		},

		{
			VehicleBrand: "opel",
			ID:           "opel",
			Name:         "Opel",
			LogoURL:      "assets/images/vehicle_brand/opel.svg",
			Years:        generateYears(2024, 25),
			Model:        []string{"Corsa", "Astra", "Insignia", "Mokka", "Crossland", "Grandland", "Combo", "Zafira"},
		},
		{
			VehicleBrand: "peugeot",
			ID:           "peugeot",
			Name:         "Peugeot",
			LogoURL:      "assets/images/vehicle_brand/peugeot.svg",
			Years:        generateYears(2024, 25),
			Model:        []string{"108", "208", "308", "408", "508", "2008", "3008", "5008", "Rifter", "Traveller"},
		},

		{
			VehicleBrand: "pontiac",
			ID:           "pontiac",
			Name:         "Pontiac",
			LogoURL:      "assets/images/vehicle_brand/pontiac.svg",
			Years:        generateYears(2024, 25),
			Model:        []string{"GTO", "Firebird", "Trans Am", "Grand Prix", "Grand Am", "Solstice", "G6", "G8"},
		},

		{
			VehicleBrand: "porsche",
			ID:           "porsche",
			Name:         "Porsche",
			LogoURL:      "assets/images/vehicle_brand/porsche.svg",
			Years:        generateYears(2024, 25),
			Model:        []string{"911", "Cayenne", "Panamera", "Macan", "Taycan", "Cayman", "Boxster", "718"},
		},

		{
			VehicleBrand: "renault",
			ID:           "renault",
			Name:         "Renault",
			LogoURL:      "assets/images/vehicle_brand/renault.svg",
			Years:        generateYears(2024, 25),
			Model:        []string{"Clio", "Megane", "Captur", "Kadjar", "Scenic", "Talisman", "Zoe", "Twingo", "Kangoo"},
		},

		{
			VehicleBrand: "rover",
			ID:           "rover",
			Name:         "Rover",
			LogoURL:      "assets/images/vehicle_brand/rover.svg",
			Years:        generateYears(2024, 25),
			Model:        []string{"25", "45", "75", "200", "400", "600", "800", "Streetwise"},
		},

		{
			VehicleBrand: "saab",
			ID:           "saab",
			Name:         "Saab",
			LogoURL:      "assets/images/vehicle_brand/saab.svg",
			Years:        generateYears(2024, 25),
			Model:        []string{"9-3", "9-5", "900", "9000", "9-2X", "9-4X", "9-7X"},
		},

		{
			VehicleBrand: "seat",
			ID:           "seat",
			Name:         "SEAT",
			LogoURL:      "assets/images/vehicle_brand/seat.svg",
			Years:        generateYears(2024, 25),
			Model:        []string{"Ibiza", "Leon", "Ateca", "Arona", "Tarraco", "Alhambra", "Mii", "Toledo"},
		},

		{
			VehicleBrand: "skoda",
			ID:           "skoda",
			Name:         "Škoda",
			LogoURL:      "assets/images/vehicle_brand/skoda.svg",
			Years:        generateYears(2024, 25),
			Model:        []string{"Fabia", "Octavia", "Superb", "Kodiaq", "Karoq", "Kamiq", "Scala", "Enyaq"},
		},

		{
			VehicleBrand: "smart",
			ID:           "smart",
			Name:         "Smart",
			LogoURL:      "assets/images/vehicle_brand/smart.svg",
			Years:        generateYears(2024, 25),
			Model:        []string{"ForTwo", "ForFour", "Roadster", "Crossblade", "#1"},
		},

		{
			VehicleBrand: "ssangyong",
			ID:           "ssangyong",
			Name:         "SsangYong",
			LogoURL:      "assets/images/vehicle_brand/ssangyong.svg",
			Years:        generateYears(2024, 25),
			Model:        []string{"Korando", "Rexton", "Tivoli", "XLV", "Musso", "Rodius", "Actyon"},
		},

		{
			VehicleBrand: "subaru",
			ID:           "subaru",
			Name:         "Subaru",
			LogoURL:      "assets/images/vehicle_brand/subaru.svg",
			Years:        generateYears(2024, 25),
			Model:        []string{"Impreza", "Legacy", "Outback", "Forester", "XV", "BRZ", "WRX", "Levorg"},
		},

		{
			VehicleBrand: "suzuki",
			ID:           "suzuki",
			Name:         "Suzuki",
			LogoURL:      "assets/images/vehicle_brand/suzuki.svg",
			Years:        generateYears(2024, 25),
			Model:        []string{"Swift", "Vitara", "S-Cross", "Jimny", "Ignis", "Baleno", "Alto", "Grand Vitara"},
		},

		{
			VehicleBrand: "tata",
			ID:           "tata",
			Name:         "Tata",
			LogoURL:      "assets/images/vehicle_brand/tata.svg",
			Years:        generateYears(2024, 25),
			Model:        []string{"Nexon", "Harrier", "Safari", "Tiago", "Altroz", "Punch", "Hexa"},
		},

		{
			VehicleBrand: "tesla",
			ID:           "tesla",
			Name:         "Tesla",
			LogoURL:      "assets/images/vehicle_brand/tesla.svg",
			Years:        generateYears(2024, 25),
			Model:        []string{"Model S", "Model 3", "Model X", "Model Y", "Cybertruck", "Roadster"},
		},

		{
			VehicleBrand: "toyota",
			ID:           "toyota",
			Name:         "Toyota",
			LogoURL:      "assets/images/vehicle_brand/toyota.svg",
			Years:        generateYears(2024, 25),
			Model:        []string{"Yaris", "Corolla", "Camry", "RAV4", "C-HR", "Prius", "Land Cruiser", "Hilux", "Supra", "Aygo"},
		},

		{
			VehicleBrand: "volkswagen",
			ID:           "volkswagen",
			Name:         "Volkswagen",
			LogoURL:      "assets/images/vehicle_brand/volkswagen.svg",
			Years:        generateYears(2024, 25),
			Model:        []string{"Golf", "Polo", "Passat", "Tiguan", "T-Roc", "T-Cross", "Touareg", "ID.3", "ID.4", "Arteon"},
		},

		{
			VehicleBrand: "volvo",
			ID:           "volvo",
			Name:         "Volvo",
			LogoURL:      "assets/images/vehicle_brand/volvo.svg",
			Years:        generateYears(2024, 25),
			Model:        []string{"S60", "S90", "V60", "V90", "XC40", "XC60", "XC90", "C40", "Polestar 2"},
		},
	}
	interfaceVehicles := make([]interface{}, len(vehicles))
	for i, v := range vehicles {
		interfaceVehicles[i] = v
	}
	_, err = database.Collection("Vehicles").InsertMany(context.TODO(), interfaceVehicles)
	if err != nil {
		return err
	}

	// Seed product brands
	// Reference lines 668-682 for product brands
	productBrands := []models.ProductBrand{
		// All product brand data here
		{
			ID:      "bosch",
			Name:    "Bosch",
			LogoURL: "assets/images/product_brand/bosch.svg",
		},
		{
			ID:      "febi",
			Name:    "Febi",
			LogoURL: "assets/images/product_brand/febi.svg",
		},
		{
			ID:      "luk",
			Name:    "LUK",
			LogoURL: "assets/images/product_brand/luk.svg",
		},
		{
			ID:      "sachs",
			Name:    "Sachs",
			LogoURL: "assets/images/product_brand/sachs.svg",
		},
		{
			ID:      "valeo",
			Name:    "Valeo",
			LogoURL: "assets/images/product_brand/valeo.svg",
		},
		{
			ID:      "mann-filter",
			Name:    "MANN-FILTER",
			LogoURL: "assets/images/product_brand/mann-filter.svg",
		},
		{
			ID:      "gates",
			Name:    "Gates",
			LogoURL: "assets/images/product_brand/gates.svg",
		},
		{
			ID:      "continental",
			Name:    "Continental",
			LogoURL: "assets/images/product_brand/continental.svg",
		},
		{
			ID:      "skf",
			Name:    "SKF",
			LogoURL: "assets/images/product_brand/skf.svg",
		},
		{
			ID:      "ngk",
			Name:    "NGK",
			LogoURL: "assets/images/product_brand/ngk.svg",
		},
		{
			ID:      "ina",
			Name:    "INA",
			LogoURL: "assets/images/product_brand/ina.svg",
		},
		{
			ID:      "bsg",
			Name:    "BSG",
			LogoURL: "assets/images/product_brand/bsg.svg",
		},
	}
	// Convert productBrands to []interface{}
	interfaceBrands := make([]interface{}, len(productBrands))
	for i, v := range productBrands {
		interfaceBrands[i] = v
	}
	_, err = database.Collection("ProductBrands").InsertMany(context.TODO(), interfaceBrands)
	return err

}
func generateYears(startYear, count int) []int {
	years := make([]int, count)
	for i := 0; i < count; i++ {
		years[i] = startYear - i
	}
	return years
}
