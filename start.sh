#!/bin/sh
set -e

# start backend
java -jar /app/backend/app.jar &

# start next frontend
cd /app/frontend
npm run start -- -p 3000 &

# start nginx
nginx -g 'daemon off;'