Esta documentación cubre los aspectos fundamentales de la **Asincronía** y el **Ciclo de Vida** de los tests en Vitest con TypeScript. Estos conceptos son los que te permitirán escalar de simples funciones matemáticas a probar lógica de negocio real que interactúa con bases de datos o servicios externos.

---

# 🧪 Guía Avanzada: Asincronía y Ciclo de Vida en Vitest

## 1. Diferencia entre `toBe` y `toEqual`

> **Concepto:** En JavaScript/TypeScript, la igualdad depende del tipo de dato.
>
> - **`toBe`**: Comprueba **identidad referencial** (¿apuntan al mismo lugar en memoria?). Úsalo para primitivos (`string`, `number`, `boolean`).
> - **`toEqual`**: Comprueba **igualdad de valor** (¿tienen las mismas propiedades?). Úsalo para objetos y arrays.

```typescript
// Ejemplo con Objetos
const user = { id: 1 };

it("diferencia entre toBe y toEqual", () => {
  // PASS: Los valores internos son idénticos
  expect(user).toEqual({ id: 1 });

  // FAIL: Aunque el contenido es igual, son dos objetos distintos en memoria
  // expect(user).toBe({ id: 1 });

  // PASS: Es exactamente la misma referencia
  const sameUser = user;
  expect(user).toBe(sameUser);
});
```

---

## 2. Testeo de Callbacks (Funciones como parámetros)

> **Concepto:** Cuando una función ejecuta otra que le pasamos por parámetro, queremos verificar que esa función (el callback) sea llamada correctamente.

```typescript
// Función que aplica una operación a dos números y ejecuta un callback con el resultado
const processNumbers = (
  a: number,
  b: number,
  callback: (res: number) => void
) => {
  callback(a + b);
};

it("debe ejecutar el callback con el resultado de la suma", () => {
  // Creamos un "Mock" (función falsa) para espiar si se llama
  const mockCb = vi.fn();

  processNumbers(5, 5, mockCb);

  // Verificamos que se llamó con el valor esperado (10)
  expect(mockCb).toHaveBeenCalledWith(10);
});
```

---

## 3. Uso de `done` en Callbacks con `try-catch`

> **Concepto:** El parámetro `done` es una forma clásica (aunque cada vez menos usada en favor de promesas) de decirle a Vitest: "No termines el test todavía, espera a que yo te avise". Es crucial usar `try-catch` para que, si el test falla, el error se capture y el test no se quede "colgado" esperando.

```typescript
it("debe probar un callback asíncrono usando done", (done) => {
  const asyncCallback = (data: string) => {
    try {
      // Intentamos la aserción
      expect(data).toBe("success");
      // Si todo va bien, avisamos que el test terminó
      done();
    } catch (error) {
      // Si el expect falla, pasamos el error a done para que el test falle correctamente
      done(error);
    }
  };

  // Simulamos una operación que tarda
  setTimeout(() => asyncCallback("success"), 100);
});
```

---

## 4. Promesas: `resolves` y `rejects`

> **Concepto:** Vitest permite encadenar directamente en el `expect` la resolución o el rechazo de una promesa sin tener que esperar manualmente.

```typescript
const getAsyncData = (ok: boolean) =>
  ok ? Promise.resolve("Data") : Promise.reject("Error");

it("debe gestionar promesas con resolves/rejects", () => {
  // Verificamos éxito: Retornamos la promesa para que Vitest la espere
  return expect(getAsyncData(true)).resolves.toBe("Data");
});

it("debe gestionar errores con rejects", () => {
  // Verificamos fallo
  return expect(getAsyncData(false)).rejects.toMatch("Error");
});
```

---

## 5. Promesas: `async` y `await`

> **Concepto:** Es la forma más legible y estándar hoy en día. Al marcar el test como `async`, podemos usar `await` para pausar la ejecución hasta que la promesa se resuelva.

```typescript
it("debe obtener datos asíncronos usando await", async () => {
  const data = await getAsyncData(true);

  // El código se detiene en la línea anterior hasta que los datos llegan
  expect(data).toBe("Data");
});
```

---

## 6. Hooks de Ciclo de Vida vs. Constantes Globales

> **Concepto:** Las constantes globales pueden causar "efectos secundarios" (un test cambia el valor y rompe el siguiente). Los **Hooks** aseguran que el entorno esté limpio para cada prueba.

```typescript
// ❌ EVITAR: Constantes globales mutables entre tests
let globalCounter = 0;

// ✅ RECOMENDADO: Hooks
describe("Contador", () => {
  let counter: number;

  beforeEach(() => {
    // Se reinicia antes de cada IT, garantizando aislamiento
    counter = 0;
  });
});
```

### Definición de Hooks:

| Hook             | Ejecución                                     | Uso común                              |
| ---------------- | --------------------------------------------- | -------------------------------------- |
| **`beforeAll`**  | Una vez, antes de todos los tests del bloque. | Configurar DB, iniciar servidor mock.  |
| **`beforeEach`** | Antes de cada test individual.                | Reiniciar variables, limpiar arrays.   |
| **`afterEach`**  | Después de cada test individual.              | Limpiar Mocks, cerrar conexiones.      |
| **`afterAll`**   | Una vez, al final de todo el bloque.          | Borrar archivos temporales, cerrar DB. |

---

## 7. Ejecución Concurrente (`.concurrent`)

> **Concepto:** Por defecto, los tests se ejecutan uno tras otro (secuencial). `.concurrent` permite que Vitest ejecute varios tests al mismo tiempo.

```typescript
// Se puede usar en un describe (todos los tests dentro) o en un it individual
describe.concurrent("Tests de alto rendimiento", () => {
  it("Test pesado 1", async () => {
    /* ... */
  });
  it("Test pesado 2", async () => {
    /* ... */
  });
});
```

### Ventajas y Desventajas:

- ✅ **Ventaja:** Reduce drásticamente el tiempo total de ejecución si tienes muchos tests asíncronos que esperan (ej. llamadas a API).
- ❌ **Desventaja:** Puede causar condiciones de carrera si los tests comparten recursos (como una variable global o una base de datos local).
- **¿Cuándo usarlo?:** Úsalo cuando tus tests sean puramente independientes y no dependan de estados compartidos.
