import Group from "@Models/group";

const findParent = (groups: Group[], parentId: string): Group | undefined => {
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