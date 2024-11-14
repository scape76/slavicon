FROM ubuntu:22.04
RUN apt-get update && apt-get install -y curl unzip
RUN curl -fsSL https://bun.sh/install | bash && \
    ln -s $HOME/.bun/bin/bun /usr/local/bin/bun
COPY src /src
COPY package.json /
RUN bun install
ENV PORT=3001
ARG DATABASE_URL
ARG GOOGLE_CLIENT_ID
ARG GOOGLE_CLIENT_SECRET
ARG BASE_URL
ARG BASE_FRONTEND_URL
ARG OPENAI_API_KEY
ARG FINETUNED_MODEL_ID
ARG MODEL_NAME
ARG DOMAIN_NAME
ENV NODE_ENV=production
RUN bun run build
EXPOSE 3001
CMD ["bun", "run", "./out/index.js"]