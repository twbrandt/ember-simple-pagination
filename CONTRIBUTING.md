# How To Contribute

This repo is divided into multiple packages using Yarn workspaces:

- `addon` is the actual ember-simple-pagination addon
- `test-app` is its test suite

## Installation

- `git clone <repository-url>`
- `cd ember-simple-pagination`
- `yarn install`

## Linting

Inside any of the packages you can run:

- `yarn lint`
- `yarn lint:fix`

## Running tests

- `cd test-app && ember test` – Runs the test suite on the current Ember version
- `cd test-app && ember test --server` – Runs the test suite in "watch mode"
- `cd test-app & ember try:each` – Runs the test suite against multiple Ember versions

## Running the test application

- `cd test-app && ember serve`
- Visit the test application at [http://localhost:4200](http://localhost:4200).

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).