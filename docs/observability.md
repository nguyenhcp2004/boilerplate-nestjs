# Observability (SigNoz + OpenTelemetry)

This boilerplate ships [SigNoz](https://signoz.io) integration for distributed tracing, with trace-correlated application logs.

## What is instrumented

- **Traces** — HTTP requests, Express routes, PostgreSQL (via `pg`), Redis (via `ioredis`), and DNS, via `@opentelemetry/auto-instrumentations-node`.
- **Log ↔ trace correlation** — every pino log line includes `trace_id` / `span_id` from the active span, so logs are linked to traces in the SigNoz UI. Logs stay console-only (see [Rationale](#rationale)).

## Architecture

```
NestJS app ── (OTLP HTTP :4318) ──> SigNoz OTel collector ──> ClickHouse ──> SigNoz UI (:8080)
```

SigNoz is deployed via [Foundry](https://github.com/SigNoz/foundry) (`casting.yaml`), which manages its own compose stack separate from the app stack. The app reaches SigNoz through the host-published OTLP port.

## Setup

### 1. Start SigNoz (Foundry)

```bash
curl -fsSL https://signoz.io/foundry.sh | bash   # one-time: installs foundryctl
foundryctl cast -f casting.yaml                 # generates pours/deployment/ and starts the stack
```

SigNoz UI: http://localhost:8080 — first visit prompts you to create an admin account.

Requires ≥4GB memory allocated to Docker.

### 2. Start the app

The Docker compose stack is already wired (`extra_hosts: host.docker.internal:host-gateway` on the api service, `OTEL_ENABLED=true` in `.env.docker`):

```bash
docker compose up -d
```

For running the app directly on the host (not in Docker), use `.env` with:

```
OTEL_ENABLED=true
OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318
```

### 3. Verify

1. Generate traffic: `curl http://localhost:3000/api/health` a few times.
2. Open SigNoz → **Services** → refresh; `nestjs-boilerplate-api` should appear.
3. **Traces** → filter by service; expand a trace to see `pg` / `ioredis` child spans.
4. Debugging missing data: set `OTEL_LOG_LEVEL=debug` and check app console output.

## Environment variables

| Variable | Default | Description |
| --- | --- | --- |
| `OTEL_ENABLED` | `false` | Enables the OTel SDK. When `false`, instrumentation is a no-op. |
| `OTEL_EXPORTER_OTLP_ENDPOINT` | `http://localhost:4318` | OTLP HTTP base endpoint. Use `http://host.docker.internal:4318` from containers. |
| `OTEL_SERVICE_NAME` | `nestjs-boilerplate-api` | Service name shown in SigNoz. |

## How it works in code

- `src/instrumentation.ts` — OTel `NodeSDK` bootstrap (env-gated, `SIGTERM` span flush). Called as the **first import** in `src/main.ts` so require-in-the-middle can patch libraries before the app loads them.
- `src/utils/logger-factory.ts` — `traceContextMixin` injects `trace_id`/`span_id` into every pino log line; returns `{}` when tracing is off, so no overhead when disabled.

## Rationale

- **Foundry over inline compose** — SigNoz deprecated their bundled `install.sh`/`deploy/` compose (v0.130.0+); Foundry is the supported deployment path and keeps ~5 SigNoz services (ClickHouse, Keeper, metastore, collector, query service) out of this repo's compose file.
- **Traces only** — pino logs stay console-only with trace IDs in the metadata. Shipping logs to SigNoz too (`pino-opentelemetry-transport`) is a possible future addition; it was skipped to keep the setup minimal. Trace IDs in metadata are enough for SigNoz to link log search to traces.
- **OTLP HTTP over gRPC** — one less proto dependency; works identically with the SigNoz collector.

## Troubleshooting

- **Service not appearing in SigNoz** — check `OTEL_ENABLED=true`, endpoint reachable from where the app runs, and that the app actually received traffic (OTel buffers spans before sending).
- **Connection refused in docker logs** — SigNoz stack not running; the exporter retries and logs errors until it is.
- **`node -r` / ERR_REQUIRE_ESM** — not applicable: this repo compiles to CommonJS (`module: commonjs` in tsconfig).
