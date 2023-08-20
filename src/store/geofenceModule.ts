import GeofenceState from "@Models/states/geofenceState";
import {Module} from "vuex";
import AppState from "@Models/states/appState";
import ApiManager from "@/helpers/apiManager";

export const geofenceModule: Module<GeofenceState, AppState> = {
    state: () => ({
        schemas: [],
    }) as GeofenceState,
    getters: {},
    mutations: {},
    actions: {
        async initSchemas({commit, rootState}) {
            try {
                if (rootState.token) {
                    const res = await new ApiManager().getSchemas({
                        session: rootState.token
                    })
                    if (res.status === 200) {
                        commit('initSchemas', res.data.map(data => {
                            return {
                                id: data.ID,
                                name: data.Name,
                            }
                        }))
                    }
                }
            } catch (e) {
                console.log("init schemas error", e)
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

                        }
                    }
                }
            } catch (e) {
                console.log("get all devices error", e)
            }
        },
    },
    namespaced: true
}