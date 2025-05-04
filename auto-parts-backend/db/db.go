package db

import (
	"context"
	"log"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var Client *mongo.Client
var database *mongo.Database

// ConnectDB initializes the MongoDB connection
func ConnectDB() error {
	// Update these credentials with your actual MongoDB Atlas credentials
	username := "dbHassan"
	password := "1qDMW6Ps9Rgp0Rs0" // Make sure this is your actual password
	cluster := "hastechcluster.ikp2w.mongodb.net"
	dbName := "Ecommerce"

	// Construct the connection string
	uri := "mongodb+srv://" + username + ":" + password + "@" + cluster + "/" + dbName + "?retryWrites=true&w=majority&authSource=admin"

	// Create client options
	clientOptions := options.Client().ApplyURI(uri)

	// Connect to MongoDB
	var err error
	Client, err = mongo.Connect(context.TODO(), clientOptions)
	if err != nil {
		log.Fatal("Error connecting to MongoDB:", err)
	}

	// Check the connection
	err = Client.Ping(context.TODO(), nil)
	if err != nil {
		log.Fatal("Error pinging MongoDB:", err)
	}

	log.Println("Connected to MongoDB successfully!")
	database = Client.Database(dbName)
	return nil
}

// Collection returns a handle to the specified collection
func Collection(name string) *mongo.Collection {
	return database.Collection(name)
}
