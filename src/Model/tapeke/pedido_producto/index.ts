import { SModel } from "servisofts-model";
import Action from "./Action";
import Reducer from "./Reducer";

export default new SModel<Action, Reducer>({
    info: {
        component: "pedido_producto",
    },
    Columns: {
        "key": { type: "text", pk: true },
        "key_usuario": { type: "text", fk: "usuario" },
        "fecha_on": { type: "timestamp", label: "Fecha de creacion" },
        "estado": { type: "integer" },

        "key_pedido": { type: "text", fk: "pedido" },
        "key_producto": { type: "text", fk: "producto" },
        "descripcion": { type: "text", editable: true, notNull: false, label: "Descripción" },
        "cantidad": { type: "text", editable: true, notNull: false, label: "Cantidad" },
        "precio": { type: "double", editable: true, notNull: true, label: "Precio" },
    },
    Action,
    Reducer,
});