import { SModel } from "servisofts-model";
import Action from "./Action";
import Reducer from "./Reducer";

export default new SModel<Action, Reducer>({
    info: {
        component: "restaurante_cuenta"
    },
    Columns: {
        "key": { type: "text", pk: true },
        "key_usuario": { type: "text", fk: "usuario" },
        "fecha_on": { type: "timestamp", label: "Fecha de creacion" },
        "estado": { type: "integer" },
        "ci": { type: "text", editable: true, notNull: true, label: "CI" },
        "nombre": { type: "text", editable: true, notNull: true, label: "Nombre" },
        "sucursal": { type: "text", editable: true, notNull: true, label: "Sucursal" },
        "numero_cuenta": { type: "text", editable: true, notNull: true, label: "Numero de cuenta" },
        "banco": { type: "text", editable: true, notNull: true, label: "Banco" },
        "key_restaurante": { type: "text", fk: "restaurante" },


    },
    Action,
    Reducer,
});