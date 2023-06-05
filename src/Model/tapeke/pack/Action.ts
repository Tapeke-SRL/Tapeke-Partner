import { SDate, SStorage } from "servisofts-component";
import { SAction } from "servisofts-model";
import SSocket from 'servisofts-socket'
import Model from "../..";

export default class Action extends SAction {

    getAllRecursive() {
        var packs = this.getAll({
            vigentes: true
        });
        // var pedidos = Model.pedido.Action.getAllActivos();
        var pack_extras = Model.pack_extra.Action.getAll({
            vigentes: true
        });
        if (!packs || !pack_extras) return null;

        // var lista = Object.values(pedidos);
        var lista_pack_extras = Object.values(pack_extras);
        // console.log(lista_pack_extras)
        let curday = new SDate().toString("yyyy-MM-dd");
        Object.values(packs).map((pack: any) => {
            // var pedidos_del_pack = lista.filter((obj: any) => obj.key_pack == pack.key);
            var extras_del_pack = lista_pack_extras.filter((obj: any) => (obj.key_pack == pack.key ))
            // var extras_del_pack = lista_pack_extras.filter((obj: any) => (obj.key_pack == pack.key && new SDate(obj.fecha, "yyyy-MM-ddThh:mm:ss").toString("yyyy-MM-dd") == curday))
            // pack.pedidos = pedidos_del_pack;
            // var pedidos_activos = pedidos_del_pack.filter((p: any) => p.state != "pendiente_pago" && p.state != "timeout_pago");

            var cantidad = 0;
            var cantidad_extra = 0;
            // pedidos_activos.map((o: any) => cantidad += o.cantidad);
            extras_del_pack.map((o: any) => cantidad_extra += parseFloat(o.cantidad));
            pack.cantidad_disponibles = (parseFloat(pack.cantidad) + (cantidad_extra)) - cantidad
            pack.cantidad_total = parseFloat(pack.cantidad) + (cantidad_extra);
            // console.log(cantidad_extra)
        })
        return packs;
    }

    getByKeyHorario = (key_horario, props) => {
        var data = this.getAllRecursive();
        if (!data) return null;
        return Object.values(data).filter((item: any) => item.key_horario == key_horario)[0];
    }
}