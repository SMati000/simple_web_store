# Simple Web Store <!-- https://github.com/SMati000/simple_web_store -->
Este repositorio contiene los cinco componentes de la Web Store:

- La API, hecha en Java con Spring Boot
- El Front Web, hecho con ReactJs (a partir de [aca](https://github.com/Kurtney21/hdev-web-store). Ese repo tiene una demo)
- El IdP, usando Keycloak
- La base de datos (MySQL 10.4.28-MariaDB) con PhpMyAdmin
- La aplicación móbil, hecha con React Native y expo

Esta Simple Web Store esta dockerizada con Docker Compose. Aca se pueden ver los casos de uso para la Web [here](./extras/use_cases.jpg). La app se desarrollo en otra iteración e incluye algunas cosas extras, detalladas posteriormente.

Esto es un MVP inicial, algunas funciones no estan implementadas por completo.

## Como levantar localmente
- Asegurate que la ip de tu maquina sea la del `./.env` y la de `./porky-cakes-app/app.json`
- Ejecuta `docker compose up` en el directorio raíz de este repo
- La applicación móbil no esta dockerizada, si se quiere levantar se debe ejecutar `npm i && npm run android` en `./porky-cakes-app/`
    - Aca se asume que se tiene instalado y configurado nodejs, expo, emuladores, sdk para android/ios.
    - Además, se debería configurar el id del proyecto de expo en `./porky-cakes-app/app.json` para que funcionen las notificaciones push desde la api a la app.

## Como usar
La autorización de usuarios esta basada en tres roles simples: `pc_admin`, `pc_customer`, `pc_customer_premium`. El primero es para el/los administradores de la tienda, el segundo es el por defecto de los clientes, el tercero es para usuarios premium (estos usuarios tendrian ambos roles `pc_customer` y `pc_customer_premium`).

- URLs:
    - Front web: http://localhost:8081/
        - Se puede loggear con los usuarios por defecto: usuario admin: `username: porkys, password: admin` y usuario premium: `username: premium, password: premium`.
        - Se pueden registrar usuarios a placer. Dichos usuarios tendran el role `pc_customer` por defecto.
    - Keycloak: http://{ip_del_.env}:8080/ 
        - Podes encontrar el usuario administrador en el `/compose.yaml`
        - El Realm utilizado es `porky_cakes_realm`
        - En dicho Realm, el Cliente que usa la app es `porky_cakes_client`
    - PhpMyAdmin: http://localhost:8082
        - Podes encontrar la contraseña en el `/compose.yaml` (username: `root`)
        - El nombre de la base de datos es `porkycakes`
        - En este repo, la BD ya esta inicializada con alguna data minima, pero también se puede inciar con el script `/db/populate_db.sql` .
    - API:
        - Se puede encontrar la documentación en un swagger: http://localhost:8083/swagger-ui/index.html#/

## Limitaciones
- No se implemento un servidor para las imagenes de los productos, cuando se carga un producto, la imagen debe ser una de las disponibles en la imagen docker, en `porkycakes-react/public/assets/productos` para la web, o `porky-cakes-app/assets/productos` para la app.
- En la Web Store estan las opciones usuales para registrarse, loggearse, y desloggearse. El resto de la administración de usuarios (como cambiar el role o la contraseña de un usuario) no esta incluido en la Web Store en si, se debe hacer desde Keycloak. Cambiar el password se podría habilitar configurando un servidor mail en Keycloak.
- El backend envía una notificación (en la app) al comprar, estas utilizan expo push notifications, y estan vinculadas al dispositivo físico, no necesariamente a la cuenta de cada usuario.
- Algunas funcionalidades se implementaron en la app, pero no en la Web
    - Modo oscuro
    - Comentarios en los productos (tanto verlos, como comentar, como aprobarlos/eliminarlos en el caso del administrador).
    - Notificaciones locales (cuando un usuario no loggeado ve varios productos, se le envia una notificacion para que se registre) y desde la API (cuando se realiza una compra).
    - Distinciónes para los usuarios premium: estos pueden comentar en los productos, tienen un descuento al comprar y ven sugerencias al acceder a un producto.