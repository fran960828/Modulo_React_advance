¡Hola! Como experto en React y TypeScript, he preparado esta guía técnica diseñada para llevarte desde los conceptos básicos hasta una implementación profesional de autenticación.

---

## 🔐 Guía Profesional: Autenticación en React con TypeScript

> **Nota para principiantes:** La autenticación es el proceso de verificar quién es un usuario, mientras que la autorización es decidir qué puede hacer ese usuario. En aplicaciones modernas de React (SPAs), el estándar es delegar la responsabilidad de "recordar" al usuario al navegador mediante tokens.

---

### 1. ¿Cómo funciona la Autenticación?

La autenticación es un flujo de intercambio de credenciales. El cliente envía datos (email/password), el servidor los valida y devuelve una "llave" (token o sesión) que el cliente debe presentar en cada petición futura para demostrar su identidad.

---

### 2. Server-side Session vs. Authentication Tokens

| Método                  | Funcionamiento                                                                         | Uso en React                                                                        |
| ----------------------- | -------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| **Server-side Session** | El servidor guarda la sesión en base de datos y envía una `cookie` de ID al navegador. | Menos común en SPAs puras; el servidor gestiona el estado.                          |
| **Auth Tokens (JWT)**   | El servidor genera un token firmado (JSON Web Token) que el cliente guarda.            | **Estándar en React**. El cliente es responsable de enviar el token en los headers. |

---

### 3. Query Parameters (`?mode=signup`)

Se utilizan para pasar estados opcionales a través de la URL. Son muy útiles para alternar entre formularios de Login y Registro en una misma página.

```tsx
// Ejemplo: Navegar cambiando el modo
import { Link } from "react-router-dom";

const AuthNavigation = () => {
  return (
    <div>
      {/* Añadimos el parámetro 'mode' a la URL */}
      <Link to="?mode=login">Ir a Login</Link>
      <Link to="?mode=signup">Crear cuenta</Link>
    </div>
  );
};
```

---

### 4. Uso de `useSearchParams`

Este hook de `react-router-dom` permite leer y modificar los parámetros de búsqueda de la URL de forma sencilla.

```tsx
import { useSearchParams } from "react-router-dom";

export const AuthPage = () => {
  // searchParams funciona similar a un Map de JS
  const [searchParams] = useSearchParams();

  // Extraemos el valor de 'mode'. Si no existe, por defecto es 'login'
  const isLogin = searchParams.get("mode") === "login";

  return <h1>{isLogin ? "Iniciar Sesión" : "Registrarse"}</h1>;
};
```

---

### 5. Extracción de Token en `action` y `localStorage`

En React Router profesional, usamos `actions` para manejar el envío de formularios. Aquí recibimos el token del backend y lo persistimos.

```tsx
import { redirect } from "react-router-dom";

export async function action({ request }: { request: Request }) {
  const data = await request.formData();
  const authData = Object.fromEntries(data);

  const response = await fetch("https://api.ejemplo.com/login", {
    method: "POST",
    body: JSON.stringify(authData),
  });

  if (!response.ok) throw new Error("Error en login");

  const resData = await response.json();
  const token = resData.token; // Suponiendo que el backend responde { token: '...' }

  // Guardamos el token para que persista al recargar la página
  localStorage.setItem("token", token);

  // Guardamos la hora de creación para la expiración (opcional)
  localStorage.setItem("expiration", new Date().toISOString());

  return redirect("/");
}
```

---

### 6. Adición del Token en Headers

Para acceder a rutas protegidas en el backend, debemos adjuntar el token en el estándar **Bearer Token**.

```tsx
export async function getProtectedData() {
  const token = localStorage.getItem("token");

  const response = await fetch("https://api.ejemplo.com/profile", {
    headers: {
      "Content-Type": "application/json",
      // Incluimos el token en las cabeceras de autorización
      Authorization: `Bearer ${token}`,
    },
  });

  return response.json();
}
```

---

### 7. Componente de Logout

Cerrar sesión implica limpiar los datos de identificación y redirigir al usuario.

```tsx
import { redirect } from "react-router-dom";

// No es un componente visual, es una acción lógica
export function action() {
  // Eliminamos los datos del almacenamiento
  localStorage.removeItem("token");
  localStorage.removeItem("expiration");

  // Redirigimos al inicio
  return redirect("/");
}

// En el componente de UI:
// <Form action="/logout" method="post"><button>Cerrar Sesión</button></Form>
```

---

### 8. Protección de Rutas (Route Protection)

Para evitar que un usuario entre a `/admin` escribiendo la URL, usamos un `loader` que verifique el token antes de renderizar la página.

```tsx
import { redirect } from "react-router-dom";

// Esta función se añade a la ruta en el Router (checkAuthLoader)
export function checkAuthLoader() {
  const token = localStorage.getItem("token");

  // Si no hay token, bloqueamos el acceso y mandamos a login
  if (!token) {
    return redirect("/auth?mode=login");
  }

  return null; // Permite el acceso
}

// Uso en App.tsx:
// { path: 'admin', element: <AdminPage />, loader: checkAuthLoader }
```

---

### 9. Expiración Automática del Token

Es vital por seguridad. Si el token expira (ej. en 1 hora), debemos forzar el logout.

```tsx
import { useEffect } from "react";
import { useSubmit, useRouteLoaderData } from "react-router-dom";

export const RootLayout = () => {
  const token = useRouteLoaderData("root"); // Obtenemos el token actual
  const submit = useSubmit();

  useEffect(() => {
    if (!token) return;

    // Si el token es 'EXPIRED', forzamos logout inmediato
    if (token === "EXPIRED") {
      submit(null, { action: "/logout", method: "post" });
      return;
    }

    // Calculamos cuánto tiempo falta (ejemplo: 1 hora = 3600000ms)
    const duration = 3600000;

    setTimeout(() => {
      // Al cumplirse el tiempo, ejecutamos la acción de logout automáticamente
      submit(null, { action: "/logout", method: "post" });
    }, duration);
  }, [token, submit]);

  return <main>Contenido de la App</main>;
};
```

¿Te gustaría que profundicemos en cómo crear un Provider de React para gestionar el estado global del usuario de forma más eficiente?
