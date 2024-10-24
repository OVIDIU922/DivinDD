.PHONY: help

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

rebuild:
	symfony console doctrine:database:drop -f
	symfony console doctrine:database:create
	symfony console doctrine:schema:update -f
	symfony console doctrine:fixtures:load -n
	

install:
	symfony composer install
	symfony console lexik:jwt:generate-keypair --overwrite
	make rebuild
	

stan: ## run php stan
	symfony php -d memory_limit=-1 vendor/phpstan/phpstan/phpstan analyse -c ../../.husky/phpstan-conf.neon

fixer: ## cs fixer dry-run
	PHP_CS_FIXER_IGNORE_ENV=true symfony php vendor/friendsofphp/php-cs-fixer/php-cs-fixer fix --dry-run --diff

fixer-fix: ## cs fixer
	PHP_CS_FIXER_IGNORE_ENV=true symfony php vendor/friendsofphp/php-cs-fixer/php-cs-fixer fix --diff

run:
	symfony serve --allow-http

stop:
	symfony server:stop