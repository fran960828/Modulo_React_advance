import { getAuthToken } from "../presentation/utils/utils";

export function loader(){
    const token=getAuthToken()
    return token
}