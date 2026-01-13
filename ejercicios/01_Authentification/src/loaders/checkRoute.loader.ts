import { redirect } from "react-router-dom";
import { getAuthToken } from "../presentation/utils/utils";

export function loader(){
    const token=getAuthToken()
    if (!token){
        return redirect ('/authentification?mode=login')
    }
    return null
}