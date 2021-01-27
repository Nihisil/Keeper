FROM python:3.8.3-alpine

ENV PYTHONUNBUFFERED 1

# Requirements are installed here to ensure they will be cached.
COPY ./backend/requirements /requirements
RUN \
 apk add --no-cache postgresql-libs gettext-dev jpeg-dev zlib-dev && \
 apk add --no-cache --virtual .build-deps build-base linux-headers gcc musl-dev postgresql-dev && \
 python3 -m pip install -r /requirements/local.txt --no-cache-dir && \
 apk --purge del .build-deps

COPY ./docker/local/django/entrypoint /entrypoint
RUN sed -i 's/\r//' /entrypoint
RUN chmod +x /entrypoint

COPY ./docker/local/django/start /start
RUN sed -i 's/\r//' /start
RUN chmod +x /start

RUN addgroup -S docker && adduser -S docker-user -G docker

WORKDIR /app/backend

ENTRYPOINT ["/entrypoint"]

USER docker-user
