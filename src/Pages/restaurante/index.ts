import { SPage, SPageListProps } from 'servisofts-component';

import root from './root';
import addmore from './addmore';
import modificarHorario from './modificarHorario';
import crearhorario from './crearhorario'
import registro from "./registro"
import edit from './edit';
export const Parent = {
    name: "restaurante",
    path: `/restaurante`,
}
export default SPage.combinePages(Parent.name, {
    "": root,
    "addmore": addmore,
    "modificarHorario": modificarHorario,
    crearhorario,
    "registro": registro,
    edit
});