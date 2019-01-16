VERSION ?= 0.0.1
ROOT_DIR := $(shell pwd)
OUTPUT_DIR := ${ROOT_DIR}/dist
$(shell mkdir -p ${OUTPUT_DIR})

clean:
	find -type d -name node_modules -exec rm -rf {} \; 
	rm -rf dist/*

webot-nats:
	docker-compose up -d
	sleep 2
	cd webot-nats && npm run start

nats-to-file:
	mkdir -p dist/data
	cd nats-to-file && npm run start

.PHONY: webot-nats nats-to-file