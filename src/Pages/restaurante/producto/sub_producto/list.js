import React from 'react';
import DPA, { connect } from 'servisofts-page';
import { Parent } from "."
import Model from '../../../../Model';
import { SButtom, SHr, SList, SNavigation, SSwitch, SText, STheme, SView, SIcon, SPopup } from 'servisofts-component';

class index extends DPA.list {
    constructor(props) {
        super(props, {
            Parent: Parent,
            limit: 10,
            params: ["key_producto"],
            excludes: ["key", "estado", "key_usuario"],
        });

        // this.editPermisoSubProducto = Model.usuarioPage.Action.getPermiso({ url: Parent.path, permiso: "edit" });
        // this.deletePermisoSubProducto = Model.usuarioPage.Action.getPermiso({ url: Parent.path, permiso: "delete" });

        this.editPermisoSubProducto = true;
        this.deletePermisoSubProducto = true;

        this.editPermisoDetalleSubProducto = true;
        this.deletePermisoDetalleSubProducto = true;
    }

    componentDidMount() {
        Parent.model.Action.CLEAR()
    }

    $allowNew() {
        // return Model.usuarioPage.Action.getPermiso({ url: Parent.path, permiso: "new" });
        return true;
    }

    $allowAccess() {
        // return Model.usuarioPage.Action.getPermiso({ url: Parent.path, permiso: "view" });
        return true;
    }

    $filter(data) {
        return data.estado != 0
    }

    $getData() {
        this.subProductoDetalle = Model.sub_producto_detalle.Action.getAll();
        return Parent.model.Action.getAll({ key_producto: this.$params.key_producto });
    }


    $order() {
        return [{ key: "fecha_on", order: "desc", type: "date" }];
    }

    handleChange_habilitado(obj, habilitado) {
        // if (!this.editPermiso) {
        //     SPopup.alert("No tienes permisos para esta acción.")
        //     return;
        // }

        if (obj.estado == 1) {
            obj.estado = -1;
        } else {
            obj.estado = 1;
        }

        Model.sub_producto.Action.editar({
            data: {
                ...obj,
                estado: obj.estado
            },
            key_usuario: Model.usuario.Action.getKey()
        })
    }

    onEditSubProducto(key_sub_producto) {
        SNavigation.navigate(Parent.path + "/edit", { pk: key_sub_producto })
    }

    onDeleteSubProducto(obj) {
        if (this.deletePermisoSubProducto) {
            SPopup.confirm({
                title: "Eliminar Producto",
                message: "¿Seguro que desea remover el producto?",
                onPress: () => {
                    Parent.model.Action.editar({ //TODO no edita.
                        data: {
                            // ...obj,
                            key: obj.key,
                            estado: 0
                        },
                        key_usuario: Model.usuario.Action.getKey()
                    })
                }
            })
        } else {
            SPopup.alert("No tiene permisos para eliminar el tag")
        }
    }

    onEditSubProductoDetalle(key_sub_producto_detalle) {
        SNavigation.navigate(Parent.path + "/sub_producto_detalle/edit", { pk: key_sub_producto_detalle })
    }

    onDeleteSubProductoDetalle(obj) {
        if (this.deletePermisoDetalleSubProducto) {
            SPopup.confirm({
                title: "Eliminar Detalle Sub Producto",
                message: "¿Seguro que desea remover el Detalle Sub Producto?",
                onPress: () => {
                    Model.sub_producto_detalle.Action.editar({ //TODO no edita.
                        data: {
                            // ...obj,
                            key: obj.key,
                            estado: 0
                        },
                        key_usuario: Model.usuario.Action.getKey()
                    })
                }
            })
        } else {
            SPopup.alert("No tiene permisos para eliminar el tag")
        }
    }

    cardSubProductoDetalle(key_sub_producto) {
        return <>
            <SView>
                <SHr height={5} />
                <SHr height={1} color={STheme.color.secondary} />
                <SText center fontSize={15}>Sub Producto Detalles</SText>
                <SHr height={1} color={STheme.color.secondary} />
                <SButtom
                    onPress={() =>
                        SNavigation.navigate(Parent.path + "/sub_producto_detalle/new", { key_sub_producto: key_sub_producto })
                    }
                >+ Crear</SButtom>
                <SList
                    data={this.subProductoDetalle}
                    space={0}
                    order={[{ key: "nombre", order: "desc", peso: 1 }]}
                    filter={obj => (obj.key_sub_producto == key_sub_producto && obj.estado != 0)}
                    render={(obj) => {
                        return <>
                            <SView card row flex
                                style={{
                                    margin: 5,
                                    padding: 5,
                                    justifyContent: "space-between",
                                }}
                            >
                                <SView>
                                    <SText padding={3}>Nombre: {obj.nombre}</SText>
                                    <SText padding={3}>Descripción:</SText>
                                    <SText padding={3} width={150}>{obj.descripcion}</SText>
                                    <SText padding={3}>Precio: {obj.precio}</SText>
                                </SView>
                                <SView row center>
                                    <SView style={{ marginRight: 10 }} onPress={() => this.onEditSubProductoDetalle(obj.key)}>
                                        {this.editPermisoDetalleSubProducto ? <SIcon name={"Edit"} height={30} width={30}></SIcon> : <SView />}
                                    </SView>
                                    <SView onPress={() => this.onDeleteSubProductoDetalle(obj)}>
                                        {this.deletePermisoDetalleSubProducto ? <SIcon name={"Delete"} height={30} width={30}></SIcon> : <SView />}
                                    </SView>
                                </SView>
                            </SView>
                        </>
                    }}
                />
            </SView >
        </>
    }

    $item(obj) {
        let habilitado = obj.estado == -1 ? false : true;
        return <>
            <SView card
                style={{
                    margin: 4,
                    padding: 8,
                    borderRadius: 10,
                }}
            >
                <SView flex row
                    style={{
                        justifyContent: "space-between"
                    }}
                >
                    <SView col={"xs-8"}>
                        <SText padding={5}>Nombre:</SText>
                        <SText padding={5}>{obj.nombre}</SText>
                        <SText padding={3}>Descripción:</SText>
                        <SText padding={3} width={200}>{obj.descripcion}</SText>
                        <SText padding={3}>Cantidad de Selección: {obj.cantidad_seleccion}</SText>
                    </SView>

                    <SView col={"xs-4"} center>
                        <SView row center>
                            <SView marginRight={5} onPress={() => this.onEditSubProducto(obj.key)}>
                                {this.editPermisoSubProducto ? <SIcon name={"Edit"} height={30} width={30}></SIcon> : <SView />}
                            </SView>

                            <SView margin={5} onPress={() => this.onDeleteSubProducto(obj)}>
                                {this.deletePermisoSubProducto ? <SIcon name={"Delete"} height={30} width={30}></SIcon> : <SView />}
                            </SView>
                        </SView>

                        <SHr height={20} />
                        <SSwitch center key={this.state.key_zona} size={20} loading={this.state.loading} onChange={this.handleChange_habilitado.bind(this, obj)} value={!!habilitado} />
                    </SView>
                </SView>
                {this.cardSubProductoDetalle(obj.key)}
            </SView>
        </>
    }
}
export default connect(index);