import Rect from "@Models/geofence/rect";

class Polygon extends Rect {
    coordinates: {
        lat: number,
        lng: number
    }[]

    constructor(points: {
        lat: number,
        lng: number
    }[]) {
        super();
        this.coordinates = points
    }
}
export default Polygon