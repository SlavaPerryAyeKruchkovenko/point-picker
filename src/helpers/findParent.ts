import GroupTransport from "@Models/groupTransport";

const findParent = (groups: GroupTransport[], parentId: string): GroupTransport | undefined => {
    if (groups.length > 0) {
        const parent = groups.find(x => x.id === parentId)
        if (parent) {
            return parent
        } else {
            for (const group of groups) {
                const parent = findParent(group.groups, parentId)
                if (parent) {
                    return parent
                }
            }
        }
    }
    return undefined
}
export default findParent