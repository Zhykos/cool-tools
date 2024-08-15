package services

import (
    "context"
    "encoding/json"
    "errors"
    "fmt"
    "github.com/gin-gonic/gin"
    "io/ioutil"
    "log"
    "net/http"
    "os"

    "OrderAPI/config"
    "OrderAPI/models"
)

func CreateOrder(c *gin.Context) {
    client, err := config.ConnectToMongoDB()
    if err != nil {
        c.IndentedJSON(http.StatusInternalServerError, err.Error())
        return
    }
    defer client.Disconnect(context.Background())

    var order models.Order
    if err := c.BindJSON(&order); err != nil {
        c.IndentedJSON(http.StatusBadRequest, err.Error())
        return
    }

    userName := GetUserName(order.UserID)
    order.UserName = userName

    collection := client.Database("demo-opt-orders").Collection("orders")
    result, err := collection.InsertOne(context.Background(), order)
    if err != nil {
        c.IndentedJSON(http.StatusInternalServerError, err.Error())
        return
    }

    c.IndentedJSON(http.StatusCreated, result)
}

func GetUserName(userId string) (string) {
    uri := os.Getenv("USER_API_URI")
    if uri == "" {
        fmt.Print("USER_API_URI is not set")
        os.Exit(1)
    }

    response, err := http.Get(uri + "/user")

    if err != nil {
        fmt.Print(err.Error())
        os.Exit(1)
    }

    allUsersRaw, err := ioutil.ReadAll(response.Body)
    if err != nil {
        log.Fatal(err)
        os.Exit(1)
    }

    var users []models.User
    err2 := json.Unmarshal(allUsersRaw, &users)
    if err2 != nil {
        log.Fatalf("Error unmarshaling JSON: %v", err2)
        os.Exit(1)
    }

    user, err3 := searchByValue(users, userId)
    if err3 != nil {
        log.Fatalf("Cannot find user: %v", err3)
        os.Exit(1)
    }

    return user.Name
}

func searchByValue(users []models.User, id string) (*models.User, error) {
    for _, item := range users {
        if item.UUID == id {
            return &item, nil
        }
    }
    return nil, errors.New("item not found")
}