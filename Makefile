################################################################
## Client
################################################################

build-client:
	cd client && yarn run build
.PHONY: build-client

format-client:
	cd client && yarn run format:nofix
.PHONY: format-client

format-fix-client:
	cd client && yarn run format
.PHONY: format-client

lint-client:
	cd client && yarn run lint:nofix
.PHONY: lint-client

lint-fix-client:
	cd client && yarn run lint
.PHONY: lint-client

################################################################
## Server
################################################################

build-server:
	cd server && yarn run build
.PHONY: build-server

format-server:
	cd server && yarn run format:nofix
.PHONY: format-server

format-fix-server:
	cd server && yarn run format
.PHONY: format-server

lint-server:
	cd server && yarn run lint:nofix
.PHONY: lint-server

lint-fix-server:
	cd server && yarn run lint
.PHONY: lint-server

################################################################
## App
################################################################

start-client:
	cd client && yarn run start:dev
.PHONY: start-client

start-server:
	cd server && yarn run start:dev
.PHONY: start

start-prod:
	cd server && yarn run start
.PHONY: start-prod

heroku-local:
	yarn run heroku-local
PHONY: heroku-local

deploy:
	yarn run deploy
.PHONY: deploy
