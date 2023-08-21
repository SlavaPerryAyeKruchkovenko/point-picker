type GeofenceCoordinateResponse = {
    [key: string]: {
        IsPolygon: boolean
        R: number,
        Lat: number[],
        Lng: number[]
    }
}
export default GeofenceCoordinateResponse