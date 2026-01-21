¡Hola! Es un gusto saludarte. Como experto en **React y TypeScript**, he preparado esta guía exhaustiva de **Next.js (App Router)**. Next.js ha transformado la forma en que construimos aplicaciones web, optimizando el rendimiento mediante el renderizado en el servidor por defecto.

A continuación, encontrarás la documentación estructurada para un nivel principiante-intermedio, con explicaciones profesionales y ejemplos prácticos.

---

## 1. Instalación de un proyecto Next.js

/_
Next.js se instala preferiblemente usando 'create-next-app'. Este comando configura
automáticamente TypeScript, ESLint, Tailwind CSS y la estructura de directorios.
_/

**Pasos:**

1. Abre tu terminal.
2. Ejecuta: `npx create-next-app@latest`
3. Responde a los prompts (se recomienda: TypeScript: Yes, ESLint: Yes, Tailwind: Yes, `src/` directory: No, **App Router: Yes**, Import alias: Yes).
4. Entra a la carpeta: `cd nombre-de-tu-proyecto`
5. Levanta el servidor: `npm run dev`

---

## 2. Server Components y el archivo `page.tsx`

/_
En el App Router, todos los componentes dentro de la carpeta 'app' son Server Components
por defecto. Esto significa que se renderizan en el servidor, reduciendo el JS enviado al cliente.
El archivo 'page.tsx' es el que hace que una ruta sea accesible públicamente.
_/

```tsx
// app/page.tsx
export default function HomePage() {
  // Este log se verá en la terminal de VS Code, NO en la consola del navegador
  console.log("Renderizando en el servidor...");

  return (
    <main>
      <h1>Bienvenido a mi App con Next.js</h1>
    </main>
  );
}
```

---

## 3. Enrutamiento y Archivos Especiales

/_
Next.js usa un sistema de archivos para definir rutas. Cada carpeta en 'app' es un segmento de ruta.
Existen archivos con nombres reservados que definen comportamientos específicos.
_/

- `page.tsx`: Contenido único de la ruta.
- `layout.tsx`: Estructura compartida (UI persistente).
- `loading.tsx`: Estado de carga (usa Suspense de React).
- `error.tsx`: Manejo de errores (debe ser Client Component).
- `not-found.tsx`: UI para errores 404.
- `route.ts`: Para crear APIs (HTTP Methods).

---

## 4. Navegación con el componente `Link`

/_
Para navegar entre páginas sin recargar el navegador (Single Page Application feel),
usamos el componente <Link>. Esto permite que Next.js precargue la página destino.
_/

```tsx
import Link from "next/link";

export default function Navbar() {
  return (
    <nav>
      {/* Navegación instantánea sin refresh de pantalla */}
      <Link href="/about">Sobre nosotros</Link>
      <Link href="/blog">Blog</Link>
    </nav>
  );
}
```

---

## 5. Root Layout y Layouts Anidados

/_
El Root Layout (`app/layout.tsx`) es el nivel más alto y envuelve a toda la aplicación.
Contiene las etiquetas <html> y <body>. Puedes crear layouts dentro de subcarpetas
para que solo afecten a esas rutas.
_/

```tsx
// app/layout.tsx (Root Layout)
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <header>Header Global</header>
        {/* Aquí se renderiza la página o layout activo */}
        {children}
      </body>
    </html>
  );
}
```

---

## 6. Organización de Componentes (Colocación)

/_
Puedes guardar componentes dentro de carpetas en 'app'. Mientras la carpeta NO
contenga un archivo 'page.tsx', no será una ruta accesible. Esto permite
"colocar" los componentes cerca de donde se usan.
_/

```text
app/
  components/
    Button.tsx  <-- No es una ruta, es solo un componente
  dashboard/
    page.tsx    <-- Ruta: /dashboard
    Chart.tsx   <-- Componente privado del dashboard

```

---

## 7. Rutas Dinámicas `[slug]`

/_
Para crear rutas basadas en datos (ej: id de producto), usamos corchetes.
El nombre dentro de los corchetes será la propiedad en el objeto 'params'.
_/

```tsx
// app/blog/[id]/page.tsx
// Recibimos 'params' como una Promise en versiones recientes de Next.js
export default async function BlogPost({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <h1>Viendo la publicación con ID: {id}</h1>;
}
```

---

## 8. El componente `Image`

