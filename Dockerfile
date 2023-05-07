FROM node:19.4.0-alpine
EXPOSE 3000
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY . .
RUN yarn
RUN yarn build
CMD ["yarn", "start:prod"]