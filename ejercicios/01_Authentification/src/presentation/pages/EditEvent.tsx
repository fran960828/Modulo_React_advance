import { useRouteLoaderData } from "react-router-dom";
import EventForm from "../Complements/EventForm";
import type { EventGet } from "../../core/domain/models";


export function EditEvent(){
    const data=useRouteLoaderData('event-detail') as EventGet
    return (
        <EventForm method="PATCH" event={data}/>
    )
}