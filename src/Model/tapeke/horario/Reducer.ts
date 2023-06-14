import { SReducer } from "servisofts-model";

export default class Reducer extends SReducer {


    getByKeyRestauranteProximo(state: any, action: any): void {
        if (action.estado == "exito") {
            state.getByKeyRestauranteProximo = action.data;
        }
    }
}