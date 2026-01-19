import { queryClient } from "../App";
import { getEventsDef } from "../config/dependencies";
export function loader() {
  return queryClient.fetchQuery({
    queryKey: ["events"],
    queryFn: ({ signal }) => getEventsDef(signal),
  });
}
