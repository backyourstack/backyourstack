FROM node:10

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

RUN npm prune

ARG PORT=3000
ENV PORT $PORT

EXPOSE ${PORT}

CMD [ "npm", "run", "start" ]
