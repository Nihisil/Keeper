FROM python:3.9.2-alpine

ENV PYTHONUNBUFFERED 1

RUN python3 -m pip install pip==21.0.1

# requirements are installed here to ensure they will be cached
COPY ./backend/requirements.txt /requirements.txt
RUN \
 apk add --no-cache --virtual .build-deps build-base linux-headers gcc musl-dev python3-dev libffi-dev openssl-dev cargo && \
 python3 -m pip install -r /requirements.txt --no-cache-dir && \
 apk --purge del .build-deps

COPY ./docker/backend/entrypoint /entrypoint
RUN sed -i 's/\r//' /entrypoint
RUN chmod +x /entrypoint

RUN addgroup -S docker && adduser -S docker-user -G docker

WORKDIR /app/

ENTRYPOINT ["/entrypoint"]

USER docker-user
