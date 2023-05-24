import { SPage, SPageListProps } from 'servisofts-component';
import root from './root';
// import calendario from './root';

export const Parent = {
    name: "calificacion",
    path: `/calificacion`,
    
}
export default SPage.combinePages(Parent.name, {
    "": root,
    // "/calendario": calendario,
});