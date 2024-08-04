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
/*
// Get all users
func GetAllUsers(w http.ResponseWriter, r *http.Request) {
    client, err := config.ConnectToMongoDB()
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    defer client.Disconnect(context.Background())

    collection := client.Database("your_database_name").Collection("users")
    cursor, err := collection.Find(context.Background(), bson.D{})
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    defer cursor.Close(context.Background())

    var users []models.User
    for cursor.Next(context.Background()) {
        var user models.User
        if err := cursor.Decode(&user); err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
            return
        }
        users = append(users, user)
    }

    json.NewEncoder(w).Encode(users)
}

// Get a user by ID
func GetUserByID(w http.ResponseWriter, r *http.Request) {
    client, err := config.ConnectToMongoDB()
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    defer client.Disconnect(context.Background())

    id, err := primitive.ObjectIDFromHex(r.URL.Query().Get("id"))
    if err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }

    collection := client.Database("your_database_name").Collection("users")
    var user models.User
    if err := collection.FindOne(context.Background(), bson.M{"_id": id}).Decode(&user); err != nil {
        http.Error(w, err.Error(), http.StatusNotFound)
        return
    }

    json.NewEncoder(w).Encode(user)
}

// Update a user
func UpdateUser(w http.ResponseWriter, r *http.Request) {
    client, err := config.ConnectToMongoDB()
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    defer client.Disconnect(context.Background())

    id, err := primitive.ObjectIDFromHex(r.URL.Query().Get("id"))
    if err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }

    var updatedUser models.User
    if err := json.NewDecoder(r.Body).Decode(&updatedUser); err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }

    collection := client.Database("your_database_name").Collection("users")
    filter := bson.M{"_id": id}
    update := bson.M{"$set": updatedUser}
    result, err := collection.UpdateOne(context.Background(), filter, update)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    json.NewEncoder(w).Encode(result)
}

// Delete a user
func DeleteUser(w http.ResponseWriter, r *http.Request) {
    client, err := config.ConnectToMongoDB()
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    defer client.Disconnect(context.Background())

    id, err := primitive.ObjectIDFromHex(r.URL.Query().Get("id"))
    if err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }

    collection := client.Database("your_database_name").Collection("users")
    result, err := collection.DeleteOne(context.Background(), bson.M{"_id": id})
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    json.NewEncoder(w).Encode(result)
}
*/