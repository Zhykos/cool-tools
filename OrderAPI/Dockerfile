FROM golang:1.24.3-alpine

COPY go.mod /build/
COPY go.sum /build/
COPY main.go /build/
COPY config/ /build/config/
COPY services/ /build/services/
COPY models/ /build/models/

WORKDIR /build/
RUN go build

EXPOSE 9004

CMD ["./OrderAPI"]