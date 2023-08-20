import TransportState from "@Models/states/transportState";
import Schema from "@Models/schema";
import ApiManager from "@/helpers/apiManager";
import {Module} from "vuex";
import AppState from "@Models/states/appState";
import InitGroupsParam from "@Models/params/initGroupsParam";
import Group from "@Models/group";
import groupBy from "@/helpers/groupBy";
import findParent from "@/helpers/findParent";
import fromResGroupToGroup from "@/helpers/converters/fromResGroupToGroup";
import fromResItemsToTransport from "@/helpers/converters/fromResItemsToTransport";
import moment from "moment";

export const transportModule: Module<TransportState, AppState> = {
    state: () => ({
        schemas: [],
    }) as TransportState,
    getters: {
        getSchemas(state: TransportState) {
            return state.schemas
        },
        getSchemasOfTruck: (state: TransportState) => (truckId: string): string | undefined => {
            const isTruckInGroups = (groups: Group[]) => {
                for (const group of groups) {
                    if (group.id === truckId || isTruckInGroups(group.groups)) {
                        return true;
                    }
                    for (const transport of group.transports) {
                        if (transport.id === truckId) {
                            return true
                        }
                    }
                }
                return false;
            }
            for (const schema of state.schemas) {
                if (isTruckInGroups(schema.groups)) {
                    return schema.id
                }
            }
            return undefined;
        },
    },
    mutations: {
        initSchemas(state: TransportState, schemas: Schema[]) {
            state.schemas = schemas
        },
        initGroupsForSchema(state: TransportState, {schemaId, groups}: InitGroupsParam) {
            const schema = state.schemas.find(x => x.id === schemaId)
            if (schema) {
                schema.groups = groups
            }
        },
    },
    actions: {
        async initSchemas({commit, rootState}) {
            try {
                const manager = new ApiManager()
                if (rootState.token) {
                    const res = await manager.getSchemas({
                        session: rootState.token
                    })
                    if (res.status === 200) {
                        commit('initSchemas', res.data.map(data => {
                            return {
                                id: data.ID,
                                name: data.Name,
                                groups: []
                            }
                        }))
                    }
                }

            } catch (e) {
                console.log("init schemas error", e)
            }
        },
        async initDevices({state, commit, rootState}) {
            try {
                const manager = new ApiManager();
                for (const schema of state.schemas) {
                    if (rootState.token) {
                        const res = await manager.getTransports({
                            schemaId: schema.id, session: rootState.token
                        })

                        if (res.status === 200) {
                            const value = res.data
                            const groups = groupBy(value.Groups, x => x.ParentID);
                            const devices = groupBy(value.Items, x => x.ParentID);
                            const head: Group[] = fromResGroupToGroup((groups.get(null) ?? []).concat(devices.get(null) ?? []));
                            groups.forEach((value, key) => {
                                if (key) {
                                    const parent = findParent(head, key)
                                    if (parent) {
                                        parent.groups = parent.groups.concat(fromResGroupToGroup(value))
                                    }
                                }
                            });
                            devices.forEach((value, key) => {
                                if (key) {
                                    const parent = findParent(head, key)
                                    if (parent) {
                                        parent.transports = parent.transports.concat(fromResItemsToTransport(value))
                                    }
                                }
                            })
                            commit("initGroupsForSchema", {
                                schemaId: schema.id, groups: head
                            })
                        }
                    }
                }
            } catch (e) {
                console.log("get all devices error", e)
            }
        },
        async initLastDayTuckCoordinate({state, commit, rootState}, truckInfo: {
            id: string,
            schemaId: string,
        }) {
            try {
                const manager = new ApiManager();
                if (rootState.token) {
                    const now = new Date();
                    const startDate = new Date();
                    const endDate = new Date();
                    startDate.setHours(5);
                    startDate.setMinutes(0);
                    endDate.setHours(5);
                    endDate.setMinutes(0);
                    endDate.setDate(now.getDate() + 1);

                    const res = await manager.getTruckCoordinate({
                        session: rootState.token,
                        schemaID: truckInfo.schemaId,
                        IDs: truckInfo.id,
                        SD: moment(startDate).format("yyyyMMdd-HHmm"),
                        ED: moment(endDate).format("yyyyMMdd-HHmm")
                    })
                    console.log(res.data)
                }
            } catch (e) {
                console.log("get last day coordinate error", e)
            }
        }
    },
    namespaced: true
}