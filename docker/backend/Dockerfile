FROM python:3.8.7-alpine

ENV PYTHONUNBUFFERED 1

# requirements are installed here to ensure they will be cached.
COPY ./backend/requirements.txt /requirements.txt
RUN \
 apk add --no-cache postgresql-libs gettext-dev jpeg-dev zlib-dev && \
 apk add --no-cache --virtual .build-deps build-base linux-headers gcc musl-dev postgresql-dev && \
 python3 -m pip install -r /requirements.txt --no-cache-dir && \
 apk --purge del .build-deps

COPY ./docker/backend/entrypoint /entrypoint
RUN sed -i 's/\r//' /entrypoint
RUN chmod +x /entrypoint

RUN addgroup -S docker && adduser -S docker-user -G docker

WORKDIR /app/backend

ENTRYPOINT ["/entrypoint"]

USER docker-user
