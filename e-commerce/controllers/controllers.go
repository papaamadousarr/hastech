package controllers

import (
	"commerce/database"
	"commerce/models"
	generate "commerce/tokens"
	"context"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"golang.org/x/crypto/bcrypt"
)

var UserCollection *mongo.Collection = database.UserData(database.Client, "Users")
var ProductCollection *mongo.Collection = database.ProductData(database.Client, "Products")
var Validate = validator.New()

func HashPassword(password string) string {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)

	if err != nil {
		log.Fatal(err)
	}
	return string(bytes)

}

func VerifyPassword(userPasswor string, givenPassword string) (bool, string) {

	err := bcrypt.CompareHashAndPassword([]byte(givenPassword), []byte(userPasswor))

	msg := ""
	var valid = true

	if err != nil {
		msg = "Login or Password is not valid"
		valid = false

	}

	return valid, msg

}

func SignUp() gin.HandlerFunc {

	return func(c *gin.Context) {
		var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
		defer cancel()

		var user models.User
		if err := c.BindJSON(&user); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error:": err.Error()})
			return
		}
		validationErr := Validate.Struct(user)
		//generated.TokenGeneator()

		if validationErr != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": validationErr})
			return
		}
		count, err := UserCollection.CountDocuments(ctx, bson.M{"email": user.Email})
		fmt.Println(bson.M{"email": user.Email}, count)
		if err != nil {
			log.Panic(err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": user.Email})
			return
		}

		if count > 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "email already exist"})
			return
		}

		count, err = UserCollection.CountDocuments(ctx, bson.M{"phone": user.Phone})

		defer cancel()

		if err != nil {
			log.Panic(err)
			c.JSON(http.StatusBadRequest, gin.H{"errorSign": err})
			return
		}

		if count > 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "this phone no. is already exist in use"})
			return
		}
		user.Created_At, _ = time.Parse(time.RFC3339, time.Now().Format(time.RFC3339))
		user.Updated_At, _ = time.Parse(time.RFC3339, time.Now().Format(time.RFC3339))
		user.ID = primitive.NewObjectID()
		user.User_ID = user.ID.Hex()

		token, refreshtoken, _ := generate.TokenGeneator(*user.Email, *user.First_Name, *user.Last_Name, user.User_ID)
		user.Token = &token
		user.Refresh_Token = &refreshtoken
		user.UserCart = make([]models.ProductUser, 0)
		user.Address_Details = make([]models.Shipping, 0)
		user.Order_Status = make([]models.Order, 0)
		// Définir le rôle par défaut comme "client"
		user.User_Role = "client"

		_, inserterr := UserCollection.InsertOne(ctx, user)

		if inserterr != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "the user did not created"})
			return
		}
		defer cancel()

		c.JSON(http.StatusCreated, "Successfully signed in!")
	}

}

func Login() gin.HandlerFunc {

	return func(c *gin.Context) {
		var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)

		defer cancel()

		var user models.User

		if err := c.BindJSON(&user); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err})
			return
		}
		var founduser *models.User
		err := UserCollection.FindOne(ctx, bson.M{"email": user.Email}).Decode(&founduser)

		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Login or password incorrect"})
			return
		}

		PasswordInvalid, msg := VerifyPassword(*user.Password, *founduser.Password)
		fmt.Println(PasswordInvalid)

		defer cancel()

		if PasswordInvalid {
			c.JSON(http.StatusUnauthorized, gin.H{"error": msg})
			fmt.Println(msg)
			return
		}
		token, refreshtoken, _ := generate.TokenGeneator(*founduser.Email, *founduser.First_Name, *founduser.Last_Name, founduser.User_ID)

		defer cancel()

		generate.UpdateAllTokens(token, refreshtoken, founduser.User_ID)

		founduser.Password = nil // Ne pas envoyer le mot de passe dans la réponse

		c.JSON(http.StatusOK, founduser)
	}
}

func ProductViewerAdmin() gin.HandlerFunc {

	return func(c *gin.Context) {
		var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
		defer cancel()
		var products models.Product

		if err := c.BindJSON(&products); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		count, err := ProductCollection.CountDocuments(ctx, bson.M{"noserie": products.Num})
		fmt.Println(count)
		if err != nil {
			log.Panic(err)
			return
		}
		if count > 0 {

			c.JSON(http.StatusInternalServerError, gin.H{"error": "numero serie already exist"})
			return
		}

		products.Product_ID = primitive.NewObjectID()

		_, err = ProductCollection.InsertOne(ctx, products)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Not Created"})
			return
		}
		defer cancel()
		c.JSON(http.StatusOK, "Successfully added our Product Admin!!")
	}

}

func GetAllProducts() gin.HandlerFunc {

	return func(c *gin.Context) {

		var productList []models.Product

		var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)

		defer cancel()

		cursor, err := ProductCollection.Find(ctx, bson.D{})

		if err != nil {
			c.IndentedJSON(http.StatusInternalServerError, "Something went wrong, please try after some time")

			return

		}

		err = cursor.All(ctx, &productList)

		if err != nil {
			log.Println(err)
			c.AbortWithStatus(http.StatusInternalServerError)
			return
		}
		defer cursor.Close(ctx)

		if err := cursor.Err(); err != nil {
			log.Println(err)
			c.IndentedJSON(400, "invalid")
			return
		}
		defer cancel()

		c.IndentedJSON(200, productList)

	}

}

func GetProductByID(c *gin.Context) {
	id := c.Param("id")
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		c.AbortWithStatus(http.StatusBadRequest)
		return
	}

	product, err := models.GetProductByID(objectID)
	if err != nil {
		c.AbortWithStatus(http.StatusNotFound)
		return
	}

	c.JSON(http.StatusOK, *product)
}

