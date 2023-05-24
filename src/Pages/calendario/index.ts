import { SPage, SPageListProps } from 'servisofts-component';
import root from './root';
// import calendario from './root';

export const Parent = {
    name: "calendario",
    path: `/calendario`,
    
}
export default SPage.combinePages(Parent.name, {
    "": root,
    // "/calendario": calendario,
});