FROM alpine:3.20 AS base

RUN apk add --no-cache musl-dev g++

# Map the source code to the container /working when running
ENTRYPOINT ["g++", "-o", "/working/target.o", "/working/source.c"]
