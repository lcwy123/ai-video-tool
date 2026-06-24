ARG NPM_REGISTRY=https://registry.npmjs.org

FROM docker.m.daocloud.io/library/node:20-alpine

ARG NPM_REGISTRY

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm config set registry $NPM_REGISTRY && npm ci

COPY . .

EXPOSE 3000
CMD ["npm", "run", "dev"]
