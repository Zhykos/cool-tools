package models

import (
    "go.mongodb.org/mongo-driver/bson/primitive"
)

type Order struct {
    OrderID primitive.ObjectID `bson:"_id,omitempty"`
    UserID string `bson:"user_id,omitempty"`
    UserName string `bson:"user_name,omitempty"`
    ProductID string `bson:"product_id,omitempty"`
    ProductName string `bson:"product_name,omitempty"`
    Price float64 `bson:"price,omitempty"`
}