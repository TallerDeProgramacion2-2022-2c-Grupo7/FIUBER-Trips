FROM node:18
COPY . .
RUN rm -rf node_modules dist
RUN yarn install
RUN yarn build
EXPOSE 8000
CMD yarn start