package config

import (
    "context"
    "fmt"
    "os"
    "go.opentelemetry.io/contrib/instrumentation/go.mongodb.org/mongo-driver/mongo/otelmongo"
    "go.mongodb.org/mongo-driver/mongo"
    "go.mongodb.org/mongo-driver/mongo/options"
)

func ConnectToMongoDB() (*mongo.Client, error) {
    uri := os.Getenv("MONGODB_URI")
    if uri == "" {
        return nil, fmt.Errorf("MONGODB_URI is not set")
    }

    mongoClient := options.Client()
    mongoClient.Monitor = otelmongo.NewMonitor()
    clientOptions := mongoClient.ApplyURI(uri)
    client, err := mongo.Connect(context.Background(), clientOptions)
    if err != nil {
        return nil, err
    }

    err = client.Ping(context.Background(), nil)
    if err != nil {
        return nil, err
    }

    return client, nil
}