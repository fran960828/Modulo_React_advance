¡Hola! Como experto en **Cypress**, entramos en el nivel de maestría técnica: **la integración con el Backend y la persistencia de datos**.

Manejar bases de datos y peticiones de red es fundamental para que tus tests sean "deterministas" (que siempre den el mismo resultado). Aquí tienes la documentación profesional para dominar el manejo de datos y red.

---

## 🗄️ 1. Interacción con Bases de Datos y `cy.task`

### El concepto

Cypress se ejecuta en el navegador y no tiene acceso directo a tu base de datos (SQL, MongoDB, etc.). Para interactuar con ella, usamos el archivo de configuración de Cypress como un **puente** mediante `cy.task`.

### Reinicio de la DB antes de cada test

Es una práctica profesional limpiar la base de datos antes de cada prueba para asegurar que el estado sea siempre el mismo.

```javascript
// 1. En cypress.config.js (El puente)
const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on("task", {
        resetDb() {
          // Aquí iría la lógica real de tu DB (ej: knex, mongoose)
          console.log("Reiniciando base de datos ficticia...");
          return null; // Las tareas deben devolver algo o null
        },
      });
    },
  },
});

// 2. En tu archivo de test (El uso)
describe("User Dashboard", () => {
  beforeEach(() => {
    // Llamamos a la tarea para tener la DB limpia antes de cada 'it'
    cy.task("resetDb");
  });

  it("Debería mostrar datos iniciales", () => {
    cy.visit("/dashboard");
  });
});
```

---

## 🌐 2. Intercepción de Red: `cy.intercept` y `cy.wait`

### ¿Qué es `cy.intercept`?

Permite espiar o "mockear" (falsear) las respuestas del servidor. Es ideal para probar el frontend sin que el backend esté listo o para forzar errores.

### ¿Cuándo NO puedes usar interceptores?

1. **Peticiones que no son XHR/Fetch:** No intercepta la carga de imágenes estáticas, CSS o la navegación principal del navegador (la URL que pones en `cy.visit`).
2. **Fuera del navegador:** No intercepta peticiones hechas desde el script de Node (como `cy.request` o tareas).

```javascript
it("Mockeando la respuesta del servidor", () => {
  // 1. Definimos la intercepción
  // Argumentos: Método, URL (usamos comodines *), Datos ficticios
  cy.intercept("GET", "**/api/usuarios", { fixture: "users.json" }).as(
    "getUsers"
  );

  cy.visit("/usuarios");

  // 2. cy.wait(): Esperamos a que la petición ocurra antes de seguir
  // Esto evita que el test falle si el servidor tarda un poco
  cy.wait("@getUsers");

  cy.get('[data-cy="user-card"]').should("have.length", 3);
});
```

---

## 📡 3. Peticiones Directas: `cy.request`

`cy.request` es diferente a `intercept`. No usa el navegador, sino que hace una petición HTTP directa desde Cypress al servidor. Es perfecta para preparar datos o testear APIs.

```javascript
it("Test de API: Crear usuario", () => {
  cy.request({
    method: "POST",
    url: "/api/v1/create",
    body: {
      name: "Tester",
      job: "QA",
    },
  }).then((response) => {
    // Comprobamos que el backend respondió correctamente
    expect(response.status).to.eq(201);
    expect(response.body).to.have.property("name", "Tester");
  });
});
```

---

## 🔐 4. Autenticación y Comandos Personalizados

### Estrategia Profesional

No deberías usar la interfaz de usuario para loguearte en cada test (es lento). Lo ideal es crear un **Custom Command** que haga la petición de login por detrás y guarde la sesión.

```javascript
// 1. Definir comando en cypress/support/commands.js
Cypress.Commands.add("loginSession", (email, password) => {
  cy.request({
    method: "POST",
    url: "/api/login",
    body: { email, password },
  }).then((res) => {
    // Aquí podrías guardar tokens en cookies o localStorage
    cy.log("Sesión iniciada correctamente");
  });
});

// 2. Uso en el test
it("Acceso al perfil logueado", () => {
  cy.loginSession("admin@test.com", "password123");
  cy.visit("/profile");
});
```

---

## 🍪 5. Cookies y Sesión: `cy.getCookies().its()`

A veces necesitas verificar que el servidor ha enviado una cookie de sesión tras el login.

```javascript
it("Verificar cookie de autenticación", () => {
  cy.loginSession("admin@test.com", "password123");

  // Obtenemos las cookies, extraemos la primera y verificamos su nombre
  cy.getCookies()
    .its(0) // Accedemos a la primera cookie del array
    .should("have.property", "name", "auth_token");
});
```

---

## 📤 6. Validación Avanzada de POST con Regex

A veces queremos validar que lo que el usuario envió al servidor cumple con un formato específico (como un UUID o una fecha).

```javascript
it("Validar cuerpo de petición POST con Regex", () => {
  // 1. Interceptamos la creación
  cy.intercept("POST", "**/api/orders").as("postOrder");

  cy.get('[data-cy="input-order"]').type("Laptop");
  cy.get('[data-cy="submit"]').click();

  // 2. Esperamos la petición y validamos el cuerpo enviado (request.body)
  cy.wait("@postOrder")
    .its("request.body.orderCode") // Accedemos a una propiedad del body enviado
    .should("match", /ORD-\d{3}-\w+/); // Validación mediante Expresión Regular
});
```

---

### 💡 Resumen para el principiante:

- **`cy.task`**: Para hablar con la base de datos (Node.js).
- **`cy.intercept`**: Para controlar/falsear lo que el navegador recibe o envía.
- **`cy.request`**: Para hablar con el backend sin usar botones (rápido).
- **`cy.wait`**: El ancla que asegura que la red ha terminado antes de validar.

Con estas herramientas ya puedes testear aplicaciones completas con flujos de datos reales. **¿Quieres que te muestre cómo manejar una carga de archivos (upload) o descargas (download)?** Es el siguiente paso lógico.
