Esta es una guía profesional y detallada de **TanStack Query (React Query)** diseñada para que pases de nivel principiante a manejar estados de servidor de forma experta.

---

## 1. ¿Qué es React Query y por qué usarlo?

> **Comentario Inicial:** Imagina que el estado de tu aplicación se divide en dos: **Estado de Cliente** (formularios abiertos, filtros, temas oscuro/claro) y **Estado de Servidor** (datos que vienen de una DB). Tradicionalmente, usamos `useEffect` y un `useState` para traer datos, pero eso no gestiona caché, ni re-intentos, ni sincronización.

| Herramienta                 | Diferencia con React Query                                                                                                                                                      |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Custom Hook + useEffect** | Tienes que escribir manualmente la lógica de `loading`, `error` y evitar carreras de datos (_race conditions_). No hay caché compartida.                                        |
| **Redux Toolkit**           | Excelente para estado global complejo, pero muy verboso para simples peticiones API. React Query reemplaza a Redux en un 90% de las apps modernas al eliminar el "boilerplate". |
| **React Router**            | Gestiona la navegación. Aunque tiene `loaders`, React Query se complementa con él para ofrecer persistencia y caché de los datos que el router solicita.                        |

**¿Cuándo usarlo?** Siempre que tu app dependa de datos externos (API REST, GraphQL).

---

## 2. Instalación

Para empezar, necesitas el paquete principal:

```bash
npm install @tanstack/react-query
# Opcional pero recomendado para depurar:
npm install @tanstack/react-query-devtools

```

---

## 3. Configuración Inicial: QueryClient y Provider

Antes de usar los hooks, debemos envolver nuestra aplicación para que el "motor" de caché esté disponible.

```tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// 1. Creamos una instancia del cliente. Este contiene la caché.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Configuraciones globales por defecto
      retry: 1,
    },
  },
});

export function App() {
  return (
    // 2. Proveemos el cliente a toda la aplicación
    <QueryClientProvider client={queryClient}>
      <MyComponent />
    </QueryClientProvider>
  );
}
```

---

## 4. Consumo de datos: `useQuery`

Este hook se usa para **leer** datos (peticiones GET).

### Conceptos clave:

- **queryKey**: Un array que identifica de forma única la petición en la caché (ej: `['users', userId]`).
- **queryFn**: La función asíncrona que devuelve los datos (fetch/axios).
- **staleTime**: Tiempo (ms) que el dato se considera "fresco". Mientras sea fresco, no volverá a pedirlo al servidor.
- **gcTime** (antes cacheTime): Tiempo que el dato permanece en memoria antes de ser borrado tras quedar inactivo.
- **enabled**: Booleano para pausar la ejecución (ej: no pedir datos hasta tener un ID).
- **signal**: Aborta la petición automáticamente si el componente se desmonta o la query se cancela.

### Ejemplo de uso:

```tsx
import { useQuery } from "@tanstack/react-query";

const fetchUser = async ({ signal }: { signal: AbortSignal }) => {
  const res = await fetch("https://api.example.com/user", { signal });
  if (!res.ok) throw new Error("Error en la red");
  return res.json();
};

function UserProfile() {
  // Extraemos variables de estado:
  // - data: los datos si tuvo éxito
  // - isPending: está cargando por primera vez (no hay datos en caché)
  // - isError/error: información de fallo
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
    staleTime: 1000 * 60 * 5, // 5 minutos de datos frescos
    gcTime: 1000 * 60 * 10, // 10 minutos en caché
  });

  if (isPending) return <span>Cargando...</span>;
  if (isError) return <span>Error: {error.message}</span>;

  return <div>{data.name}</div>;
}
```

> **Nota sobre `isLoading` vs `isPending`:**
> En versiones recientes, `isPending` significa que no hay datos y está cargando. `isLoading` es equivalente en el uso básico, pero `isPending` es el término estándar actual para referirse a la ausencia de datos iniciales.

---

## 5. Modificación de datos: `useMutation`

Se usa para **crear, actualizar o borrar** (POST, PUT, DELETE).

