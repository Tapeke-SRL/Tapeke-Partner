import { SPage, SPageListProps } from 'servisofts-component';
import historialPedido from './historialPedido';


export const Parent = {
    name: "reporte",
    path: `/reporte`,
}
export default SPage.combinePages(Parent.name, {
    "hitorialPedidos": historialPedido
});