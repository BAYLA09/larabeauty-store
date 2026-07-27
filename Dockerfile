FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ARG NEXT_PUBLIC_SITE_URL=https://larabeauty.store
ARG NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL
ARG NEXT_PUBLIC_SHEETS_WEBHOOK_SECRET

ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL=$NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL
ENV NEXT_PUBLIC_SHEETS_WEBHOOK_SECRET=$NEXT_PUBLIC_SHEETS_WEBHOOK_SECRET

RUN npm run build

FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/out /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