/_
Optimiza imágenes automáticamente: lazy loading, cambio de tamaño y prevención de
Cumulative Layout Shift (CLS).
_/

```tsx
import Image from "next/image";

export default function Profile() {
  return (
    <div style={{ position: "relative", width: "300px", height: "200px" }}>
      <Image
        src="/avatar.png"
        alt="User Profile"
        fill // Ocupa el contenedor padre (requiere position relative en el padre)
        priority // Se carga inmediatamente (útil para imágenes Above the Fold)
        className="object-cover"
      />
    </div>
  );
}
```

---

## 9. Server vs Client Components ('use client')

/\*

- Server Components: Ideales para fetching de datos y seguridad. No usan hooks (useState, useEffect).
- Client Components: Se usan para interactividad y hooks. Se definen con 'use client'.
  \*/

```tsx
"use client"; // Indica que este componente se hidrata en el cliente

import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);

  return <button onClick={() => setCount(count + 1)}>Contador: {count}</button>;
}
```

---

## 10. `usePathname` para Rutas Activas

/_
Hook de cliente para saber en qué URL estamos. Útil para resaltar links activos en el menú.
_/

```tsx
"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function ActiveLink() {
  const pathname = usePathname(); // Devuelve ej: "/about"

  return (
    <Link href="/about" className={pathname === "/about" ? "active" : ""}>
      Acerca de
    </Link>
  );
}
```

---

## 11. Base de Datos con `better-sqlite3`

/_
Para proyectos locales rápidos, better-sqlite3 es excelente.
Instalación: npm install better-sqlite3
Tip: Instalar tipos si usas TS: npm install @types/better-sqlite3 -D
_/

```ts
// lib/db.ts
import sql from "better-sqlite3";

const db = sql("meals.db"); // Crea o abre el archivo de la DB

// Inicialización básica
db.prepare(
  `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT
  )
`
).run();

export default db;
```

---

## 12. Obtención de datos (Data Fetching) en Server Components

/_
Gracias a que Next.js permite componentes asíncronos, podemos consultar
la base de datos directamente en el componente sin usar APIs intermedias.
_/

```tsx
// app/users/page.tsx
import db from "@/lib/db";

export default function UsersPage() {
  // Consulta directa a la DB en el servidor
  const users = db.prepare("SELECT * FROM users").all();

  return (
    <ul>
      {users.map((user: any) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

---

## 13. Manejo de estados (Loading, Error, Not Found)

### Loading

/_ Se muestra automáticamente mientras el componente de la página hace fetch de datos. _/

```tsx
// app/loading.tsx
export default function Loading() {
  return <p>Cargando información...</p>;
}
```

### Error

/_ Captura errores en la ruta. DEBE ser un Client Component. _/

```tsx
"use client";
// app/error.tsx
export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div>
      <h2>¡Algo salió mal!</h2>
      <button onClick={() => reset()}>Reintentar</button>
    </div>
  );
}
```

### Not Found

/_ Se dispara con la función notFound() o cuando una ruta no existe. _/

```tsx
// app/not-found.tsx
export default function NotFound() {
  return <h2>Página no encontrada - 404</h2>;
}
```

---

## 14. `dangerouslySetInnerHTML`

/_ Se usa para renderizar HTML puro que viene de una fuente (como un CMS).
Es "peligroso" porque puede exponer a ataques XSS si el contenido no es seguro.
_/

```tsx
export default function HtmlRenderer({ content }: { content: string }) {
  return (
    <div
      // Se pasa un objeto con la propiedad __html
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
```

---

## 15. Ejemplo Final: Detalle con Params y DB

/_ Combinamos rutas dinámicas, obtención de datos y manejo de errores.
_/

```tsx
// app/products/[slug]/page.tsx
import db from "@/lib/db";
import { notFound } from "next/navigation";

export default async function ProductDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Buscamos en la DB el producto por su slug
  const product = db.prepare("SELECT * FROM products WHERE slug = ?").get(slug);

  // Si no existe, disparamos el archivo not-found.tsx
  if (!product) {
    notFound();
  }

  return (
    <article>
      <h1>{product.title}</h1>
      {/* Ejemplo de uso de dangerouslySetInnerHTML para la descripción */}
      <div dangerouslySetInnerHTML={{ __html: product.description }} />
    </article>
  );
}
```

¿Te gustaría que profundizara en cómo manejar formularios con **Server Actions** para insertar datos en esa base de datos de SQLite?
