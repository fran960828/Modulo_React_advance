## 📘 Guía Profesional: React + TypeScript

### 1. El dilema de `React.FC`

> **Comentario:** `React.FC` (o `FunctionComponent`) es un tipo genérico que se usa para definir componentes funcionales. Aunque fue muy popular, hoy en día hay un debate sobre su uso. Su principal ventaja es que tipa automáticamente el retorno y provee validación para las `props`. Sin embargo, ya no incluye implícitamente `children`, lo que obliga a ser explícito (algo bueno en TS).

#### Ejemplo de uso profesional:

```tsx
import React from "react";

// 1. Definimos la interfaz de las "Props" (qué datos recibe el componente)
interface WelcomeProps {
  name: string;
  age?: number; // El '?' indica que es opcional
  children: React.ReactNode; // Obligatorio definirlo si vas a envolver contenido
}

// 2. Usamos React.FC con el genérico <WelcomeProps>
const Welcome: React.FC<WelcomeProps> = ({ name, age, children }) => {
  return (
    <div>
      <h1>Hola, {name}!</h1>
      {age && <p>Tienes {age} años.</p>}
      <div>{children}</div>
    </div>
  );
};

export default Welcome;
```

---

### 2. Hooks Esenciales y su Tipificación

> **Comentario:** En TypeScript, la mayoría de los hooks infieren el tipo automáticamente si les das un valor inicial. El reto aparece cuando el valor inicial es `null`, un array vacío o un objeto complejo.

#### `useState` y `useRef`

```tsx
import { useState, useRef, useEffect } from "react";

interface User {
  id: number;
  username: string;
}

const UserProfile = () => {
  // Tipado de useState: Usamos <User | null> porque empieza vacío
  const [user, setUser] = useState<User | null>(null);

  // Tipado de useRef: Para elementos del DOM usamos el tipo específico (HTMLInputElement)
  const inputRef = useRef<HTMLInputElement>(null);

  const handleLogin = () => {
    // Si el input existe, accedemos a su valor de forma segura
    if (inputRef.current) {
      setUser({ id: 1, username: inputRef.current.value });
    }
  };

  return (
    <div>
      <input ref={inputRef} type="text" placeholder="Tu nombre" />
      <button onClick={handleLogin}>Loguear</button>
      {user && <p>Bienvenido: {user.username}</p>}
    </div>
  );
};
```

---

### 3. Librerías del Ecosistema (Nivel Profesional)

#### A. React Router Dom (Navegación)

> **Comentario:** Aquí lo más importante es tipar los parámetros de la URL (`useParams`) para evitar errores al intentar acceder a IDs que TS cree que no existen.

```tsx
import { useParams, useNavigate, NavigateFunction } from "react-router-dom";

// Definimos la forma de los parámetros de la ruta
type RouteParams = {
  productId: string;
};

const ProductDetail = () => {
  // Le pasamos el tipo al hook para que reconozca 'productId'
  const { productId } = useParams<RouteParams>();
  const navigate: NavigateFunction = useNavigate();

  return (
    <div>
      <h2>Viendo producto: {productId}</h2>
      <button onClick={() => navigate("/home")}>Volver</button>
    </div>
  );
};
```

#### B. TanStack Query (Gestión de Estado Asíncrono)

> **Comentario:** Es la librería estándar para fetching. Lo vital es tipar la respuesta de la función fetcher para que el `data` que devuelve el hook sea reconocido en todo el componente.

```tsx
import { useQuery } from "@tanstack/react-query";

interface Todo {
  id: number;
  title: string;
}

const TodoList = () => {
  // useQuery<TipoDeDato, TipoDeError>
  const { data, isLoading, isError } = useQuery<Todo[]>({
    queryKey: ["todos"],
    queryFn: async () => {
      const res = await fetch("https://jsonplaceholder.typicode.com/todos");
      return res.json();
    },
  });

  if (isLoading) return <span>Cargando...</span>;

  return (
    <ul>
      {data?.map((todo) => (
        <li key={todo.id}>{todo.title}</li>
      ))}
    </ul>
  );
};
```

#### C. Redux Toolkit (Estado Global)

> **Comentario:** En Redux, la clave no es tipar cada componente, sino configurar bien el "Store" para que los hooks `useDispatch` y `useSelector` sepan exactamente qué hay en tu estado global.

```tsx
// 1. Configuración del Store (store.ts)
import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CounterState {
  value: number;
}

const initialState: CounterState = { value: 0 };

const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    // Usamos PayloadAction para tipar lo que recibe la acción
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
  },
});

export const store = configureStore({
  reducer: { counter: counterSlice.reducer },
});

// 2. Tipos cruciales para el resto de la app
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// 3. Uso en componente (se recomienda crear hooks personalizados)
import { useSelector, useDispatch } from "react-redux";

const Counter = () => {
  const count = useSelector((state: RootState) => state.counter.value);
  const dispatch = useDispatch<AppDispatch>();

  return (
    <button onClick={() => dispatch(counterSlice.actions.incrementByAmount(5))}>
      Sumar 5 (Total: {count})
    </button>
  );
};
```

---

### Resumen de Mejores Prácticas

1. **Interfaces vs Types:** Usa `interface` para objetos y props (por su capacidad de extensión) y `type` para uniones o alias simples.
2. **No uses `any`:** Es el enemigo. Si no sabes el tipo, usa `unknown` y valida con un `if`.
3. **Inferencia:** Si TypeScript ya sabe que `const x = 5` es un `number`, no necesitas poner `: number`. Deja que el lenguaje trabaje por ti.

¿Te gustaría que profundizara en cómo configurar los **Hooks personalizados de Redux** para no tener que importar `RootState` en cada archivo?
