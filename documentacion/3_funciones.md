¡Hola! Como experto en **Clean Code**, es un placer acompañarte en este tercer nivel de maestría. Hoy vamos a tratar el corazón de cualquier aplicación: **Las Funciones**.

Escribir una función que "funcione" es fácil; escribir una función que sea legible, mantenible y escalable es un arte que separa a los aficionados de los profesionales.

---

## 📘 Guía Maestra de Funciones: Clean Code y Lógica Profesional

```javascript
/**
 * REGLAS DE ORO PARA LAS FUNCIONES:
 * 1. Deben ser pequeñas, casi ridículamente pequeñas.
 * 2. Deben hacer UNA SOLA COSA (Single Responsibility).
 * 3. Los argumentos deben ser mínimos (0, 1 o 2 máximo).
 * 4. El nombre debe ser un verbo claro que describa su única tarea.
 * 5. Deben ser predecibles: dadas las mismas entradas, idealmente
 * deberían dar las mismas salidas sin romper nada afuera.
 */
```

---

### 1. Parámetros: Menos es Más

Cuantos más parámetros tiene una función, más difícil es de testear y entender. Si necesitas pasar muchos datos, usa un **objeto** como argumento. Esto elimina la dependencia del orden y hace que el código sea autodocumentado.

#### ❌ Dirty Code

```javascript
// ¿Qué era el tercer true? ¿Y el cuarto parámetro? El orden es crítico.
function createUser(name, lastName, isAdmin, isActive, role) { ... }
createUser("Juan", "Pérez", true, false, "Editor");

```

#### ✅ Clean Code

```javascript
// Usamos un objeto: el orden no importa y los nombres dan contexto.
function createUser({ name, lastName, isAdmin, role }) {
  // Lógica para crear usuario...
}

createUser({
  name: "Juan",
  lastName: "Pérez",
  isAdmin: true,
  role: "Editor",
});
```

---

### 2. Spread Operator como Parámetro

El **Spread Operator** (`...`) es útil para funciones que aceptan un número indefinido de argumentos o para pasar colecciones de forma limpia.

#### ✅ Ejemplo Profesional

```javascript
// Suma todos los números que se le pasen, sin importar cuántos sean
function sumAllNumbers(...numbers) {
  return numbers.reduce((total, num) => total + num, 0);
}

const total = sumAllNumbers(1, 5, 10, 20); // Resultado: 36
```

---

### 3. Evitar "Output Arguments" (Argumentos de salida)

Una función debe devolver un valor (Return), no modificar un objeto que se le pasó por parámetro para "devolver" el resultado. Modificar los argumentos confunde al lector.

#### ❌ Dirty Code

```javascript
// La función modifica 'user' directamente. Es confuso.
function addId(user) {
  user.id = 1;
}
```

#### ✅ Clean Code

```javascript
// La función devuelve un nuevo objeto o el valor esperado.
function generateUserId(user) {
  return { ...user, id: 1 };
}
```

---

### 4. Una Sola Tarea (Single Responsibility)

Si una función tiene la palabra "y" (and) en su nombre o en su descripción mental, probablemente hace demasiadas cosas.

#### ❌ Dirty Code

```javascript
function validateAndSaveUser(user) {
  if (user.name !== "") {
    // Tarea 1: Validar
    db.save(user); // Tarea 2: Guardar
    log.info("Saved"); // Tarea 3: Loguear
  }
}
```

#### ✅ Clean Code

```javascript
// Dividimos en funciones atómicas
function isValidUser(user) {
  return user.name !== "";
}

function saveUser(user) {
  db.save(user);
}
```

---

### 5. Niveles de Abstracción

El código debe leerse como un artículo de periódico: de lo general (alto nivel) a lo específico (bajo nivel).

- **Alto nivel:** "Hacer un café".
- **Bajo nivel:** "Calentar agua a 90 grados", "Moler 15g de grano".

#### ✅ Ejemplo de Abstracción

```javascript
// ALTO NIVEL: Orquestador, fácil de leer
function prepareMorningCoffee() {
  boilWater();
  grindBeans();
  brew();
}

// BAJO NIVEL: Detalles técnicos ocultos
function grindBeans() {
  // Lógica compleja de milisegundos y potencia del motor
}
```

---

### 6. Rule of Thumb (Regla del Pulgar)

**¿Cuándo separar una función?** 1. Si el bloque de código tiene una funcionalidad distinta a la principal. 2. Si entender ese bloque requiere más esfuerzo mental que el resto de la función (ej. un algoritmo complejo de fechas dentro de una función de interfaz).

---

### 7. DRY: Don't Repeat Yourself (No te repitas)

Si copias y pegas código, estás creando una deuda técnica. Si mañana hay un error, tendrás que arreglarlo en dos sitios.

#### ❌ Dirty Code

```javascript
function showAdminMenu(user) {
  console.log(`Welcome ${user.name} ${user.lastName}`);
  // mostrar menu...
}

function showGuestMenu(user) {
  console.log(`Welcome ${user.name} ${user.lastName}`); // DUPLICADO
  // mostrar menu...
}
```

#### ✅ Clean Code

```javascript
function getFullName(user) {
  return `${user.name} ${user.lastName}`;
}

function showAdminMenu(user) {
  console.log(`Welcome ${getFullName(user)}`);
}
```

---

### 8. Funciones Puras vs Impuras y Side Effects

- **Función Pura:** No tiene efectos secundarios. Si le das A, siempre devuelve B. No toca nada de "afuera".
- **Efecto Secundario (Side Effect):** Cuando una función modifica una variable global, escribe en un archivo o cambia un estado externo.

#### ❌ Función Impura (Con Side Effects)

```javascript
let total = 0;

function addToTotal(amount) {
  total += amount; // Modifica una variable externa (Side Effect)
  return total;
}
```

#### ✅ Función Pura

```javascript
function add(a, b) {
  return a + b; // No toca nada externo, solo depende de sus entradas
}
```

---

### 9. ¿Cuándo dividir y cuándo no el código?

- **Divide cuando:** La función supera las 15-20 líneas, tiene múltiples niveles de identación (muchos `if` anidados) o hace más de una cosa.
- **No dividas cuando:** La separación haga que el código sea más difícil de seguir (abstracción innecesaria) o cuando la lógica sea tan simple que la función hija solo tenga una línea que ya es clara por sí misma.

---

### Resumen Comparativo Final

| Concepto            | Dirty Code                                  | Clean Code                                   |
| ------------------- | ------------------------------------------- | -------------------------------------------- |
| **Argumentos**      | 5 parámetros en orden estricto.             | Un objeto desestructurado.                   |
| **Responsabilidad** | Validar, calcular y guardar en una función. | Una función para cada paso.                  |
| **Repetición**      | Copiar lógica de formato en 3 sitios.       | Una función `format()` reutilizable.         |
| **Predicibilidad**  | Cambia variables globales por sorpresa.     | Funciones puras que retornan nuevos valores. |

¿Te gustaría que practicáramos refactorizando una función "monstruo" que tengas por ahí siguiendo estas reglas?
