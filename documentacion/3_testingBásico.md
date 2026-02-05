Esta es una guía detallada diseñada para un entorno profesional de TypeScript. Aunque el curso original sea en JavaScript, aquí aplicaremos el **tipado estricto** y las mejores prácticas de **Vitest** para elevar la calidad de tus pruebas.

---

# 🧪 Documentación Profesional de Testing con Vitest y TypeScript

## 1. La Suite de Test: `describe`, `it` y `expect`

> **Concepto:** > \* `describe`: Agrupa tests relacionados (Test Suite). Facilita la lectura y organización cuando tienes cientos de pruebas.
>
> - `it` (o `test`): Define una prueba individual. El nombre debe describir qué comportamiento estamos validando.
> - `expect`: Es la función de aserción. Toma el resultado real y lo compara con el esperado usando "matchers" (como `.toBe()`).

```typescript
// Función a testear: Suma de un array de números
export const sumArray = (numbers: number[]): number => {
  return numbers.reduce((acc, curr) => acc + curr, 0);
};

// Agrupamos todos los tests de esta función
describe("sumArray()", () => {
  // Un test individual claro y conciso
  it("debe sumar correctamente un array de números positivos", () => {
    const input: number[] = [1, 2, 3];
    const result = sumArray(input);

    // Aserción: Esperamos que el resultado sea exactamente 6
    expect(result).toBe(6);
  });
});
```

---

## 2. Configuración de Scripts en `package.json`

> **Concepto:** Los flags de Vitest permiten controlar cómo se ejecutan las pruebas según la etapa del desarrollo (Local, CI/CD, Debugging).

En tu `package.json`:

```json
"scripts": {
  // Ejecuta los tests una sola vez y muestra detalles de cada test (ideal para servidores de despliegue)
  "test": "vitest --run --reporter verbose",

  // Abre una interfaz gráfica interactiva en el navegador para ver los tests (increíble para debugging)
  "test:ui": "vitest --ui",

  // Modo observador: los tests se re-ejecutan automáticamente al guardar cambios (el estándar para desarrollo)
  "test:watch": "vitest"
}

```

---

## 3. El Patrón AAA (Arrange, Act, Assert)

> **Concepto:** Es el estándar de oro para estructurar cualquier test. Divide la prueba en tres pasos claros para que cualquiera pueda entenderla.

```typescript
it("debe sumar números negativos correctamente", () => {
  // 1. ARRANGE (Organizar): Preparamos los datos y el entorno
  const input: number[] = [-5, -10, 15];
  const expectedResult = 0;

  // 2. ACT (Actuar): Ejecutamos la función o lógica que queremos probar
  const actualResult = sumArray(input);

  // 3. ASSERT (Afirmar): Verificamos que el resultado sea el esperado
  expect(actualResult).toBe(expectedResult);
});
```

---

## 4. Casos Especiales: Array Vacío y Tipos Inválidos

> **Concepto:** Aunque TypeScript evita que pases un `string` accidentalmente, a veces consumimos datos de APIs externas (tipo `any`). Debemos testear cómo reacciona nuestra lógica a estos casos.

```typescript
describe("sumArray() - Casos de borde", () => {
  it("debe retornar 0 si se le pasa un array vacío", () => {
    // Caso importante en lógica de negocio
    const result = sumArray([]);
    expect(result).toBe(0);
  });

  it("debe manejar valores que no son números (Defensa contra datos externos)", () => {
    // Forzamos un array con strings usando 'any' para simular una respuesta de API mal formada
    const input = ["1", "2"] as any;

    // Si nuestra función no los convierte, el test nos avisará de comportamientos extraños
    const result = sumArray(input);

    // En JS esto devolvería "012" (concatenación), en TS queremos detectar este fallo
    expect(result).not.toBe(3);
  });
});
```

---

## 5. Manejo de Errores y Excepciones (`toThrow`)

> **Concepto:** Para testear si una función lanza un error (`throw`), **no debemos ejecutar la función directamente**, ya que el test fallaría antes de poder verificar el error. En su lugar, envolvemos la llamada en una función anónima.

