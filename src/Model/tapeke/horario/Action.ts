import { SDate, SStorage } from "servisofts-component";
import { SAction } from "servisofts-model";
import SSocket from 'servisofts-socket'
import Model from "../..";

export default class Action extends SAction {

    editar(extra?: {}): Promise<unknown> {
        var key = Model.usuario.Action.getUsuarioLog().key
        console.log("kye", key)
        return super.editar({
            ...extra,
            key_usuario: key,

        });
    }

    getAllRecursive() {
        var horarios = this.getAll();
        var packs = Model.pack.Action.getAllRecursive();

        if (!horarios || !packs) return null;

        Object.values(horarios).map((obj: any) => {
            var packs = Model.pack.Action.getAllBy({
                key_horario: obj.key
            })
            horarios[obj.key].pack = Object.values(packs)[0]
        })
        return horarios;
    }

    getByKeyRestauranteProximo = (key:any, force:any) => {
        let { getByKeyRestauranteProximo, estado, key_restaurante_proximo } = this._getReducer();
        if (key_restaurante_proximo != key) {
            getByKeyRestauranteProximo = null;
            this._getReducer().key_restaurante_proximo = key;
        }
        if (getByKeyRestauranteProximo && !force) return getByKeyRestauranteProximo[0];
        if (estado == "cargando" && !force) return null;
        SSocket.sendHttpAsync(SSocket.api.root + "api", {
            ...this.model.info,
            type: "getByKeyRestauranteProximo",
            key_restaurante: key,
            estado: "cargando"
        }).then(e => {
            console.log(e)
            this._dispatch(e);
        })
        // SSocket.send({

        // })
        return null;
    }
    // getByKeyRestauranteProximo = (key) => {
    //     var data = this.getAll();
    //     var enviroments = Model.enviroment.Action.getAll();
    //     if (!data || !enviroments) return null;
    //     let env_tiempo_espera_drivers = parseFloat(enviroments["tiempo_para_cancelar_no_rocogido"]?.value ?? 0);
    //     var arr = Object.values(data).filter((itm: any) => itm.key_restaurante == key && itm.dia != -1)
    //     if (arr.length == 0) return "void";
    //     var date = new SDate();
    //     var arr2 = arr.filter((itm: any) => itm.dia >= date.getDayOfWeek());

    //     if (arr2.length > 0) {
    //         arr2.sort((a: any, b: any) => { return a.dia > b.dia ? 1 : -1 });
    //     } else {
    //         arr2 = arr;
    //         arr2.sort((a: any, b: any) => { return a.dia > b.dia ? 1 : -1 });
    //     }
    //     var list = [];
    //     arr2.map((dow: any) => {
    //         var date = new SDate();
    //         var dia = dow.dia;
    //         var text = SDate.getDayOfWeek(dia).text;
    //         if (dia == date.getDayOfWeek()) {
    //             text = "Hoy";
    //             dow.fecha = date.toString("yyyy-MM-dd");
    //         } else if (dia > date.getDayOfWeek()) {
    //             dow.fecha = date.addDay(dow.dia - date.getDayOfWeek()).toString("yyyy-MM-dd");
    //         } else if (dia < date.getDayOfWeek()) {
    //             dow.fecha = date.addDay(7 - date.getDayOfWeek() + dow.dia).toString("yyyy-MM-dd");
    //         }
    //         let days: SDate = new SDate(dow.fecha + " " + dow.hora_fin, "yyyy-MM-dd hh:mm");

    //         // let timeAwaitDrivers = 1000 * 60 * 30;
    //         let timeAwaitDrivers = env_tiempo_espera_drivers * 1000;
    //         if (days.getTime() + timeAwaitDrivers < new SDate().getTime()) {
    //             dow.fecha = date.addDay(7).toString("yyyy-MM-dd");
    //             text = "Próximo " + SDate.getDayOfWeek(dow.dia).text?.toLowerCase();
    //             days = new SDate(dow.fecha + " " + dow.hora_fin, "yyyy-MM-dd hh:mm");
    //         }
    //         dow.sdate = days;
    //         dow.text = text + " " + dow.hora_inicio + " - " + dow.hora_fin;
    //         dow.extraData = {
    //             text: text,
    //             hora_inicio: dow.hora_inicio,
    //             hora_fin: dow.hora_fin,
    //         }

    //         list.push(dow);
    //     })
    //     list.sort((a, b) => { return a.sdate.getTime() > b.sdate.getTime() ? 1 : -1 });
    //     return list[0];
    // }

    getByKeyRestaurante = ({ key }:any) => {
        // @ts-ignore
        var data = this.getAll();
        if (!data) return null;
        var arr = Object.values(data).filter((item: any) => item.key == key);
        // var cantidad = 0;
        // arr.map((item: any) => cantidad += item.cantidad);
        return arr;
    }




}