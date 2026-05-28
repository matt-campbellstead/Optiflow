# Optimum Freight Solutions

## A client-facing and internal business web application

This is essentially a CRUD application that uses authorisation to determine which data to display to the user, based on their user role. If the user is a customer, the data is kept to a minimum and is to be presented appropriately; if the user is an admin or business employee, then the application serves the purpose of an internal business records platform, and the data is presented more or less in its entirety.

# Features of this application

## Stack:

    - Node.JS
    - Express
    - MongoDB with Mongoose ORM
    - MariaDB with Sequelize ORM
    - Frontend is server-side rendered with PUG rendering engine

## Notes:

A MongoDB database is hosted on the MongoDB cloud and is managed with MongoDB compass. It handles users and authorisation / authentication.
Additionally, a MariaDB database is used for storing business data with the side benefit of learning SQL. The choice specifically of MariaDB over something like MySQL was made because the ISP's hosting platform provides MariaDB. So it was just a question of working with what was available.
Tailwind CSS was investigated for use, but seemed to work at cross-purposes with the PUG rendering engine, so vanilla CSS was favoured instead.
On the frontend, API calls are made using Axios.
The web bundler used for the frontend script is ESBuild.
Authorisation and authentication is done using short-lived access tokens (JSON web tokens) and refresh 'tokens' (hashed tokens stored in MongoDB which can be revoked or replaced as needed).

### Security notes:

    - Custom error handling and graceful shutdown are used with the intention of preventing DoS attacks and providing no error stack information in error messages during production mode.
    - `Helmet` is used for setting more secure HTTP headers.
    - Rate limiting is set for all requests and also specifically for auth requests.
    - Input is sanitised using `express-mongo-sanitize` to prevent MongoDB injection and another sanitiser middleware to prevent SQL injection.
    - `bcryptjs` package for encryption
    - Mongoose instance methods hash passwords whenever the user supplies a new password (sign-up, forgotten password, changing password)
    - CSRF protection is implemented using the `csrf-csrf` package, an updated version of the now deprecated `csurf` package.
    * I still plan on implementing user email validation. At the moment the user can sign up with a fake address.
