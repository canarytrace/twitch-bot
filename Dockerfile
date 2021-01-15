FROM node:12-alpine

ENV APP_DIR /opt/bot/

# Create app directory
RUN mkdir -p ${APP_DIR} && \
    chown -R node:node ${APP_DIR}
    
WORKDIR ${APP_DIR}
COPY . ${APP_DIR}

RUN apk add --no-cache bash && \
    cd ${APP_DIR} && npm install && \
    chmod +x ${APP_DIR}/entrypoint.sh && \
    chown -R node:node ${APP_DIR}

USER node
ENTRYPOINT ["/opt/bot/entrypoint.sh"]