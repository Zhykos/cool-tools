package main

import (
    "context"
    "encoding/json"
    "errors"
    "fmt"
    "go.opentelemetry.io/contrib/instrumentation/net/http/otelhttp"
    "log"
    "net"
    "net/http"
    "os"
    "os/signal"
    "time"

    "OrderAPI/models"
    "OrderAPI/services"
)

func main() {
    // Handle SIGINT (CTRL+C) gracefully.
    ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt)
    defer stop()

    // Set up OpenTelemetry.
    otelShutdown, err := setupOTelSDK(ctx)
    if err != nil {
        return
    }
    // Handle shutdown properly so nothing leaks.
    defer func() {
        err = errors.Join(err, otelShutdown(context.Background()))
    }()

    // Start HTTP server.
    srv := &http.Server{
        Addr:         "0.0.0.0:9004",
        BaseContext:  func(_ net.Listener) context.Context { return ctx },
        ReadTimeout:  time.Second,
        WriteTimeout: 10 * time.Second,
        Handler:      newHTTPHandler(),
    }
    srvErr := make(chan error, 1)
    go func() {
        srvErr <- srv.ListenAndServe()
    }()

    // Wait for interruption.
    select {
    case err = <-srvErr:
        // Error when starting HTTP server.
        return
    case <-ctx.Done():
        // Wait for first CTRL+C.
        // Stop receiving signal notifications as soon as possible.
        stop()
    }

    // When Shutdown is called, ListenAndServe immediately returns ErrServerClosed.
    err = srv.Shutdown(context.Background())
    return
}

func newHTTPHandler() http.Handler {
    mux := http.NewServeMux()

    // handleFunc is a replacement for mux.HandleFunc
    // which enriches the handler's HTTP instrumentation with the pattern as the http.route.
    handleFunc := func(pattern string, handlerFunc func(http.ResponseWriter, *http.Request)) {
        // Configure the "http.route" for the HTTP instrumentation.
        handler := otelhttp.WithRouteTag(pattern, http.HandlerFunc(handlerFunc))
        mux.Handle(pattern, handler)
    }

    // Register handlers.
    createOrderRoute(handleFunc)

    // Add HTTP instrumentation for the whole server.
    handler := otelhttp.NewHandler(mux, "/")
    return handler
}

func createOrderRoute(handleFunc func(pattern string, handlerFunc func(http.ResponseWriter, *http.Request))) {
    handleFunc("/order", func(w http.ResponseWriter, r *http.Request) {
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
}