import Group from "@Models/group";

type InitGroupsParam<T> = {
    schemaId: string, groups: Group<T>[]
}
export default InitGroupsParam