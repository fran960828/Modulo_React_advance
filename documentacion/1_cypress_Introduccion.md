¡Hola! Qué gusto saludarte. Como experto en automatización, entiendo perfectamente que al principio Cypress puede parecer un "mundo", pero su curva de aprendizaje es de las mejores.

Aquí tienes una guía profesional diseñada para llevarte de cero a realizar tus primeras interacciones con confianza, aplicando buenas prácticas desde el primer día.

---

## 🛠️ 1. Instalación y Apertura

Para empezar, necesitas tener instalado [Node.js](). Una vez lo tengas, sigue estos pasos:

1. **Inicializar proyecto:** Crea una carpeta y abre la terminal en ella. Ejecuta: `npm init -y`.
2. **Instalar Cypress:** Ejecuta el comando de instalación.

```bash
npm install cypress --save-dev

```

3. **Abrir Cypress:** Una vez instalado, usa el ejecutable de Node para abrir la interfaz gráfica.

```bash
npx cypress open

```

---

## 🖥️ 2. Puesta a punto de la UI

Al ejecutar `npx cypress open`, se abrirá el **Launchpad**:

1. **E2E Testing:** Selecciona esta opción (es la más común para pruebas de extremo a extremo).
2. **Configuration Files:** Cypress te mostrará los archivos que va a crear (cypress.config.js, carpetas de soporte, etc.). Dale a **Continue**.
3. **Select a Browser:** Elige tu navegador preferido (Chrome, Edge o Electron) y haz clic en **Start E2E Testing**.
4. **Create your first spec:** Selecciona "Create new empty spec", nómbralo (ej: `my_test.cy.js`) y ¡listo para codificar!

---

## 📝 Conceptos de Código: Guía Profesional

Para que el autocompletado funcione (que Visual Studio Code te sugiera comandos de Cypress), siempre debemos incluir la **Triple Slash Reference** al inicio de nuestro archivo.

### Ejemplo Comparativo: Estructura y Comandos Básicos

```javascript
/// <reference types="cypress" />

/*
  EXPLICACIÓN INICIAL:
  Un test profesional se divide en bloques 'describe' (el grupo de pruebas) 
  y 'it' (el caso de prueba individual). 
  - cy.visit(): Navega a una URL.
  - cy.get(): Busca elementos usando selectores CSS.
  - .should(): Realiza una aserción (validación).
*/

// ❌ DIRTY CODE (Lo que debemos evitar)
describe("Test con malas practicas", () => {
  it("test feo", () => {
    cy.visit("https://example.com");
    // Usar selectores CSS largos, frágiles o clases que cambian
    cy.get("body > div > div:nth-child(2) > form > input").type("Hola");
    // No validar que las cosas ocurrieron realmente
  });
});

// ✅ CLEAN CODE (El estándar profesional)
describe("User Login Flow", () => {
  it("Should navigate and validate basic elements", () => {
    // 1. Visitar la página
    cy.visit("https://example.com");

    // 2. cy.get con selectores robustos + autocompletado activo
    // El uso de .should('be.visible') asegura que el elemento es interactuable
    cy.get("#main-title").should("be.visible").and("contain", "Example Domain");
  });
});
```

---

### 🔍 Selección Inteligente: Contains, Click y Type

A veces no tenemos un ID y necesitamos buscar por el texto que ve el usuario.

- **`cy.contains('texto')`**: Busca un elemento por su contenido textual.
- **`.click()`**: Ejecuta el clic del ratón.
- **`.type('texto')`**: Simula la escritura en un input o textarea.

```javascript
// ✅ CLEAN CODE
it("Interacción con formularios", () => {
  cy.visit("/login");

  // Buscamos un botón que dice "Enviar" y pulsamos
  cy.contains("button", "Enviar").click();

  // Escribimos en un input de email
  cy.get('input[name="email"]')
    .clear() // Práctica profesional: Limpiar antes de escribir
    .type("usuario@test.com");
});
```

---

### ⛓️ Encadenamiento: El peligro de `.get().get()`

**Error común:** Encadenar dos `.get()` seguidos. Cypress siempre busca el segundo `.get()` desde la raíz del documento (`document`), lo que puede causar errores si esperabas buscar _dentro_ de un contenedor.

**Solución:** Usar `.find()`. Este busca exclusivamente dentro del elemento seleccionado previamente.

```javascript
// ❌ DIRTY CODE
cy.get(".navbar").get(".login-btn"); // ¡Mal! El segundo get busca en toda la web de nuevo.

// ✅ CLEAN CODE
cy.get(".navbar")
  .find(".login-btn") // Busca el botón SOLO dentro de la navbar
  .click();
```

---

### 🛠️ Aserciones Comunes (`should`)

La estructura de `should` suele ser: `.should('condicion', 'valor_esperado')`.

| Condición             | Uso                                                                                   |
| --------------------- | ------------------------------------------------------------------------------------- |
| `be.visible`          | Verifica que el elemento se vea en pantalla.                                          |
| `have.length`, `n`    | Verifica cuántos elementos hay.                                                       |
| `have.value`, `texto` | Verifica el valor de un input.                                                        |
| `have.class`, `clase` | Verifica si tiene una clase CSS específica.                                           |
| `not.exist`           | **Crucial:** Verifica que el elemento ha desaparecido del DOM (ej: tras borrar algo). |

```javascript
// Ejemplo de no existencia
cy.get(".modal-error").should("not.exist");
```

---

### 📑 Selects y Listas (`eq`, `first`, `last`)

Cuando `cy.get()` devuelve varios elementos, podemos filtrarlos:

- **`.first()`**: Selecciona el primer elemento de la lista.
- **`.last()`**: Selecciona el último.
- **`.eq(índice)`**: Selecciona por posición (empezando desde 0).
- **`.select()`**: Específico para etiquetas `<select>`.

```javascript
// ✅ CLEAN CODE: Manejo de listas y selects
it("Manejo de colecciones", () => {
  // Seleccionar por texto o por el atributo 'value' de la <option>
  cy.get("select#paises").select("España");

  // Trabajar con listas de productos
  cy.get(".product-item").first().should("contain", "Producto A");
  cy.get(".product-item").last().click();
  cy.get(".product-item").eq(2).should("be.visible"); // El tercer elemento
});
```

---

Espero que esta guía te sirva para arrancar con bases sólidas. **¿Te gustaría que te ayude a configurar un archivo de "Custom Commands" para que tu código sea aún más limpio?**
