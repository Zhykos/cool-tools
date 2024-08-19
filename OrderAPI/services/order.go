package services

import (
    "context"
    "encoding/json"
    "errors"
    "fmt"
    "go.mongodb.org/mongo-driver/mongo"
    "go.opentelemetry.io/contrib/instrumentation/net/http/otelhttp"
    "io"
    "io/ioutil"
    "log"
    "net/http"
    "os"
    "strings"

    "OrderAPI/config"
    "OrderAPI/models"
)

func CreateOrder(order models.Order, ctx context.Context) (*mongo.InsertOneResult, string, *error) {
    client, err := config.ConnectToMongoDB()
    if err != nil {
        return nil, "", &err
    }
    defer client.Disconnect(context.Background())

    userName := GetUserName(order.UserID, ctx)
    if userName == nil {
        return nil, "Cannot get user name", nil
    }

    product := GetProduct(order.ProductID, ctx)
    if product == nil {
        return nil, "Cannot get product", nil
    }

    order.UserName = *userName
    order.ProductName = product.Name
    order.Price = product.Price

    collection := client.Database("demo-opt-orders").Collection("orders")
    result, err := collection.InsertOne(context.Background(), order)
    if err != nil {
        return nil, "", &err
    }

    return result, "", nil
}

func GetUserName(userId string, ctx context.Context) (*string) {
    users := callAllUsers(ctx)
    if users == nil {
        fmt.Print("Cannot get users")
        return nil
    }

    user, err3 := searchUserById(*users, userId)
    if err3 != nil {
        fmt.Print(err3.Error())
        return nil
    }

    return &user.Name
}

func callAllUsers(ctx context.Context) (*[]models.User) {
    client := http.Client{Transport: otelhttp.NewTransport(http.DefaultTransport)}

    var body []byte

    err := func(ctx context.Context) error {
        uri := os.Getenv("USER_API_URI")
        if uri == "" {
            panic("USER_API_URI is not set")
        }

        req, _ := http.NewRequestWithContext(ctx, "GET", "http://localhost:9001/user", nil)

        fmt.Printf("Sending request...\n")
        res, err := client.Do(req)
        if err != nil {
            panic(err)
        }
        body, err = io.ReadAll(res.Body)
        _ = res.Body.Close()

        return err
    }(ctx)

    if err != nil {
        log.Fatal(err)
    }

    var users []models.User
    err2 := json.Unmarshal(body, &users)
    if err2 != nil {
        fmt.Print(err2.Error())
        return nil
    }

    return &users
}

func searchUserById(users []models.User, id string) (*models.User, error) {
    for _, item := range users {
        if item.UUID == id {
            return &item, nil
        }
    }
    return nil, errors.New("User not found")
}

func GetProduct(productId string, ctx context.Context) (*models.Product) {
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