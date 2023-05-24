import { SPage } from 'servisofts-component';

import mapa from './mapa';

export const Parent = {
    name: "direccion",
    path: "/direccion"
}
export default SPage.combinePages(Parent.name, {
    "mapa": mapa,
});