FROM node:20-alpine
WORKDIR /app

RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    linux-headers \
    eudev-dev

ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_SOLANA_NETWORK
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_SOLANA_NETWORK=$NEXT_PUBLIC_SOLANA_NETWORK

COPY frontend/package*.json ./

RUN npm install 
COPY frontend/. .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]