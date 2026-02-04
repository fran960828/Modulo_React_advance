Excelente elección. **Vitest** se ha convertido en el estándar moderno para aplicaciones desarrolladas con Vite (como suele ser el caso en React actualmente). Al usar TypeScript, la integración es nativa y muy potente.

Aquí tienes la documentación técnica detallada para dominar estas herramientas.

---

# 🚀 Configuración del Entorno de Testing: Vitest y TypeScript

## 1. Test Runner vs. Assertion Library

> **Concepto:** A nivel profesional, solemos confundirlos porque vienen empaquetados juntos, pero cumplen roles muy distintos en el ciclo de vida de una prueba.
>
> - **Test Runner:** Es el "motor". Su trabajo es buscar los archivos de prueba (ej. `.test.ts`), ejecutar el código, gestionar el tiempo de ejecución (timeouts) y mostrar los resultados en la consola.
> - **Assertion Library (Librería de Aseveraciones):** Es el "validador". Proporciona las herramientas y funciones (como `expect`) para verificar que el código hace lo que debe. Es la que dicta la semántica del test: "Espero que X sea igual a Y".

### Ejemplo Conceptual

```typescript
// --- EL TEST RUNNER (Motor) ---
// Se encarga de crear este bloque y decidir CUÁNDO se ejecuta.
describe("Suite de ejemplo", () => {
  test("nombre del test", () => {
    const valorReal: number = 10;
    const valorEsperado: number = 10;

    // --- LA ASSERTION LIBRARY (Validador) ---
    // La función 'expect' y sus comparadores (matchers) como 'toBe'
    // pertenecen a la librería de aseveraciones.
    expect(valorReal).toBe(valorEsperado);
  });
});
```

---

## 2. Vitest: El estándar moderno

> **Concepto:** Vitest es un framework de testing extremadamente rápido diseñado para funcionar sobre **Vite**. A diferencia de Jest, Vitest no necesita una configuración compleja para TypeScript; entiende tus archivos `.ts` y `.tsx` de forma nativa porque comparte la misma configuración de transformación que tu servidor de desarrollo.

### Instalación Profesional

Para un proyecto de React con TypeScript, lo instalamos como dependencia de desarrollo:

```bash
npm install -D vitest

```

Luego, en tu archivo `package.json`, añade el script para lanzarlo:

```json
{
  "scripts": {
    "test": "vitest"
  }
}
```

---

### Configuración en TypeScript (`vitest.config.ts`)

Para que Vitest funcione perfectamente con React y reconozca los alias o decoradores de TS, creamos un archivo en la raíz:

```typescript
// vitest.config.ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Permite usar 'describe', 'it', 'expect' globalmente sin importarlos en cada archivo
    globals: true,
    // Simula un entorno de navegador (necesario para React)
    environment: "jsdom",
  },
});
```

> **Tip de experto:** Si activas `globals: true`, debes añadir `"types": ["vitest/globals"]` en tu archivo `tsconfig.json` para que TypeScript no marque errores de "no se encuentra el nombre 'describe'".

---

## 3. Ejemplo Práctico: Testeando un Utility en TS

Imagina que tenemos una función que formatea precios de productos en nuestra tienda React.

### El Código (`formatPrice.ts`)

```typescript
// Definimos un tipo para la moneda para mayor seguridad
type Currency = "USD" | "EUR";

/**
 * Formatea un número como moneda.
 * @param amount - Cantidad numérica
 * @param currency - Tipo de moneda
 */
export const formatPrice = (amount: number, currency: Currency): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount);
};
```

### El Test (`formatPrice.test.ts`)

```typescript
// Importamos la función a testear
import { formatPrice } from "./formatPrice";
import { describe, it, expect } from "vitest";

describe("formatPrice()", () => {
  it("debe formatear correctamente un valor en USD", () => {
    // 1. Preparación (Arrange)
    const amount: number = 100;
    const currency: "USD" = "USD";

    // 2. Ejecución (Act)
    const result = formatPrice(amount, currency);

    // 3. Verificación (Assert)
    // Usamos la assertion library para validar el string resultante
    // El espacio en blanco de Intl.NumberFormat a veces es un "non-breaking space"
    expect(result).toMatch(/\$100\.00/);
  });

  it("debe lanzar un error de tipo si pasamos un valor inválido (Garantía TS)", () => {
    // En TS esto daría error de compilación, pero testeamos la robustez
    // @ts-expect-error: Forzamos un error para probar la resistencia
    const result = formatPrice("100", "USD");

    // Verificamos que el resultado no sea nulo
    expect(result).toBeDefined();
  });
});
```

---

¿Qué te parece esta estructura? Si estás listo, el siguiente paso lógico es aprender a **testear componentes de React** usando `React Testing Library` junto con Vitest. ¿Quieres que preparemos esa guía?
