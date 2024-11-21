package tokens

import (
	"commerce/database"
	"context"
	"log"
	"os"
	"time"

	"github.com/dgrijalva/jwt-go"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type SigneDetails struct {
	Email      string
	First_Name string
	Last_Name  string
	Uid        string
	jwt.StandardClaims
}

var UserData *mongo.Collection = database.UserData(database.Client, "Users")
var SECRET_KEY = os.Getenv("JWT_SECRET_KEY")

func TokenGeneator(email, first_name, last_name, uid string) (signedtoken string, signedrefresh string, err error) {

	claims := &SigneDetails{
		Email:      email,
		First_Name: first_name,
		Last_Name:  last_name,
		Uid:        uid,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: time.Now().Add(time.Hour * time.Duration(24)).Unix(),
		},
	}
	refreshclaims := &SigneDetails{
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: time.Now().Local().Add(time.Hour * time.Duration(168)).Unix(),
		},
	}

	token, err := jwt.NewWithClaims(jwt.SigningMethodHS256, claims).SignedString([]byte(SECRET_KEY))

	if err != nil {
		return "", "", err
	}

	refreshtoken, err := jwt.NewWithClaims(jwt.SigningMethodHS384, refreshclaims).SignedString([]byte(SECRET_KEY))
	if err != nil {
		log.Panic(err)
		return
	}
	return token, refreshtoken, err
}

func ValidateToken(signedtoken string) (claims *SigneDetails, msg string) {
	token, err := jwt.ParseWithClaims(signedtoken, &SigneDetails{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(SECRET_KEY), nil
	})

	if err != nil {
		msg = err.Error()
		return
	}

	claims, ok := token.Claims.(*SigneDetails)

	if !ok {
		msg = "the token is invalid"

		return
	}

	if claims.ExpiresAt < time.Now().Local().Unix() {
		msg = "the token is already expired"
		return
	}

	return claims, msg

}

func UpdateAllTokens(signedtoken string, signedrefreshtoken string, userid string) {

	var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)

	var updatepbj primitive.D

	updatepbj = append(updatepbj, bson.E{Key: "token", Value: signedtoken})
	updatepbj = append(updatepbj, bson.E{Key: "refresh_token", Value: signedrefreshtoken})
	updated_at, _ := time.Parse(time.RFC3339, time.Now().Format(time.RFC3339))

	updatepbj = append(updatepbj, bson.E{Key: "updated_at", Value: updated_at})

	upsert := true

	filter := bson.M{"user_id": userid}

	opt := options.UpdateOptions{
		Upsert: &upsert,
	}
	_, err := UserData.UpdateOne(ctx, filter, bson.D{
		{Key: "$set", Value: updatepbj},
	},
		&opt)

	defer cancel()

	if err != nil {
		log.Panic(err)
		return

	}

}
