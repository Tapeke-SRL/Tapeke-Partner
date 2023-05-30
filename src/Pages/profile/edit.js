import React from 'react';
import DPA, { connect } from 'servisofts-page';
import { Parent } from '.';
import { SNavigation, SPopup, SView, SIcon, SText, STheme } from 'servisofts-component';
import Model from '../../Model';
import CryptoJS from 'crypto-js';
import DatosDocumentosEditar from '../../Components/DatosDocumentos/DatosDocumentosEditar';

class index extends DPA.edit {
    constructor(props) {
        super(props, {
            Parent: Parent,
            title: "Editar perfil",
            excludes: [],
        });
        this.pk = Model.usuario.Action.getKey();
    }
    // $allowAccess() {
    // return Model.usuarioPage.Action.getPermiso({ url: Parent.path, permiso: "edit" })
    // }

    $getData() {
        return Parent.model.Action.getByKey(this.pk);
    }

    alertErrorPasswordLength() {
        return <SView col={"xs-11 md-8 xl-6"} row center style={{ height: 250, borderRadius: 8, }} backgroundColor={STheme.color.background} >
            <SView col={"xs-11"} height={40} />
            <SView col={"xs-11"}  >
                <SIcon name={"InputPassword"} height={100} />
            </SView>
            <SView col={"xs-11"} height={15} />
            <SView col={"xs-12"} center  >
                <SText center color={STheme.color.darkGray} style={{ fontSize: 18, fontWeight: "bold" }}>Las contraseñas deben contener más de 8 caracteres.</SText>
            </SView>
            <SView col={"xs-11"} height={30} />
        </SView>
    }

    $inputs() {
        var inputs = super.$inputs();
        inputs["Password"].type = "password"
        inputs["Correo"].type = "email"
        inputs["Telefono"].type = "phone"
        return inputs;
    }
    $onSubmit(data) {
        if (data["Password"].length <= 8) {
            SPopup.open({ content: this.alertErrorPasswordLength() });
            return;
        }
        var dataUser = Parent.model.Action.getByKey(this.pk);
        if (!dataUser) return;
        if (data.Password != dataUser.Password) data.Password = CryptoJS.MD5(data.Password).toString();

        Parent.model.Action.editar({
            data: {
                ...this.data,
                ...data
            },
            key_usuario: ""
        }).then((resp) => {
            SNavigation.goBack();
            // this.presolve(this.pk)
        }).catch(e => {
            console.error(e);
        })
    }

    // $submitName() {
    //     return ""
    // }
    // $footer() {
    //     return <DatosDocumentosEditar key_usuario={this.pk} onSubmit={() => {
    //         return new Promise((resolve, reject) => {
    //             this.presolve = resolve;
    //             this.form.submit();
    //             // resolve("KEY_USUARIO");
    //         })
    //     }} />
    // }
}

export default connect(index);