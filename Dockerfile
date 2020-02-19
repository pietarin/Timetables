FROM node:12

WORKDIR /
EXPOSE 3000
COPY . .
RUN yarn install
RUN yarn build
RUN npm install -g serve
CMD ["serve", "-s", "build"]