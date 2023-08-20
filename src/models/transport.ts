import Point from "@Models/point";

type Transport = {
    id:string,
    parentID:string | null,
    name: string,
    points: Point[]
}
export default Transport