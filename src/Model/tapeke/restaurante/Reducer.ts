import { SStorage } from "servisofts-component";
import { SReducer } from "servisofts-model";

export default class Reducer extends SReducer {
    initialState(extra?: {}) {
        var initState = super.initialState(extra);
        SStorage.getItem("rest_select", (itm) => {
            if (!itm) return;
            initState.rest_select = itm;
        });
        return initState;
    }

    enable_tapeke(state: any, action: any): void {
        if(action.estado == "exito"){
            if(action.key_restaurante){
                state.data[action.key_restaurante].tapeke_deshabilitado = false;   
            }
        }
    }
    disable_tapeke(state: any, action: any): void {
        if(action.estado == "exito"){
            if(action.key_restaurante){
                state.data[action.key_restaurante].tapeke_deshabilitado = true;   
            }
        }
    }

}