### Ejemplo con Actualización Optimista (Optimistic Update)

Esta es la técnica profesional donde actualizamos la UI **antes** de que el servidor responda, para que la app se sienta instantánea.

```tsx
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface Todo {
  id: number;
  text: string;
}

function TodoEditor() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newTodo: Todo) => {
      return fetch("/api/todos", {
        method: "POST",
        body: JSON.stringify(newTodo),
      });
    },
    // Se ejecuta ANTES de la petición al servidor
    onMutate: async (newTodo) => {
      // 1. Cancelamos peticiones en curso para que no sobreescriban nuestra actualización
      await queryClient.cancelQueries({ queryKey: ["todos"] });

      // 2. Guardamos el estado previo por si hay que revertir (Snapshot)
      const previousTodos = queryClient.getQueryData<Todo[]>(["todos"]);

      // 3. Actualizamos la caché manualmente (Optimista)
      queryClient.setQueryData(["todos"], (old: Todo[]) => [
        ...(old || []),
        newTodo,
      ]);

      // 4. Retornamos el contexto con el valor previo
      return { previousTodos };
    },
    // Si la petición falla, usamos el contexto para revertir
    onError: (err, newTodo, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(["todos"], context.previousTodos);
      }
    },
    // Se ejecuta al terminar (éxito o error)
    onSettle: () => {
      // Invalidamos para sincronizar con el servidor real
      queryClient.invalidateQueries({
        queryKey: ["todos"],
        exact: true, // Solo esta key exacta
        refetchType: "active", // Solo los componentes que se ven en pantalla
      });
    },
  });

  return (
    <button
      onClick={() => mutation.mutate({ id: Date.now(), text: "Nueva tarea" })}
    >
      {mutation.isPending ? "Guardando..." : "Añadir tarea"}
    </button>
  );
}
```

---

## 6. Integración con React Router (Loaders)

Para evitar el "salto" de carga al navegar, podemos pre-cargar los datos usando `fetchQuery`.

```tsx
// En tu archivo de rutas
export const userLoader =
  (queryClient: QueryClient) =>
  async ({ params }: any) => {
    const queryKey = ["user", params.id];

    // fetchQuery devuelve los datos si están en caché o hace el fetch si no.
    return (
      queryClient.getQueryData(queryKey) ??
      (await queryClient.fetchQuery({
        queryKey,
        queryFn: () => fetchUserById(params.id),
      }))
    );
  };
```

---

## 7. Global Loading con `useIsFetching`

Si quieres mostrar una barra de progreso global cada vez que haya CUALQUIER petición de fondo.

```tsx
import { useIsFetching } from "@tanstack/react-query";

function GlobalLoader() {
  // Devuelve un número > 0 si hay alguna query cargando
  const isFetching = useIsFetching();

  return isFetching ? (
    <div className="progress-bar">Cargando datos en segundo plano...</div>
  ) : null;
}
```

---

¡Excelente iniciativa! Para dominar **TanStack Query** a nivel profesional, no basta con saber hacer un `fetch`. Necesitas entender cómo manejar grandes volúmenes de datos, cómo optimizar el rendimiento y cómo mejorar la experiencia de usuario en condiciones de red inestables.

Aquí tienes la continuación de la documentación con conceptos avanzados.

---

## 1. `useInfiniteQuery` (Scroll Infinito y Paginación)

> **Comentario Inicial:** Cargar miles de registros a la vez es inviable para el rendimiento. `useInfiniteQuery` permite cargar "páginas" de datos de forma secuencial, gestionando automáticamente qué página sigue y acumulando los resultados en una sola estructura.

```tsx
import { useInfiniteQuery } from "@tanstack/react-query";

const fetchPosts = async ({ pageParam = 1 }) => {
  const res = await fetch(`https://api.example.com/posts?page=${pageParam}`);
  return res.json(); // Supongamos que devuelve { data: [...], nextCursor: 2 }
};

