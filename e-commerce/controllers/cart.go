package controllers

import (
	"commerce/database"
	"commerce/models"
	"context"
	"errors"
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type Application struct {
	ProdCollection *mongo.Collection
	UserCollection *mongo.Collection
}

func NewApplication(prodCollection, userCollection *mongo.Collection) *Application {
	return &Application{
		ProdCollection: prodCollection,
		UserCollection: userCollection,
	}
}

func (app *Application) AddToCart() gin.HandlerFunc {
	return func(c *gin.Context) {
		productQueryId := c.Query(("id"))
		if productQueryId == "" {
			log.Println("product id is empty")

			_ = c.AbortWithError(http.StatusBadRequest, errors.New("product is empty"))
			return

		}
		userQueryID := c.Query("userID")

		if userQueryID == "" {
			_ = c.AbortWithError(http.StatusBadRequest, errors.New("user_id is empty"))
			return
		}

		productID, err := primitive.ObjectIDFromHex(productQueryId)

		if err != nil {
			log.Println(err)
			c.AbortWithStatus(http.StatusInternalServerError)
			return
		}

		var ctx, cancel = context.WithTimeout(context.Background(), 5*time.Second)

		defer cancel()
		err = database.AddProductToCart(ctx, app.ProdCollection, app.UserCollection, productID, userQueryID)

		if err != nil {
			c.IndentedJSON(http.StatusInternalServerError, err)
		}
		c.IndentedJSON(200, "Successfully added to the cart")

	}

}

func (app *Application) RemoveItem() gin.HandlerFunc {

	return func(c *gin.Context) {
		productQueryID := c.Query("id")

		if productQueryID == "" {
			_ = c.AbortWithError(http.StatusBadRequest, errors.New("id is empty"))
			return
		}

		userQueryID := c.Query("userID")

		if userQueryID == "" {
			_ = c.AbortWithError(http.StatusBadRequest, errors.New("userID is empty"))
			return
		}
		productID, err := primitive.ObjectIDFromHex(productQueryID)

		if err != nil {
			log.Println(err)

			c.AbortWithStatus(http.StatusInternalServerError)
			return
		}

		var ctx, cancel = context.WithTimeout(context.Background(), 5*time.Second)

		defer cancel()

		err = database.RemoveCartIten(ctx, app.ProdCollection, app.UserCollection, productID, userQueryID)

		if err != nil {
			log.Println(err)
			c.IndentedJSON(http.StatusInternalServerError, err)
			return
		}

		c.IndentedJSON(200, "Successfully removed item from cart")

	}

}

func GetItemFromCart() gin.HandlerFunc {
	return func(c *gin.Context) {
		user_id := c.Query("id")

		if user_id == "" {
			c.Header("Content-Type", "application/json")
			c.JSON(http.StatusBadRequest, "invalid")
			c.Abort()
			return
		}

		usert_id, _ := primitive.ObjectIDFromHex(user_id)

		var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)

		defer cancel()

		var fillCart models.User
		err := UserCollection.FindOne(ctx, bson.D{{Key: "_id", Value: usert_id}}).Decode(&fillCart)

		if err != nil {
			log.Println(err)
			c.IndentedJSON(500, "not found")
			return

		}
		filler_match := bson.D{{Key: "$match", Value: bson.D{primitive.E{Key: "_id", Value: usert_id}}}}
		unwind := bson.D{{Key: "$unwind", Value: bson.D{primitive.E{Key: "path", Value: "$usercart"}}}}
		grouping := bson.D{{Key: "&group", Value: bson.D{primitive.E{Key: "_id", Value: "$_id"}, {Key: "total", Value: bson.D{primitive.E{Key: "$sum", Value: "$usercart.price"}}}}}}

		pointCursor, err := UserCollection.Aggregate(ctx, mongo.Pipeline{filler_match, unwind, grouping})

		if err != nil {
			log.Println(err)
		}

		var listing []bson.M

		if err = pointCursor.All(ctx, &listing); err != nil {
			log.Println(err)
			c.AbortWithStatus(http.StatusInternalServerError)

		}
		for _, json := range listing {

			c.IndentedJSON(200, json["total"])
			c.IndentedJSON(200, fillCart.UserCart)

		}

		ctx.Done()

	}

}

func (app *Application) BuyFromCart() gin.HandlerFunc {

	return func(c *gin.Context) {

		userQueryID := c.Query("id")

		if userQueryID == "" {
			log.Println("user_id is empty")

			_ = c.AbortWithError(http.StatusBadRequest, errors.New("userID is empty"))
			return
		}

		var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)

		defer cancel()

		err := database.BuyItemFromCart(ctx, app.UserCollection, userQueryID)

		if err != nil {
			c.IndentedJSON(http.StatusInternalServerError, err)

			return
		}

		c.IndentedJSON(200, "Successfully bought from item cart")
	}

}

func (app *Application) InstantBuy() gin.HandlerFunc {
	return func(c *gin.Context) {
		productQueryID := c.Query("id")

		if productQueryID == "" {
			_ = c.AbortWithError(http.StatusBadRequest, errors.New("id is empty"))
			return
		}

		userQueryID := c.Query("userID")

		if userQueryID == "" {
			_ = c.AbortWithError(http.StatusBadRequest, errors.New("user_idmis empty"))

			return
		}

		productID, err := primitive.ObjectIDFromHex(productQueryID)

		if err != nil {
			log.Println(err)
			c.AbortWithStatus(http.StatusInternalServerError)
			return
		}

		var ctx, cancel = context.WithTimeout(context.Background(), 5*time.Second)

		defer cancel()

		err = database.InstantBuyFromCart(ctx, app.ProdCollection, app.UserCollection, productID, userQueryID)

		if err != nil {
			c.IndentedJSON(http.StatusInternalServerError, err)

			return
		}

		c.IndentedJSON(200, "Successfully cart bougth")
	}

}