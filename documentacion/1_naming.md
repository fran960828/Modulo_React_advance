¡Hola! Qué gusto saludarte. Como experto en **Clean Code**, me encanta que estés dando tus primeros pasos con esta mentalidad. Escribir código no es hablar con una máquina; es **escribirle una carta a otro ser humano** (que podrías ser tú mismo en seis meses) explicando qué debe pasar.

Aquí tienes la guía definitiva de nomenclatura profesional, diseñada para que pases de "picar código" a "diseñar software".

---

## 📘 Guía de Nomenclatura Profesional: Clean Code

```javascript
/**
 * BIENVENIDO AL CLEAN CODE
 * * El objetivo principal de estas reglas es reducir la carga cognitiva.
 * Un buen nombre debe responder tres preguntas: ¿Por qué existe?,
 * ¿Qué hace? y ¿Cómo se usa? Si tienes que añadir un comentario para
 * explicar el nombre de una variable, entonces el nombre no es bueno.
 * * Recuerda: El código se lee mucho más de lo que se escribe.
 */
```

---

### 1. La importancia de elegir buenos nombres

Los nombres son la columna vertebral de tu lógica. Un nombre genérico obliga al lector a rastrear todo el archivo para entender qué contiene una variable. Un nombre descriptivo permite leer el código como si fuera un libro.

#### ❌ Dirty Code

```javascript
// ¿Qué es 'd'? ¿Días? ¿Distancia? ¿Datos?
const d = 15;
```

#### ✅ Clean Code

```javascript
// El nombre comunica el propósito y la unidad de medida
const daysSinceLastUpdate = 15;
```

---

### 2. Variables y Constantes: Sustantivos y Adjetivos

Las **variables** representan "cosas" o estados, por lo que deben ser **sustantivos**. Las **constantes** suelen representar valores fijos o configuraciones que no cambian.

- **Uso:** Nombres claros o frases cortas con adjetivos.
- **Ejemplo:** `activeUser`, `maxRetryAttempts`.

#### ❌ Dirty Code

```javascript
let lista = ["Juan", "Maria"]; // Muy genérico
const VAL = 3.14; // No describe qué es el valor
```

#### ✅ Clean Code

```javascript
// Sustantivo + Adjetivo para dar contexto
let userNames = ["Juan", "Maria"];

// Nombre descriptivo para la constante
const PI_APPROXIMATION = 3.14;
```

---

### 3. Funciones: Verbos y Acción

Las funciones **hacen algo**. Por lo tanto, su nombre debe empezar con un **verbo** que indique la acción, seguido de un sustantivo o adjetivo.

#### ❌ Dirty Code

```javascript
// ¿Qué hace 'proceso'? ¿Limpia? ¿Imprime? ¿Borra?
function proceso(u) { ... }

```

#### ✅ Clean Code

```javascript
// Verbo (send) + Sustantivo (Email)
function sendWelcomeEmail(user) {
  // Lógica para enviar el correo...
}
```

---

### 4. Clases: Representación del Mundo Real

Las clases son los "moldes" de los objetos. Deben ser **sustantivos** y representar un concepto claro, sin incluir verbos en su nombre.

#### ❌ Dirty Code

```javascript
class GestorDeOperacionesParaElUsuario { ... } // Demasiado largo y mezcla conceptos
class HacerLogin { ... } // Error: Es un verbo, no un objeto

```

#### ✅ Clean Code

```javascript
// Representa una entidad clara del mundo real
class User { ... }
class ShoppingCart { ... }

```

---

### 5. Estilos de Escritura (Casing)

Dependiendo del lenguaje y la comunidad, se utilizan diferentes formatos:

| Estilo         | Ejemplo       | Uso común                                             |
| -------------- | ------------- | ----------------------------------------------------- |
| **camelCase**  | `myVariable`  | JavaScript, Java, TypeScript (Variables y funciones). |
| **PascalCase** | `MyClass`     | C#, Java, JS (Clases y Componentes).                  |
| **snake_case** | `my_variable` | Python, PHP, SQL.                                     |
| **kebab-case** | `my-style`    | CSS, URLs.                                            |

---

### 6. Tipos de Datos Específicos

#### Strings y Numbers

Deben describir el contenido, no el tipo de dato (evita poner `nameString`).

#### Booleans (Pregunta/Respuesta)

Los booleanos deben sonar como una pregunta que se responde con "Sí" o "No" (`true`/`false`). Se suelen usar prefijos como `is`, `has`, `can` o `should`.

#### ❌ Dirty Code

```javascript
let nombreStr = "Carlos"; // No hace falta decir que es String
let edadNum = 30; // No hace falta decir que es Number
let abierto = true; // ¿Abierto o cerrando?
```

#### ✅ Clean Code

```javascript
let userName = "Carlos";
let userAge = 30;

// Booleano como respuesta a una pregunta
let isOpen = true;
let hasAccessPermission = false;
let shouldUpdateDatabase = true;
```

---

### 7. Funciones y Métodos Booleanos

Cuando una función devuelve un booleano, su nombre debe actuar como un predicado o una validación.

#### ❌ Dirty Code

```javascript
// No queda claro qué devuelve si no miras el código
function password(p) {
  return p.length > 8;
}
```

#### ✅ Clean Code

```javascript
// El nombre indica claramente que la respuesta será True o False
function isPasswordValid(password) {
  // Comprobamos si la longitud es mayor a 8
  return password.length > 8;
}

if (isPasswordValid("123456789")) {
  // Acción si es correcto
}
```

---

### 8. Resumen Comparativo Final

A continuación, un ejemplo que integra todo lo aprendido:

#### ❌ Dirty Code (El caos)

```javascript
// Clase con nombre de verbo
class Crear {
  constructor(n) {
    this.n = n;
  }
}

// Variable poco descriptiva y booleano confuso
let x = new Crear("Admin");
let v = true;

// Función con nombre de sustantivo (mal)
function datos(obj) {
  if (v) {
    console.log(obj.n);
  }
}
```

#### ✅ Clean Code (La claridad)

```javascript
/**
 * Representa un perfil de usuario en el sistema.
 * Usamos PascalCase para la Clase.
 */
class UserProfile {
  constructor(userName) {
    this.userName = userName; // Nombre descriptivo
  }
}

// Usamos camelCase para instancias y nombres claros
const currentUser = new UserProfile("Admin");
const isUserLoggedIn = true; // Booleano como pregunta

/**
 * Muestra el nombre del usuario si está autenticado.
 * Usamos Verbo + Sustantivo.
 */
function displayUserName(user) {
  // Solo actuamos si el estado es verdadero
  if (isUserLoggedIn) {
    console.log(user.userName);
  }
}

displayUserName(currentUser);
```

¿Te gustaría que profundizáramos en cómo aplicar estas reglas específicamente en algún lenguaje como Python o JavaScript?
