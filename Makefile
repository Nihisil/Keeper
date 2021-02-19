COMPOSE_FILE=$(or $(COMPOSE_FILE_VAR), docker-compose.yml)

MAKE_FILE_PATH=$(abspath $(lastword $(MAKEFILE_LIST)))
CURRENT_DIR=$(dir $(MAKE_FILE_PATH))

up:
	docker-compose -f $(COMPOSE_FILE) up

down:
	docker-compose -f $(COMPOSE_FILE) down

build-docker:
	docker-compose -f $(COMPOSE_FILE) build

shell:
	docker-compose -f $(COMPOSE_FILE) run -u `id -u` --rm api sh

update-api-client:
	curl http://0.0.0.0:8090/openapi.json > ./frontend/openapi.json
	docker-compose -f $(COMPOSE_FILE) run -u `id -u` --rm frontend \
		npx swagger-typescript-api \
        -p /home/node/app/openapi.json \
        -o /home/node/app/src/client/ \
        --modular \
        --single-http-client
	rm ./frontend/openapi.json

### Development related commands

check: format lint test

format: format-be format-fe
lint: lint-be lint-fe
test: test-be

### Backend ###

test-be:
	docker-compose -f docker-compose.yml -f docker-compose.test.yml run -u `id -u` --rm api sh -c "pytest"

# usage example "make test-single-be test=test_get_access_token_by_username_and_password"
test-single-be:
	docker-compose -f docker-compose.yml -f docker-compose.test.yml run -u `id -u` --rm api sh -c "pytest -k $(test)"

format-be: format-isort format-black
lint-be: lint-isort format-black lint-flake8 lint-mypy

format-isort:
	docker-compose -f $(COMPOSE_FILE) run -u `id -u` --rm api isort .

format-black:
	docker-compose -f $(COMPOSE_FILE) run -u `id -u` --rm api black .

lint-isort:
	docker-compose -f $(COMPOSE_FILE) run -u `id -u` --rm api isort --check-only .

lint-flake8:
	docker-compose -f $(COMPOSE_FILE) run -u `id -u` --rm api flake8 .

lint-black:
	docker-compose -f $(COMPOSE_FILE) run -u `id -u` --rm api black --check .

lint-mypy:
	docker-compose -f $(COMPOSE_FILE) run -u `id -u` --rm api mypy -p api -p lib

### Frontend ###

format-fe:
	docker-compose -f $(COMPOSE_FILE) run -u `id -u` --rm frontend yarn format

lint-fe:
	docker-compose -f $(COMPOSE_FILE) run -u `id -u` --rm frontend yarn lint