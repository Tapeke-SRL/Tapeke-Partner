import { SModel } from "servisofts-model";
import Action from "./Action";
import Reducer from "./Reducer";

export default new SModel<Action, Reducer>({
    info: {
        component: "pack_extra"
    },
    Columns: {
        "key": { type: "text", pk: true },
        "key_usuario": { type: "text", fk: "usuario" },
        "fecha_on": { type: "timestamp", label: "Fecha de creacion" },
        "estado": { type: "integer" },
        "key_pack": { type: "text", fk: "pack" },
        "descripcion": { type: "text", editable: true },
        "cantidad": { type: "integer", editable: true },
        "fecha": { type: "date", editable: true },
    },
    Action,
    Reducer,
});