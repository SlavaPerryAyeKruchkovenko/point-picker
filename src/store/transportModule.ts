import TransportState from "@Models/states/transportState";
import Schema from "@Models/schema";
import ApiManager from "@/helpers/apiManager";
import {Module} from "vuex";
import AppState from "@Models/states/appState";

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
        }
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
        async initTrucks({state, commit, rootState}) {
            try {
                const manager = new ApiManager();
                for (const schema of state.schemas) {
                    if (rootState.token) {
                        const res = await manager.getTransports({
                            schemaId: schema.id, session: rootState.token
                        })
                        if (res.status === 200) {
                            console.log(res.data)
                        }
                    }
                }

            } catch (e) {
                console.log("login error", e)
            }
        }
    },
    namespaced: true
}