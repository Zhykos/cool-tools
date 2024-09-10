package services

import (
    "context"
    "encoding/json"
    "errors"
    "fmt"
    "github.com/twmb/franz-go/pkg/kgo"
    "github.com/twmb/franz-go/plugin/kotel"
    "go.mongodb.org/mongo-driver/bson/primitive"
    "go.opentelemetry.io/contrib/instrumentation/net/http/otelhttp"
    "go.opentelemetry.io/otel/propagation"
    "go.opentelemetry.io/otel/trace"
    "io"
    "log"
    "net/http"
    "os"
    "strings"
    "sync"

    "OrderAPI/config"
    "OrderAPI/models"
)

func CreateOrder(order models.Order, ctx context.Context, tracerProvider trace.TracerProvider) (*models.OrderDTO, string, *error) {
    client, err := config.ConnectToMongoDB(ctx)
    if err != nil {
        return nil, "", &err
    }
    defer client.Disconnect(ctx)

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

    collection := client.Database("cool-tools-orders").Collection("orders")
    result, err := collection.InsertOne(ctx, order)
    if err != nil {
        return nil, "", &err
    }

    orderDTO := models.OrderDTO{
        OrderID: result.InsertedID.(primitive.ObjectID).Hex(),
        UserID: order.UserID,
        UserName: order.UserName,
        ProductID: order.ProductID,
        ProductName: order.ProductName,
        Price: order.Price,
    }

    sendOrderToKafka(orderDTO, ctx, tracerProvider)

    return &orderDTO, "", nil
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

        req, _ := http.NewRequestWithContext(ctx, "GET", uri + "/user", nil)

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
    products := callAllProducts(ctx)
    if products == nil {
        fmt.Print("Cannot get products")
        return nil
    }

    product, err3 := searchProductById(*products, productId)
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

func callAllProducts(ctx context.Context) (*[]models.Product) {
    client := http.Client{Transport: otelhttp.NewTransport(http.DefaultTransport)}

    var body []byte

    err := func(ctx context.Context) error {
        uri := os.Getenv("PRODUCT_API_URI")
        if uri == "" {
            panic("PRODUCT_API_URI is not set")
        }

        req, _ := http.NewRequestWithContext(ctx, "GET", uri + "/product", nil)

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

    var products []models.Product
    groups := strings.Split(string(body), "\n")
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

    return &products
}

func sendOrderToKafka(order models.OrderDTO, ctx context.Context, tracerProvider trace.TracerProvider) {
    // Objects to send to Kafka

    orderKafka := models.OrderKafka{
        OrderID: order.OrderID,
        UserID: order.UserID,
        UserName: order.UserName,
        ProductID: order.ProductID,
        ProductName: order.ProductName,
        Price: order.Price,
    }

    json, errMarshal := json.Marshal(orderKafka)
    if errMarshal != nil {
        log.Fatal("failed to marshal order:", errMarshal)
    }

    // Send to Kafka

    uri := os.Getenv("KAFKA_URI")
    if uri == "" {
        panic("KAFKA_URI is not set")
    }

    tracerOpts := []kotel.TracerOpt{
        kotel.TracerProvider(tracerProvider),
        kotel.TracerPropagator(propagation.NewCompositeTextMapPropagator(propagation.TraceContext{})),
    }
    tracer := kotel.NewTracer(tracerOpts...)

    kotelOps := []kotel.Opt{
        kotel.WithTracer(tracer),
    }
    kotelService := kotel.NewKotel(kotelOps...)

    seeds := []string{uri}
    cl, errNewClient := kgo.NewClient(
        kgo.SeedBrokers(seeds...),
        kgo.WithHooks(kotelService.Hooks()...),
    )
    if errNewClient != nil {
        panic(errNewClient)
    }
    defer cl.Close()

    var wg sync.WaitGroup
    wg.Add(1)
    record := &kgo.Record{Topic: "orders", Key: []byte(order.OrderID), Value: json}
    cl.Produce(ctx, record, func(_ *kgo.Record, err error) {
        defer wg.Done()
        if err != nil {
            fmt.Printf("record had a produce error: %v\n", err)
        }

    })
    wg.Wait()
}