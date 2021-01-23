[![Test](https://github.com/Nalhin/socialAuth/workflows/Test/badge.svg?branch=master)](https://github.com/Nalhin/SocialAuth/actions)
[![Codecov](https://codecov.io/gh/Nalhin/SocialAuth/branch/master/graph/badge.svg)](https://codecov.io/gh/Nalhin/SocialAuth)
[![CodeFactor](https://www.codefactor.io/repository/github/nalhin/socialauth/badge)](https://www.codefactor.io/repository/github/nalhin/tutoring)
[![License](https://img.shields.io/github/license/nalhin/SocialMedia)](LICENSE.md)

# Social Auth

NestJS framework Social Auth implementation supporting multiple providers (google and facebook). 

## Table of contents

* [Description](#description)
* [Features](#features)
* [Architecture](#architecture)
* [GraphQL API specification](#graphql-api-specification)
* [Env schema](#env-schema)
* [Prerequisites](#prerequisites)
* [Installation](#installation)
* [Tests](#tests)
* [License](#license)

## Description

Social Auth provides the extendable base implementation of social auth in graphql application

## Features

* Multiple social auth providers

### Backend

* NestJS
* Graphql
* Apollo
*

### CI/CD

* Github Actions
* Codecov

## Architecture

Architecture description

## GraphQL API specification

Graphql API specification is available at http://localhost:8000/graphql. The server has to be up and running in for the
documentation to be available. Alternatively, a schema.graphql file is provided in the root directory.

# Env schema

Please provide an .env file in the root directory that conforms to the following JSON schema

```json
{
  "type": "object",
  "properties": {
    "NODE_ENV": {
      "type": "string",
      "default": "development",
      "enum": [
        "development",
        "production",
        "test",
        "provision"
      ]
    },
    "PORT": {
      "type": "number",
      "default": 8000
    },
    "DB_USER": {
      "type": "string"
    },
    "DB_PASSWORD": {
      "type": "string"
    },
    "DB_PORT": {
      "type": "number",
      "default": 5432
    },
    "DB_DEV": {
      "type": "string"
    },
    "DB_TEST": {
      "type": "string"
    },
    "JWT_SECRET": {
      "type": "string"
    },
    "JWT_EXPIRES_IN": {
      "type": "string"
    },
    "FACEBOOK_ID": {
      "type": "string"
    },
    "FACEBOOK_SECRET": {
      "type": "string"
    },
    "GOOGLE_ID": {
      "type": "string"
    },
    "GOOGLE_SECRET": {
      "type": "string"
    }
  },
  "required": [
    "DB_USER",
    "DB_PASSWORD",
    "DB_DEV",
    "DB_TEST"
  ]
}
```

## Prerequisites

Install (node)[https://nodejs.org/en], (npm)[https://www.npmjs.com]. You should be able to run the following commands.

```bash
node --version
npm --version
```

Install [docker](https://docs.docker.com/install/) and [docker-compose](https://docs.docker.com/compose/). You should be
able to run the following commands.

```bash
docker --version
docker-compose --version
```

## Installation

Run the following commands before proceeding to the sections below.

### Setup database

```bash
docker-compose --env-file ./.env --f ./docker/docker-compose.dev.yml up -d
```

or

```bash
make setup-dev
```

### Setup backend

```bash
cd backend
npm install
npm run start
```

## Tests

In order to manually run tests, follow the instructions below.

### Unit

```bash
cd backend
npm run test
```

### E2E

```bash
cd backend
npm run test:e2e
```

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
