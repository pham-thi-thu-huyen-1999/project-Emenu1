FROM node:12-alpine as builder

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN yarn && \
    yarn cache clean

COPY . .

RUN yarn build



# ------------------------------------------------------
# Production Build
# ------------------------------------------------------
FROM nginx:alpine

# apk 
RUN apk update
RUN apk add --no-cache curl tzdata
ENV TZ=Asia/Bangkok

COPY --from=builder /usr/src/app/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]