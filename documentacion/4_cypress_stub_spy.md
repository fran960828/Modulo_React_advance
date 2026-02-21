¡Hola! Como experto en **Cypress**, entramos en el terreno de las pruebas de **comportamiento avanzado**. Dominar los _Stubs_, _Spies_ y el control del tiempo es lo que permite testear funcionalidades complejas (como geolocalización o portapapeles) sin depender del hardware o de esperas reales.

Aquí tienes la guía definitiva para controlar el entorno de ejecución de tus tests.

---

## 🎭 1. Stubs y Spies: Controlando el Comportamiento

### ¿Qué son y cuándo usarlos?

- **Stub:** Reemplaza una función real por una versión controlada. Se usa cuando queremos **forzar un resultado** (ej: simular que el usuario está en París) o evitar efectos secundarios (ej: no queremos que realmente se envíe un email).
- **Spy:** No reemplaza la función; solo la "observa". Se usa cuando queremos dejar que el código funcione normalmente pero **verificar que se llamó** con ciertos argumentos.

---

### 📍 2. Geolocalización y `callsFake`

Para testear mapas o servicios de clima, necesitamos "engañar" al navegador. Como `getCurrentPosition` es una función del objeto `window.navigator.geolocation`, la interceptamos antes de que la aplicación cargue.

```javascript
it("Simular ubicación en Madrid con stub y callsFake", () => {
  cy.visit("/mapa", {
    onBeforeLoad(win) {
      // 1. Creamos el stub sobre la función de geolocalización
      // 2. Usamos callsFake para simular el comportamiento de éxito (success callback)
      cy.stub(win.navigator.geolocation, "getCurrentPosition")
        .callsFake((cb) => {
          return cb({
            coords: { latitude: 40.41, longitude: -3.7 }, // Coordenadas ficticias
          });
        })
        .as("getPos"); // 3. Asignamos un alias para verificarlo después
    },
  });

  // Verificamos que la app realmente pidió la posición
  cy.get("@getPos").should("have.been.called");
});
```

---

### 📋 3. Portapapeles (Clipboard) y Promesas

Escribir en el portapapeles (`writeText`) devuelve una promesa. Para simular esto, usamos `resolves`.

```javascript
it("Validar que el texto se copia al portapapeles", () => {
  cy.visit("/dashboard", {
    onBeforeLoad(win) {
      // Interceptamos la escritura en el portapapeles
      // Como es una promesa, usamos .resolves()
      cy.stub(win.navigator.clipboard, "writeText").resolves().as("copyStub");
    },
  });

  cy.get('[data-cy="copy-btn"]').click();

  // Verificamos con una Expresión Regular que el texto copiado tiene formato de ID
  cy.get("@copyStub").should("have.been.calledWithMatch", /ID-\d{5}/);
});
```

---

### 📦 4. Fixtures: Datos de prueba externos

Las **Fixtures** son archivos JSON que guardan datos estáticos para no "ensuciar" el código del test.

- **Archivo:** `cypress/fixtures/users.json`
- **Contenido:** `{"name": "Admin", "role": "SuperUser"}`

```javascript
it("Uso profesional de Fixtures", () => {
  // 1. Cargamos el archivo y le damos un alias
  cy.fixture("users.json").as("userData");

  cy.visit("/profile");

  // 2. Accedemos a los datos con el alias y un .then()
  cy.get("@userData").then((user) => {
    cy.get('[data-cy="username-input"]').type(user.name);
    cy.get('[data-cy="role-label"]').should("contain", user.role);
  });
});
```

---

### 🕵️ 5. Spies en LocalStorage

A diferencia del stub, aquí queremos que el dato se guarde de verdad, pero queremos confirmar que la aplicación llamó a la función de guardado.

```javascript
it("Espiar el guardado en LocalStorage", () => {
  cy.visit("/", {
    onBeforeLoad(win) {
      // Espiamos el método setItem sin bloquear su funcionalidad
      cy.spy(win.localStorage, "setItem").as("storeSpy");
    },
  });

  cy.get('[data-cy="accept-cookies"]').click();

  // Comprobamos que se llamó al spy
  cy.get("@storeSpy").should("have.been.called");
});
```

---

### ⏰ 6. Viaje en el tiempo: `clock` y `tick`

Si tu aplicación tiene un `setTimeout` de 10 segundos, ¡no hagas que tu test espere 10 segundos reales! Usa el reloj de Cypress para "adelantar" el tiempo.

> **Nota:** En Cypress se usa `cy.clock()` y `cy.tick()`. (En Vitest se usa `vi`, pero en el estándar de Cypress es el objeto `cy`).

```javascript
it("Evitar esperas reales en notificaciones temporales", () => {
  // 1. Congelamos el reloj del navegador
  cy.clock();

  cy.visit("/alerts");
  cy.get('[data-cy="trigger-alert"]').click();

  // La alerta desaparece en 5 segundos (5000ms)
  // 2. Adelantamos el tiempo instantáneamente
  cy.tick(5005);

  // 3. Verificamos que ya no existe sin haber esperado 5s reales
  cy.get(".alert-box").should("not.exist");
});
```

---

## 💡 Resumen para tu flujo de trabajo:

- Usa **Stubs** para APIs del navegador (Geo, Bluetooth, Clipboard) que no están disponibles o son inestables en entornos de CI.
- Usa **Fixtures** para centralizar strings, correos o configuraciones de usuario.
- Usa **Clock/Tick** para que tus tests sean ultra rápidos aunque la app tenga delays.

¿Te gustaría que te ayude ahora a crear un **Mock de una API (Network Stubbing)** usando `cy.intercept`? Es el complemento perfecto para estas técnicas.
