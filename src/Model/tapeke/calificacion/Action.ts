import { SAction } from "servisofts-model";
import SSocket from 'servisofts-socket'
import Model from "../..";
export default class Action extends SAction {

    getMediaByRestaurante = (key_restaurante:any) => {
        return SSocket.sendPromise({
            // @ts-ignore
            ...this.model.info,
            type: "get_media_restaurante",
            estado: "cargando",
            key_restaurante: key_restaurante,
            key_usuario: Model.usuario.Action.getKey()
        })
    }
    // getByKeyRestaurante = (key_restaurante) => {
    //     return SSocket.sendPromise({
    //         ...this.model.info,
    //         type: "getByKeyRestaurante",
    //         estado: "cargando",
    //         key_restaurante: key_restaurante,
    //         key_usuario: Model.usuario.Action.getKey()
    //     })
    // }
    getComentarios = (key_restaurante:any) => {
        return SSocket.sendPromise({
            ...this.model.info,
            type: "getComentarios",
            estado: "cargando",
            key_restaurante: key_restaurante,
            key_usuario: Model.usuario.Action.getKey()
        })
    }
}