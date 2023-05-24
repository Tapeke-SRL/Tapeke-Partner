import { SModel } from "servisofts-model";
import Action from "./Action";
import Reducer from "./Reducer";

export default new SModel<Action, Reducer>({
    info: {
        component: "usuario_restaurante"
    },
    Columns: {
        "key": { type: "text", pk: true },
        "fecha_on": { type: "timestamp", label: "Fecha de creacion" },
        "estado": { type: "integer" },
        "key_usuario": { type: "text", fk: "usuario" },
        "key_restaurante": { type: "text", fk: "restaurante", notNull: true, },
    },
    Action,
    Reducer,
});