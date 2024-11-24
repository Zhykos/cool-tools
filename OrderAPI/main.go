package main

import (
	"context"
	"encoding/json"
	"fmt"
	"go.opentelemetry.io/contrib/instrumentation/net/http/otelhttp"
	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/exporters/otlp/otlpmetric/otlpmetrichttp"
	"go.opentelemetry.io/otel/exporters/otlp/otlptrace/otlptracehttp"
	"go.opentelemetry.io/otel/propagation"
	sdkmetric "go.opentelemetry.io/otel/sdk/metric"
	"go.opentelemetry.io/otel/sdk/resource"
	sdktrace "go.opentelemetry.io/otel/sdk/trace"
	semconv "go.opentelemetry.io/otel/semconv/v1.20.0"
	"go.opentelemetry.io/otel/trace"
	"log"
	"net/http"

	"OrderAPI/models"
    "OrderAPI/services"
)

var tracerProvider trace.TracerProvider

func initTracer(ctx context.Context) (*sdktrace.TracerProvider, error) {
	// Create stdout exporter to be able to retrieve
	// the collected spans.
	exporter, err := otlptracehttp.New(ctx)
	if err != nil {
		return nil, err
	}

	// For the demonstration, use sdktrace.AlwaysSample sampler to sample all traces.
	// In a production application, use sdktrace.ProbabilitySampler with a desired probability.
	tp := sdktrace.NewTracerProvider(
		sdktrace.WithSampler(sdktrace.AlwaysSample()),
		sdktrace.WithBatcher(exporter),
		sdktrace.WithResource(resource.NewWithAttributes(semconv.SchemaURL, semconv.ServiceName("OrderAPI"))),
	)
	otel.SetTracerProvider(tp)
	otel.SetTextMapPropagator(propagation.NewCompositeTextMapPropagator(propagation.TraceContext{}, propagation.Baggage{}))
	return tp, err
}

func initMeter(ctx context.Context) (*sdkmetric.MeterProvider, error) {
	exp, err := otlpmetrichttp.New(ctx)
	if err != nil {
		return nil, err
	}

	mp := sdkmetric.NewMeterProvider(sdkmetric.WithReader(sdkmetric.NewPeriodicReader(exp)))
	otel.SetMeterProvider(mp)
	return mp, nil
}

func main() {
    ctx := context.Background()
	tp, err := initTracer(ctx)
	tracerProvider = tp

	if err != nil {
	    log.Printf("Cannot initTracer: %v", err)
		return
	}

	defer func() {
		if err := tp.Shutdown(ctx); err != nil {
			log.Printf("Error shutting down tracer provider: %v", err)
		}
	}()

	mp, err := initMeter(ctx)
	if err != nil {
	    log.Printf("Cannot initMeter: %v", err)
		return
	}

	defer func() {
		if err := mp.Shutdown(ctx); err != nil {
			log.Printf("Error shutting down meter provider: %v", err)
		}
	}()

	createOrderHandler := otelhttp.NewHandler(http.HandlerFunc(createOrder), "post /order")
	http.Handle("/order", createOrderHandler)

	err = http.ListenAndServe("0.0.0.0:9004", nil)
	if err != nil {
	    log.Printf("Cannot listen and serve: %v", err)
	}
}

func createOrder(w http.ResponseWriter, r *http.Request) {
    fmt.Println("create order", r.Method)

    if r.Method == http.MethodOptions {
        w.Header().Set("Access-Control-Allow-Origin", "*")
        w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        w.Header().Set("Access-Control-Allow-Headers", "*")
        w.Header().Set("Access-Control-Allow-Credentials", "true")
        w.Header().Set("Access-Control-Max-Age", "3600")
        w.WriteHeader(http.StatusOK)
        return
    }

    if r.Method != http.MethodPost && r.Method != http.MethodOptions {
        http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
        return
    }

    createOrderDTO := &models.Order{}
    err := json.NewDecoder(r.Body).Decode(createOrderDTO)
    if err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }

    //logger.InfoContext(ctx, "create order:", createOrderDTO)
    fmt.Println("create order:", createOrderDTO)
    ctx := r.Context()
    result, errStr, err2 := services.CreateOrder(*createOrderDTO, ctx, tracerProvider)

    if err2 != nil {
        w.WriteHeader(http.StatusInternalServerError)
        log.Printf("Cannot create order: %v", &err2)
        return
    }

    if errStr != "" {
        w.WriteHeader(http.StatusInternalServerError)
        log.Printf("Cannot create order with message: %v", &errStr)
        return
    }

    json.NewEncoder(w).Encode(result)
    w.WriteHeader(http.StatusCreated)
    w.Header().Set("Access-Control-Allow-Origin", "*")
}