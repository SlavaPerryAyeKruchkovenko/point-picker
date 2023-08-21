import Group from "@Models/group";
import Transport from "@Models/transport/transport";

const allTransportsHasPoints = (group: Group<Transport>) => {
    if (group.data.length > 0 || group.groups.length > 0) {
        if (group.data.every(geo => geo.points)) {
            return group.groups.every(group => allTransportsHasPoints(group))
        } else {
            return false
        }
    }
    return true
}
export default allTransportsHasPoints