¡Hola de nuevo! Como experto en **Cypress**, me encanta que quieras profundizar en conceptos más avanzados que marcan la diferencia entre un "scripter" y un **QA Automation Engineer**.

Esta guía se centra en la robustez de los selectores, el manejo del flujo asíncrono y la navegación avanzada. Aquí tienes la documentación profesional detallada:

---

## 🏗️ Guía Avanzada de Cypress: De Principiante a Profesional

### 1. El Atributo `data-cy`: Selectores que no se rompen

En el desarrollo web, las clases CSS y los IDs cambian constantemente por rediseños. El estándar profesional es usar atributos de datos específicos para pruebas (`data-cy`), lo que desacopla el test del diseño.

```javascript
// ❌ DIRTY CODE: Selector frágil (basado en diseño)
cy.get(".btn-primary-large-active").click();

// ✅ CLEAN CODE: Selector robusto (específico para testing)
cy.get('[data-cy="submit-button"]').click();
```

---

### 2. Navegación Avanzada: `location`, `pathname` y `go`

Para asegurar que el usuario está donde debe estar, validamos la URL. `cy.location('pathname')` extrae la ruta relativa (ej: `/dashboard`), y `cy.go()` permite navegar por el historial del navegador.

```javascript
// ✅ Ejemplo de flujo de navegación
it("Debería navegar y volver atrás", () => {
  cy.visit("/login");
  cy.get('[data-cy="login-btn"]').click();

  // Validar que estamos en el dashboard
  cy.location("pathname").should("eq", "/dashboard");

  // Volver a la página anterior (atrás)
  cy.go("back"); // o cy.go(-1)
  cy.location("pathname").should("eq", "/login");

  // Ir hacia adelante
  cy.go("forward"); // o cy.go(1)
});
```

---

### 3. Encadenamiento con `and`

`and()` es simplemente un alias de `should()`. Se usa para encadenar múltiples validaciones en una sola línea de forma legible.

```javascript
// ✅ CLEAN CODE: Validaciones múltiples legibles
cy.get('[data-cy="error-message"]')
  .should("be.visible")
  .and("have.class", "text-red")
  .and("contain", "Credenciales inválidas");
```

---

### 4. Alias (`as`) y Referencias (`@`)

Los alias permiten guardar una referencia a un elemento o una petición para reutilizarla más tarde sin tener que volver a escribir el selector.

```javascript
// ✅ CLEAN CODE: Usando alias para claridad
it("Uso de alias", () => {
  // Definimos el alias con .as()
  cy.get("table tbody tr").first().as("primerFila");

  // ... otras acciones intermedias ...

  // Recuperamos el elemento con @
  cy.get("@primerFila").should("contain", "Admin");
});
```

---

### 5. Acceso al DOM con `then()`

Cypress es asíncrono. Si necesitas extraer un valor de un elemento (como un texto o atributo) para usarlo en una lógica posterior, debes usar `.then()`, que nos da acceso al objeto jQuery del elemento.

```javascript
// ✅ CLEAN CODE: Extrayendo valores dinámicos
cy.get('[data-cy="user-id"]').then(($el) => {
  const userId = $el.text(); // Extraemos el texto
  cy.log("El ID del usuario es: " + userId);
  // Aquí podrías hacer otra petición usando ese ID
});
```

---

### 6. Special Keys: `{enter}` para formularios

No siempre necesitas hacer clic en "Enviar". Simular que el usuario presiona la tecla Enter es vital para probar la accesibilidad y usabilidad.

```javascript
// ✅ Ejemplo de envío con teclado
cy.get('[data-cy="search-input"]').type("Cypress Testing{enter}"); // Escribe y pulsa Enter automáticamente
```

---

### 7. Interacción de Foco: `focus`, `blur` y validación de clases

- **focus()**: Pone el cursor en el elemento.
- **blur()**: Quita el foco (clic fuera). Útil para disparar validaciones de formularios que ocurren al "salir" del campo.

```javascript
// ✅ Verificación de validación "on blur"
cy.get('[data-cy="email-input"]')
  .focus()
  .blur() // Salimos del campo sin escribir nada
  .then(($input) => {
    // Comprobamos si el elemento ahora tiene la clase de error
    expect($input).to.have.class("is-invalid");
  });
```

---

### 8. Selector Playground (Selector Tools)

Cypress incluye una herramienta visual en su UI (un icono de mira telescópica al lado de la URL en el navegador de pruebas).

1. Haz clic en el icono **Selector Playground**.
2. Haz clic en cualquier elemento de tu web.
3. Cypress te sugerirá el selector más óptimo (priorizando `data-cy`).

---

### 9. Expresiones Regulares con `match`

A veces el texto de un elemento cambia ligeramente pero sigue un patrón. `match` permite usar **Regex** para validaciones flexibles.

```javascript
// ❌ DIRTY CODE: Texto exacto que puede fallar por un espacio
cy.get(".order-id").should("have.text", "ID: 12345");

// ✅ CLEAN CODE: Match con Regex (busca que contenga números)
cy.get(".order-id")
  .invoke("text")
  .should("match", /ID: \d+/); // \d+ busca uno o más dígitos
```

---

### 10. Capturas de pantalla: `cy.screenshot()`

Ideal para documentar errores o estados específicos. Cypress las guarda automáticamente en la carpeta `cypress/screenshots`.

```javascript
// ✅ Uso profesional de capturas
it("Captura de estado crítico", () => {
  cy.visit("/checkout");
  // Tomar captura de toda la página
  cy.screenshot("estado-del-carrito");

  // Tomar captura de un solo elemento
  cy.get('[data-cy="payment-summary"]').screenshot("resumen-pago");
});
```

---

**¿Qué te ha parecido esta profundización?** Si quieres, puedo enseñarte a configurar los **Reports** para que estas capturas de pantalla se incluyan automáticamente en un informe HTML cuando un test falle. Sería un paso gigante hacia la profesionalización de tu entorno.
