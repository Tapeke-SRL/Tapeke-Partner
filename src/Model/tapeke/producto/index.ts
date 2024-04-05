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

        "nombre": { type: "text", editable: true, notNull: true, label: "Nombre" },
        "descripcion": { type: "text", editable: true, notNull: false, label: "Descripción" },
        "precio": { type: "double", editable: true, notNull: true, label: "Precio" },
        "habilitado": { type: "boolean", notNull: true, label: "Habilitado" },
        "mayor_edad": { type: "boolean", editable: true, notNull: true, label: "Mayor de edad" },
        "ley_seca": { type: "boolean", editable: true, notNull: true, label: "Ley Seca" },
        "key_categoria_producto": { type: "text", fk: "categoria_producto", editable: true, label: "Categoria Producto" },
        "index": { type: "integer", editable: true, notNull: true, label: "Index" },

        "descuento_monto": { type: "double", label: "Descuento Monto" },
        "descuento_porcentaje": { type: "double", label: "Descuento Porcentaje" },

        // "label_oferta": { type: "text", editable: true, label: "Label Ofertanga" },

        "limite_compra": { type: "integer", editable: true, label: "Limite de compra" },

        "fecha_habilitacion_automatica": { type: "date", label: "Fecha habilitación automática" },
    },
    image: {
        api: "root",
        name: "producto"
    },
    Action,
    Reducer,
});