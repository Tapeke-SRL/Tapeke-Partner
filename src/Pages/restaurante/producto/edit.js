import React, { Component, forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { View, Text, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { SHr, SInput, SNavigation, SNotification, SPage, SPopup, SText, STheme, SThread, SUuid, SView, DropFile, DropFileSingle, Submit, Upload } from 'servisofts-component';
import Container from '../../../Components/Container';
import SSocket from 'servisofts-socket';
import Model from '../../../Model';
import TopBar from '../../../Components/TopBar';
import ListaDeOpciones from './Components/EditarListaDeOpciones';
import BtnNaranja from './Components/BtnNaranja';
import Input, { InputValidator } from './Components/Input';
import FormularioProducto from './Components/FormularioProducto';
import FormularioOpciones from './Components/FormularioOpciones';
import VentanaLista from "./list";
import PageTitle from '../../../Components/PageTitle';
const color = "#000000"
const colorGray = "#999999"
const colorGray2 = "#BBBBBB"
const colorCard = "#EEEEEE"
const font = 'Montserrat'
const FotoDePerfil = ({ key_producto, onChange }) => {
    return <SView center>
        <SView width={130} height={130} style={{
            backgroundColor: colorCard,
            borderRadius: 8,
            overflow: "hidden"
        }}>
            {/* <SInput defaultValue={SSocket.api.root + "producto/" + key_producto} type={"image"} style={{
                width: "100%",
                height: "100%",
                borderRadius: 8,
            }} /> */}
            <DropFileSingle
                defaultValue={SSocket.api.root + "producto/" + key_producto}
                accept={"image/*"}
                style={{
                    resizeMode: "cover"
                }}
                onChange={onChange}
            />
        </SView>
        <SHr h={4} />
        <SText fontSize={10} font={"Montserrat-SemiBold"} color={colorGray}>{"Agregar foto del producto/item"}</SText>
        {/* <SText fontSize={10} font={"Montserrat-MediumItalic"} color={colorGray2}>{"jpeg,png,1024x1024px máximo 1Mb"}</SText> */}
        <SText fontSize={10} font={"Montserrat"} color={colorGray2}>{"jpeg,png,1024x1024px máximo 1Mb"}</SText>
    </SView>
}




export default class edit extends Component {
    _inputs = {}
    static TOPBAR = <TopBar type={"usuario_back"} />
    imageToUpload = null;
    constructor(props) {
        super(props);
        this.state = {
            original: {}
        };

        this.key_restaurante = SNavigation.getParam("key_restaurante")
        this.key_producto = SNavigation.getParam("key_producto")
        this.noPrevent = false;
    }


    verificarCambios() {
        if (!this.formProducto) return;
        this.formProducto.handleGuardar();
        let cambios = {};
        if (this.imageToUpload) {
            cambios["image"] = this.imageToUpload?.file?.name
        }
        const deepCompare = (obj1, obj2, prefix = '') => {
            if (obj1 == null && obj2 == null) {
                console.log("Retorno por error")
                return;
            }

            if ((!obj1) != (!obj2)) {
                cambios[prefix] = "uno nulo";
                return;
            }
            if (typeof obj1 == "object" || typeof obj2 == "object") {

                if (Array.isArray(obj1)) {
                    for (let i = 0; i < obj1.length; i++) {
                        deepCompare(obj1[i], obj2[i], prefix + "." + i);
                    }
                } else {
                    try {
                        const arr = Object.keys(obj1)
                        for (let i = 0; i < arr.length; i++) {
                            const key = arr[i];
                            deepCompare(obj1[key], obj2[key], prefix + "." + key);
                        }
                    } catch (error) {
                        console.error(error)
                    }

                }

            } else {
                // console.log(obj1, obj2)
                if (typeof obj1 == 'number' || typeof obj2 == 'number') {
                    if (parseFloat(obj1) !== parseFloat(obj2)) {
                        cambios[prefix] = obj1
                    }
                } else if (obj1 !== obj2) {
                    cambios[prefix] = obj1
                }
            }



        };
        deepCompare(this.state.data, this.state.original, "producto");
        console.log(this.state.data, this.state.original)
        console.log("CAMBIOS", cambios)
        return Object.values(cambios).length > 0 ? cambios : null
    }
    handleRemove(e) {
        if (this.noPrevent) {
            return;
        }

        if (!this.verificarCambios()) {
            return;
        }
        e.preventDefault();

        SPopup.confirm({
            title: "¿Salir sin guardar cambios?",
            message: "Si confirma se perderán los cambios realizados.",
            onClose: () => {
                console.log("cancel")
            },
            onPress: () => {
                this.noPrevent = true;
                SNavigation.goBack();
            }
        })
        console.log("Se previno");
    }
    componentDidMount() {
        new SThread(100, "load",).start(() => {
            this.setState({ ready: true })
        })
        if (this.key_producto) {
            SSocket.sendPromise({
                component: "restaurante",
                type: "getProductosDetallePartner",
                key_producto: this.key_producto,
                key_usuario: Model.usuario.Action.getKey(),
            }).then(e => {
                this.setState({ data: e.data, original: JSON.parse(JSON.stringify(e.data)) })
                console.log(e);
            }).catch(e => {
                console.error(e);
            })
        } else {
            // cuando no viene pk
            this.setState({
                data: {
                    key: SUuid(),
                    estado: 1,
                    key_usuario: Model.usuario.Action.getKey(),
                    sub_productos: [],
                }
            })
        }

        console.log(this.props.navigation);
        this.props.navigation.addListener("beforeRemove", this.handleRemove.bind(this));

    }
    componentWillUnmount() {
        this.props.navigation.removeListener("beforeRemove", this.handleRemove);
    }

    handleGuardar() {
        let resp = {}
        Object.keys(this._inputs).map(k => {
            resp[k] = this._inputs[k].getValue();
        })
        console.log(resp);
    }

    renderSaveChange() {

        const cambios = this.verificarCambios();
        if (!cambios) return null
        return <SView col={"xs-12"} height={30} backgroundColor={STheme.color.primary}>
            <SText>{"Cambios sin guardar"}</SText>
        </SView>
    }

    render() {
        const data = this.state.data ?? {};
        return <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >

            <SPage hidden footer={this.renderSaveChange()}>
                <Container loading={!this.state.ready || !this.state.data}>
                    <SHr />
                    <PageTitle title={this.key_producto ? "EDITAR PRODUCTO" : 'AGREGAR PRODUCTO'} />
                    {/* <SView col={"xs-12"}>
                        <SText font={"Montserrat-Bold"}>{"AGREGAR PRODUCTO"}</SText>
                        <SText color={STheme.color.primary} fontSize={12} font={"Montserrat-Bold"}>{"Mi Restaurante - Beni"}</SText>
                    </SView> */}
                    <SHr h={32} />
                    <FotoDePerfil key_producto={this.key_producto} onChange={(e) => {
                        this.imageToUpload = e[0];
                    }} />
                    <SHr h={32} />
                    <FormularioProducto ref={ref => this.formProducto = ref} producto={this.state.data} key_restaurante={this.key_restaurante} />
                    <SHr h={32} />
                    <SView col={"xs-12"} row>
                        <SText flex color={STheme.color.primary} fontSize={14} font={"Montserrat-Bold"}>{"OPCIONES"}</SText>
                        <BtnNaranja onPress={() => {
                            FormularioOpciones.openPopup({
                                data: { key_producto: this.key_producto },
                                onChange: (subproductoedit) => {
                                    const existe = this.state.data.sub_productos.findIndex(a => a.key == subproductoedit.key);
                                    if (existe > -1) {
                                        console.log("Existe", existe)
                                    } else {
                                        this.state.data.sub_productos.push(subproductoedit)
                                        console.log("No Existe", existe)
                                    }
                                    this.setState({ ...this.state })
                                }
                            })
                        }}>{"+ Agregar Opciones"}</BtnNaranja>
                    </SView>
                    <SHr h={8} />
                    <ListaDeOpciones producto={this.state.data} />
                    <SHr h={32} />
                    <BtnNaranja onPress={() => {
                        this.formProducto.handleGuardar();

                        let producto = this.state.data;

                        const faltantes = InputValidator({
                            data: producto,
                            keys: ["nombre", "key_categoria_producto", "precio"]
                        })

                        console.log(producto);

                        if (faltantes.length > 0) {
                            SNotification.send({
                                title: "Complete lo campos requeridos.",
                                body: faltantes.join(", "),
                                time: 5000,
                                color: STheme.color.danger,
                            })
                            return;
                        } 

                        if(producto.descuento_monto > producto.precio){
                            SNotification.send({
                                body:  "El descuento monto no puede ser mayor al precio del producto.",
                                time: 5000,
                                color: STheme.color.danger,
                            })
                            return;
                        }

                        SNotification.send({
                            key: "guardando_producto",
                            title: "Producto",
                            body: "Estamos guardando los cambios.",
                            // color: STheme.color.danger,
                            type: "loading"
                        })
                        SSocket.sendPromise({
                            component: "producto",
                            type: "guardar",
                            data: producto,
                            key_usuario: Model.usuario.Action.getKey(),
                        }).then(async (e) => {
                            SNotification.send({
                                key: "guardando_producto",
                                title: "Producto",
                                body: "Subiendo la foto.",
                                // color: STheme.color.danger,
                                type: "loading"
                            })
                            if (this.imageToUpload) {
                                console.log(this.imageToUpload)
                                const resp = await Upload.sendPromise(this.imageToUpload, SSocket.api.root + "upload/producto/" + this.key_producto)
                            }
                            SNotification.remove("guardando_producto")
                            SNotification.send({
                                title: "Producto",
                                body: "Guardado con exito",
                                time: 5000,
                                color: STheme.color.success,
                            })

                            if (VentanaLista.INSTANCE) {
                                VentanaLista.INSTANCE.onChangeProducto(producto);
                            }
                            this.noPrevent = true;
                            SNavigation.goBack();
                            console.log(e);
                        }).catch(e => {
                            SNotification.remove("guardando_producto")
                            SNotification.send({
                                title: "Producto",
                                body: "Ocurrio un error al guardar.",
                                time: 5000,
                                color: STheme.color.danger,
                            })
                            console.error(e);
                        })
                    }}>{"Guardar"}</BtnNaranja>
                </Container>
                <SHr h={100} />
            </SPage>
        </KeyboardAvoidingView>
    }
}





