COMPOSE_FILE=$(or $(KEEPER_COMPOSE_FILE), docker-compose.yml)

MAKE_FILE_PATH=$(abspath $(lastword $(MAKEFILE_LIST)))
CURRENT_DIR=$(dir $(MAKE_FILE_PATH))

up:
	docker-compose -f $(COMPOSE_FILE) up

up-daemon:
	docker-compose -f $(COMPOSE_FILE) up -d

down:
	docker-compose -f $(COMPOSE_FILE) down

docker-build: down
	docker-compose -f $(COMPOSE_FILE) build

docker-pull:
	docker-compose -f $(COMPOSE_FILE) pull

shell:
	docker-compose -f $(COMPOSE_FILE) run -u `id -u` --rm api sh

update-api-client:
	curl http://0.0.0.0:8090/openapi.json > ./frontend/openapi.json
	docker-compose -f $(COMPOSE_FILE) run -u `id -u` --rm frontend \
		npx swagger-typescript-api \
        -p /home/node/app/openapi.json \
        -o /home/node/app/src/client/ \
        --modular \
        --axios \
        --single-http-client
	rm ./frontend/openapi.json


### Linters and formatters ###

check: check-be check-fe
check-be: format-be lint-be test-be
check-fe: format-fe lint-fe test-fe

format: format-be format-fe
lint: lint-be lint-fe
test: test-be test-fe

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

test-fe: test-fe-chrome test-fe-firefox

test-fe-chrome:
	docker-compose -f docker-compose.yml -f docker-compose.test.yml up -d frontend
	docker-compose -f docker-compose.yml -f docker-compose.test.yml run -u `id -u` --rm cypress --browser chrome

test-fe-firefox:
	docker-compose -f docker-compose.yml -f docker-compose.test.yml up -d frontend
	docker-compose -f docker-compose.yml -f docker-compose.test.yml run -u `id -u` --rm cypress --browser firefox
