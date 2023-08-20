import Transport from "@Models/transport";

const fromResItemsToTransport = (value: {ID: string, ParentID: string | null, Name: string}[]):Transport[] => {
    return value.map(value => {
        return {
            parentID:value.ParentID,
            id: value.ID,
            name: value.Name,
            points: []
        }
    })
}
export default fromResItemsToTransport