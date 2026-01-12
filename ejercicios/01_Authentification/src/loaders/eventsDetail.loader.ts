import type{ LoaderFunctionArgs } from "react-router-dom"
import { getEventDef } from "../config/dependencies"
import type { EventGet } from "../core/domain/models"


export async function loader({params}:LoaderFunctionArgs):Promise<EventGet>{
    const id=params.id as string
    const data=await getEventDef(id)
    console.log("Loader result:", data);
    return data
}
