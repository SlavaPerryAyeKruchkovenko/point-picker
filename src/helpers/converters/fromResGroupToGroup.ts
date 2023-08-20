const fromResGroupToGroup = (value: { ID: string, ParentID: string | null, Name: string }[]) => {
    return value.map(value => {
        return {
            id: value.ID,
            parentId: value.ParentID,
            groups: [],
            name: value.Name,
            transports: []
        }
    })
}
export default fromResGroupToGroup