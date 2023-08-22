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
import findGeofenceInGroups from "@/helpers/findFunctions/findGeofenceInGroups";

export const geofenceModule: Module<GeofenceState, AppState> = {
    state: () => ({
        schemas: [],
    }) as GeofenceState,
    getters: {
        getSchemas: (state: GeofenceState) => {
            return state.schemas
        },
        getSchemasOfGeofence: (state: GeofenceState) => (geofenceId: string): string | undefined => {
            for (const schema of state.schemas) {
                if (findGeofenceInGroups(schema.groups, geofenceId)) {
                    return schema.id
                }
            }
            return undefined;
        },
        getAllRect: (state: GeofenceState) => {
            const getPointFromGroups = (groups:Group<Geofence>[]): Rect[] =>{
                let rects = []
                groups.forEach(group=>{
                    rects = rects.concat(group.data.filter(x=>x.rect).map(x => x.rect));
                    rects = rects.concat(getPointFromGroups(group.groups))
                })
                return rects
            }
            let rects: Rect[] = []
            state.schemas.forEach(schema=>{
                rects = rects.concat(getPointFromGroups(schema.groups))
            })
            return rects;
        }
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
        addRectForGeofence(state: GeofenceState, {rect, geofenceId}: RectParam) {
            state.schemas.forEach(schema => {
                const geofence = findGeofenceInGroups(schema.groups, geofenceId) as Geofence;
                if (geofence) {
                    geofence.rect = rect;
                }
            })
        },
        removeRect(state: GeofenceState, geofenceId: string) {
            const removeGroupRect = (group: Group<Geofence>) => {
                group.data.forEach(geofence => {
                    geofence.rect = undefined
                })
                group.groups.forEach(group => {
                    removeGroupRect(group)
                })
            }
            state.schemas.forEach(schema => {
                const object = findGeofenceInGroups(schema.groups, geofenceId);
                const geofence = object as Geofence;
                const group = object as Group<Geofence>
                if ((geofence as Geofence).rect) {
                    geofence.rect = undefined;
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
        async addGeofenceCoordinate({commit, rootState}, geofenceInfo: {
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
                        commit("addRectForGeofence", {
                            rect: rect,
                            geofenceId: key
                        })
                    })
                }
            } catch (e) {
                console.log("get last day coordinate error", e)
            }
        },
        removeGeofenceRect({commit}, geofenceId: string) {
            commit("removeRect", geofenceId)
        }
    },
    namespaced: true
}