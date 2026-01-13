import classes from './EventsNavigation.module.css';
import {Link, useRouteLoaderData} from 'react-router-dom'

function EventsNavigation() {
  const token=useRouteLoaderData('root')
  return (
    <header className={classes.header}>
      <nav>
        <ul className={classes.list}>
          <li>
            <Link to="/events">All Events</Link>
          </li>
          {token &&
            <li>
            <Link to="/events/new">New Event</Link>
          </li>
            }
          
        </ul>
      </nav>
    </header>
  );
}

export default EventsNavigation;
