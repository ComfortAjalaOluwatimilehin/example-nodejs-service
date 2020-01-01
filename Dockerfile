FROM  node:10
WORKDIR /usr/src/app
COPY package*.json ./
COPY . .
RUN npm install
RUN npm run build
EXPOSE 5000
CMD ["npm", "run", "start:dev"]