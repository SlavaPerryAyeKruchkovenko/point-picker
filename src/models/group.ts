import Transport from "@Models/transport";

type Group = {
    id: string
    parentId: string
    groups: Group[],
    transports: Transport[]
}
export default Group