function InfinitePosts() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["posts"],
      queryFn: fetchPosts,
      initialPageParam: 1,
      // Lógica para determinar cuál es la siguiente página
      getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    });

  return (
    <div>
      {/* data.pages es un array de arrays (un array por cada petición) */}
      {data?.pages.map((group, i) => (
        <div key={i}>
          {group.data.map((post: any) => (
            <p key={post.id}>{post.title}</p>
          ))}
        </div>
      ))}

      <button
        onClick={() => fetchNextPage()}
        disabled={!hasNextPage || isFetchingNextPage}
      >
        {isFetchingNextPage
          ? "Cargando más..."
          : hasNextPage
          ? "Cargar más"
          : "No hay más"}
      </button>
    </div>
  );
}
```

---

## 2. Prefetching (Anticiparse al Usuario)

> **Comentario Inicial:** El Prefetching consiste en descargar datos antes de que el usuario los necesite (por ejemplo, al pasar el ratón sobre un enlace). Esto hace que la navegación parezca instantánea porque los datos ya están en la caché.

```tsx
function Navigation() {
  const queryClient = useQueryClient();

  const prefetchUser = async (id: string) => {
    // Los datos se guardan en caché pero no marcan el componente como cargando
    await queryClient.prefetchQuery({
      queryKey: ["user", id],
      queryFn: () => fetchUser(id),
      staleTime: 5000, // Considerar fresco por 5 segundos
    });
  };

  return <button onMouseEnter={() => prefetchUser("123")}>Ver Perfil</button>;
}
```

---

## 3. Selectors (Transformación de Datos)

> **Comentario Inicial:** A veces la API devuelve un objeto enorme, pero tú solo necesitas una propiedad. Usar `select` permite transformar o filtrar los datos **antes** de que lleguen a tu componente, y lo mejor: si el resto del objeto cambia pero tu selección no, el componente **no se re-renderiza**.

```tsx
const { data: userNames } = useQuery({
  queryKey: ["users"],
  queryFn: fetchUsers,
  // Transformamos el array de objetos en un array de strings
  select: (users) => users.map((user) => user.name),
});
```

---

## 4. Query Filters e Invalidación Masiva

> **Comentario Inicial:** En aplicaciones grandes, necesitas limpiar la caché de forma selectiva. Los filtros te permiten invalidar solo las queries que cumplen ciertos criterios (como todas las que empiecen por una key o las que estén inactivas).

```tsx
const queryClient = useQueryClient();

const handleLogout = () => {
  // Invalida absolutamente todas las queries de la caché
  queryClient.invalidateQueries();

  // Invalida solo las que empiecen por ['dashboard']
  queryClient.invalidateQueries({ queryKey: ["dashboard"] });

  // Invalida solo las que NO se están usando actualmente en pantalla
  queryClient.invalidateQueries({ type: "inactive" });
};
```

---

## 5. Persist Query Client (Persistencia en LocalStorage)

> **Comentario Inicial:** Por defecto, si refrescas la página, la caché de React Query desaparece. Para apps que funcionan offline o quieren carga instantánea tras refrescar, usamos el persistente.

```tsx
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";

const queryClient = new QueryClient();

// Configuramos dónde se guardará la caché
const localStoragePersister = createSyncStoragePersister({
  storage: window.localStorage,
});

