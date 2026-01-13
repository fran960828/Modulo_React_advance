// 1. Add five new (dummy) page components (content can be simple <h1> elements)
//    - HomePage
//    - EventsPage
//    - EventDetailPage
//    - NewEventPage
//    - EditEventPage
// 2. Add routing & route definitions for these five pages
//    - / => HomePage
//    - /events => EventsPage
//    - /events/<some-id> => EventDetailPage
//    - /events/new => NewEventPage
//    - /events/<some-id>/edit => EditEventPage
// 3. Add a root layout that adds the <MainNavigation> component above all page components
// 4. Add properly working links to the MainNavigation
// 5. Ensure that the links in MainNavigation receive an "active" class when active
// 6. Output a list of dummy events to the EventsPage
//    Every list item should include a link to the respective EventDetailPage
// 7. Output the ID of the selected event on the EventDetailPage
// BONUS: Add another (nested) layout route that adds the <EventNavigation> component above all /events... page components

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { RootLayout } from "./presentation/pages/RootLayout";
import { Home } from "./presentation/pages/Home";
import { Events } from "./presentation/pages/Events";
import { EventLayout } from "./presentation/pages/EventLayout";
import { EventDetail } from "./presentation/pages/EventDetail";
import { EditEvent } from "./presentation/pages/EditEvent";
import { NewEvent } from "./presentation/pages/NewEvent";
import { loader as eventsLoader } from "./loaders/events.loader";
import { loader as eventLoader } from "./loaders/eventsDetail.loader";
import { action as eventPostAction } from "./actions/newEvent.action";
import { action as eventPatchAction } from "./actions/newEvent.action";
import { action as eventDeleteAction } from "./actions/eventDetail.action";
import { action as eventNewsletterAction } from "./actions/newsletter.action";
import { action as authentificationAction } from "./actions/Authentication.action";
import { action as logOutAction } from "./actions/logOut.action";
import ErrorPage from "./presentation/pages/ErrorPage";
import NewsletterPage from "./presentation/pages/NewsletterPage";
import { AuthPage } from "./presentation/pages/AuthPage";
function App() {
  const route = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      errorElement: <ErrorPage />,
      children: [
        { index: true, element: <Home /> },
        {
          path: "events",
          element: <EventLayout />,
          children: [
            { index: true, element: <Events />, loader: eventsLoader },
            {
              path: ":id",
              id: "event-detail",
              loader: eventLoader,
              children: [
                {
                  index: true,
                  element: <EventDetail />,
                  action: eventDeleteAction,
                },
                {
                  path: "edit",
                  element: <EditEvent />,
                  action: eventPatchAction,
                },
              ],
            },
            { path: "new", element: <NewEvent />, action: eventPostAction },
          ],
        },
        {
          path: "authentification",
          element: <AuthPage />,
          action: authentificationAction,
        },

        {
          path: "newsletter",
          element: <NewsletterPage />,
          action: eventNewsletterAction,
        },
        { path: "logout", action: logOutAction },
      ],
    },
  ]);

  return <RouterProvider router={route} />;
}

export default App;
