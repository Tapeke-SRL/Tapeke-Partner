import React, { Component } from 'react';
import DPA, { connect } from 'servisofts-page';
import { Parent } from "."
import Model from '../../../Model';
import SSocket from 'servisofts-socket'
import { SNavigation, SText, SView, SIcon, SPopup, SButtom, SList, SHr, SImage, SMath, SSwitch, STheme, SLoad } from 'servisofts-component';

class index extends DPA.list {
    constructor(props) {
        super(props, {
            Parent: Parent,
            limit: 10,
            params: ["key_restaurante"],
            excludes: ["key", "estado", "key_usuario"],
            onRefresh: () => {
                Parent.model.Action.CLEAR()
            }
        });
    }

    componentDidMount() {
        if (!Model.restaurante.Action.getSelect()) {
            SNavigation.goBack();
            return;
        }

        Parent.model.Action.CLEAR()
        Model.categoria_producto.Action.CLEAR()
    }

    $allowNew() {
        // return Model.usuarioPage.Action.getPermiso({ url: Parent.path, permiso: "new" });
        return true;
    }

    $allowAccess() {
        // return Model.usuarioPage.Action.getPermiso({ url: Parent.path, permiso: "view" });
        return true
    }

    $filter(data) {
        return data.estado != 0
    }

    $getData() {
        return Parent.model.Action.getAll({ key_restaurante: this.$params.key_restaurante });
    }

    $getDataCategoriaProducto() {
        return Model.categoria_producto.Action.getAll({ key_restaurante: this.$params.key_restaurante });
    }

    $order() {
        return [{ key: "fecha_on", order: "desc", type: "date" }];
    }

    $menu() {
        let menu = super.$menu();
        menu.push({ children: this.listCategoria() })
        return menu;
    }

    listCategoria() {
        return <>
            <SView padding={7}
                onPress={() => {
                    SNavigation.navigate("/restaurante/categoria_producto/list", { key_restaurante: this.$params.key_restaurante })
                }}
            >
                <SText>Lista Categorías</SText>
            </SView>
        </>
    }

    onEdit(obj) {
        SNavigation.navigate(Parent.path + "/edit", { pk: obj.key, key_restaurante: this.$params.key_restaurante })
    }

    handleChange_habilitado(obj) {
        if (!this.editPermiso) {
            SPopup.alert("No tienes permisos para esta acción.")
            return;
        }

        Model.producto.Action.editar({
            data: {
                ...obj,
                habilitado: !obj.habilitado
            },
            key_usuario: Model.usuario.Action.getKey()
        })
    }

    handleChange_mayor_edad(obj) {
        if (!this.editPermiso) {
            SPopup.alert("No tienes permisos para esta acción.")
            return;
        }

        Model.producto.Action.editar({
            data: {
                ...obj,
                mayor_edad: !obj.mayor_edad
            },
            key_usuario: Model.usuario.Action.getKey()
        })
    }

    handleChange_ley_seca(obj) {
        if (!this.editPermiso) {
            SPopup.alert("No tienes permisos para esta acción.")
            return;
        }

        Model.producto.Action.editar({
            data: {
                ...obj,
                ley_seca: !obj.ley_seca
            },
            key_usuario: Model.usuario.Action.getKey()
        })
    }


