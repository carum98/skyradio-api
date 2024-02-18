# File Structure
This project use [ExpressJS](https://expressjs.com/) as the backend framework. The project is divided into the following folders:

![File Structure](./assets/file_structure.png)

## Routes
The routes are used to define the endpoints of the API, each route is defined in a separate file.

## Controllers
The controllers are used to define the logic of the routes, each controller is defined in a separate file. The controllers are called by the routes. The main function of the controllers is to handle the request and response of the routes, and call the services to define the logic of the routes.

## Services
The services are used to define the logic of the controllers, the services call the repositories to communicate with the database.

## Repositories
The repositories are used to define the logic of the database, the repositories are called by the services to define the logic of the controllers.

## Models
The models are used to define the structure of the data that will be stored in the database [Drizzle](https://orm.drizzle.team/), data schema [Zod](https://zod.dev) is used to define the structure of the data and validate it in ejecution time and define the TypeScript types of the data to use in the code. Each model is defined in a separate file.

## Middlewares
The middlewares are used to define the logic that will be executed before the controllers, the middlewares are called by the routes.
