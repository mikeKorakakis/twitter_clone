#################
## DEVELOPMENT ##
#################
FROM node:alpine AS development

WORKDIR /twitter_clone/workers/queues

COPY package.json  ./

# RUN npm install -g pnpm
# RUN pnpm install
RUN npm install


COPY . .

RUN npm run build

################
## PRODUCTION ##
################
FROM node:alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /twitter_clone/workers/queues

COPY --from=development /twitter_clone/workers/queues .

CMD [ "node", "dist/main" ]