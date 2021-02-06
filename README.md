![Linters and Tests](https://github.com/Nihisil/Keeper/workflows/Linters%20and%20Tests/badge.svg)

Project to keep information about read/watched books/comics/cinema/tv-shows/etc, and other different stuff (like personal bookkeeping).

For back-end we are using Python + FastAPI + MongoDB, and for front-end React + TypeScript. 

# Hot to run it locally

1. `make build-docker`
1. `make up`

After that you can access project parts:
- API endpoint: http://0.0.0.0:8090/
- API documentation: http://0.0.0.0:8090/docs
- Client: http://0.0.0.0:3000/

# Generate FE client from openapi

1. `make up`
1. `make update-api-client`
1. `make format-fe`

# Before commit

Run `make check` to validate the code with linters and to run unit tests.
