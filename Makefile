.PHONY: docker-dev

setup-dev:
	docker-compose --f ./docker/docker-compose.dev.yml up -d
