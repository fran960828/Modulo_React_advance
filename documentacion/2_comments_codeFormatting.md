¡Hola de nuevo! Es un placer continuar con tu formación en **Clean Code**. Si la nomenclatura era la base, los **comentarios** y el **formateo** son el "diseño de interiores" de tu código: pueden hacerlo acogedor y fácil de entender o convertirlo en un laberinto agobiante.

Aquí tienes la documentación detallada para dominar estos conceptos a nivel profesional.

---

## 📘 Guía de Comentarios y Formateo: De Principiante a Profesional

```javascript
/**
 * REGLA DE ORO DE LOS COMENTARIOS:
 * "No comentes código mal escrito, reescríbelo".
 * Los comentarios deben ser el último recurso para explicar el "porqué"
 * de una decisión, no el "qué" está haciendo el código. El código debe
 * explicarse por sí mismo. El formateo, por otro lado, es la cortesía
 * visual que le debemos a nuestros compañeros.
 */
```

---

### 1. Malos Comentarios (Antipatrones)

Un mal comentario es aquel que ensucia, confunde o miente. Debemos evitarlos para no generar ruido visual.

- **Información redundante:** Comentar algo que el código ya dice claramente.
- **Divisores de código:** Usar banners gigantes para separar secciones (ej: `// --- FUNCIONES --- //`). Si necesitas esto, es que tu archivo es demasiado grande.
- **Comentarios que inducen a error:** Comentarios que no se actualizaron cuando el código cambió.
- **Código comentado:** Si no se usa, se borra. Para eso existe Git (el control de versiones).

#### ❌ Dirty Code

```javascript
// Variable para el nombre del usuario (REDUNDANTE)
let userName = "Alex";

// ///////////////////////////////////////////
// FUNCIONES DE BASE DE DATOS (DIVISOR INNECESARIO)
// ///////////////////////////////////////////

// Actualiza el email en la BD (ERROR: El código realmente borra)
function deleteUser(id) {
  db.remove(id);
}

// let oldTotal = calculateTotal(); (CÓDIGO MUERTO, DEBE BORRARSE)
```

#### ✅ Clean Code

```javascript
let userName = "Alex";

function deleteUser(id) {
  db.remove(id);
}
```

---

### 2. Buenos Comentarios (Cuándo sí comentar)

Existen situaciones donde un comentario aporta un valor real que el código no puede expresar por sí solo.

- **Información legal:** Licencias o Copyright al inicio del archivo.
- **Explicación de intención:** Como explicar una **Expresión Regular** compleja.
- **Warnings:** Advertir sobre consecuencias de cambiar una línea (ej: "No cambiar este timeout, causa lag en el servidor").
- **TODOs:** Notas sobre tareas pendientes (`// TODO: Refactorizar este bucle`).

#### ✅ Ejemplo de uso profesional

```javascript
/**
 * Copyright (c) 2026 Empresa XYZ.
 * Licensed under MIT.
 */

// Comprobamos si el formato es un email.
// Explicar regex es útil porque son difíciles de leer a simple vista.
const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

function processData() {
  // WARNING: No llamar a esta función más de 2 veces por segundo
  // para evitar el bloqueo de la API externa.
  api.call();
}

// TODO: Implementar validación de seguridad extra en el sprint 3
```

---

### 3. Code Formatting: Vertical y Horizontal

El formato organiza el código para que el ojo humano pueda escanearlo rápidamente.

- **Vertical Formatting:** Se refiere al orden de arriba hacia abajo (la estructura del archivo).
- **Horizontal Formatting:** Se refiere al ancho de las líneas y los espacios laterales.

---

### 4. Reglas del Vertical Formatting (Estructura de archivo)

1. **División en archivos:** No metas todo en un `app.js`. Separa las clases y funciones lógicas en archivos distintos.
2. **Líneas en blanco:** Úsalas como "puntos y aparte" en un libro. Separa bloques de lógica distintos.
3. **Densidad y Distancia:** Las variables usadas dentro de una función deben estar cerca de donde se usan. Los conceptos relacionados deben estar pegados.

#### ❌ Dirty Code

```javascript
class User {
  constructor(n) {
    this.n = n;
  }
  save() {
    db.save(this.n);
  }
}
const u = new User("Alex");
const p = 500;
u.save();
// (Todo está pegado, sin aire, mezclando instanciación con lógica)
```

#### ✅ Clean Code

```javascript
// 1. Los archivos deben ser pequeños y enfocados
class User {
  constructor(name) {
    this.name = name;
  }

  // 2. Línea en blanco para separar métodos
  save() {
    db.save(this.name);
  }
}

// 3. Conceptos relacionados cerca
const newUser = new User("Alex");
newUser.save();
```

---

### 5. Reglas del Horizontal Formatting (Estilo de línea)

1. **Indentación:** Es sagrada. Define la jerarquía (qué está dentro de qué).
2. **Longitud de línea:** Evita el scroll horizontal. Si una línea pasa de los 80-120 caracteres, divídela.
3. **Nombres breves pero descriptivos:** No uses `laVariableQueGuardaElNombreDelUsuarioQueSeRegistroAyer`, pero tampoco uses `x`.

#### ❌ Dirty Code

```javascript
function pagar(monto) {
  if (monto > 0) {
    const transaccionExitosa =
      api.procesarPagoMuyLargoYComplejoQueRequiereMuchosParametros(
        monto,
        "USD",
        true,
        "Tarjeta de Credito",
        "Token12345"
      );
    return transaccionExitosa;
  }
}
```

#### ✅ Clean Code

```javascript
function processPayment(amount) {
  // Indentación correcta con 4 espacios o 2
  if (amount > 0) {
    // Dividimos líneas excesivamente largas para legibilidad
    const isSuccess = api.callPaymentProcessor(amount, "USD", "CreditCard");

    return isSuccess;
  }
}
```

---

### Resumen Comparativo Final

| Característica  | Dirty Code                                 | Clean Code                                |
| --------------- | ------------------------------------------ | ----------------------------------------- |
| **Comentarios** | Explican el código obvio o mienten.        | Explican intención, advertencias o TODOs. |
| **Espacios**    | Código comprimido como un bloque.          | Uso de líneas en blanco para "respirar".  |
| **Archivos**    | Un solo archivo con 2000 líneas.           | Módulos pequeños y especializados.        |
| **Ancho**       | Líneas eternas que obligan a hacer scroll. | Líneas cortas y limpias.                  |

¿Te gustaría que revisemos algún fragmento de código que estés escribiendo para aplicar estas reglas de formateo y comentarios juntos?
