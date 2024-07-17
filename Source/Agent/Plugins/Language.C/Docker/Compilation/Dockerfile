FROM alpine:3.20 AS base

RUN apk add --no-cache musl-dev gcc

# Map the source code to the container /working when running
ENTRYPOINT ["gcc", "-o", "/working/target.o", "/working/source.c"]