// Conectamos el cliente con el almacenamiento
persistQueryClient({
  queryClient,
  persister: localStoragePersister,
});
```

---

## 6. Placeholder Data vs Initial Data

> **Comentario Inicial:** > - **Initial Data:** Datos que ya tienes y se consideran "reales" (vienen de la caché).
>
> - **Placeholder Data:** Datos "de relleno" (como un esqueleto o datos falsos) que se muestran mientras se cargan los de verdad, pero no se guardan en la caché de forma permanente.

```tsx
const { data } = useQuery({
  queryKey: ["blog", id],
  queryFn: () => fetchPost(id),
  // Mostramos esto mientras carga, pero no se trata como dato real
  placeholderData: { title: "Cargando título...", body: "..." },
});
```

---

## 7. Retry y RetryDelay (Manejo de Errores)

> **Comentario Inicial:** En producción, las peticiones fallan por micro-cortes. React Query reintenta 3 veces por defecto, pero puedes personalizar el comportamiento según el tipo de error (ej: no reintentar si es un 404).

```tsx
const { data } = useQuery({
  queryKey: ["data"],
  queryFn: fetchData,
  retry: (failureCount, error: any) => {
    // No reintentar si el servidor dice que el recurso no existe
    if (error.status === 404) return false;
    // Reintentar máximo 5 veces para otros errores
    return failureCount < 5;
  },
  // Espera exponencial: 1s, 2s, 4s...
  retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
});
```

---

## 8. Network Mode (Offline First)

> **Comentario Inicial:** React Query es inteligente con la conexión. El `networkMode` determina qué hacer si el usuario pierde internet.

- `online`: (Por defecto) No lanza la petición si no hay red y la pone en "pausa".
- `always`: Lanza la petición aunque parezca que no hay red (útil si usas Service Workers).
- `offlineFirst`: Intenta la petición y, si falla por red, activa los reintentos automáticos cuando la conexión vuelva.

```tsx
const { data } = useQuery({
  queryKey: ["status"],
  queryFn: fetchStatus,
  networkMode: "offlineFirst",
});
```

---

### Resumen de Buenas Prácticas Profesionales:

1. **Centraliza tus Query Keys:** Usa un objeto constante para evitar errores de dedo: `export const USER_KEYS = { all: ['users'] as const, detail: (id: string) => ['users', id] as const };`
2. **Aborta peticiones:** Pasa siempre el `signal` a tus funciones fetch para ahorrar ancho de banda.
3. **Usa DevTools:** Mantén abierta la pestaña de React Query DevTools para inspeccionar el estado de tus queries en tiempo real.

Es importante empezar con una pequeña aclaración técnica de experto: En las versiones más recientes de TanStack Query (v5 en adelante), el callback `onSuccess` **se ha eliminado de `useQuery**`, pero sigue siendo perfectamente válido y fundamental dentro de **`useMutation`\*\*.

> **Comentario Inicial:** El parámetro `onSuccess` es un "disparador" (trigger). Se utiliza para ejecutar código justo después de que una mutación se completa correctamente. Su uso más común a nivel profesional es para **invalidar cachés** (avisar que los datos viejos ya no sirven) o para **redireccionar** al usuario tras completar una acción (como crear un post).

---

### Ejemplo: Creación de un producto con redirección e invalidación

En este ejemplo, cuando el usuario crea un producto, queremos que ocurran tres cosas si todo sale bien:

1. Limpiar la caché de la lista de productos (para que se vea el nuevo).
2. Mostrar una alerta de éxito.
3. Navegar a la página principal.

```tsx
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

// Función que simula la petición a la API
const createProduct = async (newProduct: { name: string; price: number }) => {
  const res = await fetch("https://api.example.com/products", {
    method: "POST",
    body: JSON.stringify(newProduct),
  });
  if (!res.ok) throw new Error("Error al crear producto");
  return res.json();
};

function CreateProductForm() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: createProduct,

    // El callback onSuccess recibe:
    // - data: Lo que devolvió el servidor
    // - variables: Los datos que enviaste tú (el producto)
    // - context: El estado previo si usaste onMutate
    onSuccess: (data, variables) => {
      // 1. Invalidamos la query de 'products' para que React Query
      // haga un fetch automático de la lista actualizada.
      queryClient.invalidateQueries({ queryKey: ["products"] });

      // 2. Feedback visual
      alert(`Producto "${variables.name}" creado con éxito con ID: ${data.id}`);

      // 3. Redirección profesional
      navigate("/products");
    },

    onError: (error) => {
      console.error("Hubo un error:", error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ejecutamos la mutación
    mutate({ name: "Monitor 4K", price: 300 });
  };

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit" disabled={isPending}>
        {isPending ? "Guardando..." : "Crear Producto"}
      </button>
    </form>
  );
}
```

---

Esta es una de las integraciones más potentes en el ecosistema actual de React. Combinar **Actions de React Router** con **React Query** permite que tu aplicación maneje las mutaciones de forma estandarizada (usando formularios nativos o el componente `<Form>`) mientras aprovechas la potente caché de TanStack Query.

> **Comentario Inicial:** La filosofía aquí es que el **Action** de React Router se encarga de "la intención" de modificar datos (capturar el FormData y enviarlo), mientras que **React Query** actúa como el orquestador de la caché. Al usar `queryClient.invalidateQueries()` dentro del Action, obligas a React Router a re-ejecutar los `loaders` activos, manteniendo la UI perfectamente sincronizada.

---

### Ejemplo: Gestión de un Post (POST, PUT, DELETE)

En este ejemplo, configuraremos un Action que detecta el método HTTP y actúa en consecuencia, integrándose con el `queryClient`.

#### 1. Definición del Action Unificado

```tsx
import { redirect } from "react-router-dom";
import { QueryClient } from "@tanstack/react-query";

