FROM node:12

WORKDIR /app
EXPOSE 3000
COPY . .
RUN yarn install
CMD [ "yarn", "start" ]