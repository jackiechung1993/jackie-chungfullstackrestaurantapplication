# Full Stack Restaurant Application

## Table of Contents
1. Introduction
2. Dependencies
3. Installation & Deployment
4. Features
5. License

## Introduction
This application is designed to showcase full-stack development for a restaurant-based app. It runs APIs and databases to manage the data that populates the front end.

## Dependencies
The application runs on Node 12 and utilizes compatible dependencies. If you're not using Node 12, please install it with `nvm install 12` and then run `nvm use 12`. Note: NVM needs to be installed in order to be utilized.

## Installation & Deployment
To test and run the app on localhost, follow these steps:

1. Navigate to the root directory.
2. Run `npm install`.
3. Run `npm run dev`.
4. Navigate to the backend folder.
5. Run `npm install`.
6. Run `npm run build`.
7. Run `npm run develop`.

Running on Docker.

1. Build image in the main root: `docker-compose build`.
2. Launch the application: `docker-compose up`.

## Features
The application includes the following features:

- UI updates for login and authentication check.
- Order processing check.
- Display restaurants on the home page.
- Display dishes on a dishes page only after a restaurant is selected.
- Enable search functionality for restaurants and dishes.
- Conditional rendering of the checkout cart so that it only appears after dishes are selected.
- Display order history.
- User profile.

## License
This project is licensed under the terms of the MIT License.
