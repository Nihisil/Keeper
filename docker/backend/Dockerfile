FROM python:3.9.2-alpine

ENV PYTHONUNBUFFERED 1

RUN python3 -m pip install pip==21.0.1

COPY ./backend/requirements/base.txt /requirements.txt
COPY ./backend/requirements/base.txt /base.txt
COPY ./backend/requirements/dev.txt /dev.txt

# let's install additional dev package only if there is no production build
ARG mode
RUN echo "Mode=$mode"
RUN if [ "$mode" != "production" ] ; then cat /base.txt /dev.txt > /requirements.txt ; fi

RUN \
 apk add --no-cache --virtual .build-deps musl-dev gcc && \
 python3 -m pip install -r /requirements.txt --no-cache-dir && \
 apk --purge del .build-deps

COPY ./docker/backend/entrypoint /entrypoint
RUN sed -i 's/\r//' /entrypoint
RUN chmod +x /entrypoint

ADD ./docker/backend/crontab /etc/crontabs/root

RUN addgroup -S docker && adduser -S docker-user -G docker

COPY ./backend/ /app/
WORKDIR /app/

RUN rm /requirements.txt
RUN rm /base.txt
RUN rm /dev.txt
RUN rm -r /app/requirements/

ENTRYPOINT ["/entrypoint"]

USER docker-user
