package handlers

import (
    "context"
    "net/http"
    "github.com/gin-gonic/gin"
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

    collection := client.Database("demo-opt-orders").Collection("orders")
    result, err := collection.InsertOne(context.Background(), order)
    if err != nil {
        c.IndentedJSON(http.StatusInternalServerError, err.Error())
        return
    }

    c.IndentedJSON(http.StatusCreated, result)
}
