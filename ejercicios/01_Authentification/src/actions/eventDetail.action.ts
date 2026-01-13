import { redirect } from "react-router-dom";
import type { ActionFunctionArgs } from "react-router-dom";
import { deleteEventDef } from "../config/dependencies";
import { getAuthToken } from "../presentation/utils/utils";

export async function action({ params }: ActionFunctionArgs) {
    if (!params.id) {
      throw new Error("Event ID is required for DELETE");
    }
    const token=getAuthToken()
    if (!token){
      return redirect('/authentification?mode=login')
    }
    await deleteEventDef(params.id);
    return redirect("/events");
}