FROM alpine:3.20
WORKDIR /judge
USER judge

RUN apk add --no-cache gcc musl-dev busybox

COPY source.c source.c

RUN gcc -o target.o source.c

CMD ["/judge/target.o"]
