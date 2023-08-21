import Group from "@Models/group";
import Transport from "@Models/transport/transport";

const someTransportsHasRect = (group: Group<Transport>) => {
    if (group.data.length > 0 || group.groups.length > 0) {
        if (group.data.some(geo => geo.points)) {
            return true
        } else {
            return group.groups.some(group => someTransportsHasRect(group))
        }
    }
    return false
}
export default someTransportsHasRect