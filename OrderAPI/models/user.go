package models

import (
    "go.mongodb.org/mongo-driver/bson/primitive"
)

type User struct {
    ID     primitive.ObjectID `bson:"_id,omitempty"`
    Name   string             `bson:"name,omitempty"`
    Email  string             `bson:"email,omitempty"`
    Age    int                `bson:"age,omitempty"`
    Active bool               `bson:"active,omitempty"`
}