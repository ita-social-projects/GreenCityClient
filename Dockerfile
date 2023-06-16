FROM nginx:1.21.6-alpine as runner
RUN rm -rf /usr/share/nginx/html/index.html
COPY ./dist/GreenCityClient/ /usr/share/nginx/html/
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD nginx -g 'daemon off;'