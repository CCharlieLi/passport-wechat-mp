DEBUG = DEBUG=membership,membership:*
BIN = ./node_modules/.bin
TEST_OPTS = --verbose
NODEMON_CONFIG = ./configs/nodemon.json

lint: lint-fix
lint-fix:
	@echo "Linting with fix flag..."
	@$(BIN)/eslint --fix .
test: lint-fix
	@echo "Testing..."
	@NODE_ENV=test $(DEBUG) $(BIN)/jest $(TEST_OPTS)
test-cov: lint
	@echo "Testing..."
	@NODE_ENV=test $(DEBUG) $(BIN)/jest --coverage $(TEST_OPTS)
test-coveralls: test-cov
	@cat ./coverage/lcov.info | $(BIN)/coveralls --verbose
.PHONY: lint lint-fix watch test test-cov test-coveralls
