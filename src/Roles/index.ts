import SSocket from "servisofts-socket";
import Model from "../Model";

export default class Roles {


    static data: any = {}
    static async getRolData(key_rol: string) {
        if (Roles.data[key_rol]) return Roles.data[key_rol];
        const resp: any = await SSocket.sendPromise({
            service: "roles_permisos",
            component: "usuarioPage",
            type: "getAllRol",
            key_rol: key_rol
        })
        Roles.data[key_rol] = resp.data;
        return Roles.data[key_rol];
    }

    static async getPermiso(props: { key_rol: string, url: string, permiso: string }) {
        const data = await Roles.getRolData(props.key_rol);
        const page = data[props.url];
        if (page) {
            const permiso = page.permisos[props.permiso];
            if(!permiso) throw "Sin permiso"
            return permiso;
        }
       throw "Sin permiso"
    }
}