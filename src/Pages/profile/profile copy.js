import React from 'react';

import DPA, { connect } from 'servisofts-page';
import { SButtom, SHr, SInput, SList, SLoad, SNavigation, SText, SView } from 'servisofts-component';
import Model from '../../Model';
import { Parent } from './index';
import { EditarUsuarioRol } from 'servisofts-rn-roles_permisos';
import DatosDocumentos from '../../Components/DatosDocumentos/DatosDocumentos';
class index extends DPA.profile {
    constructor(props) {
        super(props, {
            Parent: Parent,
            excludes: ["key", "Password"],
            defaultParams: {
                "pk": Model.usuario.Action.getKey()
            },
        });
        this.pk = Model.usuario.Action.getKey();
        this.$params.pk = this.pk;
    }

    $allowEdit() {
        return true;
    }

    $allowDelete() {
        // return Model.usuarioPage.Action.getPermiso({ url: Parent.path, permiso: "delete" })
        return true;
    }
    // $allowDelete() {
    //     return Model.usuarioPage.Action.getPermiso({ url: Parent.path, permiso: "delete" })
    // }
    // $allowAccess() {
    //     return Model.usuarioPage.Action.getPermiso({ url: Parent.path, permiso: "ver" })
    // }

    // $getData() {
    //     var data = Parent.model.Action.getByKey(this.$params["pk"]); 
    //     // return Parent.model.Action.getByKey(this.$params["pk"]);
    //     return <SView col={"xs-12"}>
    //         {data.Nombres}
    //     </SView>
    // }
    $getData() {
        return Parent.model.Action.getByKey(this.$params["pk"]);
    }

    $footer() {
        var data = Parent.model.Action.getByKey(this.$params["pk"]);
        if (!data) return <SLoad />
        return <SView col={"xs-12"}>
            {data.Nombres}
            <DatosDocumentos key_usuario={this.pk} />
            {/* <SHr height={16} /> */}
            {/* <DatosDocumentosEditar key_usuario={this.pk} /> */}
            {/* <SHr height={16} /> */}
            {/* <EditarUsuarioRol key_usuario={this.pk} url={"/usuario"} permiso={"edit_rol"} /> */}
        </SView>

    }
}
export default connect(index);