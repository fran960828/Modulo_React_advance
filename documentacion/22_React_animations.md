¡Hola! Qué gusto saludarte. Como experto en React y TypeScript, te he preparado esta guía definitiva de **Framer Motion**. Esta librería es el estándar de oro para animaciones en React porque combina una potencia increíble con una API declarativa muy sencilla.

---

## 🚀 Guía Profesional de Framer Motion para Principiantes

### 1. ¿Qué es Framer Motion?

Es una librería de animaciones para React que permite crear interfaces fluidas y profesionales. A diferencia de las transiciones CSS tradicionales, Framer Motion entiende el ciclo de vida de los componentes de React, permitiendo animar elementos incluso cuando se desmontan del DOM.

### 2. El componente `motion`

Para animar cualquier elemento HTML (div, button, li), simplemente anteponemos la palabra `motion.`. Esto convierte la etiqueta en un "super componente" que acepta props especiales de animación.

```tsx
import { motion } from "framer-motion";

const SimpleBox = () => {
  // Sustituimos <div> por <motion.div> para habilitar las animaciones
  return <motion.div style={{ width: 100, height: 100, background: "blue" }} />;
};
```

---

### 3. Prop `animate` (x, y, rotate)

Es el corazón de la animación. Define el estado final o el estado activo del componente.

- **x / y:** Mueven el elemento en los ejes (pueden ser números en px o strings como "100%").
- **rotate:** Gira el elemento en grados.

```tsx
const AnimatedBox = () => (
  <motion.div
    animate={{
      x: 100, // Se mueve 100px a la derecha
      rotate: 45, // Rota 45 grados
      backgroundColor: "#ff0000", // Cambia el color
    }}
  />
);
```

---

### 4. Prop `transition` (duration, bounce, type)

Define _cómo_ llegamos del punto A al punto B.

- **type:** Puede ser `spring` (físico/elástico) o `tween` (basado en tiempo).
- **duration:** Tiempo en segundos.
- **bounce:** Nivel de rebote (solo con type: "spring").

```tsx
const SmoothBox = () => (
  <motion.div
    animate={{ x: 200 }}
    transition={{
      type: "spring",
      bounce: 0.5, // Hace que rebote al llegar
      duration: 1, // Tarda 1 segundo
    }}
  />
);
```

---

### 5. Ciclo de vida: `initial`, `animate` y `exit`

Este trío controla la entrada, el estado activo y la salida de un componente.

- **initial:** Estado antes de que el componente aparezca.
- **exit:** Estado al que el componente transiciona antes de ser eliminado del DOM.

### 6. `AnimatePresence` y Modales

Para que `exit` funcione, React necesita ayuda, ya que normalmente elimina el componente del DOM instantáneamente. `AnimatePresence` permite que Framer Motion mantenga el componente vivo hasta que la animación de salida termine.

```tsx
import { motion, AnimatePresence } from "framer-motion";

const Modal = ({ isOpen }: { isOpen: boolean }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }} // Aparece pequeño y transparente
        animate={{ opacity: 1, scale: 1 }} // Se vuelve visible y tamaño normal
        exit={{ opacity: 0, scale: 0.5 }} // Se desvanece al cerrar
        className="modal"
      >
        ¡Soy un Modal!
      </motion.div>
    )}
  </AnimatePresence>
);
```

---

### 7. Gestos: `whileHover`

Framer Motion detecta interacciones del usuario de forma nativa. Usar `stiffness` en un spring controla la "rigidez" del muelle.

```tsx
const HoverButton = () => (
  <motion.button
    whileHover={{ scale: 1.1 }} // Se agranda un 10% al pasar el mouse
    transition={{ type: "spring", stiffness: 400 }} // Animación muy rápida y firme
  >
    ¡Púlsame!
  </motion.button>
);
```

---

### 8. Variants y `staggerChildren`

