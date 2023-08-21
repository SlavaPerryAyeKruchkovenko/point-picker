import GeofenceState from "@Models/states/geofenceState";
import {Module} from "vuex";
import AppState from "@Models/states/appState";
import ApiManager from "@/helpers/apiManager";
import Schema from "@Models/schema";
import groupBy from "@/helpers/groupBy";
import fromResGroupToGroup from "@/helpers/converters/fromResGroupToGroup";
import findParent from "@/helpers/findParent";
import Geofence from "@Models/geofence/geofence";
import Group from "@Models/group";
import fromResItemsToGeofence from "@/helpers/converters/fromItemsToGeofence";
import getSchemaFromApi from "@/helpers/apiFunctions/getSchemaFromApi";
import InitGroupsParam from "@Models/params/initGroupsParam";
import Rect from "@Models/geofence/rect";
import Circle from "@Models/geofence/circle";
import Polygon from "@Models/geofence/polygon";
import Rectangle from "@Models/geofence/rectangle";
import RectParam from "@Models/params/rectParam";

export const geofenceModule: Module<GeofenceState, AppState> = {
    state: () => ({
        schemas: [],
    }) as GeofenceState,
    getters: {
        getSchemas(state: GeofenceState) {
            return state.schemas
        },
        getSchemasOfGeofence: (state: GeofenceState) => (geofenceId: string): string | undefined => {
            const isTruckInGroups = (groups: Group<Geofence>[]) => {
                for (const group of groups) {
                    if (group.id === geofenceId || isTruckInGroups(group.groups)) {
                        return true;
                    }
                    for (const transport of group.data) {
                        if (transport.id === geofenceId) {
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
        initSchemas(state: GeofenceState, schemas: Schema<Geofence>[]) {
            state.schemas = schemas
        },
        initGroupsForSchema(state: GeofenceState, {schemaId, groups}: InitGroupsParam<Geofence>) {
            const schema = state.schemas.find(x => x.id === schemaId)
            if (schema) {
                schema.groups = groups
            }
        },
        initRectForGeofence(state: GeofenceState, {rect, geofenceId}: RectParam) {
            const getGeofenceById = (groups: Group<Geofence>[], id: string): Geofence | undefined => {
                for (const group of groups) {
                    for (const geofence of group.data) {
                        if (geofence.id === id) {
                            return geofence;
                        }
                    }
                    const geofence = getGeofenceById(group.groups, id);
                    if (geofence) {
                        return geofence;
                    }
                }
                return undefined
            }
            state.schemas.forEach(schema => {
                const geofence = getGeofenceById(schema.groups, geofenceId);
                if (geofence) {
                    console.log(geofence)
                    geofence.rect = rect;
                }
            })
        }
    },
    actions: {
        async initSchemas({commit, rootState}) {
            try {
                if (rootState.token) {
                    const schemas = await getSchemaFromApi<Geofence>(rootState.token);
                    if (schemas) {
                        commit("initSchemas", schemas);
                    }
                }
            } catch (e) {
                console.log("init geofence schemas error", e)
            }
        },
        async initGeofence({state, commit, rootState}) {
            try {
                const manager = new ApiManager();
                for (const schema of state.schemas) {
                    if (rootState.token) {
                        const res = await manager.getGeofences({
                            schemaId: schema.id, session: rootState.token
                        })
                        if (res.status === 200) {
                            const value = res.data
                            const groups = groupBy(value.Groups, x => x.ParentID);
                            const geofences = groupBy(value.Items, x => x.ParentID);
                            const head: Group<Geofence>[] = fromResGroupToGroup((groups.get(null) ?? []).concat(geofences.get(null) ?? []));
                            groups.forEach((value, key) => {
                                if (key) {
                                    const parent = findParent(head, key)
                                    if (parent) {
                                        parent.groups = parent.groups.concat(fromResGroupToGroup(value))
                                    }
                                }
                            });
                            geofences.forEach((value, key) => {
                                if (key) {
                                    const parent = findParent(head, key)
                                    if (parent) {
                                        parent.data = parent.data.concat(fromResItemsToGeofence(value))
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
                console.log("get all geofences error", e)
            }
        },
        async initGeofenceCoordinate({commit, rootState}, geofenceInfo: {
            schemaId: string,
            id: string
        }) {
            try {
                const manager = new ApiManager();
                if (rootState.token) {

                    const res = await manager.getGeofencesCoordinate({
                        session: rootState.token,
                        schemaID: geofenceInfo.schemaId,
                        IDs: geofenceInfo.id,
                    })
                    const data = res.data
                    Object.keys(data).forEach(key => {
                        const point = data[key]
                        let rect: Rect
                        if (point.R > 0) {
                            rect = new Circle(point.R, {
                                lat: point.Lat[0],
                                lng: point.Lng[0]
                            })
                        } else if (point.IsPolygon) {
                            rect = new Polygon(point.Lng.map((lng, i) => {
                                return {
                                    lng: lng,
                                    lat: point.Lat[i]
                                }
                            }))
                        } else {
                            rect = new Rectangle(point.Lng.map((lng, i) => {
                                return {
                                    lng: lng,
                                    lat: point.Lat[i]
                                }
                            }))
                        }
                        commit("initRectForGeofence", {
                            rect: rect,
                            geofenceId: key
                        })
                    })
                }
            } catch (e) {
                console.log("get last day coordinate error", e)
            }
        }
    },
    namespaced: true
}