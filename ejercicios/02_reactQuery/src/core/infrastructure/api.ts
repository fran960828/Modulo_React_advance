const parseJson = async <T>(res: Response): Promise<T> => {
  const text = await res.text();
  return text && JSON.parse(text);
};
// const getAuthHeaders = () => {
//   const token = localStorage.getItem("token");
//   const headers: Record<string, string> = {
//     "Content-Type": "application/json",
//   };

//   if (token) {
//     headers["Authorization"] = `Bearer ${token}`;
//   }

//   return headers;
// };

export const httpClient = {
  get: async <T>(url: string, signal: AbortSignal): Promise<T> => {
    const res = await fetch(url, {
      signal,
    });
    if (!res.ok) {
      const errorData = await parseJson<any>(res);
      throw new Response(
        JSON.stringify({
          message: errorData.message || "Could not fetch data.",
        }),
        { status: res.status }
      );
    }
    return parseJson<T>(res);
  },

  put: async <T>(url: string, body: unknown): Promise<T> => {
    const res = await fetch(url, {
      method: "PUT",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) {
      const errorData = await parseJson<any>(res);
      throw new Response(
        JSON.stringify({
          message: errorData.message || "Could not update event.",
        }),
        { status: res.status }
      );
    }
    return parseJson<T>(res);
  },

  delete: async (url: string): Promise<void> => {
    const res = await fetch(url, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) {
      const errorData = await parseJson<any>(res);
      throw new Response(
        JSON.stringify({
          message: errorData.message || "Could not delete event.",
        }),
        { status: res.status }
      );
    }
  },
  post: async <T>(url: string, body: unknown): Promise<T> => {
    const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      const errorData = await parseJson<any>(res);

      // Si el backend envió una lista de errores (status 422), los extraemos
      // Si no, usamos el mensaje genérico que ya tenías
      const errorMessage = errorData.errors
        ? Object.values(errorData.errors).join(" ")
        : errorData.message || "Could not authenticate.";

      throw new Response(JSON.stringify({ message: errorMessage }), {
        status: res.status,
      });
    }

    return parseJson<T>(res);
  },
};