Las **Variants** son objetos de configuración que permiten organizar tus animaciones y orquestar sub-elementos (hijos). `staggerChildren` hace que los hijos se animen uno tras otro con un retraso.

```tsx
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }, // El primer hijo sale, luego el 2º a los 0.2s...
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

const List = () => (
  <motion.ul variants={containerVariants} initial="hidden" animate="visible">
    <motion.li variants={itemVariants}>Item 1</motion.li>
    <motion.li variants={itemVariants}>Item 2</motion.li>
  </motion.ul>
);
```

---

### 9. Keyframes (Arrays en propiedades)

Si pasas un array a una propiedad, crearás una secuencia de valores (keyframes).

```tsx
const KeyframeBox = () => (
  <motion.div
    animate={{
      scale: [1, 1.5, 1.5, 1, 1], // Crece, se mantiene, encoge
      rotate: [0, 0, 270, 270, 0], // Gira en puntos específicos
    }}
    transition={{ duration: 2, repeat: Infinity }}
  />
);
```

---

### 10. `useAnimate` (Control Imperativo)

A veces necesitas disparar animaciones manualmente sin depender solo de props. `useAnimate` te da un control total mediante código.

```tsx
import { useAnimate } from "framer-motion";

const ManualControl = () => {
  const [scope, animate] = useAnimate(); // scope es la referencia al elemento padre

  const handleSequence = async () => {
    // Animamos elementos hijos especificando selectores CSS
    await animate("button", { x: 50 });
    await animate("p", { opacity: 1 }, { duration: 1 });
  };

  return (
    <div ref={scope}>
      <p style={{ opacity: 0 }}>Texto oculto</p>
      <button onClick={handleSequence}>Iniciar Secuencia</button>
    </div>
  );
};
```

---

### 11. `layout` y `layoutId`

- **layout:** Si el tamaño o posición de un elemento cambia (por ejemplo, al añadir ítems a una lista), `layout` hace que el cambio sea suave en lugar de un salto brusco.
- **layoutId:** Permite "pasar" un elemento de un componente a otro. Ideal para menús con subrayados que se mueven.

```tsx
const Tabs = ({ activeTab }: { activeTab: string }) => {
  return (
    <nav>
      {["A", "B", "C"].map((tab) => (
        <button key={tab}>
          {tab}
          {activeTab === tab && (
            // El subrayado se moverá suavemente entre pestañas gracias al layoutId
            <motion.div layoutId="underline" className="line" />
          )}
        </button>
      ))}
    </nav>
  );
};
```

---

### 12. `AnimatePresence` con `mode="wait"`

Evita que el contenido nuevo aparezca antes de que el viejo se haya ido, lo cual es vital para listas con mensajes de "No hay elementos".

```tsx
const ListManager = ({ items }: { items: string[] }) => (
  <AnimatePresence mode="wait">
    {items.length > 0 ? (
      <motion.ul key="list" exit={{ opacity: 0 }}>
        {items.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </motion.ul>
    ) : (
      <motion.p key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        La lista está vacía
      </motion.p>
    )}
  </AnimatePresence>
);
```

---

### 13. `useScroll` y `useTransform`

Permiten crear animaciones ligadas al desplazamiento del usuario. `useScroll` nos da el progreso (0 a 1) y `useTransform` mapea ese valor a otra propiedad (ej: opacidad).

```tsx
import { useScroll, useTransform, motion } from "framer-motion";

const ParallaxHeader = () => {
  const { scrollYProgress } = useScroll(); // Valor de 0 a 1 según el scroll

  // Cuando el scroll va de 0 a 0.5, la opacidad va de 1 a 0
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 2]);

  return (
    <motion.div style={{ opacity, scale }} className="header">
      ¡Haz scroll hacia abajo!
    </motion.div>
  );
};
```

---

¿Te gustaría que profundizáramos en cómo tipar correctamente las **Variants** con TypeScript para tener autocompletado total en tus proyectos?
