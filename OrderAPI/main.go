package main

import (
    "fmt"
    "github.com/gin-gonic/gin"

    "OrderAPI/handlers"
)

func main() {
    router := gin.Default()

    router.POST("/users", handlers.CreateUser)
    //router.GET("/users", handlers.GetAllUsers)
    //router.GET("/users/", handlers.GetUserByID)
    //router.PATCH("/users/", handlers.UpdateUser)
    //router.DELETE("/users/", handlers.DeleteUser)

    fmt.Println("Server running on port 8080")
    router.Run("localhost:9004")
}