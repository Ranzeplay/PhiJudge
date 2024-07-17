FROM rust:1-alpine3.20 AS builder
WORKDIR /app

COPY --link . .

RUN cargo build --release

FROM alpine:3.20 AS runner
WORKDIR /app

COPY --from=builder /app/target/release/execution ./execution

RUN apk add --no-cache sudo
RUN adduser -u 1001 -DH judge

# Map running-related files to /app/context
ENTRYPOINT ["./execution"]
