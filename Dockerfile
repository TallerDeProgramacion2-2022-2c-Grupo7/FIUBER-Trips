FROM node:18
COPY . .
COPY service-account-file.json .
RUN rm -rf node_modules dist
RUN yarn install
RUN yarn build
EXPOSE 8000
CMD yarn start