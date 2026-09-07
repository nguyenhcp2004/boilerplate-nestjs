// OpenTelemetry SDK bootstrap. MUST be the first import in main.ts so
// require-in-the-middle can patch libraries before the app loads them.
// Follows the SigNoz Node.js code-based setup:
// https://signoz.io/docs/instrumentation/javascript/opentelemetry-nodejs/
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions';
import process from 'node:process';

export function startInstrumentation(): NodeSDK | undefined {
  // Env-gated: local dev without SigNoz pays nothing and gets no
  // connection-error noise from the exporter.
  if (process.env.OTEL_ENABLED !== 'true') {
    return undefined;
  }

  const exporter = new OTLPTraceExporter({
    // e.g. http://localhost:4318 (local) or http://host.docker.internal:4318 (docker)
    url: `${process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:4318'}/v1/traces`,
  });

  const sdk = new NodeSDK({
    traceExporter: exporter,
    instrumentations: [getNodeAutoInstrumentations()],
    resource: resourceFromAttributes({
      [ATTR_SERVICE_NAME]:
        process.env.OTEL_SERVICE_NAME || 'nestjs-boilerplate-api',
    }),
  });

  sdk.start();

  // Flush buffered spans on SIGTERM so container stops don't drop traces.
  process.on('SIGTERM', () => {
    sdk
      .shutdown()
      .catch((error) => console.error('Error terminating tracing', error))
      .finally(() => process.exit(0));
  });

  return sdk;
}
