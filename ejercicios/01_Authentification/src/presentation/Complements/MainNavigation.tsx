import NewsletterPage from "../pages/NewsletterPage";
import classes from "./MainNavigation.module.css";
import { NavLink, Form, useRouteLoaderData } from "react-router-dom";

function MainNavigation() {
  const token = useRouteLoaderData('root');

  return (
    <header className={classes.header}>
      <nav>
        <ul className={classes.list}>
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? "px-4 py-2 bg-amber-400 rounded-sm" : undefined
              }
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="events"
              className={({ isActive }) =>
                isActive ? "px-4 py-2 bg-amber-400 rounded-sm" : undefined
              }
            >
              Events
            </NavLink>
          </li>
          <li>
            <NavLink
              to="newsletter"
              className={({ isActive }) =>
                isActive ? "px-4 py-2 bg-amber-400 rounded-sm" : undefined
              }
            >
              Newsletter
            </NavLink>
          </li>
          {!token ? (
            <li>
              <NavLink
                to="authentification?mode=login"
                className={({ isActive }) =>
                  isActive ? "px-4 py-2 bg-amber-400 rounded-sm" : undefined
                }
              >
                Authentification
              </NavLink>
            </li>
          ) : (
            <li>
              <Form action="/logout" method="post">
                <button>Logout</button>
              </Form>
            </li>
          )}
        </ul>
      </nav>
      <div>
        <NewsletterPage />
      </div>
    </header>
  );
}

export default MainNavigation;
