Esta documentación cierra el círculo sobre el manejo de elementos globales, asincronía avanzada y pruebas de interfaz. Como experto en TypeScript, he diseñado estos ejemplos para que veas no solo cómo "hacer que pasen", sino cómo mantener el tipado y la robustez en un entorno profesional.

---

# 🛠️ Dominando el Entorno Global y la Interfaz

## 1. `vi.stubGlobal` para funciones nativas (fetch)

> **Concepto:** `fetch` es una función global (no se importa). Para testearla sin hacer peticiones reales, Vitest nos permite "sustituir" cualquier objeto global mediante `vi.stubGlobal`. Esto evita que el test dependa de internet y acelera la ejecución.

```typescript
// @vitest-environment jsdom
import { it, expect, vi } from "vitest";

it("debe sustituir el fetch global para no llamar a la API real", async () => {
  // Creamos un valor ficticio que simula la respuesta de fetch
  const mockResponse = {
    ok: true,
    json: async () => ({ info: "Personajes de Rick & Morty" }),
  };

  // Reemplazamos 'fetch' en el objeto global (window/global)
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(mockResponse));

  const res = await fetch("https://rickandmortyapi.com/api/character");
  const data = await res.json();

  expect(data.info).toBe("Personajes de Rick & Morty");

  // Es vital limpiar los stubs después de cada test o en afterEach
  vi.unstubAllGlobals();
});
```

---

## 2. `vi.fn()` customizado dentro de `vi.stubGlobal`

> **Concepto:** A veces no basta con que `fetch` devuelva algo; necesitamos que simule el comportamiento exacto de la API, incluyendo el manejo de los parámetros que recibe. Al pasar `vi.fn()` con una implementación personalizada, podemos validar la lógica interna.

```typescript
it("debe customizar el comportamiento de fetch según los parámetros", async () => {
  // Definimos un mock con lógica: si la URL contiene '1', devuelve a Rick
  const customFetch = vi.fn((url: string) => {
    if (url.includes("/1")) {
      return Promise.resolve({
        ok: true,
        json: async () => ({ name: "Rick Sanchez" }),
      });
    }
    return Promise.reject(new Error("Character not found"));
  });

  vi.stubGlobal("fetch", customFetch);

  const response = await fetch("https://rickandmortyapi.com/api/character/1");
  const data = await response.json();

  // Verificamos que la lógica del mock funcionó
  expect(data.name).toBe("Rick Sanchez");
  // Verificamos que se llamó con la URL correcta
  expect(customFetch).toHaveBeenCalledWith(expect.stringContaining("/1"));

  vi.unstubAllGlobals();
});
```

---

## 3. Asincronía: `return expect` vs `async/await`

> **Concepto:** Existen dos formas de esperar a que una promesa termine en Vitest:
>
> 1. **`return expect(...)`**: Vitest espera la resolución de la promesa retornada. Es más conciso para aserciones simples.
> 2. **`async/await`**: Permite escribir código que parece síncrono. Es mucho más flexible si necesitas hacer varias operaciones antes del `expect`.

```typescript
const getData = () => Promise.resolve("Success");

// Opción 1: return expect (Conciso)
it("test asíncrono usando return", () => {
  return expect(getData()).resolves.toBe("Success");
});

// Opción 2: async/await (Recomendado para lógica compleja)
it("test asíncrono usando async/await", async () => {
  const result = await getData();
  expect(result).toBe("Success");
});
```

---

## 4. Controlando `JSON.stringify` y el rechazo

> **Concepto:** A veces queremos testear qué sucede cuando algo que debería ser automático falla. `JSON.stringify` puede fallar si intentamos convertir objetos con referencias circulares. En testing, podemos mockearlo para forzar un error y verificar que nuestro código captura ese rechazo.

```typescript
it("debe manejar errores cuando JSON.stringify falla", () => {
  // Mockeamos JSON.stringify para que lance un error a propósito
  const spy = vi.spyOn(JSON, "stringify").mockImplementation(() => {
    throw new Error("Circular reference error");
  });

  const complexObject = {};

  // Verificamos que nuestra lógica lanza el error esperado
  expect(() => JSON.stringify(complexObject)).toThrow(
    "Circular reference error"
  );

  // Restauramos el comportamiento original de JSON para no romper otros tests
  spy.mockRestore();
});
```

---

## 5. Testing en Formularios

> **Concepto:** Al testear formularios, no nos centramos en los estilos, sino en la **extracción de datos**. Usamos `FormData` para simular el envío y verificamos si las funciones encargadas de procesar esos datos reciben la información correcta.

