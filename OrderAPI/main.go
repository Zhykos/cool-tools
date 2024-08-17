package main

import (
    "encoding/json"
    "fmt"
    "log"
    "net/http"

    "OrderAPI/models"
    "OrderAPI/services"
)

func main() {
    http.HandleFunc("/order", func(w http.ResponseWriter, r *http.Request) {
        if r.Method != http.MethodPost  {
            http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
            return
        }

        createOrderDTO := &models.Order{}
        err := json.NewDecoder(r.Body).Decode(createOrderDTO)
        if err != nil {
            http.Error(w, err.Error(), http.StatusBadRequest)
            return
        }

        fmt.Println("create order:", createOrderDTO)
        result, errStr, err2 := services.CreateOrder(*createOrderDTO)

        if err2 != nil {
	        w.WriteHeader(http.StatusInternalServerError)
	        log.Fatalf("oops", err2)
	        return
        }

        if errStr != "" {
            w.WriteHeader(http.StatusInternalServerError)
            log.Fatalf(errStr)
            return
        }

        json.NewEncoder(w).Encode(result)
        w.WriteHeader(http.StatusCreated)
    })

    if err := http.ListenAndServe("0.0.0.0:9004", nil); err != http.ErrServerClosed {
        panic(err)
    }
}