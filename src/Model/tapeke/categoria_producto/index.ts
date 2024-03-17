import { SModel } from "servisofts-model";
import Action from "./Action";
import Reducer from "./Reducer";

export default new SModel<Action, Reducer>({
    info: {
        component: "categoria_producto"
    },
    Columns: {
        "key": { type: "text", pk: true },
        "key_usuario": { type: "text", fk: "usuario" },
        "fecha_on": { type: "timestamp", label: "Fecha de creacion" },
        "estado": { type: "integer" },
        
        "key_restaurante": { type: "text", fk: "restaurante", editable: false },
        "index": { type: "integer", editable: true, notNull: false, label: "Index" },
        "nombre": { type: "text", editable: true, notNull: false, label: "Nombre" },
    },
    Action,
    Reducer,
});