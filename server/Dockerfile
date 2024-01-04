FROM node:16-alpine

WORKDIR /.

COPY package.json .

RUN npm install

COPY . .

EXPOSE 3030

CMD ["npx", "ts-node", "index.ts"]