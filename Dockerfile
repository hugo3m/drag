# node image
FROM node:22-alpine
# copy src files
COPY src /app/src
COPY package-lock.json /app/package-lock.json
COPY package.json /app/package.json
COPY tsconfig.json /app/tsconfig.json
COPY public /app/public
COPY webpack.config.js /app/webpack.config.js
# install dependencies
RUN cd /app && npm install
# set working directory
WORKDIR /app
# run project
ENTRYPOINT [ "npm", "run", "start" ]