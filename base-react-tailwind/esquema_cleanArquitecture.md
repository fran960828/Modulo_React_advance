\*\* DESCRIPCIÓN DE LA ARQUITECTURA GENERAL DE UN PROYECTO FRONTEND
src/
├── 🧠 core/ # LÓGICA DE NEGOCIO (Independiente del Framework)
│ ├── 🏗️ domain/ # Reglas esenciales y tipos de datos
│ │ ├── models/ # Interfaces/Entidades (ej. User.ts)
│ │ └── services/ # Lógica pura (ej. validadores de negocio)
│ ├── ⚙️ application/ # Orquestación de procesos
│ │ ├── ports/ # Contratos (Interfaces) para el exterior
│ │ └── useCases/ # Acciones del usuario (ej. CreateOrder.ts)
│ └── 🔌 infrastructure/ # DETALLES TÉCNICOS (Implementaciones)
│ ├── api/ # Llamadas HTTP (Axios, Fetch)
│ └── implement/ # Repositorios que cumplen los 'ports'
│
├── 🎨 presentation/ # INTERFAZ DE USUARIO (React/Vue/etc.)
│ ├── 📦 containers/ # Lógica de vista (Conecta UseCases + State)
│ ├── 🧩 complements/ # UI Pura (Botones, Inputs, Cards)
│ ├── ⚓ hooks/ # Lógica de UI reutilizable y efectos
│ └── 🏪 store/ # Estado Global (Zustand, Redux, Context)
│
└── 🛠️ config/ # CONFIGURACIÓN GLOBAL
└── 🔗 dependencies/ # Inyección de dependencias (DI Container)

\*\*DESCRIPCIÓN DE LA ARQUITECTURA GENERAL DE PRESENTACIÓN
presentation/
├── 📦 containers/
│ ├── Sales/ # Módulo de Ventas
│ │ ├── SalesContainer.tsx
│ │ ├── 🧩 components/ # Solo para este container (ej: SalesGraph)
│ │ ├── ⚓ hooks/ # Lógica de UI solo de Ventas (ej: useSalesFilter)
│ │ └── 🏪 store/ # Estado local del módulo (ej: salesSlice.ts)
│ │
│ └── Auth/ # Módulo de Autenticación
│ ├── LoginContainer.tsx
│ └── ⚓ hooks/ # ej: useLoginFormValidation
│
├── 🧩 complements/ # UI Global (Buttons, Inputs, Modals)
├── ⚓ hooks/ # Hooks Globales (useLocalStorage, useWindowSize)
└── 🏪 store/ # Estado Global (UserSession, Theme, Language)

\*\* DESCRIPCION DE LA ARQUITECTURA GENERAL DE CORE
models/
├── User.ts # Interface User, UserID, UserRole
├── Product.ts # Interface Product, ProductPrice
├── Order.ts # Interface Order, OrderStatus
└── Shared.ts # Tipos comunes (ej: ISOString, Email, etc.)

application/
├── ports/
│ ├── IUserRepository.ts # interface IUserRepository { save(u: User): void; }
│ └── ILogger.ts # interface para logs
└── useCases/
├── LoginUser.ts # Clase o función que ejecuta el login
└── GetProducts.ts # Lógica para listar productos

infrastructure/
├── api/
│ ├── axiosConfig.ts # Instancia base de Axios (interceptores, base de URL)
│ └── endpoints.ts # Diccionario de rutas: { LOGIN: '/auth/login' }
└── implement/
├── ApiUserRepository.ts # Implementación real que usa Axios
└── LocalStorageAuth.ts # Implementación de guardado en el navegador

config/
└── dependencies/
└── container.ts # Ejemplo: const userRepository = new ApiUserRepository();
