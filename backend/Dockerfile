#################
## DEVELOPMENT ##
#################
FROM node:alpine AS development

WORKDIR /twitter_clone/backend

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm
RUN pnpm install

COPY . .

RUN pnpm run build

################
## PRODUCTION ##
################
FROM node:alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /twitter_clone/backend

COPY --from=development /twitter_clone/backend .

EXPOSE 4000

CMD [ "node", "dist/main" ]