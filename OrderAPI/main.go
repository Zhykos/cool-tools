package main

import (
    "github.com/gin-gonic/gin"
    "OrderAPI/services"
)

func main() {
    router := gin.Default()
    router.POST("/order", services.CreateOrder)
    router.Run("0.0.0.0:9004")
}