// Pasamos el queryClient como argumento al Action
export const postAction =
  (queryClient: QueryClient) =>
  async ({ request, params }: any) => {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    const method = request.method; // POST, PUT o DELETE

    let url = "https://api.example.com/posts";
    if (params.id) url += `/${params.id}`;

    // 1. Ejecutamos la petición asíncrona
    const response = await fetch(url, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: method !== "DELETE" ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) throw new Error("Error al procesar la acción");

    // 2. LA CLAVE: Invalidamos las queries relacionadas en React Query
    // Esto asegura que cualquier componente escuchando 'posts' se refresque
    await queryClient.invalidateQueries({ queryKey: ["posts"] });

    // 3. Redireccionamos tras el éxito (comportamiento estándar de Router)
    return redirect("/posts");
  };
```

#### 2. Configuración en la Ruta

```tsx
// App.tsx o router.tsx
const router = createBrowserRouter([
  {
    path: "/posts/:id/edit",
    element: <EditPostPage />,
    // Inyectamos el queryClient en el action
    action: postAction(queryClient),
  },
  {
    path: "/posts/new",
    element: <NewPostPage />,
    action: postAction(queryClient),
  },
]);
```

#### 3. El Componente (Uso de `<Form>`)

Aquí no necesitas `useMutation` explícitamente en el componente, ya que React Router se encarga del ciclo de vida del envío.

```tsx
import { Form, useNavigation } from "react-router-dom";

function EditPostPage({ post }: { post: any }) {
  const navigation = useNavigation();

  // Verificamos si se está enviando el formulario para feedback visual
  const isSubmitting = navigation.state === "submitting";

  return (
    <div>
      <h2>Editar Post</h2>
      {/* El componente Form de react-router-dom dispara el action automáticamente */}
      <Form method="put">
        <input type="text" name="title" defaultValue={post?.title} required />
        <textarea name="content" defaultValue={post?.content} />

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Guardando..." : "Actualizar"}
        </button>
      </Form>

      {/* Ejemplo de botón de borrar en el mismo u otro formulario */}
      <Form method="delete" style={{ marginTop: "10px" }}>
        <button type="submit" style={{ color: "red" }}>
          Eliminar Post
        </button>
      </Form>
    </div>
  );
}
```

---

### ¿Por qué esta combinación es profesional?

1. **Sincronización Automática:** React Router, al terminar un Action, automáticamente re-ejecuta los `loaders` de las rutas activas. Si a esto le sumas `invalidateQueries`, garantizas que la caché de React Query y la UI de Router estén siempre en la misma página.
2. **Manejo de Errores Nativo:** Si el Action lanza un error, React Router lo captura y muestra el `errorElement` de la ruta, sin necesidad de estados `isError` manuales en cada componente.
3. **Progresive Enhancement:** El componente `<Form>` funciona incluso si el JS es lento en cargar (en aplicaciones SSR), lo cual es una excelente práctica de UX y accesibilidad.

¿Te gustaría que viéramos cómo manejar la **validación de errores del servidor** (como errores 400) para mostrarlos dentro del formulario usando `useActionData`?
