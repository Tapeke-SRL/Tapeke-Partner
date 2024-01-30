import DPA, { connect } from 'servisofts-page';
import { Parent } from '.';
import SSocket from 'servisofts-socket';
import { SNavigation, SPopup } from 'servisofts-component';
import Model from '../../../Model';

class index extends DPA.new {
    constructor(props) {
        super(props, {
            Parent: Parent,
            params: ["key_restaurante"],
            excludes: ["key", "fecha_on", "key_usuario", "estado", "key_restaurante", "habilitado"]
        });
    }

    $allowAccess() {
        // return Model.usuarioPage.Action.getPermiso({ url: Parent.path, permiso: "new" })
        return true;
    }

    $inputs() {
        var inp = super.$inputs();
        inp["precio"].type = "money"

        inp["mayor_edad"].type = "select"
        inp["mayor_edad"].options = [{ key: "", content: "SELECCIONAR" }, { key: "true", content: "SI" }, { key: "false", content: "NO" }]

        inp["ley_seca"].type = "select"
        inp["ley_seca"].options = [{ key: "", content: "SELECCIONAR" }, { key: "true", content: "SI" }, { key: "false", content: "NO" }]

        inp["key_categoria_producto"].editable = false;
        inp["key_categoria_producto"].required = true;
        inp["key_categoria_producto"].onPress = (val) => {
            SNavigation.navigate("/restaurante/categoria_producto/list", {
                key_restaurante: this.$params.key_restaurante, onSelect: (val) => {
                    this.setState({ categoria_producto: val })
                }
            })
        }

        inp["key_categoria_producto"].value = this.state.categoria_producto ? this.state.categoria_producto.nombre : null;

        return inp;
    }

    $onSubmit(data) {
        data.habilitado = false;

        if (data.precio <= 0) {
            SPopup.alert("El producto no puede tener un precio menor o igual a 0")
            return;
        }

        if (!this.state.categoria_producto.key) return null;
        data.key_categoria_producto = this.state.categoria_producto.key;

        Parent.model.Action.registro({
            data: data,
            key_usuario: Model.usuario.Action.getKey(),
        }).then((resp) => {

            this.form.uploadFiles(
                SSocket.api.root + "upload/producto/" + resp.data.key
            );

            SNavigation.goBack();
        }).catch(e => {
            console.error(e);
        })
    }
}

export default connect(index);