import { useNavigate,Form, useNavigation} from 'react-router-dom';

import classes from './EventForm.module.css';
import type { IEventForm } from '../../core/domain/models';

function EventForm({ method,event }:IEventForm) {
  const navigate = useNavigate();
  const navigation=useNavigation()
  const isSubmitted=navigation.state==='submitting';


  function cancelHandler() {
    navigate('..');
  }

  return (
    <Form className={classes.form} method={method}>
      <p>
        <label htmlFor="title">Title</label>
        <input id="title" type="text" name="title" required defaultValue={event ? event.title:undefined}/>

      </p>
      <p>
        <label htmlFor="image">Image</label>
        <input id="image" type="url" name="image" required defaultValue={event ? event.image:undefined}/>
      </p>
      <p>
        <label htmlFor="date">Date</label>
        <input id="date" type="date" name="date" required defaultValue={event ? event.date:undefined}/>
      </p>
      <p>
        <label htmlFor="description">Description</label>
        <textarea id="description" name="description" rows={5} required defaultValue={event ? event.description:undefined}/>
      </p>
      <div className={classes.actions}>
        <button type="button" onClick={cancelHandler}  disabled={isSubmitted}>
          Cancel
        </button>
        <button disabled={isSubmitted}>Save</button>
      </div>
    </Form>
  );
}

export default EventForm;
