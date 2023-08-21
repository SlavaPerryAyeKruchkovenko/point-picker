const fromResGroupToGroup = <T>(value: { ID: string, ParentID: string | null, Name: string }[]) => {
    return value.map(value => {
        return {
            id: value.ID,
            parentId: value.ParentID,
            groups: [],
            name: value.Name,
            data: new Array<T>()
        }
    })
}
export default fromResGroupToGroup