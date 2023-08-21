type GeofenceResponse = {
    ID: string,
    Groups: [{
        ID:string,
        Name: string,
        ParentID: string | null
    }],
    Items: [{
        ID:string,
        Name: string,
        ParentID: string | null
    }]
}
export default GeofenceResponse