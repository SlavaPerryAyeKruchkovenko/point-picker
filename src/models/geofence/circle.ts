import Rect from "@Models/geofence/rect";

class Circle extends Rect {
    radius: number;
    coordinate: {
        lat: number,
        lng: number
    }

    constructor(radius: number, point: {
        lat: number,
        lng: number
    }) {
        super();
        this.radius = radius
        this.coordinate = point
    }
}
export default Circle