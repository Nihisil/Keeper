Project to keep information about read/watched books/comics/cinema/tv-shows/etc, and other different stuff (like personal bookkeeping).

For back-end we are using Python + FastAPI + MongoDB, and for front-end React + TypeScript. 

# Hot to run it Locally

1. `make build-docker`
1. `make up`

After that you can access project parts:
- API endpoint: http://0.0.0.0:8090/
- API documentation: http://0.0.0.0:8090/docs
- Client: http://0.0.0.0:3000/

# Before commit

Run `make check` to validate the code with linters and to run unit tests.
