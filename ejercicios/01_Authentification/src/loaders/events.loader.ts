import { getEventsDef } from "../config/dependencies"
import type { EventGet } from "../core/domain/models"


export async function loader():Promise<EventGet[]>{
    const data=await getEventsDef()
    return data
}