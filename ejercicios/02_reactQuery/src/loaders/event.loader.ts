import type { LoaderFunctionArgs } from "react-router-dom";
import { queryClient } from "../App";
import { getEventDef } from "../config/dependencies";

export function loader({ params }: LoaderFunctionArgs) {
  const id = params.id;

  // Usamos ensureQueryData para aprovechar la caché si existe
  return queryClient.ensureQueryData({
    // IMPORTANTE: La key debe ser IDENTICA a la del useQuery en tus componentes
    queryKey: ["events", { id: id }],
    queryFn: ({ signal }) => getEventDef(id!, signal),
  });
}
