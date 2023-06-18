FROM node:alpine

WORKDIR /twitter_clone/frontend

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm
RUN pnpm install

COPY . .

EXPOSE 3000

CMD ["pnpm", "run", "dev"]