import { type AuthenticationRepository } from "../application/ports";
import type { AuthEvent, TokenEvent } from "../domain/models";
import { urlAuth } from "../domain/services";
import { httpClient } from "./api";

export const authEventImpl: AuthenticationRepository = {
  authEvent: async (auth: AuthEvent): Promise<TokenEvent> => {
    // 1. Decidir el endpoint basado en el modo (login o sign up)
    // El backend usa 'signup' pero tu modelo usa 'sign up' (con espacio), ojo aquí:
    const modeUrl = auth.mode === "login" ? "/login" : "/signup";

    // 2. Realizar la petición
    // Extraemos solo lo que el backend espera (email y password)
    const data = await httpClient.post<any>(`${urlAuth}${modeUrl}`, {
      email: auth.email,
      password: auth.password,
    });

    // 3. Normalizar la respuesta:
    // En signup viene { token, user, message }
    // En login viene { token }
    // Devolvemos solo lo que nuestro puerto espera: TokenEvent
    return {
      token: data.token,
    };
  },
};
