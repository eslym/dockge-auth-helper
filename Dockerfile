FROM oven/bun:distroless

COPY index.js /home/bun/app/index.js

ENV OUTPUT_FILE="/opt/dockge/docker-auth.json"

WORKDIR /home/bun/app

CMD ["index.js"]
