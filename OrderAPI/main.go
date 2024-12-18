package main

import (
	"context"
	"encoding/json"
	"fmt"
	"go.opentelemetry.io/contrib/instrumentation/net/http/otelhttp"
	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/exporters/stdout/stdoutmetric"
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

func initMeter() (*sdkmetric.MeterProvider, error) {
	exp, err := stdoutmetric.New()
	if err != nil {
		return nil, err
	}

	mp := sdkmetric.NewMeterProvider(sdkmetric.WithReader(sdkmetric.NewPeriodicReader(exp)))
	otel.SetMeterProvider(mp)
	return mp, nil
}

func main() {
	tp, err := initTracer(context.Background())
	tracerProvider = tp

	if err != nil {
	    log.Printf("Cannot initTracer: %v", err)
		return
	}

	defer func() {
		if err := tp.Shutdown(context.Background()); err != nil {
			log.Printf("Error shutting down tracer provider: %v", err)
		}
	}()

	mp, err := initMeter()
	if err != nil {
	    log.Printf("Cannot initMeter: %v", err)
		return
	}

	defer func() {
		if err := mp.Shutdown(context.Background()); err != nil {
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
}