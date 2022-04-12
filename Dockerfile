FROM nginx:latest

COPY /default.conf /etc/nginx/conf.d/default.conf
COPY /dist/coreui-free-angular-admin-template /usr/share/nginx/html
COPY /dist/dms /usr/share/nginx/html/dms

EXPOSE 80