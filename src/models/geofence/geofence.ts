import Rect from "@Models/geofence/rect";

type Geofence = {
    id: string,
    name: string,
    parentId: string | null
    rect?: Rect
}
export default Geofence