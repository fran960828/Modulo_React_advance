import { redirect, type ActionFunctionArgs } from "react-router-dom";
import { putEventDef } from "../config/dependencies";
import type { EventPost } from "../core/domain/models";
import { queryClient } from "../App";

export async function action({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData.entries());
  const event = {
    id: params.id as string,
    event: JSON.parse(data.event as string) as EventPost,
  };
  await putEventDef(event);
  queryClient.invalidateQueries({ queryKey: ["events"] });
  return redirect("../");
}

// En este caso no ha sido empleada esta función ya que se ha realizado con useMutation,
// Así sería el action combinado con reactQuery.
