const parseJson = async <T>(res: Response): Promise<T> => {
  const text = await res.text();
  return text && JSON.parse(text);
};
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
};

export const httpClient = {
  get: async <T>(url: string): Promise<T> => {
    const res = await fetch(url);
    if (!res.ok)
      throw new Response(
        JSON.stringify({ message: "Could not fetch events." }),
        {
          status: 500,
        }
      );
    return parseJson<T>(res);
  },

  patch: async <T>(url: string, body: unknown): Promise<T> => {
    const res = await fetch(url, {
      method: "PATCH",
      body: JSON.stringify(body),
      headers: getAuthHeaders(),
    });
    if (!res.ok)
      throw new Response(
        JSON.stringify({ message: "Could not fetch events." }),
        {
          status: 500,
        }
      );
    return parseJson<T>(res);
  },

  delete: async (url: string): Promise<void> => {
    const res = await fetch(url, { method: "DELETE",headers:getAuthHeaders() });
    if (!res.ok)
      throw new Response(
        JSON.stringify({ message: "Could not fetch events." }),
        {
          status: 500,
        }
      );
  },
  post: async <T>(url: string, body: unknown): Promise<T> => {
    const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify(body),
      headers:getAuthHeaders(),
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
