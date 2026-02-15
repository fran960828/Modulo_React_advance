¡Hola! Qué placer saludarte nuevamente. Como experto en **Clean Code**, hoy vamos a subir un escalón más. Vamos a pasar de la "forma" del código a la **robustez y arquitectura**.

Aprenderás a manejar errores como un profesional, a evitar el código "espagueti" lleno de condicionales anidados y a organizar tu lógica mediante patrones de creación.

---

## 📘 Guía de Robustez y Arquitectura: Clean Code Avanzado

```javascript
/**
 * MENTALIDAD DE DISEÑO PROFESIONAL:
 * 1. Fail Fast: Si algo va a fallar, que falle lo antes posible. No arrastres errores.
 * 2. Guard Clauses: Limpia el camino de tu función antes de ejecutar la lógica principal.
 * 3. Errores Semánticos: Un error debe decir EXACTAMENTE qué pasó, no solo "Error".
 * 4. Factory Pattern: Encapsula la creación de lógica para mantener el código modular.
 */
```

---

### 1. Guard Clauses (Cláusulas de Guarda) y Fail Fast

El concepto **Fail Fast** dicta que debemos validar las condiciones necesarias al inicio de la función. Si no se cumplen, salimos inmediatamente (`return` o `throw`). Esto evita el "Anidamiento de la muerte" (múltiples `if` uno dentro de otro).

#### ❌ Dirty Code (El "Triángulo de la Muerte")

```javascript
function processPayment(payment) {
  if (payment !== null) {
    if (payment.amount > 0) {
      if (payment.status === "PENDING") {
        // Lógica principal muy hundida a la derecha
        return "Pago procesado";
      } else {
        return "Estado no válido";
      }
    } else {
      return "Monto insuficiente";
    }
  } else {
    return "No hay pago";
  }
}
```

#### ✅ Clean Code (Plano y Directo)

```javascript
function processPayment(payment) {
  // Aplicamos Guard Clauses: validamos y salimos rápido
  if (!payment) return "No hay pago";
  if (payment.amount <= 0) return "Monto insuficiente";
  if (payment.status !== "PENDING") return "Estado no válido";

  // El camino está despejado para la lógica principal
  return "Pago procesado";
}
```

---

### 2. Construir y Lanzar Custom Errors

En lugar de lanzar errores genéricos como `Error("Invalido")`, creamos clases que hereden de `Error`. Esto permite identificar el tipo de fallo mediante código, no solo mediante texto.

#### ✅ Ejemplo Profesional

```javascript
// Definimos nuestra propia clase de error para mayor semántica
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
    this.code = 400; // Podemos añadir metadatos útiles
  }
}

function registerUser(email) {
  if (!email.includes("@")) {
    // Lanzamos el error específico
    throw new ValidationError("El formato del email es incorrecto.");
  }
}
```

---

### 3. Capturar y Manejar Custom Errors

Una vez lanzados, debemos capturarlos en un bloque `try/catch`. La clave del Clean Code aquí es **diferenciar el error** para dar una respuesta adecuada.

#### ❌ Dirty Code (Manejo genérico)

```javascript
try {
  registerUser("email-falso");
} catch (error) {
  // Tratamos todos los errores igual, lo cual es peligroso
  console.error("Algo salió mal");
}
```

#### ✅ Clean Code (Manejo específico)

```javascript
try {
  registerUser("email-falso");
} catch (error) {
  // Verificamos si es nuestro error personalizado
  if (error instanceof ValidationError) {
    console.warn(`[VALIDACIÓN]: ${error.message} (Código: ${error.code})`);
  } else {
    // Si es un error desconocido (ej. de sistema), lo manejamos distinto
    console.error("[ERROR CRÍTICO]:", error);
  }
}
```

---

### 4. Function Factory (Patrón Fábrica)

Una **Function Factory** es una función que devuelve un objeto con métodos. Es una alternativa elegante a las clases cuando queremos encapsular lógica y datos privados sin usar la palabra clave `this`.

#### ❌ Dirty Code (Funciones sueltas y globales)

```javascript
// Funciones dispersas que podrían colisionar con otras
function createNotification(msg) {
  /*...*/
}
function sendNotification(id) {
  /*...*/
}
function deleteNotification(id) {
  /*...*/
}
```

#### ✅ Clean Code (Fábrica Organizada)

```javascript
/**
 * Esta fábrica crea un "servicio" de notificaciones.
 * Encapsula toda la lógica relacionada en un solo objeto.
 */
function createNotificationService(apiKey) {
  // La apiKey queda "protegida" dentro del scope de la función
  return {
    send(message) {
      console.log(`Enviando "${message}" con la clave ${apiKey}`);
    },
    log(message) {
      console.log(`Log: ${message}`);
    },
  };
}

// Uso de la factoría
const emailService = createNotificationService("SECRET_123");
emailService.send("Hola Usuario"); // Limpio y organizado
```

---

### Resumen Comparativo Final

| Concepto             | Dirty Code                       | Clean Code                                            |
| -------------------- | -------------------------------- | ----------------------------------------------------- |
| **Control de flujo** | Múltiples `if-else` anidados.    | Cláusulas de guarda (Fail Fast).                      |
| **Errores**          | `throw "Error"` (Strings).       | Clases de error personalizadas (`extends Error`).     |
| **Manejo**           | Un `catch` que no sabe qué pasó. | Evaluación con `instanceof` para respuestas precisas. |
| **Estructura**       | Funciones globales desordenadas. | Function Factory para agrupar lógica relacionada.     |

¿Qué te parece si intentamos aplicar el concepto de **Custom Errors** y **Guards** a una función de inicio de sesión (Login) para ver cómo quedaría un flujo completo? Sería un excelente próximo paso.
