import { useEffect } from "react";
import MainNavigation from "../Complements/MainNavigation";
import {Outlet, useLoaderData, useSubmit} from 'react-router-dom'
import { getTokenDuration } from "../utils/utils";

export function RootLayout(){
  
  const token = useLoaderData(); // Supongamos que tu loader devuelve el token actual
  const submit = useSubmit();

  useEffect(() => {
    if (!token) {
      return;
    }

    if (token === 'EXPIRED') {
      submit(null, { action: '/logout', method: 'post' });
      return;
    }

    const tokenDuration = getTokenDuration();
    console.log(`Token válido por: ${tokenDuration} ms`);

    // Configuramos el temporizador para hacer logout automático
    const timeout = setTimeout(() => {
      // Usamos un submit a una ruta de logout para limpiar todo de forma limpia
      submit(null, { action: '/logout', method: 'post' });
    }, tokenDuration);

    // Limpieza si el componente se desmonta o el token cambia
    return () => clearTimeout(timeout);
  }, [token, submit]);






    return (
        <>
        <MainNavigation/>
        <main>
            <Outlet/>
        </main>
        {/* Footer decorativo */}
      <footer className="mt-20 py-10 border-t border-zinc-900 text-center text-zinc-600 text-sm">
        &copy; 2026 Event Manager App. Built with React & Tailwind.
      </footer>
        </>
    )
}