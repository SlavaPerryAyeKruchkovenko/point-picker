type DeviceResponse = {
    ID: string,
    Groups: [{
        ID: string,
        ParentID: string | null,
        Name: string
    }],
    Items: [
        {
            ID: string,
            ParentID: string | null,
            Name: string,
        }
    ]
}
export default DeviceResponse