install: install-deps

install-deps:
	npm ci

test:
	npm test

watch:
	npx -n --experimental-vm-modules  jest --watch

test-coverage:
	npm test -- --coverage --coverageProvider=v8

publish:
	npm publish --dry-run

lint:
	npx eslint .
