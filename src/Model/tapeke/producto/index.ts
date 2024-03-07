import { SModel } from "servisofts-model";
import Action from "./Action";
import Reducer from "./Reducer";

export default new SModel<Action, Reducer>({
    info: {
        component: "producto"
    },
    Columns: {
        "key": { type: "text", pk: true },
        "key_usuario": { type: "text", fk: "usuario" },
        "fecha_on": { type: "timestamp", label: "Fecha de creación" },
        "estado": { type: "integer" },


        "index": { type: "text", editable: true, notNull: true, label: "index" },
        "nombre": { type: "text", editable: true, notNull: true, label: "Nombre del producto" },
        "descripcion": { type: "text", editable: true, notNull: false, label: "Descripción del producto" },
        "precio": { type: "double", editable: true, notNull: true, label: "Precio" },
        "habilitado": { type: "boolean", notNull: true, label: "Habilitado" },
        "mayor_edad": { type: "boolean", editable: true, notNull: false, label: "Mayor de edad (Opcional)" },
        "ley_seca": { type: "boolean", editable: true, notNull: false, label: "Ley Seca (Opcional)" },
        "key_categoria_producto": { type: "text", fk: "categoria_producto", editable: true, notNull: true, label: "Categoria Producto" },
    },
    image: {
        api: "root",
        name: "producto"
    },
    Action,
    Reducer,
});