import DPA, { connect } from 'servisofts-page';
import { Parent } from '.';
import { SNavigation, SPopup } from 'servisofts-component';
import Model from '../../../../Model';

class index extends DPA.new {
    constructor(props) {
        super(props, {
            Parent: Parent,
            params: ["key_producto"],
            excludes: ["key", "fecha_on", "key_usuario", "estado", "key_producto"]
        });
    }

    // $allowAccess() {
    //     // return Model.usuarioPage.Action.getPermiso({ url: Parent.path, permiso: "new" })
    //     return true;
    // }

    $inputs() {
        var imp = super.$inputs();
        return imp;
    }

    $onSubmit(data) {
        data.key_producto = this.$params.key_producto;

        Parent.model.Action.registro({
            data: data,
            key_usuario: Model.usuario.Action.getKey(),
        }).then((resp) => {
            SNavigation.goBack();
        }).catch(e => {
            console.error(e);
        })
    }
}

export default connect(index);