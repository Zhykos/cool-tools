package main

import (
    "fmt"
    "log"
    "net/http"

    "OrderAPI/handlers"
)

func main() {
    http.HandleFunc("/users", handlers.CreateUser)
    http.HandleFunc("/users", handlers.GetAllUsers)
    http.HandleFunc("/users/", handlers.GetUserByID)
    http.HandleFunc("/users/", handlers.UpdateUser)
    http.HandleFunc("/users/", handlers.DeleteUser)

    fmt.Println("Server running on port 8080")
    log.Fatal(http.ListenAndServe(":8080", nil))
}