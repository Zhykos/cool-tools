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
    "strings"

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
    product := GetProduct(order.ProductID)
    order.UserName = userName
    order.ProductName = product.Name
    order.Price = product.Price

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
        log.Fatalf("Error unmarshalling JSON: %v", err2)
        os.Exit(1)
    }

    user, err3 := searchUserById(users, userId)
    if err3 != nil {
        log.Fatalf("Cannot find user: %v", err3)
        os.Exit(1)
    }

    return user.Name
}

func searchUserById(users []models.User, id string) (*models.User, error) {
    for _, item := range users {
        if item.UUID == id {
            return &item, nil
        }
    }
    return nil, errors.New("User not found")
}

func GetProduct(productId string) (models.Product) {
    uri := os.Getenv("PRODUCT_API_URI")
    if uri == "" {
        fmt.Print("PRODUCT_API_URI is not set")
        os.Exit(1)
    }

    response, err := http.Get(uri + "/product")
    defer response.Body.Close()

    if err != nil {
        fmt.Print(err.Error())
        os.Exit(1)
    }

    allProductsRaw, err := ioutil.ReadAll(response.Body)
    if err != nil {
        log.Fatal(err)
        os.Exit(1)
    }

    var products []models.Product
    groups := strings.Split(string(allProductsRaw), "\n")
    for _, group := range groups {
        group = strings.Trim(group, " ")
        if group == "" {
            continue
        }

        var product models.Product
        err2 := json.Unmarshal([]byte(group), &product)
        if err2 != nil {
            log.Fatalf("Error unmarshalling JSON: %v", err2)
            os.Exit(1)
        }
        products = append(products, product)
    }

    product, err3 := searchProductById(products, productId)
    if err3 != nil {
        log.Fatalf("Cannot find product: %v", err3)
        os.Exit(1)
    }

    return *product
}

func searchProductById(products []models.Product, id string) (*models.Product, error) {
    for _, item := range products {
        if item.UUID == id {
            return &item, nil
        }
    }
    return nil, errors.New("Product not found")
}