```typescript
// Función que procesa el formulario
export const handleFormSubmit = (
  event: Event,
  callback: (data: any) => void
) => {
  event.preventDefault();
  const formData = new FormData(event.target as HTMLFormElement);
  const data = Object.fromEntries(formData.entries());
  callback(data);
};

it("debe capturar los datos del formulario al hacer submit", () => {
  // 1. Preparamos el DOM manual
  document.body.innerHTML = `
    <form id="my-form">
      <input name="username" value="rick_sanchez" />
      <button type="submit">Enviar</button>
    </form>
  `;

  const form = document.getElementById("my-form") as HTMLFormElement;
  const mockCallback = vi.fn();

  // 2. Escuchamos el evento y ejecutamos nuestra lógica
  form.addEventListener("submit", (e) => handleFormSubmit(e, mockCallback));

  // 3. Simulamos el evento de envío (Submit)
  const submitEvent = new Event("submit", { bubbles: true, cancelable: true });
  form.dispatchEvent(submitEvent);

  // 4. Aserción: ¿El callback recibió el objeto con el username?
  expect(mockCallback).toHaveBeenCalledWith({ username: "rick_sanchez" });
});
```
Esta es la última pieza del rompecabezas de los Mocks. Los **Helpers Mocks** representan el paso de "escribir tests" a "diseñar una arquitectura de tests". En proyectos grandes, como el que vas a empezar de Rick & Morty, estos ayudantes son los que evitan que tu código de prueba se vuelva inmanejable.

---

# 🛠️ Arquitectura de Pruebas: Helpers Mocks

## 1. Explicación de los Helper Mocks

> **Concepto:** Un Helper Mock es una función reutilizable que encapsula la configuración compleja de un simulacro (Mock). En lugar de repetir la estructura de promesas y objetos de `fetch` en cada archivo de test, creamos una "fábrica" de respuestas.
> **Relación con el testing profesional:** Permite que los tests sean **DRY** (*Don't Repeat Yourself*). Si la API de Vitest cambia o si decides añadir más lógica global a tus respuestas (como cabeceras comunes), solo lo cambias en el Helper y todos tus tests se actualizan automáticamente.

```typescript
// @vitest-environment jsdom
import { vi } from 'vitest';

/**
 * HELPER: createFetchResponse
 * Genera un mock de fetch pre-configurado.
 * @param data - Los datos que queremos que devuelva el .json()
 * @param ok - Estado de la respuesta (por defecto true)
 */
export const createFetchResponse = (data: any, ok = true) => {
  return vi.fn().mockResolvedValue({
    ok: ok,
    json: () => Promise.resolve(data),
    status: ok ? 200 : 500,
  });
};

// Ejemplo de uso en un test
it('debe usar el helper para simular una respuesta de la API', async () => {
  const mockData = { name: 'Rick Sanchez' };
  
  // Usamos el helper para obtener el mock configurado
  const mockFetch = createFetchResponse(mockData);
  
  vi.stubGlobal('fetch', mockFetch);

  const response = await fetch('https://rickandmortyapi.com/api/character/1');
  const result = await response.json();

  expect(result.name).toBe('Rick Sanchez');
  expect(mockFetch).toHaveBeenCalled();
  
  vi.unstubAllGlobals();
});

```

---

## 2. Helpers para Errores de Red y Excepciones

> **Concepto:** No todos los fallos vienen del servidor (status 500); algunos ocurren antes, en la conexión. Crear helpers específicos para errores de red ayuda a testear la resiliencia de tu aplicación sin ensuciar el bloque `it`.

```typescript
/**
 * HELPER: createNetworkError
 * Simula un fallo total de conexión (cuando la promesa hace reject)
 */
export const createNetworkError = (message = 'Failed to fetch') => {
  return vi.fn().mockRejectedValue(new Error(message));
};

it('debe manejar un fallo de conexión a internet', async () => {
  // Configuramos el fallo global
  vi.stubGlobal('fetch', createNetworkError());

  // Verificamos que nuestra lógica captura el error de red
  await expect(fetch('...')).rejects.toThrow('Failed to fetch');

  vi.unstubAllGlobals();
});

```

---

## 3. Ventajas de usar Helpers en Arquitectura Modular

> **Concepto:** En tu proyecto de Rick & Morty, tendrás diferentes módulos (Personajes, Episodios, Ubicaciones). Usar Helpers te permite centrarte en la **lógica de cada módulo** en lugar de en la **infraestructura del fetch**.

| Ventaja | Descripción Profesional |
| --- | --- |
| **Abstracción** | El test lee: "Simula respuesta X", no "Crea promesa, resuelve objeto, añade método json...". |
| **Mantenibilidad** | Si mañana añades autenticación JWT global, solo modificas el Helper para que incluya las cabeceras. |
| **Rapidez** | Escribes tests mucho más rápido al tener una "caja de herramientas" lista. |

---

### 💡 Conclusión para tu carrera

Los Helpers Mocks son la diferencia entre **sufrir** con los tests y **disfrutar** de ellos. Al abstraer la "fontanería" (el código repetitivo de fetch), tus archivos de test quedan limpios, cortos y fáciles de entender para cualquier compañero de equipo.

¿Te sientes listo para cerrar el cuaderno de teoría por hoy? Mañana, cuando termines tus últimas secciones de Academind, estarás en una posición privilegiada: dominas la lógica, la asincronía, el DOM y la arquitectura de mocks.

**¿Hay algo más de este bloque que te genere curiosidad antes de que te dejes llevar por el código real mañana?** ¡Has hecho un progreso asombroso!