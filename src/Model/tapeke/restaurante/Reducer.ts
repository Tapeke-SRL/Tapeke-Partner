// @ts-nocheck
import { SStorage } from "servisofts-component";
import { SReducer } from "servisofts-model";

export default class Reducer extends SReducer {
    initialState(extra?: {}) {
        var initState = super.initialState(extra);
        SStorage.getItem("rest_select", (itm) => {
            if (!itm) return;
            try {
                initState.rest_select = JSON.parse(itm);
            } catch (error) {
                console.log("sin rest")
            }
        });
        return initState;
    }

    enable_tapeke(state: any, action: any): void {
        if (action.estado == "exito") {
            if (action.key_restaurante) {
                state.data[action.key_restaurante].tapeke_deshabilitado = false;
            }
        }
    }
    disable_tapeke(state: any, action: any): void {
        if (action.estado == "exito") {
            if (action.key_restaurante) {
                state.data[action.key_restaurante].tapeke_deshabilitado = true;
            }
        }
    }

}