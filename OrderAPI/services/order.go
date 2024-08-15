package services

import (
    "context"
    "encoding/json"
    "errors"
    "fmt"
    "github.com/gin-gonic/gin"
    "io/ioutil"
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
    if userName == nil {
        c.IndentedJSON(http.StatusInternalServerError, "Cannot get user name")
        return
    }

    product := GetProduct(order.ProductID)
    if product == nil {
        c.IndentedJSON(http.StatusInternalServerError, "Cannot get product")
        return
    }

    order.UserName = *userName
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

func GetUserName(userId string) (*string) {
    uri := os.Getenv("USER_API_URI")
    if uri == "" {
        fmt.Print("USER_API_URI is not set")
        return nil
    }

    response, err := http.Get(uri + "/user")

    if err != nil {
        fmt.Print(err.Error())
        return nil
    }

    allUsersRaw, err := ioutil.ReadAll(response.Body)
    if err != nil {
        fmt.Print(err.Error())
        return nil
    }

    var users []models.User
    err2 := json.Unmarshal(allUsersRaw, &users)
    if err2 != nil {
        fmt.Print(err2.Error())
        return nil
    }

    user, err3 := searchUserById(users, userId)
    if err3 != nil {
        fmt.Print(err3.Error())
        return nil
    }

    return &user.Name
}

func searchUserById(users []models.User, id string) (*models.User, error) {
    for _, item := range users {
        if item.UUID == id {
            return &item, nil
        }
    }
    return nil, errors.New("User not found")
}

func GetProduct(productId string) (*models.Product) {
    uri := os.Getenv("PRODUCT_API_URI")
    if uri == "" {
        fmt.Print("PRODUCT_API_URI is not set")
        return nil
    }

    response, err := http.Get(uri + "/product")
    defer response.Body.Close()

    if err != nil {
        fmt.Print(err.Error())
        return nil
    }

    allProductsRaw, err := ioutil.ReadAll(response.Body)
    if err != nil {
        fmt.Print(err.Error())
        return nil
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
            fmt.Print(err2.Error())
            return nil
        }
        products = append(products, product)
    }

    product, err3 := searchProductById(products, productId)
    if err3 != nil {
        fmt.Print(err3.Error())
        return nil
    }

    return product
}

func searchProductById(products []models.Product, id string) (*models.Product, error) {
    for _, item := range products {
        if item.UUID == id {
            return &item, nil
        }
    }
    return nil, errors.New("Product not found")
}