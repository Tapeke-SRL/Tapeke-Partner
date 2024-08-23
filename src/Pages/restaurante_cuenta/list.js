import { SNavigation, SNotification, SText, STheme } from 'servisofts-component';
import DPA, { connect } from 'servisofts-page';
import { Parent } from "."
import Model from '../../Model';
import AccentBar from '../../Components/AccentBar';
import Roles from '../../Roles';

class index extends DPA.list {

    constructor(props) {
        super(props, {
            title: "Cuentas bancarias",
            Parent: Parent,
            excludes: ["key", "fecha_on", "key_usuario", "key_servicio", "estado", "key_restaurante"]

        });
        this.state.ver = true;
    }
    componentDidMount() {
        if (!Model.restaurante.Action.getSelect()?.key) {
            SNavigation.goBack();
            return;
        }
        this.getPermisoAgregar();
        this.getPermisoVer();

    }

    getPermisoVer() {
        Roles.getPermiso({
            key_rol: Model.restaurante.Action.getSelectKeyRol(),
            url: "/_partner/restaurante_cuenta",
            permiso: "ver"
        }).then(e => {
            this.setState({ ver: e })
        }).catch(e => {
            SNotification.send({
                title: "Acceso denegado",
                body: "No tienes permisos para ver esta pagina.",
                color: STheme.color.danger,
                time: 5000,
            })
            SNavigation.goBack();

        })
    }
    getPermisoAgregar() {
        Roles.getPermiso({
            key_rol: Model.restaurante.Action.getSelectKeyRol(),
            url: "/_partner/restaurante_cuenta",
            permiso: "add"
        }).then(e => {
            this.setState({ add: e })
            console.log(e);
        }).catch(e => {

        })
    }

    // getPermisoEliminar() {
    //     Roles.getPermiso({
    //         key_rol: Model.restaurante.Action.getSelectKeyRol(),
    //         url: "/_partner/roles",
    //         permiso: "delete"
    //     }).then(e => {
    //         this.setState({ delete: e })
    //         console.log(e);
    //     }).catch(e => {

    //     })
    // }
    $allowNew() {
        return this.state.add;
        return Model.usuarioPage.Action.getPermiso({ url: Parent.path, permiso: "new" });
    }
    $allowTable() {
        return false;
        return Model.usuarioPage.Action.getPermiso({ url: Parent.path, permiso: "table" });
    }
    $allowAccess() {
        return true;
        return Model.usuarioPage.Action.getPermiso({ url: Parent.path, permiso: "ver" })
    }
    $filter(data) {
        return data.estado != 0
    }

    $getData() {
        return Parent.model.Action.getAllBy({ key_restaurante: Model.restaurante.Action.getSelect()?.key });
    }
}
export default connect(index);