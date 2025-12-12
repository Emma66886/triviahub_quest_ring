FROM node:20-alpine
WORKDIR /app

RUN apt-get update && apt-get install -y \
    build-essential \
    python3 \
    make \
    g++ \
    libudev-dev


COPY frontend/package*.json ./

RUN npm install 
COPY frontend/. .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]