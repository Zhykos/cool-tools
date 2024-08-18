package services

import (
    "context"
    "encoding/json"
    "errors"
    "fmt"
    "go.mongodb.org/mongo-driver/mongo"
    "go.opentelemetry.io/contrib/instrumentation/net/http/otelhttp"
    //"go.opentelemetry.io/otel"
    //"go.opentelemetry.io/otel/baggage"
    //semconv "go.opentelemetry.io/otel/semconv/v1.20.0"
    //"go.opentelemetry.io/otel/trace"
    "io"
    "io/ioutil"
    "log"
    "net/http"
    "os"
    "strings"

    "OrderAPI/config"
    "OrderAPI/models"
)

func CreateOrder(order models.Order) (*mongo.InsertOneResult, string, *error) {
    client, err := config.ConnectToMongoDB()
    if err != nil {
        return nil, "", &err
    }
    defer client.Disconnect(context.Background())

    userName := GetUserName(order.UserID)
    if userName == nil {
        return nil, "Cannot get user name", nil
    }

    product := GetProduct(order.ProductID)
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

func GetUserName(userId string) (*string) {
    uri := os.Getenv("USER_API_URI")
    if uri == "" {
        fmt.Print("USER_API_URI is not set")
        return nil
    }

    response, err := http.Get(uri + "/user")

    callAllUsers()

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

func callAllUsers() {
    client := http.Client{Transport: otelhttp.NewTransport(http.DefaultTransport)}

    //bag, _ := baggage.Parse("username=donuts")
    //ctx := baggage.ContextWithBaggage(context.Background(), bag)

    var body []byte

    //tr := otel.Tracer("example/client")
    err := func(ctx context.Context) error {
        //ctx, span := tr.Start(ctx, "say hello", trace.WithAttributes(semconv.PeerService("ExampleService")))
        //defer span.End()
        req, _ := http.NewRequestWithContext(ctx, "GET", "http://localhost:9001/user", nil)

        fmt.Printf("Sending request...\n")
        res, err := client.Do(req)
        if err != nil {
            panic(err)
        }
        body, err = io.ReadAll(res.Body)
        _ = res.Body.Close()

        return err
    }(context.Background())

    if err != nil {
        log.Fatal(err)
    }

    fmt.Printf("Response Received: %s\n\n\n", body)
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