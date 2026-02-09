¡Bienvenido al siguiente nivel! Has llegado a la cima del testing de interfaces. Como experto en React, te diré que **React Testing Library (RTL)** cambiará tu forma de ver los componentes. Ya no testeamos código, testeamos **experiencias de usuario**.

Aquí tienes la guía definitiva para configurar tu entorno y dominar las herramientas de RTL.

---

# ⚛️ React Testing Masterclass: Vitest + RTL

## 1. Instalación y Configuración del Entorno

> **Concepto:** Para trabajar con React y TypeScript necesitamos un ecosistema que soporte **JSX**, tipos y un DOM simulado. Usaremos **Vite** para el proyecto, **Vitest** como motor de pruebas y **RTL** para interactuar con los componentes.

### Paso a paso en la terminal:

1. **Crear el proyecto:** `npm create vite@latest my-rick-and-morty-app -- --template react-ts`
2. **Instalar Vitest y dependencias de testing:**

```bash
npm install -D vitest @vitest/ui @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom

```

3. **Configurar Vitest:** En `vite.config.ts`, añade el entorno `jsdom` y los tipos:

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts", // Archivo para extensiones de expect
  },
});
```

4. **Archivo de Setup:** Crea `src/setupTests.ts` e importa los matchers:

```typescript
import "@testing-library/jest-dom"; // Añade .toBeInTheDocument(), etc.
```

---

## 2. El dúo dinámico: `render` y `screen`

> **Concepto:** > \* **`render`**: Es la función que "dibuja" tu componente en el DOM virtual de pruebas.
>
> - **`screen`**: Es un objeto que representa la pantalla. Imaginalo como una lupa que te permite buscar cualquier cosa que esté renderizada actualmente.

```typescript
import { render, screen } from "@testing-library/react";
import MyComponent from "./MyComponent";

it("debe mostrar el título en pantalla", () => {
  // 1. Renderizamos el componente
  render(<MyComponent title="Hola Mundo" />);

  // 2. Usamos screen para buscar el elemento
  const titleElement = screen.getByText(/hola mundo/i);

  // 3. Aserción
  expect(titleElement).toBeInTheDocument();
});
```

---

## 3. Consultas: `get`, `query` y `find`

> **Concepto:** `screen` nos da tres familias de funciones para buscar elementos. Elegir la correcta es vital para que el test no falle sin motivo.

| Prefijo        | ¿Qué hace si no lo encuentra?      | ¿Es Asíncrono? | ¿Cuándo usarlo?                                                         |
| -------------- | ---------------------------------- | -------------- | ----------------------------------------------------------------------- |
| **`get...`**   | Lanza un **error** inmediatamente. | No             | El 90% de las veces. Para elementos que ya deberían estar ahí.          |
| **`query...`** | Devuelve **null** (no falla).      | No             | Para comprobar que algo **NO** está en pantalla (ej: un modal cerrado). |
| **`find...`**  | Devuelve una **Promesa** (espera). | **SÍ**         | Para elementos que dependen de una API o un temporizador.               |

```typescript
it("ejemplo de uso de get, query y find", async () => {
  render(<CharacterList />);

  // GET: El botón de carga está ahí desde el inicio
  const loadingBtn = screen.getByRole("button", { name: /cargar/i });

  // QUERY: El mensaje de error NO debe estar presente al inicio
  const errorMsg = screen.queryByText(/error/i);
  expect(errorMsg).toBeNull(); // Correcto

  // FIND: Esperamos a que el personaje aparezca tras la "petición API"
  const character = await screen.findByText(
    "Rick Sanchez",
    {},
    { timeout: 2000 }
  );
  expect(character).toBeInTheDocument();
});
```

---

## 4. Simulando al Usuario: `userEvent`

> **Concepto:** Aunque existe `fireEvent`, la comunidad prefiere **`userEvent`**. ¿Por qué? Porque `fireEvent` dispara un evento seco, mientras que `userEvent` simula toda la interacción (hover, click, focus, keydown). Es mucho más realista.

```typescript
import userEvent from "@testing-library/user-event";

it("debe escribir en el input y pulsar el botón", async () => {
  // 1. Configurar el usuario
  const user = userEvent.setup();
  render(<SearchForm />);

  const input = screen.getByRole("textbox");
  const button = screen.getByRole("button");

  // 2. Simular escritura y clic (ambos son asíncronos)
  await user.type(input, "Morty");
  await user.click(button);

  // 3. Verificar resultado
  expect(input).toHaveValue("Morty");
});
```

---

## 5. React Testing Hooks (`renderHook`)

> **Concepto:** A veces creas **Custom Hooks** que no tienen interfaz visual (lógica pura de React). No puedes usarlos en un test normal porque los hooks solo funcionan dentro de componentes. `renderHook` envuelve tu hook en un componente invisible para que puedas testearlo.

```typescript
import { renderHook, act } from "@testing-library/react";
import { useCounter } from "./useCounter";

it("debe incrementar el contador del hook", () => {
  // 1. Renderizamos el hook
  const { result } = renderHook(() => useCounter());

  // 2. Ejecutamos acciones del hook dentro de 'act'
  // 'act' asegura que todas las actualizaciones de estado se completen
  act(() => {
    result.current.increment();
  });

  // 3. El valor se encuentra en result.current
  expect(result.current.count).toBe(1);
});
```

---
