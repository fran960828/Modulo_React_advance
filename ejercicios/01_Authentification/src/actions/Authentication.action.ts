import { type ActionFunctionArgs, redirect } from "react-router-dom";
import { authEventDef } from "../config/dependencies"; // Importamos el caso de uso ya configurado
import { type AuthEvent } from "../core/domain/models";

export async function action({ request }: ActionFunctionArgs) {
  const searchParams = new URL(request.url).searchParams;

  // Extraemos el modo de la URL (?mode=login o ?mode=signup)
  // El backend usa '/signup' pero tu interfaz dice 'sign up'.
  // Normalizamos aquí para que coincida con tu dominio:
  const mode = searchParams.get("mode") === "signup" ? "signup" : "login";

  const formData = await request.formData();

  // Preparamos el objeto siguiendo tu interfaz AuthEvent
  const authData: AuthEvent = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    mode: mode,
  };

  try {
    // Ejecutamos el caso de uso (Application Layer)
    // Gracias a tu patrón en dependencies.ts, no necesitamos pasarle el repositorio aquí
    const result = await authEventDef(authData);

    // Guardamos el token que devuelve el TokenEvent
    localStorage.setItem("token", result.token);

    // Opcional: Guardar expiración si el backend o la lógica lo requiere
    const expiration = new Date();
    expiration.setHours(expiration.getHours() + 1);
    localStorage.setItem("expiration", expiration.toISOString());

    return redirect("/"); // Redirección al Home tras éxito
  } catch (error: any) {
    /**
     * Como tu httpClient lanza una Response con JSON.stringify({message: ...}),
     * React Router capturará este error. Si queremos mostrarlo en el mismo formulario
     * sin saltar a la ErrorPage, lo capturamos aquí:
     */

    // Si el error es una respuesta de nuestro httpClient
    if (error instanceof Response) {
      const errorData = await error.json();
      return { message: errorData.message, status: error.status };
    }

    // Error genérico
    return {
      message: "Ocurrió un error inesperado en la autenticación.",
      status: 500,
    };
  }
}
