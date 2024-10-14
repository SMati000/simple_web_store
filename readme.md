# Simple Web Store
[This repository](https://github.com/SMati000/simple_web_store) contains the four components of the Web Store:

- The API, made in Java with Spring Boot
- The Front, made with ReactJs (Started off from [here](https://github.com/Kurtney21/hdev-web-store). You can see what the UI looks like there too)
- The Identity Provider, using Keycloak
- The database (MySQL 10.4.28-MariaDB) and PhpMyAdmin

This Simple Web Store is dockerized with Docker Compose.

## How to start locally
- Add this line to your machine `hosts` file
    ```
    127.0.0.1       keycloak
    ```
- Run `docker compose up` on the root path of this repo

## How to use
Authorization is based on two simple roles: `pc_admin`, `pc_customer`. The first is the admin of the store, the second one are the customers.

- URLs:
    - Web Store: http://localhost:8081/
        - You can login with the default admin user with `username: porkys, password: admin`.
        - You can register new users as you please. This will have customer role by default. 
    - Keycloak: http://keycloak:8080/ 
        - You can find user and password in `keycloak/Dockerfile`
        - Realm is `porky_cakes_realm`
        - In said Realm, the Client the app uses is `porky_cakes_client`
    - PhpMyAdmin: http://localhost:8082
        - You can find the password in the `compose.yaml` (username: `root`)
        - The database name is `porkycakes`
        - In this repo, DB is already initialized with some minimum data, but there is also a script to do that `/db/populate_db.sql` which you could run from PhpMyAdmin. Take into account the database will be initialized by the api when in its first run, then you can use the script.

## Limitations
- When uploading a product, the image has to be one of the available in `porkycakes-react/public/assets`, otherwise it won't work.
- In the Web Store you have the usual options to register, login, and logout. But the rest of user management (like changing the role or password of a user) is not included in the Web Store itself, you have to do that from Keycloak. Changing password could be enabled setting up a mail server in Keycloak.
