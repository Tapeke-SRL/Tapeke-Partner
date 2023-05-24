import { SPage, SPageListProps } from 'servisofts-component';

import profile from './profile';
import edit from './edit';
import _delete from "./delete";
import Model from '../../Model';

export const Parent = {
    name: "profile",
    path: `/profile`,
    model: Model.usuario,
}
export default SPage.combinePages(Parent.name, {
    "": profile,
    "edit": edit,
    "delete": _delete,
});