[![Test](https://github.com/Nalhin/socialAuth/workflows/Test/badge.svg?branch=master)](https://github.com/Nalhin/SocialAuth/actions)
[![Codecov](https://codecov.io/gh/Nalhin/SocialAuth/branch/master/graph/badge.svg)](https://codecov.io/gh/Nalhin/SocialAuth)
[![CodeFactor](https://www.codefactor.io/repository/github/nalhin/socialauth/badge)](https://www.codefactor.io/repository/github/nalhin/socialauth)
[![License](https://img.shields.io/github/license/nalhin/SocialMedia)](LICENSE.md)

# Social Auth

NestJS framework Social Auth implementation supporting multiple social providers.

## Table of contents

* [Description](#description)
* [Features](#features)
* [Architecture](#architecture)
* [Features](#features)
* [GraphQL API specification](#graphql-api-specification)
* [Env schema](#env-schema)
* [Prerequisites](#prerequisites)
* [Installation](#installation)
* [Tests](#tests)
* [License](#license)

## Description

The project provides the baseline configuration for NestJS GraphQL social authentication. The architecture can easily be
extended to support different OAuth providers as the social auth is implemented based on Passport.js library utilizing a
strategy design pattern.

Supported providers:

* Google
* Facebook

A database social profile entry is created after the user authenticates with the social provider. If the user does not
have an account, a new one is created, and the social profile gets attached to that account. After social
authentication, the user continues with the default (JWT) authentication strategy. A user can connect his account with
multiple social providers.

## Features

* Multiple social authentication providers
* JWT authentication
* GraphQL API
* Persistence in PostgreSQL

## Technology stack

### Backend

* NestJS
* Graphql
* Apollo
* Passport
* Jest
* Supertest
* PostgreSQL

### CI/CD

* Github Actions
* Codecov

## Architecture

The application follows a feature-first module structure resulting in a clean separation of boundaries between modules.
The GraphQL API uses union return types instead of Apollo errors to indicate an alternative flow of action. This
decision results in well-documented errors, one source of truth (the GraphQL schema) and better TypeScript support. It
also allows the user to indicate which error fields he wants to receive. The error handling was modelled after
the [GraphQL Conf presentation](https://www.youtube.com/watch?v=A5-H6MtTvqk).

### Folder structure

```
root
├── common (shared logic)
├── config (configuration)
├── graphql (graphql decorators, interfaces and responses)
└── feature modules 
    ├── input (input dto)
    ├── responses (response dto) 
    ├── results (unions of responses and errors) 
    ├── entity (database entities) 
    ├── service (business logic) 
    ├── resolver (graphql resolver) 
    └── repository (database repository) 
```

### Social

Social authentication utilizes a strategy design pattern that allows for quick implementation of additional providers.

```
strategy
├── facebook.strategy 
├── google.strategy
└── jwt.strategy

```

## GraphQL API specification

Graphql API specification is available at http://localhost:8000/graphql. The server has to be up and running in for the
documentation to be available. Alternatively, a schema.graphql file is provided in the root directory.

# Env schema

Please provide an .env file in the root directory that conforms to the following JSON schema.

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
