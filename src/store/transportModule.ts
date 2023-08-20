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

export const transportModule: Module<TransportState, AppState> = {
    state: () => ({
        schemas: [],
    }) as TransportState,
    getters: {
        getSchemas(state: TransportState) {
            return state.schemas
        }
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
                            commit("initGroupsForSchema",{
                                schemaId:schema.id, groups: head
                            })
                            console.log(head);
                        }
                    }
                }

            } catch (e) {
                console.log("get all devices error", e)
            }
        }
    },
    namespaced: true
}