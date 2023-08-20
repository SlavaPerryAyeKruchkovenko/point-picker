import axios, {AxiosResponse} from "axios";
import LoginRequest from "@Models/requests/loginRequest";
import SchemaRequest from "@Models/requests/schemaRequest";
import SchemaResponse from "@Models/responses/SchemaResponse";
import DeviceRequest from "@Models/requests/deviceRequest";
import DeviceResponse from "@Models/responses/deviceResponse";

export default class ApiManager {
    private api = "https://test.agweb.cloud/"

    login(request: LoginRequest): Promise<AxiosResponse<string, LoginRequest>> {
        return axios.post<string>(this.api + "ServiceJSON/Login", request);
    }

    getSchemas(request: SchemaRequest): Promise<AxiosResponse<SchemaResponse, SchemaRequest>> {
        return axios.post<SchemaResponse>(this.api + "ServiceJSON/EnumSchemas", request);
    }

    getTransports(request: DeviceRequest): Promise<AxiosResponse<DeviceResponse, DeviceRequest>> {
        return axios.post<DeviceResponse>(this.api + "ServiceJSON/EnumDevices", request);
    }
}