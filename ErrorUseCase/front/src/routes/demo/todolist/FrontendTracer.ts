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
import type { OTLPExporterNodeConfigBase } from '@opentelemetry/otlp-exporter-base';

export const FrontendTracer = async () => {
    const { ZoneContextManager } = await import("@opentelemetry/context-zone");
    const provider = new WebTracerProvider({
        resource: new Resource({
            [ATTR_SERVICE_NAME]: "error-case-195-frontend",
        }),
    });

    const exporterOpts: OTLPExporterNodeConfigBase = {};
    if (import.meta.env.PUBLIC_OPENTELEMETRY_COLLECTOR_URI) {
        exporterOpts.url = import.meta.env.PUBLIC_OPENTELEMETRY_COLLECTOR_URI;
    }

    provider.addSpanProcessor(new SimpleSpanProcessor(new OTLPTraceExporter(exporterOpts)));
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
