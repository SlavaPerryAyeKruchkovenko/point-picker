import TransportState from "@Models/states/transportState";
import ApiManager from "@/helpers/apiManager";
import {Module} from "vuex";
import AppState from "@Models/states/appState";
import InitGroupsParam from "@Models/params/initGroupsParam";
import groupBy from "@/helpers/groupBy";
import findParent from "@/helpers/findParent";
import fromResGroupToGroup from "@/helpers/converters/fromResGroupToGroup";
import fromResItemsToTransport from "@/helpers/converters/fromResItemsToTransport";
import moment from "moment";
import Point from "@Models/point";
import Transport from "@Models/transport/transport";
import Group from "@Models/group";
import Schema from "@Models/schema";
import getSchemaFromApi from "@/helpers/apiFunctions/getSchemaFromApi";
import PointsParam from "@Models/params/pointsParam";
import findTruckInGroup from "@Helpers/findFunctions/findTruckInGroup";

export const transportModule: Module<TransportState, AppState> = {
    state: () => ({
        schemas: [],
    }) as TransportState,
    getters: {
        getSchemas(state: TransportState) {
            return state.schemas
        },
        getSchemasOfTruck: (state: TransportState) => (truckId: string): string | undefined => {
            for (const schema of state.schemas) {
                if (findTruckInGroup(schema.groups, truckId)) {
                    return schema.id
                }
            }
            return undefined;
        },
    },
    mutations: {
        initSchemas(state: TransportState, schemas: Schema<Transport>[]) {
            state.schemas = schemas
        },
        initGroupsForSchema(state: TransportState, {schemaId, groups}: InitGroupsParam<Transport>) {
            const schema = state.schemas.find(x => x.id === schemaId)
            if (schema) {
                schema.groups = groups
            }
        },
        addPointsToTruck(state: TransportState, pointsParam: PointsParam) {
            state.schemas.forEach(schema => {
                const object = findTruckInGroup(schema.groups, pointsParam.transportId);
                const transport = object as Transport
                if (transport) {
                    transport.points = pointsParam.points;
                }
            })
        },
        removePoints(state: TransportState, transportId: string) {
            const removeGroupRect = (group: Group<Transport>) => {
                group.data.forEach(geofence => {
                    geofence.points = undefined
                })
                group.groups.forEach(group => {
                    removeGroupRect(group)
                })
            }
            state.schemas.forEach(schema => {
                const object = findTruckInGroup(schema.groups, transportId);
                const geofence = object as Transport;
                const group = object as Group<Transport>
                if ((geofence as Transport).points) {
                    geofence.points = undefined;
                } else if (group.data) {
                    removeGroupRect(group)
                }
            })
        }
    },
    actions: {
        async initSchemas({commit, rootState}) {
            try {
                if (rootState.token) {
                    const schemas = await getSchemaFromApi<Transport>(rootState.token);
                    if (schemas) {
                        commit("initSchemas", schemas);
                    }
                }
            } catch (e) {
                console.log("init transport schemas error", e)
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
                            const head: Group<Transport>[] = fromResGroupToGroup((groups.get(null) ?? []).concat(devices.get(null) ?? []));
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
                                        parent.data = parent.data.concat(fromResItemsToTransport(value))
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
        async initLastDayTuckCoordinate({commit, rootState}, truckInfo: {
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
                        SD: moment(startDate).format("yyyyMMDD-HHmm"),
                        ED: moment(endDate).format("yyyyMMDD-HHmm")
                    })
                    const data = res.data

                    Object.keys(data).forEach(key => {
                        const value = data[key]
                        const points: Point[] = []
                        value.forEach(point => {
                            points.push(...point.DT.map((date, i) => {
                                return {
                                    date: date,
                                    lat: point.Lat[i],
                                    lng: point.Lng[i]
                                }
                            }));
                        })
                        commit("addPointsToTruck", {
                            points: points,
                            transportId: key
                        })
                    })
                }
            } catch (e) {
                console.log("get last day coordinate error", e)
            }
        },
        removeTransportPoints({commit}, transportId: string) {
            commit("removePoints", transportId)
        }
    },
    namespaced: true
}