import { SPage } from "servisofts-component";
import Model from "../../../Model";
import _new from "./new";
import edit from "./edit";
import list from "./list";
import sub_producto from "./sub_producto";
import categoria_producto from "../categoria_producto";

const model = Model.producto;
export const Parent = {
    name: "producto",
    path: `/restaurante/producto`,
    model
}
export default SPage.combinePages(Parent.name, {
    "": list,
    "new": _new,
    "edit": edit,
    ...sub_producto,
    ...categoria_producto,
})
