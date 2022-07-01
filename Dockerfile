# build
FROM node:14-alpine as build
WORKDIR /app
RUN apk add --no-cache git
COPY . /app/
RUN npm install
RUN npm run lint
RUN npm run stylelint
RUN npx ng build --prod --base-href=/GreenCityClient/ --aot=false --build-optimizer=false

# prod
FROM nginx:1.21.6-alpine as runner
COPY --from=build /app/dist/ /usr/share/nginx/html/
COPY --from=build /app/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD nginx -g 'daemon off;'
