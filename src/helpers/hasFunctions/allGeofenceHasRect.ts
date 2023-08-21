import Group from "@Models/group";
import Geofence from "@Models/geofence/geofence";

const allGeofenceHasRect = (group: Group<Geofence>) => {
    if (group.data.length > 0 || group.groups.length > 0) {
        if (group.data.every(geo => geo.rect)) {
            return group.groups.every(group => allGeofenceHasRect(group))
        } else {
            return false
        }
    }
    return true
}
export default allGeofenceHasRect