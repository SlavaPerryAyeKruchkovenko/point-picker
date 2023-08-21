import Group from "@Models/group";

type Schema<T> = {
    id: string,
    name: string,
    groups: Group<T>[]
}
export default Schema