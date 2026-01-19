import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";

import Events from "./presentation/pages/Events";
import EventDetails from "./presentation/pages/EventDetails";
import NewEvent from "./presentation/pages/NewEvent";
import EditEvent from "./presentation/pages/EditEvent";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { loader as eventsloader } from "./loaders/events.loader";
import { loader as eventloader } from "./loaders/event.loader";

export const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/events" />,
  },
  {
    path: "/events",
    element: <Events />,
    loader: eventsloader,

    children: [
      {
        path: "/events/new",
        element: <NewEvent />,
      },
    ],
  },
  {
    path: "/events/:id",
    element: <EventDetails />,
    loader: eventloader,
    children: [
      {
        path: "/events/:id/edit",
        element: <EditEvent />,
      },
    ],
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />;
    </QueryClientProvider>
  );
}

export default App;
