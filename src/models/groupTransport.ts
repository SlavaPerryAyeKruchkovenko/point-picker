import Transport from "@Models/transport";

type GroupTransport = {
    id: string,
    parentId: string | null,
    name: string,
    groups: GroupTransport[],
    transports: Transport[]
}
export default GroupTransport