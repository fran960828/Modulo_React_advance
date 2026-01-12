import { redirect } from "react-router-dom";
import type { ActionFunctionArgs } from "react-router-dom";
import { deleteEventDef } from "../config/dependencies";

export async function action({ params }: ActionFunctionArgs) {
    if (!params.id) {
      throw new Error("Event ID is required for DELETE");
    }
    await deleteEventDef(params.id);
    return redirect("/events");
}