```typescript
// Función que valida que la entrada sea un array
export const sumStrict = (numbers: number[]): number => {
  if (!Array.isArray(numbers)) {
    throw new Error("is not iterable");
  }
  return numbers.reduce((acc, curr) => acc + curr, 0);
};

describe("sumStrict() - Errores", () => {
  it("debe lanzar un error si no se proporciona ningún argumento", () => {
    // Pasamos una arrow function a expect. Vitest la ejecutará por nosotros dentro de un try-catch interno.
    // Usamos 'as any' para saltarnos la protección de TS y probar la robustez en ejecución.
    expect(() => (sumStrict as any)()).toThrow();
  });

  it('debe lanzar un error específico con mensaje "is not iterable"', () => {
    // Podemos usar una Expresión Regular para verificar el contenido del mensaje de error
    expect(() => (sumStrict as any)(123)).toThrow(/is not iterable/);
  });
});
```

---

## 6. Ejemplo Completo: Múltiples Argumentos e Iterables

> **Concepto:** A veces una función espera un array pero recibe múltiples argumentos sueltos. TypeScript nos ayuda a tipar esto, pero el test confirma que la validación manual (si existe) funciona.

```typescript
it("debe fallar si recibe múltiples argumentos en lugar de un único array", () => {
  // Escenario: El programador pasó sumArray(1, 2, 3) en lugar de sumArray([1, 2, 3])
  const callWithMultipleArgs = () => (sumStrict as any)(1, 2, 3);

  // Verificamos que la función explote correctamente ante el mal uso
  expect(callWithMultipleArgs).toThrow(/is not iterable/);
});
```

### 1. Igualdad Básica (Primitivos)

- **`toBe(value)`**: Compara igualdad física (identidad). Ideal para números, strings o booleanos. Es el equivalente a `===`.
- **`toStrictEqual(value)`**: Similar a `toBe`, pero verifica que dos objetos tengan exactamente la misma estructura y tipos, incluso si tienen propiedades con `undefined`.
- **`not`**: No es un matcher por sí solo, pero se usa antes de cualquier otro para invertir el resultado. Ej: `expect(x).not.toBe(y)`.

---

### 2. Objetos y Arrays (Referencia)

- **`toEqual(value)`**: El más usado para objetos y arrays. No mira si son el mismo objeto en memoria, sino si su **contenido** es idéntico.
- **`toContain(item)`**: Verifica si un array contiene un elemento específico. También funciona para strings.
- **`toHaveLength(number)`**: Comprueba la propiedad `.length` de un array o string.
- **`toMatchObject(object)`**: Comprueba si un objeto contiene **al menos** las propiedades que le pasamos (aunque tenga más).

---

### 3. Valores "Truthiness" (Lógicos)

- **`toBeTruthy()`**: El valor es "verdadero" en un contexto booleano (cualquier cosa que no sea `false`, `0`, `""`, `null`, `undefined` o `NaN`).
- **`toBeFalsy()`**: Lo contrario al anterior.
- **`toBeNull()`**: Solo pasa si el valor es exactamente `null`.
- **`toBeUndefined()`**: Solo pasa si el valor es exactamente `undefined`.
- **`toBeDefined()`**: Lo contrario a `toBeUndefined`. Útil para asegurar que una función devolvió algo.

---

### 4. Comparaciones Numéricas

- **`toBeGreaterThan(number)`**: El valor es mayor que el argumento.
- **`toBeGreaterThanOrEqual(number)`**: Mayor o igual.
- **`toBeLessThan(number)`**: Menor que.
- **`toBeCloseTo(number, precision)`**: **Vital para números decimales**. Evita errores de precisión como .

---

### 5. Strings (Cadenas de texto)

- **`toMatch(regexp | string)`**: Verifica si un string coincide con una expresión regular o una subcadena.
- **`toContain(string)`**: Verifica si un string está incluido en otro.

---

### 6. Errores y Excepciones

- **`toThrow(error?)`**: Verifica si una función lanza un error al ejecutarse. Puede recibir un string o una regex para validar el mensaje del error.

---

### 7. Matchers de DOM (Requieren `jest-dom`)

Si instalaste `@testing-library/jest-dom`, tienes acceso a estos que son esenciales para React:

- **`toBeInTheDocument()`**: Verifica si el elemento existe en el HTML.
- **`toBeVisible()`**: Verifica si el elemento es visible para el usuario (no tiene `display: none`).
- **`toBeDisabled()` / `toBeEnabled()**`: Para botones y formularios.
- **`toHaveValue(value)`**: Verifica el valor de un input.
- **`toHaveClass(className)`**: Comprueba si un elemento tiene una clase CSS específica.
