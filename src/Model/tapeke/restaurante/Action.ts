import { SStorage, SDate } from "servisofts-component";
import { SAction } from "servisofts-model";

import SSocket from 'servisofts-socket'
import Model from "../..";


export default class Action extends SAction {

    getAll(extra?: { key_partner }) {
        console.log("Entro al get all,")
        const key_partner = Model.usuario.Action.getKey() ?? extra?.key_partner;
        if (!key_partner) return null;
        return super.getAll({
            key_partner: key_partner,
        })
    }
    registro_by_partner(extra) {
        return SSocket.sendPromise({
            ...this.model.info,
            type: "registro_by_partner",
            ...extra,
        })
    }
    editar(extra?: {}): Promise<unknown> {
        var key = Model.usuario.Action.getUsuarioLog().key
        console.log("kye", key)
        return super.editar({
            ...extra,
            key_usuario: key,

        });
    }

    select(key) {
        SStorage.setItem("rest_select", key);
        this._getReducer().rest_select = key;
    }
    getSelect() {
        return this._getReducer().rest_select;
    }
    // getAllRecursive() {
    //     var horarios = this.getAll();
    //     var packs = Model.pack.Action.getAllRecursive();

    //     if (!horarios || !packs) return null;

    //     Object.values(horarios).map((obj: any) => {
    //         var packs = Model.pack.Action.getAllBy({
    //             key_horario: obj.key
    //         })
    //         horarios[obj.key].pack = Object.values(packs)[0]
    //     })
    //     return horarios;
    // }

    getByKeyRestauranteProximo = (key) => {
        var data = this.getAll();
        if (!data) return null;
        var arr = Object.values(data).filter((itm: any) => itm.key_restaurante == key && itm.dia != -1)
        if (arr.length == 0) return "void";
        var date = new SDate();
        var arr2 = arr.filter((itm: any) => itm.dia >= date.getDayOfWeek());

        if (arr2.length > 0) {
            arr2.sort((a: any, b: any) => { return a.dia > b.dia ? 1 : -1 });
        } else {
            arr2 = arr;
            arr2.sort((a: any, b: any) => { return a.dia > b.dia ? 1 : -1 });
        }
        var list = [];
        arr2.map((dow: any) => {
            var date = new SDate();
            var dia = dow.dia;
            var text = SDate.getDayOfWeek(dia).text;
            if (dia == date.getDayOfWeek()) {
                text = "Hoy";
                dow.fecha = date.toString("yyyy-MM-dd");
            } else if (dia > date.getDayOfWeek()) {
                dow.fecha = date.addDay(dow.dia - date.getDayOfWeek()).toString("yyyy-MM-dd");
            } else if (dia < date.getDayOfWeek()) {
                dow.fecha = date.addDay(7 - date.getDayOfWeek() + dow.dia).toString("yyyy-MM-dd");
            }
            dia = new SDate(dow.fecha + " " + dow.hora_fin, "yyyy-MM-dd hh:mm");
            if (dia.getTime() < new SDate().getTime()) {
                dow.fecha = date.addDay(7).toString("yyyy-MM-dd");
                text = "Próximo " + SDate.getDayOfWeek(dow.dia).text?.toLowerCase();
                dia = new SDate(dow.fecha + " " + dow.hora_fin, "yyyy-MM-dd hh:mm");
            }
            dow.sdate = dia;
            dow.text = text + " " + dow.hora_inicio + " - " + dow.hora_fin;
            dow.extraData = {
                text: text,
                hora_inicio: dow.hora_inicio,
                hora_fin: dow.hora_fin,
            }

            list.push(dow);
        })
        list.sort((a, b) => { return a.sdate.getTime() > b.sdate.getTime() ? 1 : -1 });
        return list[0];
    }


}