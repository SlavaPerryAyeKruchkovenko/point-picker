import Group from "@Models/group";
import Geofence from "@Models/geofence/geofence";

const someGeofenceHasRect = (group: Group<Geofence>) => {
    if (group.data.length > 0 || group.groups.length > 0) {
        if (group.data.some(geo => geo.rect)) {
            return true
        } else {
            return group.groups.some(group => someGeofenceHasRect(group))
        }
    }
    return false
}
export default someGeofenceHasRect