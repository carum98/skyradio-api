# <img src="./assets/logo.png" width="30" height="30" /> SkyRadio API

API RESTful to SkyRadio app.

Frontend: [SkyRadio Frontend](https://github.com/carum98/skyradio-frontend)

Mobile: [SkyRadio Mobile](https://github.com/carum98/skyradio_mobile)

## Description
This project use [Docker](https://www.docker.com/), with two containers, one for the API ([Node.js](https://hub.docker.com/_/node)) and another for the database ([MySQL](https://hub.docker.com/_/mysql)).

The project has 3 environments, development, testing and production. Each environment has its own docker configuration file, which is located in the `/docker` folder.

## Documentation
The documentation of the project is located in the `/docs` folder, and is divided into the following files:

- [Endpoints](./docs/endpoints/index.md)
- [File Structure](./docs/file_structure.md)
- [Database Structure](./docs/database_structure.md)
- [Pagination](./docs/pagination.md)
- [Query Filters](./docs/query_filters.md)
- [Sort](./docs/sort.md)

## Environment variables
The project has a `.env` file, which contains the environment variables, which are:

| Variable | Description |
| --- | --- |
| `PORT` | Port where the API will run |
| `DB_PORT` | Port of the database |
| `DB_DATABASE` | Name of the database |
| `DB_USER` | User of the database |
| `DB_PASSWORD` | Password of the database |
| `SECRET_TOKEN` | Secret key for JWT |
| `SECRET_REFRESH_TOKEN` | Secret key for JWT refresh token |

## Setup without Docker
To run the project without Docker, you must have [Node.js](https://nodejs.org/en/) and [MySQL](https://www.mysql.com/) installed. You must also have a database created and running, and the environment variables configured.

### Development
To run the project in development mode, you must run the following commands:
```bash
npm install && npm run dev
```

### Testing
To run the project in testing mode, you must run the following commands:
```bash
npm install && npm run test
```

### Production
To run the project in production mode, you must run the following commands:
```bash
npm install && npm run build && npm run start
```

## Setup with Docker
To run the project, you must have [Docker](https://www.docker.com/) installed.

### Development
To run the project in development mode, you must run the following command:
```bash
docker-compose -f docker-compose.yml -f docker/docker-compose.dev.yml up -d --build
```
or
```bash
 ./run.sh --dev
```

### Testing
To run the project in testing mode, you must run the following command:
```bash
docker-compose -f docker-compose.yml -f docker/docker-compose.test.yml up -d --build
```
or
```bash
 ./run.sh --test
```

### Production
To run the project in production mode, you must run the following command:
```bash
docker-compose -f docker-compose.yml -f docker/docker-compose.prod.yml up -d --build
```
or
```bash
 ./run.sh --prod
```

## Generate Docker image to production
To generate the Docker image, you must run the following command:

```bash
docker build -t <name-container> -f ./docker/Dockerfile.prod .
```

To reduce the image size, the build process has 2 stages, the first one is to install the dependencies and build the project, when the build is done, prune the dependencies to remove the development dependencies, and the second stage is to copy the compiled files and production dependencies to the container.

## To run the project on a server
To run the project on a server, you must have [Docker](https://www.docker.com/) installed, and pull the image generated in the previous step. Copy the `docker-compose.yml` file and `docker-compose.prod.yml` file to the server and create a `.env` file with the [environment variables](#environment-variables), and run the following commands:

```bash
docker network create skyradio-network
```

```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

This will create a network for the containers and run the containers in the background, and create a volume for the database, so the data will be persistent even if the container is deleted or stopped.

Important, this docker-compose files don't expose the ports, so you must expose the ports manually, or use a reverse proxy container like [Nginx](https://hub.docker.com/_/nginx), connecting the containers to the same network.

## Database migrations
To run the migrations, you must run the following command:

```bash
npm run db:migrate
```
or
```bash
docker exec skyradio-api sh -c 'cd dist && node -e "require(\"./src/core/migrations.core.js\").init()"'
```




