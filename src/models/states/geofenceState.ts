import Schema from "@Models/schema";
import Geofence from "@Models/geofence/geofence";

type GeofenceState = {
    schemas: Schema<Geofence>[]
}
export default GeofenceState