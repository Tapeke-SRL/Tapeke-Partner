import { SPage, SPageListProps } from 'servisofts-component';
import root from './root';
export const Parent = {
    name: "soporte",
    path: `/soporte`,
}
export default SPage.combinePages(Parent.name, {
    "": root,
});