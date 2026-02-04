¡Hola! Qué buen combo tecnológico has elegido. **React Hook Form** y **Zod** son, hoy por hoy, el estándar de oro en el desarrollo profesional con React.

Esta dupla te permite manejar formularios complejos sin que tu aplicación pierda rendimiento (evitando re-renders innecesarios) y asegurando que los datos sean válidos antes de siquiera tocarlos.

Aquí tienes la guía definitiva para dominar estos conceptos.

---

## 1. Instalación de Dependencias

Para empezar, necesitamos el motor de formularios, la librería de validación y el "puente" que los comunica.

```bash
npm install react-hook-form zod @hookform/resolvers

```

> **Nota Pro:** `@hookform/resolvers` es esencial porque React Hook Form no sabe validar por sí solo; necesita este paquete para entender las reglas que definiremos en Zod.

---

## 2. Definición del Schema con Zod

Zod nos permite crear un **contrato de datos**. Definimos cómo debe lucir la información y qué reglas debe cumplir. Es mucho más potente que las validaciones manuales de HTML.

```typescript
import { z } from "zod";

/**
 * EXPLICACIÓN:
 * El 'schema' es un objeto que define la forma de tus datos.
 * - .string(): Obliga a que el valor sea texto.
 * - .min() / .max(): Define límites de caracteres con mensajes de error personalizados.
 * - .email(): Valida automáticamente el formato de correo electrónico.
 */

export const registerSchema = z
  .object({
    nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    email: z.string().email("Formato de correo inválido"),
    password: z
      .string()
      .min(6, "La contraseña debe tener al menos 6 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    // .refine() se usa para validaciones personalizadas entre campos
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"], // Indica dónde se mostrará el error
  });
```

---

## 3. Inferencia de Tipos con `z.infer`

Una de las mayores ventajas de usar TypeScript con Zod es que no tienes que escribir las `interfaces` a mano. Zod puede "leer" tu esquema y crear el tipo por ti.

```typescript
/**
 * EXPLICACIÓN:
 * z.infer extrae automáticamente el tipo de TypeScript del esquema de Zod.
 * Si mañana cambias el esquema, el tipo 'UserType' se actualizará solo.
 */

export type UserFormData = z.infer<typeof registerSchema>;

// Ahora UserFormData es equivalente a:
// interface UserFormData { nombre: string; email: string; ... }
```

---

## 4. Uso de `useForm` con Resolver

Aquí es donde ocurre la magia. Conectamos nuestro esquema de Zod con el hook de React Hook Form.

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

/**
 * EXPLICACIÓN:
 * useForm es el hook principal. Le pasamos el 'resolver' para que
 * use nuestras reglas de Zod.
 * - register: Función para conectar inputs nativos.
 * - handleSubmit: Función que procesa el formulario si es válido.
 * - formState.errors: Objeto que contiene los errores de validación en tiempo real.
 */

const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm<UserFormData>({
  resolver: zodResolver(registerSchema), // Conexión Zod -> React Hook Form
  defaultValues: {
    nombre: "",
    email: "",
    password: "",
    confirmPassword: "",
  },
});
```

---

## 5. El componente `Controller`

A veces usamos librerías de componentes (como MUI, Ant Design o Selects personalizados) que no exponen un `ref` de manera sencilla. Para ellos, usamos el `Controller`.

```tsx
import { Controller, Control } from "react-hook-form";

/**
 * EXPLICACIÓN:
 * Controller actúa como un intermediario. Envuelve a componentes externos
 * y les inyecta el valor y la función de cambio (onChange) necesaria para
 * que React Hook Form los controle sin problemas.
 */

// Ejemplo de uso dentro del JSX:
<Controller
  name="nombre"
  control={control} // Viene de useForm
  render={({ field }) => <input {...field} placeholder="Tu nombre aquí" />}
/>;
```

---

## Ejemplo Completo y Profesional

Aquí tienes todo unido en un solo archivo funcional.

```tsx
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// 1. Definimos el esquema
const schema = z
  .object({
    nombre: z.string().min(2, "Nombre muy corto"),
    email: z.string().email("Email inválido"),
    password: z.string().min(6, "Mínimo 6 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "No coinciden",
    path: ["confirmPassword"],
  });

// 2. Inferimos el tipo
type FormInputs = z.infer<typeof schema>;

export const RegistroForm = () => {
  // 3. Inicializamos el hook
  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormInputs>({
    resolver: zodResolver(schema),
  });

  // 4. Función que se ejecuta solo si los datos son válidos
  const onSubmit = (data: FormInputs) => {
    console.log("Datos enviados:", data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{ display: "flex", flexDirection: "column", gap: "10px" }}
    >
      {/* Ejemplo con register (Inputs nativos) */}
      <div>
        <label>Email:</label>
        <input {...register("email")} />
        {errors.email && <p style={{ color: "red" }}>{errors.email.message}</p>}
      </div>

      {/* Ejemplo con Controller (Para componentes complejos o custom) */}
      <div>
        <label>Nombre:</label>
        <Controller
          name="nombre"
          control={control}
          render={({ field }) => (
            <input {...field} className={errors.nombre ? "error" : ""} />
          )}
        />
        {errors.nombre && (
          <p style={{ color: "red" }}>{errors.nombre.message}</p>
        )}
      </div>

      <div>
        <label>Contraseña:</label>
        <input type="password" {...register("password")} />
        {errors.password && (
          <p style={{ color: "red" }}>{errors.password.message}</p>
        )}
      </div>

      <div>
        <label>Confirmar Contraseña:</label>
        <input type="password" {...register("confirmPassword")} />
        {errors.confirmPassword && (
          <p style={{ color: "red" }}>{errors.confirmPassword.message}</p>
        )}
      </div>

      <button type="submit">Registrarse</button>
    </form>
  );
};
```

---

¿Te gustaría que profundicemos en cómo manejar el envío de estos datos a una API (usando estados de carga o manejo de errores del servidor)?
