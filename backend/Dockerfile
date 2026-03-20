FROM alpine:latest

EXPOSE 8090

# Install curl and ca-certificates for downloading PocketBase
RUN apk add --no-cache curl ca-certificates unzip

# Create app directory
WORKDIR /app

# Download PocketBase v0.24.4 from official GitHub releases
RUN curl -L https://github.com/pocketbase/pocketbase/releases/download/v0.24.4/pocketbase_0.24.4_linux_amd64.zip -o pb.zip && \
    unzip pb.zip && \
    rm pb.zip && \
    chmod +x pocketbase

# Create data directory
RUN mkdir -p /pb_data

# Expose ports
EXPOSE 8090 8091

# Run PocketBase
CMD ["./pocketbase", "serve", "--http", "0.0.0.0:8090", "--dir", "/pb_data"]