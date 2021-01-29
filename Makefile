COMPOSE_FILE=$(or $(COMPOSE_FILE_VAR), docker-compose.yml)

MAKE_FILE_PATH=$(abspath $(lastword $(MAKEFILE_LIST)))
CURRENT_DIR=$(dir $(MAKE_FILE_PATH))

up:
	docker-compose -f $(COMPOSE_FILE) up

build_docker:
	docker-compose -f $(COMPOSE_FILE) build

shell:
	docker-compose -f $(COMPOSE_FILE) run -u `id -u` --rm web sh


### Developemnt related commands

check: format lint test-be
format: format-be format-fe
lint: lint-be lint-fe


### Backend ###

test-be:
	docker-compose -f $(COMPOSE_FILE) run -u `id -u` --rm web pytest

format-be: format-isort format-black
lint-be: lint-isort format-black lint-flake8 lint-mypy

format-isort:
	docker-compose -f $(COMPOSE_FILE) run -u `id -u` --rm web isort .

format-black:
	docker-compose -f $(COMPOSE_FILE) run -u `id -u` --rm web black .

lint-isort:
	docker-compose -f $(COMPOSE_FILE) run -u `id -u` --rm web isort --check-only .

lint-flake8:
	docker-compose -f $(COMPOSE_FILE) run -u `id -u` --rm web flake8 .

lint-black:
	docker-compose -f $(COMPOSE_FILE) run -u `id -u` --rm web black --check .

lint-mypy:
	docker-compose -f $(COMPOSE_FILE) run -u `id -u` --rm web mypy --config-file ../mypy.ini .

### Frontend ###

format-fe:
	docker-compose -f $(COMPOSE_FILE) run -u `id -u` --rm frontend yarn format

lint-fe:
	docker-compose -f $(COMPOSE_FILE) run -u `id -u` --rm frontend yarn lint