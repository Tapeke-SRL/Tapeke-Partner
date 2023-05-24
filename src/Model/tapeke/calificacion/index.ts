import { SModel } from "servisofts-model";
import Action from "./Action";
import Reducer from "./Reducer";

export default new SModel<Action, Reducer>({
    info: {
        component: "calificacion"
    },
    Columns: {
        "key": { type: "text", pk: true },
        "key_usuario": { type: "text", fk: "usuario" },
        "fecha_on": { type: "timestamp", label: "Fecha de creacion" },
        "estado": { type: "integer" },
        "star": { type: "integer" },
        "buena_calidad": { type: "boolean" },
        "buena_cantidad": { type: "boolean" },
        "buen_servcio": { type: "boolean" },
        "comentario": { type: "text" },

    },

    Action,
    Reducer,
});