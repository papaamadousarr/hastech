package db

import (
	"context"
	"fmt"
	"log"
	"os"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var Client *mongo.Client
var database *mongo.Database

// ConnectDB initializes the MongoDB connection
func ConnectDB() error {
	// Get credentials from environment variables
	username := os.Getenv("MONGODB_USERNAME")
	password := os.Getenv("MONGODB_PASSWORD")
	cluster := os.Getenv("MONGODB_CLUSTER")
	dbName := os.Getenv("MONGODB_DATABASE")

	// Set defaults if environment variables are not set
	if username == "" {
		username = "dbHassan"
	}
	if password == "" {
		password = "1qDMW6Ps9Rgp0Rs0"
	}
	if cluster == "" {
		cluster = "hastechcluster.ikp2w.mongodb.net"
	}
	if dbName == "" {
		dbName = "Ecommerce"
	}

	// Construct the connection string
	uri := "mongodb+srv://" + username + ":" + password + "@" + cluster + "/" + dbName + "?retryWrites=true&w=majority&appName=hastechCluster"

	// Log connection attempt (without password)
	log.Printf("Attempting to connect to MongoDB: mongodb+srv://%s:***@%s/%s", username, cluster, dbName)

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

	// Créer les index pour optimiser les performances
	if err := createIndexes(); err != nil {
		log.Printf("Warning: Failed to create indexes: %v", err)
	}

	return nil
}

// createIndexes crée les index nécessaires pour optimiser les requêtes
func createIndexes() error {
	ctx := context.Background()

	// Index pour la collection category
	categoryCollection := database.Collection("category")

	// Index sur slug pour les recherches rapides
	_, err := categoryCollection.Indexes().CreateOne(ctx, mongo.IndexModel{
		Keys:    bson.D{{Key: "slug", Value: 1}},
		Options: options.Index().SetUnique(true),
	})
	if err != nil {
		return fmt.Errorf("failed to create slug index: %v", err)
	}

	// Index sur id pour les recherches rapides
	_, err = categoryCollection.Indexes().CreateOne(ctx, mongo.IndexModel{
		Keys:    bson.D{{Key: "id", Value: 1}},
		Options: options.Index().SetUnique(true),
	})
	if err != nil {
		return fmt.Errorf("failed to create id index: %v", err)
	}

	// Index sur name pour les recherches textuelles
	_, err = categoryCollection.Indexes().CreateOne(ctx, mongo.IndexModel{
		Keys: bson.D{{Key: "name", Value: 1}},
	})
	if err != nil {
		return fmt.Errorf("failed to create name index: %v", err)
	}

	log.Println("Indexes created successfully")
	return nil
}

// Collection returns a handle to the specified collection
func Collection(name string) *mongo.Collection {
	return database.Collection(name)
}
