Esta sección es donde pasamos de probar "lógica aislada" a probar cómo nuestro código interactúa con el mundo exterior. Dominar los **Mocks** y **Spies** es lo que te permitirá testear aplicaciones reales sin destruir tu base de datos o llenar tu disco duro de basura cada vez que ejecutas un test.

---

# 🎭 Controlando el Entorno: Mocks, Spies y Side-Effects

## 1. Side-Effects (Efectos Secundarios) y el Testing

> **Concepto:** Un "Side-Effect" es cualquier cosa que una función hace fuera de retornar un valor: escribir en un archivo, enviar un email o guardar en una base de datos.
> **Relación con el testing:** Los efectos secundarios son el enemigo de los tests rápidos y predecibles. Un test no debería depender de si el disco duro está lleno o si hay internet. Por eso, **aislamos** el side-effect usando Mocks.

```typescript
// Función con Side-Effect: Escribe un log en el disco
import { writeFileSync } from "fs";

export const saveLog = (message: string) => {
  // Esto es un Side-Effect: altera el mundo exterior (disco duro)
  writeFileSync("log.txt", message);
  return true;
};
```

---

## 2. `toBeUndefined` para Promises

> **Concepto:** A veces testeamos funciones asíncronas que no retornan nada (`void`). En esos casos, la promesa se resuelve, pero su valor es `undefined`.

```typescript
it("debe resolver la promesa aunque no retorne nada", async () => {
  const asyncAction = async () => {
    /* no retorna nada */
  };

  const result = await asyncAction();
  // Verificamos que la promesa terminó pero el resultado es indefinido
  expect(result).toBeUndefined();
});
```

---

## 3. Spies vs. Mocks: Diferencias generales

> **Concepto:** > \* **Spy (Espía):** Observa una función **real**. Registra cuántas veces se llamó y con qué argumentos, pero la función original se sigue ejecutando (hace el side-effect real).
>
> - **Mock (Simulacro):** **Reemplaza** la función real. No ejecuta el código original; en su lugar, devuelve un valor predefinido por nosotros. Es más seguro para evitar side-effects.

---

## 4. `vi.fn()`: El Spy para Callbacks

> **Concepto:** `vi.fn()` crea una función "fantasma". Se usa principalmente para pasarla como **callback** y verificar si la función principal realmente la ejecutó.

```typescript
const executeCallback = (cb: () => void) => cb();

it("debe llamar al callback proporcionado", () => {
  // Creamos el espía
  const mySpy = vi.fn();

  executeCallback(mySpy);

  // Comprobamos si el espía fue "tocado"
  expect(mySpy).toHaveBeenCalled();
});
```

---

## 5. `vi.mock('fs')`

> **Concepto:** Le dice a Vitest: "Cada vez que cualquier parte de mi código importe `fs` (file system), no le des el módulo real de Node.js, dale una versión vacía controlada por mí". Esto evita que los tests escriban archivos reales.

```typescript
import { writeFileSync } from "fs";
import { saveLog } from "./logger";

// Mockeamos el módulo completo antes del test
vi.mock("fs");

it("no debe escribir realmente en el disco", () => {
  saveLog("Hola");
  // writeFileSync aquí es una función mockeada, no hace nada real
  expect(writeFileSync).toHaveBeenCalled();
});
```

---

## 6. Verificando llamadas: `toBeCalled`, `With` y `Times`

> **Concepto:** Son las aserciones básicas para funciones mockeadas.
>
> - `toBeCalled()`: ¿Se llamó al menos una vez?
> - `toBeCalledWith(arg)`: ¿Se llamó con este argumento específico?
> - `toHaveBeenCalledTimes(n)`: ¿Se llamó exactamente N veces?

```typescript
it("debe registrar los argumentos y frecuencia", () => {
  const spy = vi.fn();

  spy("mensaje", 1);
  spy("mensaje", 1);

  expect(spy).toHaveBeenCalledTimes(2); // Pasó 2 veces
  expect(spy).toHaveBeenCalledWith("mensaje", 1); // Con esos datos
});
```

---

## 7. Custom Mocks con lógica específica

> **Concepto:** A veces no queremos un mock vacío, sino uno que simule una respuesta. Al pasar un segundo argumento a `vi.mock`, definimos qué funciones tiene el módulo y qué retornan.

```typescript
vi.mock("fs", () => {
  return {
    // Definimos manualmente la función que nos interesa
    // Sabemos que writeFileSync recibe (path, data) y no retorna nada (void)
    writeFileSync: vi.fn((path: string, data: string) => {
      console.log("Mock escribiendo en:", path);
    }),
  };
});
```

---

## 8. El directorio `__mocks__`

> **Concepto:** Si mockeas mucho un módulo (como `fs` o `axios`), crear la lógica en cada archivo de test es tedioso. Puedes crear una carpeta `__mocks__` junto al archivo original o en la raíz para que Vitest lo use automáticamente.

```text
src/
  util/
    io.ts
    __mocks__/
       io.ts  <-- Aquí diseñas la versión "fake" global

```

_Vitest usará este archivo automáticamente cuando hagas `vi.mock('./io')`._

---

## 9. `mockImplementation` y `mockImplementationOnce`

> **Concepto:** Permiten cambiar el comportamiento de un mock sobre la marcha entre diferentes tests.
>
> - `mockImplementation`: Cambia la lógica para todas las llamadas futuras.
> - `mockImplementationOnce`: Cambia la lógica **solo para la próxima vez** que se llame.

```typescript
it("debe cambiar de comportamiento dinámicamente", () => {
  const myMock = vi.fn().mockImplementation(() => "valor por defecto");

  // Primera llamada: normal
  expect(myMock()).toBe("valor por defecto");

  // Cambiamos el comportamiento solo una vez
  myMock.mockImplementationOnce(() => "valor temporal");

  expect(myMock()).toBe("valor temporal"); // Segunda llamada: temporal
  expect(myMock()).toBe("valor por defecto"); // Tercera llamada: vuelve al original
});
```

---

### Siguiente paso para tu proyecto de Rick & Morty:

Mañana, cuando empieces a practicar, te pediré que crees un test para una función que guarde tus personajes favoritos en un archivo local. Tendrás que:

1. Mockear `fs` para no crear archivos.
2. Usar `vi.fn()` para el callback de éxito.
3. Usar `mockImplementationOnce` para simular un fallo en el disco duro y ver si tu código maneja el error.

¿Listo para recibir los ejercicios de asincronía y mocks para practicar hoy?
