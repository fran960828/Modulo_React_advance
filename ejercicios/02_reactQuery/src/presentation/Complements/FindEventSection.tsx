import { useQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { getEventsDef } from "../../config/dependencies";
import LoadingIndicator from "../utils/LoadingIndicator";
import ErrorBlock from "../utils/ErrorBlock";
import EventItem from "./EventItem";

export default function FindEventSection() {
  // 1. Tipado correcto de Ref: HTMLInputElement y empezamos en null
  const searchElement = useRef<HTMLInputElement>(null);

  // 2. Estado de búsqueda: empezamos vacío o undefined
  const [search, setSearch] = useState<string | undefined>(undefined);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    // 3. Obtenemos el valor directamente del ref al hacer submit
    setSearch(searchElement.current?.value);
  }

  const { data, isLoading, isError, error } = useQuery({
    // 4. La queryKey reaccionará cada vez que 'search' cambie
    queryKey: ["events", { search: search }],
    // 5. Solo habilitamos la búsqueda si 'search' no es undefined
    // (opcional: quitar enabled si quieres que cargue todo al principio)
    queryFn: ({ signal }) => getEventsDef(signal, undefined, search),
    enabled: search !== undefined,
  });

  let content: React.ReactNode = (
    <p>Please enter a search term to find events.</p>
  );

  if (isLoading) {
    content = <LoadingIndicator />;
  }

  // Usamos isError para mayor claridad profesional
  if (isError) {
    content = (
      <ErrorBlock
        title="An error occurred"
        message={(error as Error).message || "Failed to fetch events"}
      />
    );
  }

  if (data) {
    content = (
      <ul className="events-list">
        {data.map((event: any) => (
          <li key={event.id}>
            <EventItem event={event} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <section className="content-section" id="all-events-section">
      <header>
        <h2>Find your next event!</h2>
        <form onSubmit={handleSubmit} id="search-form">
          <input
            type="search"
            placeholder="Search events"
            // 6. PASAMOS EL REF COMPLETO, NO EL .current
            ref={searchElement}
            className="text-black"
          />
          <button type="submit">Search</button>
        </form>
      </header>
      {content}
    </section>
  );
}