func UpdateProduct() gin.HandlerFunc {
	return func(c *gin.Context) {
		prod_id := c.Query("id")

		if prod_id == "" {
			c.Header("Content-Type", "application/json")
			c.JSON(http.StatusNotFound, gin.H{"Error": "Invalid"})
			c.Abort()
			return

		}

		var UpdateProduct models.Product

		if err := c.BindJSON(&UpdateProduct); err != nil {
			c.IndentedJSON(http.StatusBadRequest, err.Error())
		}

		prodt_id, err := primitive.ObjectIDFromHex(prod_id)

		if err != nil {
			c.IndentedJSON(500, "Internal Server Error")

		}

		var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)

		defer cancel()

		filter := bson.D{{Key: "_id", Value: prodt_id}}
		update := bson.D{{Key: "$set", Value: bson.D{{Key: "product_name", Value: UpdateProduct.Product_Name}, {Key: "image", Value: UpdateProduct.Image}, {Key: "rating", Value: UpdateProduct.Rating}, {Key: "noserie", Value: UpdateProduct.Num}}}}

		_, err = ProductCollection.UpdateOne(ctx, filter, update)
		fmt.Println(filter)

		if err != nil {
			c.IndentedJSON(500, "Internal Server Error free")
			return
		}
		defer cancel()

		ctx.Done()

		c.IndentedJSON(200, "Successfully updated the product")

	}

}
func SearchProduct() gin.HandlerFunc {

	return func(c *gin.Context) {

		var productList []models.Product

		var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)

		defer cancel()

		cursor, err := ProductCollection.Find(ctx, bson.D{})

		if err != nil {
			c.IndentedJSON(http.StatusInternalServerError, "Something went wrong, please try after some time")

			return

		}

		err = cursor.All(ctx, &productList)

		if err != nil {
			log.Println(err)
			c.AbortWithStatus(http.StatusInternalServerError)
			return
		}
		defer cursor.Close(ctx)

		if err := cursor.Err(); err != nil {
			log.Println(err)
			c.IndentedJSON(400, "invalid")
			return
		}
		defer cancel()

		c.IndentedJSON(200, "Successfully ")

	}

}

func SearchProductByQueryByName() gin.HandlerFunc {
	return func(c *gin.Context) {
		var searchProduct []models.Product

		queryParam := c.Query("name")
		//queryParamno := c.Query("no")

		//check you want check if its empty
		fmt.Println(queryParam)

		if queryParam == "" {
			log.Panic("query is empty")
			c.Header("Content-Type", "application/json")
			c.JSON(http.StatusNotFound, gin.H{"Error": "Invalid search index"})
			c.Abort()
			return
		}
		// if queryParamno == "" {
		// 	log.Panic("query is empty")
		// 	c.Header("Content-Type", "application/json")
		// 	c.JSON(http.StatusNotFound, gin.H{"Error": "Invalid search index"})
		// 	c.Abort()
		// 	return
		// }
		//fmt.Println(queryParamno)

		var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)

		defer cancel()

		serachquerydb, err := ProductCollection.Find(ctx, bson.M{"product_name": bson.M{"$regex": queryParam}})

		if err != nil {
			c.IndentedJSON(404, "Something went wrong while fetching data")

		}
		err = serachquerydb.All(ctx, &searchProduct)

		if err != nil {
			log.Println(err)
			c.IndentedJSON(400, "invalid")
			return

		}
		c.IndentedJSON(200, &searchProduct)

	}

}

func SearchProductByQueryByNo() gin.HandlerFunc {
	return func(c *gin.Context) {
		var searchProduct []models.Product

		queryParam := c.Query("no")

		// Vérification si le paramètre 'no' est vide
		if queryParam == "" {
			log.Println("Query param 'no' is empty")
			c.JSON(http.StatusBadRequest, gin.H{"Error": "Invalid or empty serial number"})
			return
		}

		var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
		defer cancel()

		serachquerydb, err := ProductCollection.Find(ctx, bson.M{"noserie": bson.M{"$regex": queryParam}})
		if err != nil {
			log.Println("Error while fetching data:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"Error": "Something went wrong while fetching data"})
			return
		}

		err = serachquerydb.All(ctx, &searchProduct)
		if err != nil {
			log.Println("Error reading from database:", err)
			c.JSON(http.StatusBadRequest, gin.H{"Error": "Error reading database"})
			return
		}

		// Retourner les résultats
		c.JSON(http.StatusOK, searchProduct)
	}
}


func DeleteProduct() gin.HandlerFunc {
	return func(c *gin.Context) {
		prod_id := c.Query("id")

		if prod_id == "" {
			log.Println("")
			c.Header("Content-Type", "application/json")
			c.JSON(http.StatusNotFound, gin.H{"Error": "Invalid Search Index"})
			c.Abort()

			return
		}

		//var product models.Product

		prodt_id, err := primitive.ObjectIDFromHex(prod_id)

		if err != nil {
			c.IndentedJSON(500, "Internal Server Error")
		}

		var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)

		defer cancel()

		filter := bson.D{{Key: "_id", Value: prodt_id}}

		fmt.Println(filter)

		_, err = ProductCollection.DeleteOne(ctx, filter)

		if err != nil {
			c.IndentedJSON(404, "Wrong command")
			return
		}

		// Si un document est trouvé, la collection n'est pas vide

		// Si l'erreur n'est pas `mongo.ErrNoDocuments`, c'est une autre erreur, donc la retourner

		defer cancel()

		ctx.Done()

		c.IndentedJSON(200, "Successfully Deleted")

	}

}
