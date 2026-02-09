Esta sección es el puente final entre el código de lógica pura y la interfaz de usuario. Aquí aprenderás a crear un "laboratorio" donde Vitest simula un navegador completo (DOM) sin necesidad de abrir uno real. Esto es fundamental para testear aplicaciones de Vanilla JS o los cimientos de React.

---

# 🌐 Testing del DOM: Simulando el Navegador

## 1. Happy-dom y el Entorno de Test

> **Concepto:** Node.js no entiende qué es un `<div>` o un `button`. **Happy-dom** (o JSDom) es una librería que simula las APIs del navegador en memoria.
> **Configuración:** Para que Vitest sepa que debe usar este simulador, debemos modificar el script en el `package.json`.

```json
// package.json
"scripts": {
  // --environment happy-dom le dice a Vitest que cree un entorno de navegador ficticio
  "test": "vitest --run --environment happy-dom"
}

```

---

## 2. Carga del HTML con `path` y `fs`

> **Concepto:** Para testear nuestra web real, necesitamos leer el archivo `index.html` del disco duro.
>
> - **`path.join`**: Une fragmentos de rutas de forma segura (funciona igual en Windows, Mac o Linux).
> - **`fs.readFileSync`**: Lee el contenido del archivo.
> - **`.toString()`**: Convierte los datos binarios del archivo en texto (HTML) que podamos manipular.

```typescript
import path from "path";
import fs from "fs";

// 1. Construimos la ruta absoluta hacia el index.html
const htmlPath = path.join(process.cwd(), "index.html");

// 2. Leemos el archivo y lo convertimos a string
const htmlContent = fs.readFileSync(htmlPath).toString();
```

---

## 3. Instanciando `Window` y `Document`

> **Concepto:** `happy-dom` nos da una clase llamada `Window`. Al instanciarla, creamos una "ventana de navegador" virtual. De esa ventana extraemos el `document`, que es donde "inyectaremos" el HTML que acabamos de leer.

```typescript
import { Window } from "happy-dom";

// 1. Creamos una instancia de la ventana virtual
const window = new Window();

// 2. Extraemos el objeto document de esa ventana
const document = window.document;

// 3. Escribimos nuestro HTML dentro de ese documento virtual
document.write(htmlContent);
```

---

## 4. `vi.stubGlobal`: Conectando el Mock con Vitest

> **Concepto:** Aunque hayamos creado un `document` virtual, Vitest todavía no sabe que cuando nuestro código diga `document.getElementById`, debe mirar en nuestro objeto virtual. Usamos `vi.stubGlobal` para "secuestrar" la variable global `document`.

```typescript
import { vi, it, expect } from "vitest";

// Reemplazamos el 'document' global del sistema por nuestro document de happy-dom
vi.stubGlobal("document", document);

// Ahora, cualquier función que importe nuestro test verá el DOM de happy-dom
```

---

## 5. Test de Integración: Comprobando elementos en el DOM

> **Concepto:** Una vez montado el laboratorio, podemos usar métodos normales de JavaScript para verificar que nuestra interfaz contiene lo que esperamos.

```typescript
it("debe contener un párrafo con el mensaje de bienvenida en el documento", () => {
  // 1. Buscamos el elemento como lo haríamos en un script normal
  const paragraph = document.querySelector("p");
  const specialDiv = document.getElementById("welcome-container");

  // 2. Comprobamos que el elemento existe (no es null)
  expect(paragraph).not.toBeNull();

  // 3. Comprobamos que contiene el texto esperado
  expect(paragraph?.textContent).toContain("Bienvenido a Rick & Morty App");

  // 4. Verificamos que un contenedor específico existe dentro del DOM cargado
  expect(specialDiv).toBeTruthy();
});
```

---

### 💡 Resumen Profesional para tu Guía

Para testear el DOM de forma profesional, el flujo siempre sigue estos pasos:

1. **Preparar el escenario:** Leer el HTML real del proyecto.
2. **Crear el simulador:** Usar `happy-dom` para crear una ventana y un documento.
3. **Hacer el "bypass":** Usar `vi.stubGlobal` para que todo el proyecto use ese documento virtual.
4. **Ejecutar y Validar:** Llamar a tus funciones de JS y comprobar con `expect` si los cambios se reflejan en el HTML.

**Con esto ya tienes todas las herramientas para testear cualquier aplicación web. ¿Estás listo para aplicar esto a tu proyecto modular de Rick & Morty mañana?**
