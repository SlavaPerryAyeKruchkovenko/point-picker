import axios, {AxiosResponse} from "axios";
import LoginRequest from "@Models/requests/loginRequest";

export default class ApiManager{
    private api = "https://test.agweb.cloud/"
    login(response:LoginRequest): Promise<AxiosResponse<string,LoginRequest>>{
        return axios.post<string>(this.api+"ServiceJSON/Login",response);
    }
}