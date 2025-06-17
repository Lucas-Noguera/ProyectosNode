# ProyectosNode

Bienvenido al repositorio **ProyectosNode**, un recopilatorio de proyectos educativos y funcionales desarrollados con **Node.js** por Lucas Noguera. Aquí encontrarás desde ejercicios básicos hasta aplicaciones completas con autenticación, plantillas y conexión a bases de datos.

---

## Contenido del Repositorio

* **node-js-user-auth/**

  * API RESTful de autenticación de usuarios.
  * Tecnologías: Express, MongoDB, Mongoose, bcrypt, JSON Web Tokens (JWT).
  * Funcionalidades: registro, inicio de sesión, verificación de correo, hashing seguro.

* **clase-1/**

  * Ejercicios introductorios de Node.js.
  * Prácticas con módulos nativos (`fs`, `path`) y scripts básicos.

* **clase-2/**

  * Servidor HTTP con Express.
  * Rutas básicas y manejo de peticiones `GET` y `POST`.

* **clase-3/**

  * Aplicación de plantillas usando **EJS**.
  * Rutas dinámicas y rendering de vistas.

* **clase-6/**

  * Integración con bases de datos.
  * Rutas avanzadas y CRUD completo.

---

## Requisitos Previos

* [Node.js](https://nodejs.org/) v14 o superior
* [npm](https://www.npmjs.com/) o [yarn](https://yarnpkg.com/)
* Para el proyecto de autenticación:

  * Una instancia de MongoDB (local o en la nube).

---

## Instalación

1. Clonar el repositorio:

   ```bash
   git clone https://github.com/Lucas-Noguera/ProyectosNode.git
   cd ProyectosNode
   ```

2. Instalar dependencias en cada carpeta de proyecto:

   ```bash
   cd node-js-user-auth
   npm install
   # repetir para cada subproyecto
   ```

3. Configurar variables de entorno (solo para `node-js-user-auth`):

   ```env
   MONGODB_URI=<tu_uri_de_mongodb>
   JWT_SECRET=<tu_secreto>
   ```

---

## Uso

* **Ejecutar un proyecto**:

  ```bash
  cd <carpeta-del-proyecto>
  npm start
  ```

* **Ejemplos**:

  * `node-js-user-auth`: corre en `http://localhost:3000` con rutas `/auth/register` y `/auth/login`.
  * `clase-2`: servidor básico en `http://localhost:3000/`.

---

## Contribuciones

Las contribuciones son bienvenidas. Para colaborar:

1. Fork del repositorio.
2. Crear una rama (`git checkout -b feature/nueva-funcionalidad`).
3. Realizar cambios y commitear (`git commit -m 'Añade nueva característica'`).
4. Hacer push a tu rama (`git push origin feature/nueva-funcionalidad`).
5. Abrir un Pull Request.

---
