import EventsNavigation from "../Complements/EventsNavigation";
import {Outlet} from 'react-router-dom'

export function EventLayout(){
    return (
        <>
        <EventsNavigation/>
        <Outlet/>
        
        </>
    )
}