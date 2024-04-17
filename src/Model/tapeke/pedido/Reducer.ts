import { SReducer } from "servisofts-model";
import { SNavigation, SThread } from 'servisofts-component';
import Sounds from "../../../Components/Sounds";

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
        let pedido = action.data;

        const filterNewPedido = (pedido) => {
            if (state.data[pedido.key] && pedido.state == 'listo') {
                new SThread(200, "newPedido", false).start(() => {
                    Sounds.play();
                    SNavigation.navigate("/pedido", { pk: pedido.key });
                })
            }
        }

        if (action.estado == "exito") {
            if (state.data) {
                filterNewPedido(pedido);
            }
            state.data[pedido.key] = pedido;
        }

        if (state.data_activos) {
            if (!state.data_activos[pedido.key]) {
                filterNewPedido(action.data);
            }
            state.data_activos[pedido.key] = pedido;
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