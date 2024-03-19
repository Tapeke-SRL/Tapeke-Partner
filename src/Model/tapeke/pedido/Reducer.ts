import { SReducer } from "servisofts-model";
import { SNavigation, SThread } from 'servisofts-component';

export default class Reducer extends SReducer {


    getAllByHorarioRestaurante(state: any, action: any) {
        if (action.estado == "exito") {
            state.data = action.data;
        }
    }
    getAllActivos(state: any, action: any) {
        if (action.estado == "exito") {
            state.data_activos = action.data;
        }
    }
    editar(state: any, action: any): void {
        if (action.estado == "exito") {
            if (state.data) {
                if (!state.data[action.data[this.model.pk]]) {
                    new SThread(100, "sadasd", false).start(() => {
                        SNavigation.navigate("/pedido", { pk: action.data[this.model.pk] });

                    })
                }
                state.data[action.data[this.model.pk]] = action.data;
            }
            if (state.data_activos) {
                if (!state.data_activos[action.data[this.model.pk]]) {
                    new SThread(100, "sadasd", false).start(() => {
                        SNavigation.navigate("/pedido", { pk: action.data[this.model.pk] });

                    })
                }
                state.data_activos[action.data[this.model.pk]] = action.data;
            }

        }
    }
    registro(state: any, action: any): void {
        if (action.estado == "exito") {
            if (state.data) {
                state.data[action.data[this.model.pk]] = action.data;
            }
            if (!state.data_activos) {
                state.data_activos = {}
            }
            state.data_activos[action.data[this.model.pk]] = action.data;
        }
    }
    getDetalle(state: any, action: any): void {
        if (action.estado == "exito") {
            if (!state.data_activos) {
                state.data_activos = {}
            }
            state.data_activos[action.data[this.model.pk]] = action.data;
        }
    }
}