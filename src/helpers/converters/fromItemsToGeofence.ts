import Geofence from "@Models/geofence/geofence";

const fromResItemsToGeofence = (value: { ID: string, ParentID: string | null, Name: string }[]): Geofence[] => {
    return value.map(value => {
        return {
            parentId: value.ParentID,
            id: value.ID,
            name: value.Name,
            rect: undefined
        }
    })
}
export default fromResItemsToGeofence