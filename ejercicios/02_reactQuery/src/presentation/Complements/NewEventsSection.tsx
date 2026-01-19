import { getEventsDef } from "../../config/dependencies";
import ErrorBlock from "../utils/ErrorBlock";
import LoadingIndicator from "../utils/LoadingIndicator";
import EventItem from "./EventItem";
import { useQuery } from "@tanstack/react-query";

export default function NewEventsSection() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["/events"],
    queryFn: ({ signal }) => getEventsDef(signal, 3),
    staleTime: 1000 * 60 * 5,
  });

  let content;

  if (isLoading) {
    content = <LoadingIndicator />;
  }

  if (error) {
    content = (
      <ErrorBlock title="An error occurred" message="Failed to fetch events" />
    );
  }

  if (data) {
    content = (
      <ul className="events-list">
        {data.map((event) => (
          <li key={event.id}>
            <EventItem event={event} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <section className="content-section" id="new-events-section">
      <header>
        <h2>Recently added events</h2>
      </header>
      {content}
    </section>
  );
}
