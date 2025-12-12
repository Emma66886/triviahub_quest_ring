from node:20-alpine
WORKDIR /app
RUN apk add --no-cache python3 make g++
COPY frontend/package.json frontend/package-lock.json ./

RUN npm install 
COPY frontend/. .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]