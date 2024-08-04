package main

import (
    "github.com/gin-gonic/gin"
    "OrderAPI/handlers"
)

func main() {
    router := gin.Default()
    router.POST("/order", handlers.CreateOrder)
    router.Run("0.0.0.0:9004")
}