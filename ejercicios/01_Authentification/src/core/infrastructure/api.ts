const parseJson = async <T>(res: Response): Promise<T> => {
  const text = await res.text();
  return text && JSON.parse(text);
};

export const httpClient = {
  get: async <T>(url: string): Promise<T> => {
    const res = await fetch(url);
    if (!res.ok) throw new Response(JSON.stringify({ message: 'Could not fetch events.' }), {
      status: 500,
    });
    return parseJson<T>(res);
  },

  post: async <T>(url: string, body: unknown): Promise<T> => {
    const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) throw new Response(JSON.stringify({ message: 'Could not fetch events.' }), {
      status: 500,
    });
    return parseJson<T>(res);
  },

  patch: async <T>(url: string, body: unknown): Promise<T> => {
    const res = await fetch(url, {
      method: "PATCH",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) throw new Response(JSON.stringify({ message: 'Could not fetch events.' }), {
      status: 500,
    });
    return parseJson<T>(res);
  },

  delete: async (url: string): Promise<void> => {
    const res = await fetch(url, { method: "DELETE" });
     if (!res.ok) throw new Response(JSON.stringify({ message: 'Could not fetch events.' }), {
      status: 500,
    });
  },
};
