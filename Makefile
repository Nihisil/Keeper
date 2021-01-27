COMPOSE_FILE=$(or $(COMPOSE_FILE_VAR), local.yml)

MAKE_FILE_PATH=$(abspath $(lastword $(MAKEFILE_LIST)))
CURRENT_DIR=$(dir $(MAKE_FILE_PATH))

BACKUP_FOLDER=$(CURRENT_DIR)backups/`date +%Y-%m-%d`
BACKUP_DEST_FOLDER=~/Cloud/Backups/Life/`date +%Y-%m-%d`

build_docker:
	docker-compose -f $(COMPOSE_FILE) build

up:
	docker-compose -f $(COMPOSE_FILE) up

shell:
	docker-compose -f $(COMPOSE_FILE) run --rm web bash

test-be:
	docker-compose -f $(COMPOSE_FILE) run --rm web pytest

backup:
	docker-compose -f local.yml run --rm db bash backup.sh
	tar -zcvf "$(BACKUP_FOLDER)media.tar.gz" "backend/media"
	mkdir -p $(BACKUP_DEST_FOLDER)
	cp -r $(BACKUP_FOLDER)/* $(BACKUP_DEST_FOLDER)
	chmod -R 777 $(BACKUP_DEST_FOLDER)

format-be: format-isort format-black
lint-be: lint-isort format-black lint-flake8

format-isort:
	docker-compose -f $(COMPOSE_FILE) run -u `id -u` --rm web isort -rc .

format-black:
	docker-compose -f $(COMPOSE_FILE) run -u `id -u` --rm web black .

lint-isort:
	docker-compose -f $(COMPOSE_FILE) run -u `id -u` --rm web isort -rc --check-only .

lint-flake8:
	docker-compose -f $(COMPOSE_FILE) run -u `id -u` --rm web flake8 .

lint-black:
	docker-compose -f $(COMPOSE_FILE) run -u `id -u` --rm web black --check .
