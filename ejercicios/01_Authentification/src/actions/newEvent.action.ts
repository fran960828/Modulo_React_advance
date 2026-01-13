import { redirect } from "react-router-dom";
import type { ActionFunctionArgs } from "react-router-dom";
import { postEventDef, patchEventDef } from "../config/dependencies";
import { getAuthToken } from "../presentation/utils/utils";

export async function action({ request, params }: ActionFunctionArgs) {
  const token=getAuthToken()
  if (!token){
    return redirect('/authentification?mode=login')
  }
  const method = request.method;
  const formData = await request.formData();

  const dataSent = {
    title: formData.get("title") as string,
    image: formData.get("image") as string,
    date: formData.get("date") as string,
    description: formData.get("description") as string,
  };

  if (method === "PATCH") {
    if (!params.id) {
      throw new Error("Event ID is required for PATCH");
    }

    await patchEventDef(params.id, dataSent);
  } else if (method === "POST") {
    await postEventDef(dataSent);
  }

  return redirect("/events");
}
