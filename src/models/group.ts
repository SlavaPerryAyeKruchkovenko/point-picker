import Transport from "@Models/transport";

type Group = {
    id: string,
    parentId: string | null,
    name: string,
    groups: Group[],
    transports: Transport[]
}
export default Group