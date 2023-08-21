type Group<T> = {
    id: string,
    name: string,
    parentId: string | null
    groups: Group<T>[]
    data: T[]
}
export default Group