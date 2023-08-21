import Group from "@Models/group";
import Transport from "@Models/transport/transport";

const findTruckInGroup = (groups: Group<Transport>[], id: string): Group<Transport> | Transport | undefined => {
    for (const group of groups) {
        if (group.id === id) {
            return group
        }
        const transport = findTruckInGroup(group.groups, id)
        if (transport) {
            return transport
        }
        for (const object of group.data) {
            if (object.id === id) {
                return object
            }
        }
    }
    return undefined;
}
export default findTruckInGroup