import { useRouteError, Link, isRouteErrorResponse } from 'react-router-dom';


function ErrorPage() {
  const error = useRouteError() ;

  let title = 'Ha ocurrido un error';
  let message = 'Algo salió mal en la conexión.';

  if (isRouteErrorResponse(error)) {
    // Aquí TypeScript ya sabe que error tiene status y data
    if (error.status === 404) {
      title = 'Página no encontrada';
      message = 'No pudimos encontrar el recurso.';
    } else if (error.status === 500) {
      message = error.data?.message || 'Error interno del servidor';
    }
  } else if (error instanceof Error) {
    // Para errores genéricos de JS (como errores de red crudos)
    message = error.message;
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        {/* Icono de advertencia animado */}
        <div className="mb-8 flex justify-center">
          <div className="p-4 bg-red-500/10 rounded-full border border-red-500/20 animate-pulse">
            <svg 
              className="w-16 h-16 text-red-500" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="Twelve 12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
              />
            </svg>
          </div>
        </div>

        {/* Textos de Error */}
        <h1 className="text-4xl font-bold text-white mb-4">
          {title}
        </h1>
        <p className="text-gray-400 text-lg mb-10">
          {message}
        </p>

        {/* Botones de acción */}
        <div className="flex flex-col gap-3">
          <Link
            to="/"
            className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold rounded-lg border border-zinc-700 transition-all flex items-center justify-center gap-2"
          >
            <span>Ir al inicio</span>
          </Link>
          
          <button 
            onClick={() => window.location.reload()}
            className="w-full py-3 bg-transparent hover:text-white text-zinc-500 font-medium transition-colors"
          >
            Reintentar conexión
          </button>
        </div>

        {/* Código de error discreto */}
        <div className="mt-12 text-zinc-800 font-mono text-sm">
          Error Code: {isRouteErrorResponse(error) ? error.status : 'Unknown Connection Error'}
        </div>
      </div>
    </div>
  );
}

export default ErrorPage;