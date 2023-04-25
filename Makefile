.PHONY: docker-dev

setup-dev:
	docker-compose --env-file ./.env -f ./docker/docker-compose.dev.yml up -d
