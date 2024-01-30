import DPA, { connect } from 'servisofts-page';
import { Parent } from '.';
import { SNavigation, SPopup } from 'servisofts-component';
import Model from '../../../Model';

class index extends DPA.edit {
    constructor(props) {
        super(props, {
            Parent: Parent,
            params: ["key_restaurante"],
            excludes: []
        });
    }
    $allowAccess() {
        // return Model.usuarioPage.Action.getPermiso({ url: Parent.path, permiso: "edit" }) 
        return true;
    }

    $getData() {
        return Parent.model.Action.getByKey(this.pk);
    }

    $inputs() {
        var inp = super.$inputs();
        inp["precio"].type = "money"
        inp["precio"].defaultValue = parseFloat(inp["precio"].defaultValue ?? 0).toFixed(2);

        inp["mayor_edad"].type = "select"
        inp["mayor_edad"].options = [{ key: "", content: "SELECCIONAR" }, { key: "true", content: "SI" }, { key: "false", content: "NO" }]
        inp["mayor_edad"].defaultValue = inp["mayor_edad"].defaultValue + ""

        inp["ley_seca"].type = "select"
        inp["ley_seca"].options = [{ key: "", content: "SELECCIONAR" }, { key: "true", content: "SI" }, { key: "false", content: "NO" }]
        inp["ley_seca"].defaultValue = inp["ley_seca"].defaultValue + ""

        inp["key_categoria_producto"].onPress = (val) => {
            SNavigation.navigate("/restaurante/categoria_producto/list", {
                key_restaurante: this.$params.key_restaurante, onSelect: (val) => {
                    this.setState({ categoria_producto: val })
                }
            })
        }

        return inp;
    }

    $onSubmit(data) {
        if (data.precio <= 0) {
            SPopup.alert("El producto no puede tener un precio menor o igual a 0")
            return;
        }
        Parent.model.Action.editar({
            data: {
                ...this.data,
                ...data
            },
            key_usuario: Model.usuario.Action.getKey(),
        }).then((resp) => {
            SNavigation.goBack();
        }).catch(e => {
            console.error(e);
        })
    }
}

export default connect(index);