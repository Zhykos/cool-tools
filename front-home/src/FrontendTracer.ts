import {
    CompositePropagator,
    W3CBaggagePropagator,
    W3CTraceContextPropagator,
} from "@opentelemetry/core";
import { WebTracerProvider } from "@opentelemetry/sdk-trace-web";
import { SimpleSpanProcessor } from "@opentelemetry/sdk-trace-base";
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import { getWebAutoInstrumentations } from "@opentelemetry/auto-instrumentations-web";
import { Resource } from "@opentelemetry/resources";
import { ATTR_SERVICE_NAME } from "@opentelemetry/semantic-conventions";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";

export const FrontendTracer = async () => {
    const { ZoneContextManager } = await import("@opentelemetry/context-zone");
    const provider = new WebTracerProvider({
        resource: new Resource({
            [ATTR_SERVICE_NAME]: "shop-frontend",
        }),
    });
    provider.addSpanProcessor(new SimpleSpanProcessor(new OTLPTraceExporter({
        url: import.meta.env.VITE_OPENTELEMETRY_COLLECTOR_URI as string,
    })));
    const contextManager = new ZoneContextManager();
    provider.register({
        contextManager,
        propagator: new CompositePropagator({
            propagators: [
                new W3CBaggagePropagator(),
                new W3CTraceContextPropagator(),
            ],
        }),
    });
    registerInstrumentations({
        tracerProvider: provider,
        instrumentations: [
            getWebAutoInstrumentations({
                "@opentelemetry/instrumentation-fetch": {
                    propagateTraceHeaderCorsUrls: /.*/,
                    clearTimingResources: true,
                },
            }),
        ],
    });
};
