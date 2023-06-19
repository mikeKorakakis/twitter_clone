#################
## DEVELOPMENT ##
#################
FROM node:alpine AS development

RUN apk add --no-cache git

WORKDIR /twitter_clone/backend

COPY package.json ./

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

WORKDIR /twitter_clone/backend

COPY --from=development /twitter_clone/backend .

EXPOSE 4000

CMD [ "node", "dist/main" ]