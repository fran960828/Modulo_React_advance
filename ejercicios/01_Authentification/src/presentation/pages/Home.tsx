
export function Home(){
    return (
    <div className="min-h-screen bg-black text-gray-100">
      {/* Hero Section */}
      <header className="max-w-6xl mx-auto px-6 py-20 flex flex-col items-center text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-linear-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Manage Your Events
        </h1>
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-10">
          La plataforma definitiva para organizar, editar y visualizar tus eventos con una interfaz moderna y optimizada.
        </p>
      </header>

      {/* Stats / Features Section */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
            <h3 className="text-blue-400 font-bold text-xl mb-2">Rápido</h3>
            <p className="text-gray-400 text-sm">Interfaz optimizada con React para una navegación instantánea.</p>
          </div>
          <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
            <h3 className="text-purple-400 font-bold text-xl mb-2">Moderno</h3>
            <p className="text-gray-400 text-sm">Diseño Dark Mode nativo ideal para entornos profesionales.</p>
          </div>
          <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
            <h3 className="text-emerald-400 font-bold text-xl mb-2">Seguro</h3>
            <p className="text-gray-400 text-sm">Gestión de datos robusta y validaciones en tiempo real.</p>
          </div>
        </div>
      </section>

      
    </div>
  );
}

