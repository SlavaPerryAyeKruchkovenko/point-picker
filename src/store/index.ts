import {createStore} from 'vuex'
import {transportModule} from "@Store/transportModule";
import AppState from "@Models/states/appState";
import ApiManager from "@/helpers/apiManager";
import {geofenceModule} from "@Store/geofenceModule";

export default createStore({
    state: {
        token: null,
        login: "userapi",
        password: "123",
        UTCOffset: 300,
        date: new Date()
    } as AppState,
    getters: {
        token(state:AppState): string | null {
            return state.token
        }
    },
    mutations: {
        setCurDate(state:AppState, curDate: Date): void{
            state.date = curDate
        },
        setToken(state:AppState, token: string): void {
            state.token = token
        },
    },
    modules: {
        transport: transportModule,
        geofence: geofenceModule
    },
    actions: {
        async loginApp({state, commit}) {
            try {
                const manager = new ApiManager()
                const res = await manager.login({
                    UserName: state.login,
                    Password: state.password,
                    UTCOffset: state.UTCOffset,
                })
                if (res.status === 200) {
                    commit('setToken', res.data)
                }
            } catch (e) {
                console.log("login error", e)
            }
        }
    }
})
