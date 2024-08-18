package main

import (
	"context"
	"encoding/json"
	"fmt"
	"go.opentelemetry.io/contrib/instrumentation/net/http/otelhttp"
	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/attribute"
	"go.opentelemetry.io/otel/baggage"
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
	if err != nil {
		log.Fatal(err)
	}
	defer func() {
		if err := tp.Shutdown(context.Background()); err != nil {
			log.Printf("Error shutting down tracer provider: %v", err)
		}
	}()

	mp, err := initMeter()
	if err != nil {
		log.Fatal(err)
	}
	defer func() {
		if err := mp.Shutdown(context.Background()); err != nil {
			log.Printf("Error shutting down meter provider: %v", err)
		}
	}()

	uk := attribute.Key("username")

	createOrderHandler := func(w http.ResponseWriter, req *http.Request) {
		ctx := req.Context()
		span := trace.SpanFromContext(ctx)
		bag := baggage.FromContext(ctx)
		span.AddEvent("handling this...", trace.WithAttributes(uk.String(bag.Member("username").Value())))

        createOrder(w, req)
	}

	otelHandler := otelhttp.NewHandler(http.HandlerFunc(createOrderHandler), "post /order")

	http.Handle("/order", otelHandler)
	err = http.ListenAndServe("0.0.0.0:9004", nil)
	if err != nil {
		log.Fatal(err)
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
}