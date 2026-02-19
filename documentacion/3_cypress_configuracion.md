¡Hola de nuevo! Como experto en **Cypress**, entramos ahora en la fase de "Arquitectura y Configuración". Dominar estos conceptos es lo que separa a un principiante de un **SDET (Software Development Engineer in Test)**, ya que permiten crear frameworks escalables, rápidos y fáciles de mantener.

Aquí tienes la documentación detallada sobre la configuración y extensión de Cypress.

---

## ⚙️ 1. El corazón de Cypress: `cypress.config.js`

Este archivo es el centro de control. Aquí definimos cómo se comporta Cypress globalmente. Las propiedades más comunes incluyen:

- `viewportWidth` / `viewportHeight`: Tamaño de la ventana del navegador.
- `video`: Si queremos grabar la ejecución (útil en CI/CD).
- `retries`: Cuántas veces reintentar un test si falla.
- `e2e`: Objeto que contiene la configuración específica para pruebas de extremo a extremo.

```javascript
// ✅ Ejemplo de cypress.config.js profesional
const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false, // Desactivado para ahorrar espacio en local
    retries: {
      runMode: 2, // Reintenta 2 veces en la terminal (npx cypress run)
      openMode: 0, // 0 reintentos mientras desarrollamos en la UI
    },
    setupNodeEvents(on, config) {
      // Aquí se configuran los plugins y tareas (tasks)
    },
  },
});
```

---

## ⏱️ 2. Timeouts: Controlando la espera

Cypress tiene esperas automáticas, pero a veces necesitamos ajustarlas:

- `defaultCommandTimeout`: Tiempo de espera para que un elemento aparezca (por defecto 4s).
- `requestTimeout`: Tiempo para que una petición API responda (5s).
- `pageLoadTimeout`: Tiempo para que la página cargue (60s).

---

## 🌍 3. Configuración Global vs. Local

Puedes sobrescribir la configuración global de `cypress.config.js` para un grupo de tests específico usando un objeto de configuración dentro del `describe`.

```javascript
// ❌ DIRTY CODE: Cambiar el timeout para cada comando individualmente
cy.get(".loader", { timeout: 10000 }).should("not.exist");

// ✅ CLEAN CODE: Configuración local para toda la suite
describe(
  "Suite de reportes pesados",
  {
    defaultCommandTimeout: 10000, // Solo esta suite esperará 10s por defecto
    viewportWidth: 1920,
  },
  () => {
    it("Carga tabla con muchos datos", () => {
      cy.get(".heavy-table").should("be.visible");
    });
  }
);
```

---

## 🌐 4. `baseUrl` y Selección de Navegador

### BaseUrl

Es la URL "raíz". Al configurarla, en tus tests solo escribes la ruta relativa. Esto permite cambiar de entorno (Dev, Staging, Prod) sin tocar los tests.

```javascript
// En cypress.config.js
baseUrl: "https://mi-web-app.com";

// En tu test
cy.visit("/login"); // Navegará a https://mi-web-app.com/login
```

### Navegadores

Cypress detecta los navegadores instalados en tu sistema.

1. **Desde la UI:** Elígelo en el Launchpad antes de lanzar los tests.
2. **Desde Terminal:** Usa el flag `--browser`.

```bash
npx cypress run --browser firefox
npx cypress run --browser edge

```

---

## 🛠️ 5. Custom Commands (Comandos Personalizados)

Se crean en `cypress/support/commands.js`. Son ideales para acciones repetitivas como el Login.

```javascript
// 1. Definición en cypress/support/commands.js
Cypress.Commands.add("loginPortal", (user, password) => {
  cy.get('[data-cy="user"]').type(user);
  cy.get('[data-cy="pass"]').type(password);
  cy.get('[data-cy="login-btn"]').click();
});

// 2. Uso en el test (Mucho más limpio)
it("test de usuario", () => {
  cy.visit("/login");
  cy.loginPortal("admin", "12345"); // Llamamos al comando creado
});
```

---

## 🔍 6. Custom Queries (Consultas Personalizadas)

A diferencia de los comandos, las **Queries** son síncronas, se pueden reintentar automáticamente y no alteran el estado de la aplicación (solo buscan). Se usan para lógicas de selección complejas.

```javascript
// Definición
Cypress.Commands.addQuery("getById", (id) => {
  const getFn = Cypress.query(() => cy.get(`[id="${id}"]`));
  return getFn;
});

// Uso
cy.getById("main-header").should("be.visible");
```

---

## 🚀 7. El poder de `cy.task`

Cypress se ejecuta en el navegador, por lo que no puede acceder directamente a tu sistema de archivos o bases de datos. `cy.task` permite ejecutar código de **Node.js** (fuera del navegador).

### Paso 1: Configurar la tarea en `cypress.config.js`

```javascript
const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // Definimos la tarea 'logConsole'
      on("task", {
        logConsole(message) {
          console.log(message); // Esto se verá en la terminal de VS Code, no en el navegador
          return null;
        },
        generateUser() {
          return { name: "Juan", id: Math.random() };
        },
      });
    },
  },
});
```

### Paso 2: Llamar a la tarea en el test

```javascript
it("Uso de tareas de Node", () => {
  // Enviamos un mensaje a la terminal de Node
  cy.task("logConsole", "Iniciando proceso de base de datos...");

  // Obtenemos datos generados en Node
  cy.task("generateUser").then((user) => {
    cy.log(`El usuario creado es: ${user.name}`);
  });
});
```

---

Con esto, ya tienes las herramientas para estructurar un proyecto de Cypress a nivel profesional. **¿Te gustaría que viéramos cómo conectar Cypress con una Base de Datos real usando estas tareas (`tasks`)?** Es un caso de uso muy potente.
