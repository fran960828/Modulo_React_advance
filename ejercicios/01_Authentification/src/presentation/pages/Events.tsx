import { useLoaderData } from "react-router-dom";
import EventsList from "../Complements/EventsList";
import type { EventGet} from "../../core/domain/models";


export function Events(){
    const events=useLoaderData() as EventGet[]


    return (
        <EventsList events={events} />
    )
}

