FROM golang:1.22.4-alpine AS build

COPY go.mod /build/
COPY go.sum /build/
COPY main.go /build/
COPY config/ /build/config/
COPY handlers/ /build/handlers/
COPY models/ /build/models/

WORKDIR /build/
RUN go build

EXPOSE 9004

ENTRYPOINT ["MONGODB_URI=mongodb://root:password@localhost:9014 ./OrderAPI"]