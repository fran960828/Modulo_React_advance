import MainNavigation from "../Complements/MainNavigation";
import {Outlet} from 'react-router-dom'

export function RootLayout(){
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