import { useRouteLoaderData } from "react-router-dom";
import EventItem from "../Complements/EventItem";
import type { EventGet } from "../../core/domain/models";

export function EventDetail(){
    const event = useRouteLoaderData('event-detail') as EventGet
    if (!event){
        return <p>No hay Datos</p>
    }
    return (
        <EventItem event={event}/>
    )
}