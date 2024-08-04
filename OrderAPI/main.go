package main

import (
    "github.com/gin-gonic/gin"
    "OrderAPI/handlers"
)

func main() {
    router := gin.Default()

    router.POST("/order", handlers.CreateOrder)
    //router.GET("/users", handlers.GetAllUsers)
    //router.GET("/users/", handlers.GetUserByID)
    //router.PATCH("/users/", handlers.UpdateUser)
    //router.DELETE("/users/", handlers.DeleteUser)

    router.Run("0.0.0.0:9004")
}