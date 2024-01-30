import { SModel } from "servisofts-model";
import Action from "./Action";
import Reducer from "./Reducer";

export default new SModel<Action, Reducer>({
    info: {
        component: "sub_producto_detalle"
    },
    Columns: {
        "key": { type: "text", pk: true },
        "key_usuario": { type: "text", fk: "usuario" },
        "fecha_on": { type: "timestamp", label: "Fecha de creación" },
        "estado": { type: "integer" },

        "key_sub_producto": { type: "text", fk: "producto", label: "key_producto" },
        "nombre": { type: "text", editable: true, notNull: true, label: "Nombre" },
        "descripcion": { type: "text", editable: true, notNull: false, label: "Descripción" },
        "precio": { type: "double", editable: true, notNull: true, label: "Precio" },
    },
    Action,
    Reducer,
});