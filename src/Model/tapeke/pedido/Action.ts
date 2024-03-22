import { SStorage } from "servisofts-component";
import { SAction } from "servisofts-model";
import SSocket from 'servisofts-socket'
import Model from "../..";

export default class Action extends SAction {

    // getAll(extra?: {}) {
    // return this.getAllActivos();
    // }

    getAllByHorarioRestaurante(extra?: { key_restaurante: any, fecha: any }) {
        var reducer = this._getReducer();
        if (reducer.key_restaurante != extra.key_restaurante || reducer.fecha != extra.fecha) {
            reducer.data = null;
            reducer.key_restaurante = extra.key_restaurante;
            reducer.fecha = extra.fecha;
        }
        const data = reducer?.data;
        if (!data) {
            if (reducer.estado == "cargando") return null;
            const petition = {
                ...this.model.info,
                type: "getAllByHorarioRestaurante",
                estado: "cargando",
                ...extra
            }
            SSocket.send(petition);
            return null;
        }
        return data;
    }
    getVendidosData = ({ key_pack, fecha, key_restaurante }) => {
        var data = this.getAllByHorarioRestaurante({ fecha: fecha, key_restaurante: key_restaurante });
        if (!data) return null;
        var arr = Object.values(data).filter((item: any) =>
            item.key_pack == key_pack
            && item.fecha == fecha
            && (
                item.state != "pago_en_proceso"
                && item.state != "pendiente_pago"
                && item.state != "timeout_pago"
                && item.state != "anulado"
            )
        );
        var cantidad = 0;
        arr.map((item: any) => cantidad += item.cantidad);
        return arr;
    }

    getAllActivos(extra?: {}) {
        var reducer = this._getReducer();
        const data = reducer?.data_activos;
        if (!data) {
            if (reducer.estado == "cargando") return null;
            const petition = {
                ...this.model.info,
                type: "getAllActivos",
                estado: "cargando",
                ...extra
            }
            SSocket.send(petition);
            return null;
        }
        return data;
    }
    getEnCurso() {
        const data = this.getAllActivos()
        if (!data) return null;
        var key_usuario = Model.usuario.Action.getKey();
        if (!key_usuario) return null;
        var objFinal = Object.values(data).filter((a: any) => key_usuario == a.key_usuario
            && a.state != "entregado"
            && a.state != "pendiente_pago"
            && a.state != "pago_en_proceso"
            && a.state != "timeout_pago"
            && a.state != "anulado"
        )
        return objFinal;
    }

    // entregar(key) {
    //     var reducer = this._getReducer();
    //     if (reducer.my) {
    //         return reducer.my;
    //     }
    //     if (reducer.estado == "cargando") return null;
    //     var petition = {
    //         component: "pedido",
    //         type: "entregar",
    //         estado: "cargando",
    //         key_pedido: key,
    //         key_usuario: Model.usuario.Action.getUsuarioLog()
    //     }
    //     SSocket.send(petition);
    //     return null;
    // }
    entregar(key) {
        return SSocket.sendPromise({
            component: "pedido",
            type: "entregar",
            estado: "cargando",
            key_pedido: key,
            key_usuario: Model.usuario.Action.getUsuarioLog()
        })
    }


    getDetalle(key, reload) {
        var reducer = this._getReducer();
        if (reload) {
            reducer.data_activos = null;
        }
        var data = reducer.data_activos;

        if (data) {
            if (data[key]) {
                return data[key];
            }
        }
        if (reducer.estado == "cargando") return null;
        const petition = {
            ...this.model.info,
            type: "getDetalle",
            estado: "cargando",
            key_pedido: key,
            key_usuario: Model.usuario.Action.getKey()
        }
        SSocket.send(petition)
    }

    action({ key_pedido, action }) {
        return SSocket.sendPromise({
            "component": "pedido",
            "type": "action",
            "key_pedido": key_pedido,
            "action": action
        })
    }
}