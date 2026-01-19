import { Link, Outlet } from "react-router-dom";

import Header from "../Complements/Header.js";
import EventsIntroSection from "../Complements/EventsIntroSection.js";
import FindEventSection from "../Complements/FindEventSection.js";
import NewEventsSection from "../Complements/NewEventsSection.js";

export default function Events() {
  return (
    <>
      <Outlet />
      <Header>
        <Link to="/events/new" className="button">
          New Event
        </Link>
      </Header>
      <main>
        <EventsIntroSection />
        <NewEventsSection />
        <FindEventSection />
      </main>
    </>
  );
}
