import Group from "@Models/group";
import Geofence from "@Models/geofence/geofence";

const findGeofenceInGroups = (groups: Group<Geofence>[],id:string): Group<Geofence> | Geofence | undefined => {
    for (const group of groups) {
        if (group.id === id) {
            return group
        }
        const geofence = findGeofenceInGroups(group.groups,id)
        if(geofence){
            return geofence
        }
        for (const object of group.data) {
            if (object.id === id) {
                return object
            }
        }
    }
    return undefined;
}
export default findGeofenceInGroups