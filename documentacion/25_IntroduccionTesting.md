Perfecto. Como experto en **TypeScript**, he preparado esta guía técnica diseñada para alguien que domina la sintaxis del lenguaje pero se está iniciando en la disciplina del testing.

En TypeScript, el testing no solo verifica que el código funcione, sino que asegura que nuestros **contratos (tipos e interfaces)** se respeten en tiempo de ejecución.

---

# 📘 Guía Profesional de Testing en TypeScript

## 1. Explicación General de Testing

> **Concepto:** El testing automatizado es el proceso de escribir código adicional para verificar que nuestro código principal funcione según lo esperado. A nivel profesional, esto evita las "regresiones" (romper algo que ya funcionaba al añadir nuevas funciones) y sirve como documentación viva del proyecto.

### Ejemplo conceptual:

En TypeScript, el testing se basa en **expectativas**. Queremos confirmar que ante una entrada `A`, la salida sea siempre `B`.

```typescript
// Imagina que tenemos una función simple
const greet = (name: string): string => `Hola, ${name}`;

// Un test básico (usando sintaxis universal de Jest/Vitest)
test("debe retornar un saludo con el nombre proporcionado", () => {
  // 1. Preparación: Definimos los datos
  const name: string = "Juan";

  // 2. Ejecución: Llamamos a la función
  const result = greet(name);

  // 3. Verificación: Comprobamos si el resultado es el esperado
  expect(result).toBe("Hola, Juan");
});
```

---

## 2. Unit Testing (Pruebas Unitarias)

> **Concepto:** Es la base de la pirámide. Se encarga de probar la **unidad más pequeña** de código de forma aislada (normalmente una función o una clase). La clave aquí es que **no** debe depender de bases de datos, APIs externas o el sistema de archivos. Si hay dependencias, se usan "Mocks" (simuladores).

### Ejemplo Práctico:

Vamos a testear una lógica de descuento. Observa cómo usamos interfaces para asegurar la estructura de los datos.

```typescript
// Definimos la interfaz para el producto
interface Product {
  id: string;
  price: number;
}

// Función a testear (la unidad)
export const calculateTotal = (
  products: Product[],
  discount: number
): number => {
  const sum = products.reduce((acc, p) => acc + p.price, 0);
  return sum - discount;
};

// Test Unitario
describe("calculateTotal()", () => {
  it("debe calcular el total restando el descuento correctamente", () => {
    // ARRANGE (Preparar): Creamos datos falsos controlados
    const mockProducts: Product[] = [
      { id: "1", price: 100 },
      { id: "2", price: 50 },
    ];
    const discount = 20;

    // ACT (Actuar): Ejecutamos la lógica
    const total = calculateTotal(mockProducts, discount);

    // ASSERT (Afirmar): Verificamos el cálculo matemático (150 - 20 = 130)
    expect(total).toBe(130);
  });
});
```

---

## 3. Integration Testing (Pruebas de Integración)

> **Concepto:** Aquí probamos cómo interactúan **varias unidades** entre sí. El objetivo es verificar que la comunicación entre diferentes partes del sistema (por ejemplo, un servicio hablando con un repositorio de base de datos o dos componentes de React trabajando juntos) sea correcta.

### Ejemplo Práctico:

Supongamos que un `OrderService` depende de un `TaxCalculator`. El test de integración verifica que ambos funcionen bien en conjunto.

```typescript
class TaxCalculator {
  getTax(amount: number): number {
    return amount * 0.21;
  }
}

class OrderService {
  constructor(private calculator: TaxCalculator) {}

  processOrder(price: number) {
    const tax = this.calculator.getTax(price);
    return price + tax;
  }
}

// Test de Integración
test("OrderService debe integrar correctamente con TaxCalculator", () => {
  // Aquí no simulamos TaxCalculator, usamos la clase real para ver cómo interactúan
  const calculator = new TaxCalculator();
  const service = new OrderService(calculator);

  const finalPrice = service.processOrder(100);

  // Verificamos que la suma de la lógica de ambos sea 121
  expect(finalPrice).toBe(121);
});
```

---

## 4. End-to-End Testing (E2E)

> **Concepto:** Estas pruebas simulan el comportamiento de un **usuario real** en un entorno lo más parecido posible a la producción. Se utiliza un navegador (vía herramientas como Playwright o Cypress) para hacer clic, rellenar formularios y verificar que el flujo completo (Frontend -> Backend -> DB) funcione.

### Ejemplo Conceptual (Pseudocódigo TypeScript):

```typescript
// Esto suele escribirse con herramientas como Playwright
test("flujo de login de usuario", async ({ page }) => {
  // 1. Navegar a la URL
  await page.goto("https://tu-app.com/login");

  // 2. Interactuar con la UI (TypeScript ayuda con el autocompletado de selectores)
  await page.fill("#email", "user@test.com");
  await page.fill("#password", "123456");
  await page.click('button[type="submit"]');

  // 3. Verificar el resultado final en la pantalla
  const welcomeMessage = await page.textContent("h1");
  expect(welcomeMessage).toContain("Bienvenido, Usuario");
});
```

---

## 5. Test Driven Development (TDD)

> **Concepto:** No es un tipo de test, sino una **metodología de desarrollo**. Consiste en escribir el test **antes** que el código de la funcionalidad. El ciclo es: **Red** (el test falla), **Green** (escribes el código mínimo para que pase), **Refactor** (limpias el código).

### Ejemplo de flujo TDD:

**Paso 1: Red (Escribir el test que falla)**

```typescript
// Aún no he creado la función 'isValidEmail'
test("isValidEmail debe retornar true para correos válidos", () => {
  // @ts-ignore (porque la función no existe todavía)
  expect(isValidEmail("test@test.com")).toBe(true);
});
```

**Paso 2: Green (Escribir el código mínimo)**

```typescript
// Ahora creo la función solo para que el test pase
export const isValidEmail = (email: string): boolean => {
  return email.includes("@"); // Lógica simple inicial
};
```

**Paso 3: Refactor (Mejorar el código)**

```typescript
// Mejoramos la lógica con una Regex profesional sin romper el test
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
```

---

¿Te gustaría que profundicemos en alguna configuración específica de **Vitest** o **Jest** para que puedas empezar a correr estos ejemplos en tu entorno de TypeScript?