    onDelete(obj) {
        if (this.deletePermiso) {
            SPopup.confirm({
                title: "Eliminar Producto",
                message: "¿Seguro que desea remover el producto?",
                onPress: () => {
                    Model.producto.Action.editar({
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


    viewProductoCategoria(keyCategoria, dataProducto) {
        if (!dataProducto) return null

        this.deletePermiso = Model.usuarioPage.Action.getPermiso({ url: Parent.path, permiso: "delete" });
        this.editPermiso = Model.usuarioPage.Action.getPermiso({ url: Parent.path, permiso: "edit" });

        this.deletePermiso = true;
        this.editPermiso = true;
        // console.log("asd",dataProducto)
        // return <SText>Aqui deberian ir los productos</SText>
        return <>
            <SList
                data={dataProducto}
                filter={(producto) => {
                    if (producto.estado == 0) {
                        return false;
                    }

                    if (producto.key_categoria_producto != keyCategoria) {
                        return false;
                    }

                    return true;
                }}
                render={(producto) => {
                    // return <SText>Un producto</SText>
                    // if (Object.values(producto).length <= 0) return null;
                    return <>
                        <SView flex card style={{
                            padding: 15,
                            borderRadius: 10,
                        }} >
                            <SView>
                                <SView flex row
                                    style={{
                                        justifyContent: "space-evenly",
                                        marginBottom: 15
                                    }}
                                >
                                    <SView height={80} width={80} style={{ marginRight: 10 }}>
                                        <SImage src={Model.producto._get_image_download_path(SSocket.api, producto?.key)} />
                                    </SView>

                                    <SView
                                        style={{
                                            marginLeft: 20
                                        }}
                                    >
                                        <SText margin={5} fontSize={12}>Nombre: {producto?.nombre}</SText>
                                        <SText margin={5} fontSize={12}>Descripción:</SText>
                                        <SView width={120}>
                                            <SText margin={5} fontSize={12}>{producto?.descripcion}</SText>
                                        </SView>
                                        <SText margin={5} fontSize={12}>Precio: {SMath.formatMoney(producto?.precio) + " Bs."}</SText>
                                    </SView>
                                </SView>
                                <SView flex row
                                    style={{
                                        justifyContent: "space-evenly"
                                    }}
                                >
                                    <SView center>
                                        <SView>
                                            <SText>Mayor de Edad: {JSON.parse(producto?.mayor_edad) == true ? "SI" : "NO"}</SText>
                                            <SText>Ley Seca: {JSON.parse(producto?.ley_seca) == true ? "SI" : "NO"}</SText>
                                            <SView row>
                                                <SText fontSize={14} flex>Habilitado:</SText>
                                                <SSwitch key={producto.key} size={20} loading={this.state.loading} onChange={this.handleChange_habilitado.bind(this, producto)} value={!!producto.habilitado} />
                                            </SView>
                                        </SView>
                                    </SView>
                                    <SView center>
                                        <SView row>
                                            <SView style={{ marginRight: 10 }} onPress={() => this.onEdit(producto)}>
                                                {this.editPermiso ? <SIcon name={"Edit"} height={30} width={30}></SIcon> : <SView />}
                                            </SView>

                                            <SView onPress={() => this.onDelete(producto)}>
                                                {this.deletePermiso ? <SIcon name={"Delete"} height={30} width={30}></SIcon> : <SView />}
                                            </SView>
                                        </SView>

                                        <SHr height={20} />

                                        <SView
                                            style={{
                                                backgroundColor: STheme.color.primary,
                                                fontSize: 15,
                                                padding: 5,
                                                borderRadius: 4
                                            }}
                                            onPress={() => SNavigation.navigate(Parent.path + "/sub_producto/list", { key_producto: producto.key })}>
                                            <SText>Ver sub productos</SText>
                                        </SView>
                                    </SView>
                                </SView>
                            </SView>
                        </SView>
                    </>
                }}
            >
            </SList>
        </>
    }

    $render() {
        // this.deletePermiso = Model.usuarioPage.Action.getPermiso({ url: Parent.path, permiso: "delete" });
        // this.editPermiso = Model.usuarioPage.Action.getPermiso({ url: Parent.path, permiso: "edit" });

        this.deletePermiso = true;
        this.editPermiso = true;

        this.dataProducto = this.$getData();
        this.dataCategoria = this.$getDataCategoriaProducto();

        if (!this.dataProducto && !this.dataCategoria) return <SLoad />
        // return <SText>Hola soy ricky</SText>
        return <>
            <SHr height={10} />
            <SView col={"xs-12"}>
                <SList
                    data={this.dataCategoria}
                    filter={this.$filter.bind(this)}
                    order={[{ key: "index", order: "desc" }]}
                    render={(categoria) => {
                        if (Object.values(categoria).length <= 0) return null;

                        return <>
                            <SView row>
                                <SText flex fontSize={20}>{categoria.nombre}</SText>
                                <SText fontSize={15} center>Peso: {categoria.index}</SText>
                            </SView>
                            <SHr height={10} />
                            {this.viewProductoCategoria(categoria.key, this.dataProducto)}
                        </>
                    }}
                />
            </SView>
        </>
    }
}
export default connect(index);