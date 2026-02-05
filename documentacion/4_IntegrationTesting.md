# 🏗️ Filosofía y Buenas Prácticas de Testing en TypeScript

## 1. Testea tu código, no el de terceros

> **Concepto:** No debes escribir tests para verificar que `axios` hace una petición o que `Math.sqrt()` calcula una raíz. Esas librerías ya tienen sus propios tests. Tu objetivo es testear **cómo tu lógica usa** esas herramientas. Si confías en una librería, asume que funciona; si no confías, cámbiala.

```typescript
// MAL: Testeando que la librería externa funciona
// expect(externalLib.sum(1,1)).toBe(2);

// BIEN: Testeando TU lógica que usa la librería
import { formatCurrency } from "./my-utils";

it("debe aplicar nuestro formato personalizado usando la librería interna de Intl", () => {
  // No testeamos si Intl funciona, testeamos si NUESTRA función
  // pasa los parámetros correctos y devuelve lo que esperamos.
  const result = formatCurrency(100);
  expect(result).toContain("$100.00");
});
```

---

## 2. Un test, un solo comportamiento

> **Concepto:** Cada bloque `it` o `test` debe validar una única "promesa" de tu código. Si un test falla, deberías saber exactamente qué funcionalidad se rompió solo con leer el título del test, sin tener que navegar por 50 líneas de código.

```typescript
// ✅ BIEN: Comportamientos separados
describe("validatePassword()", () => {
  it("debe fallar si tiene menos de 8 caracteres", () => {
    expect(validatePassword("123")).toBe(false);
  });

  it("debe fallar si no tiene números", () => {
    expect(validatePassword("abcabcabc")).toBe(false);
  });
});
```

---

## 3. Mantén los tests simples (KISS: Keep It Simple, Stupid)

> **Concepto:** El código de test debe ser tan sencillo que sea imposible que tenga errores. Evita usar bucles complejos, condicionales `if` o lógica rebuscada dentro de un test. Si el test es difícil de leer, no sirve como documentación.

```typescript
// ✅ BIEN: Datos claros y directos
it("debe calcular el IVA del 21%", () => {
  const input = 100;
  const result = calculateTax(input);
  expect(result).toBe(121); // Evita hacer: expect(result).toBe(input + (input * 0.21))
});
```

---

## 4. Mínimos `expect` por test

> **Concepto:** No llenes un test de `expect` que validan cosas distintas. Usa múltiples `expect` solo cuando estés probando el **mismo comportamiento** con diferentes variaciones de datos.

```typescript
// ✅ BIEN: Varios expects para la MISMA lógica (validación de strings)
it("debe detectar strings vacíos o con solo espacios", () => {
  expect(isEmpty("")).toBe(true);
  expect(isEmpty("   ")).toBe(true);
  expect(isEmpty("a")).toBe(false);
});
```

---

## 5. División de código en funciones simples

> **Concepto:** Si una función es imposible de testear porque hace "demasiadas cosas", es una señal de que debes dividirla (Refactorización). Las funciones pequeñas y puras son las mejores amigas del Testing.

```typescript
// Difícil de testear: hace el cálculo, formatea y guarda.
// FÁCIL: Dividir en pequeñas piezas
export const calculateDiscount = (price: number) => price * 0.9;
export const formatPrice = (price: number) => `$${price}`;

// Ahora testeamos 'calculateDiscount' por separado de forma sencilla.
```

---

## 6. Integration Testing (Pruebas de Integración)

> **Concepto:** Verifica que dos o más unidades de código funcionen bien juntas. A diferencia del Unit Test, aquí no aislamos totalmente, sino que probamos la comunicación entre componentes o funciones.

```typescript
// Supongamos que tenemos un validador y un procesador de usuarios
import { validateUser, saveUser } from "./userSystem";

it("debe guardar al usuario solo si la validación es correcta", () => {
  const newUser = { name: "Lucas", age: 25 };

  // Integración: Probamos que el flujo entre validación y guardado funcione
  const isProcessed = saveUser(newUser);

  expect(isProcessed).toBe(true);
});
```

---

## 7. El equilibrio: La Pirámide de Testing

> **Concepto:** No todos los tests cuestan lo mismo. El equilibrio profesional se basa en la pirámide:
>
> 1. **Unit Tests (60-70%):** Muchos, rápidos y baratos.
> 2. **Integration Tests (20-30%):** Menos, prueban flujos.
> 3. **E2E Tests (5-10%):** Muy pocos, lentos y costosos (simulan usuario real).

---

## 8. El Script de Cobertura (`coverage`)

> **Concepto:** El _Code Coverage_ es un reporte que te indica qué porcentaje de tu código está siendo ejecutado por tus tests. Te ayuda a encontrar "zonas muertas" o funciones que olvidaste testear.

Añade esto a tu `package.json`:

```json
"scripts": {
  "coverage": "vitest run --coverage"
}

```

> **Nota Profesional:** Para que funcione, Vitest te pedirá instalar un motor de cobertura. Normalmente: `npm i -D @vitest/coverage-v8`.

Al ejecutarlo, verás una tabla como esta en tu consola:
| File | % Stmts | % Branch | % Funcs | % Lines |
| :--- | :--- | :--- | :--- | :--- |
| math.ts | 100 | 100 | 100 | 100 |
| auth.ts | 75 | 50 | 80 | 75 |

---
