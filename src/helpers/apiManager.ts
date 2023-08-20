import axios, {AxiosResponse} from "axios";
import LoginRequest from "@Models/requests/loginRequest";
import SchemaRequest from "@Models/requests/schemaRequest";
import SchemaResponse from "@Models/responses/schemaResponse";
import DeviceRequest from "@Models/requests/deviceRequest";
import DeviceResponse from "@Models/responses/deviceResponse";
import GeofenceCoordinateRequest from "@Models/requests/geofenceCoordinateRequest";
import GeofenceCoordinateResponse from "@Models/responses/geofenceCoordinateResponse";
import GeofenceRequest from "@Models/requests/geofenceRequest";
import GeofenceResponse from "@Models/responses/geofenceResponse";
import TrackCoordinateRequest from "@Models/requests/trackCoordinateRequest";
import TrackCoordinateResponse from "@Models/responses/trackCoordinateResponse";

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

    getTruckCoordinate(request: TrackCoordinateRequest): Promise<AxiosResponse<TrackCoordinateResponse, TrackCoordinateRequest>> {
        return axios.post<TrackCoordinateResponse>(this.api + "ServiceJSON/GetTrack", request);
    }

    getGeofences(request: GeofenceRequest): Promise<AxiosResponse<GeofenceResponse, GeofenceRequest>> {
        return axios.post<GeofenceResponse>(this.api + "ServiceJSON/EnumGeoFences", request);
    }

    getGeofencesCoordinate(request: GeofenceCoordinateRequest): Promise<AxiosResponse<GeofenceCoordinateResponse, GeofenceCoordinateRequest>> {
        return axios.post<GeofenceCoordinateResponse>(this.api + "ServiceJSON/GetGeofences", request);
    }
}