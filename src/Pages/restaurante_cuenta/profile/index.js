import DPA, { connect } from 'servisofts-page';
import { Parent } from ".."
import { SHr, SList, SLoad, SText, SView } from 'servisofts-component';
import Model from '../../../Model';
import Roles from '../../../Roles';
class index extends DPA.profile {
    constructor(props) {
        super(props, { Parent: Parent, title: "Cuentas bancarias", excludes: ["key", "key_usuario", "key_servicio", "estado", "key_restaurante", "fecha_on"] });
    }
    componentDidMount() {
        this.getPermisoEditar();
        this.getPermisoEliminar();
    }
    getPermisoEditar() {
        Roles.getPermiso({
            key_rol: Model.restaurante.Action.getSelectKeyRol(),
            url: "/_partner/restaurante_cuenta",
            permiso: "edit"
        }).then(e => {
            this.setState({ edit: e })
            console.log(e);
        }).catch(e => {

        })
    }
    getPermisoEliminar() {
        Roles.getPermiso({
            key_rol: Model.restaurante.Action.getSelectKeyRol(),
            url: "/_partner/restaurante_cuenta",
            permiso: "delete"
        }).then(e => {
            this.setState({ delete: e })
            console.log(e);
        }).catch(e => {

        })
    }
    $allowEdit() {
        return this.state.edit;
        return Model.usuarioPage.Action.getPermiso({ url: Parent.path, permiso: "edit" })
    }
    $allowDelete() {
        return this.state.delete;
        return Model.usuarioPage.Action.getPermiso({ url: Parent.path, permiso: "delete" })
    }
    $allowAccess() {
        return Model.usuarioPage.Action.getPermiso({ url: Parent.path, permiso: "ver" })
    }

    $getData() {
        return Parent.model.Action.getByKey(this.pk);
    }
}
export default connect(index);