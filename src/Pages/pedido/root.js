import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    SHr,
    SLoad,
    SNavigation,
    SPage,
    SText,
    SView,
    SPopup,
    STheme,
    SImage,
    SDate,
    SIcon,
    SThread,
    SButtom,
} from 'servisofts-component';
import SSocket from 'servisofts-socket';
import Container from '../../Components/Container';
import Model from '../../Model';
import AccentBar from '../../Components/AccentBar';
import { Linking } from 'react-native';
import { Platform } from 'react-native';


import { Parent } from '.';
import MapaRastreo from './Components/MapaRastreo';
import Popups from '../../Components/Popups';
import PedidoState from './Components/PedidoState';

class root extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
        this.pk = SNavigation.getParam('pk');
    }

    componentDidMount() {
        new SThread(200, 'pedido_detalle_thre', true).start(() => {
            this.setState({ ready: true });
        });

        this.loadData()
    }

    loadData() {
        SSocket.sendPromise({
            component: "pedido",
            type: "getDetalle",
            key_pedido: this.pk,
            key_usuario: Model.usuario.Action.getKey()
        }).then(res => {
            let data = res.data
            if (data?.restaurante?.key != Model.restaurante.Action.getSelect()?.key) {
                SPopup.alert('Este pedido es de otro restaurante.');
                SNavigation.goBack('/');
            }
            this.setState({ data: res.data })

            this.getUser(res.data)
        }).catch(err => {
            console.error(err.data)
        })
    }

    getUser(data) {
        let keys = [data.key_usuario];
        console.log(keys);

        SSocket.sendPromise({
            version: "2.0",
            service: "usuario",
            component: "usuario",
            type: "getAllKeys",
            keys: keys,
        }).then(resp => {
            this.setState({ usuarios: resp.data })
        }).catch(e2 => {
            SPopup.alert(e2.error)
        })
    }

    componentUsuario() {
        let borderRadius = 5;
        let redirectLink = `https://api.whatsapp.com/send?phone=${this?.state?.data?.factura?.phone.slice(5)}`
        let usuario = this.state.usuarios ? this.state.usuarios[this.state?.data?.key_usuario].usuario : null
        return <>
            <SText font={'Montserrat-ExtraBold'} fontSize={16}>DATOS DEL CLIENTE</SText>
            <SText fontSize={11} color={STheme.color.gray}>(Si te falta algún item, para salvar el pedido, puedes comunicarte con el cliente presionando en el número de teléfono y ofrecer un producto equivalente al precio)</SText>
            <SHr />

            <SView row >
                <SView row flex
                    style={{
                        alignItems: "center"
                    }}
                >
                    {
                        usuario ?
                            <>
                                <SView width={40} height={40}>
                                    <SImage src={require("../../Assets/img/no_image.jpeg")} style={{ borderRadius: 10 }} />
                                    <SImage src={SSocket.api.root + "usuario/" + usuario?.key} style={{ borderRadius: 10, position: 'absolute', resizeMode: "cover" }} />
                                </SView>

                                <SText fontSize={16} style={{ paddingLeft: 5 }}>{`${usuario?.Nombres} ${usuario?.Apellidos}`}</SText>
                            </>
                            : <SLoad />
                    }
                </SView>

                <SView row
                    // col={"xs-6"}
                    onPress={() => {
                        Linking.openURL(redirectLink)

                    }}
                >
                    <SView
                        center
                        height={40}
                        backgroundColor={"#7dcc00"}
                        style={{
                            padding: 5,
                            borderTopLeftRadius: borderRadius,
                            borderBottomLeftRadius: borderRadius
                        }}
                    >
                        <SIcon name={'whatsapp'} height={30} width={30} />
                    </SView>
                    <SView
                        center
                        height={40}
                        style={{
                            padding: 5,
                            backgroundColor: STheme.color.lightGray,
                            borderTopRightRadius: borderRadius,
                            borderBottomRightRadius: borderRadius
                        }}
                    >
                        <SText>{this.state.data?.factura?.phone}</SText>
                    </SView>
                </SView>
            </SView>
        </>
    }

    imprimirComanda() {
        if (Platform.OS === 'web') {
            return <>
                <SView row center
                    style={{
                        backgroundColor: STheme.color.primary,
                        padding: 8,
                        borderRadius: 5,
                        width: 200,
                        height: 30,
                        justifyContent: 'space-evenly'
                    }}
                    onPress={() => {
                        SNavigation.navigate(Parent.path + '/comanda', { pk: this.pk });
                    }}
                >
                    <SView height={18} width={18} >
                        <SImage src={require("../../Assets/img/imprimir.png")} style={{ borderRadius: 10, position: 'absolute' }} />
                    </SView>
                    <SText
                        font={'Montserrat-SemiBold'}
                        style={{
                            color: STheme.color.white,
                            fontSize: 12,
                        }}
                    >Imprimir Comanda</SText>
                </SView>
            </>
        }
    }

    componentDatosPedido() {
        let data = this.state.data;
        return <SView row
            style={{
                justifyContent: "space-between"
            }}
        >
            <SView>
                <SText font={'Montserrat-ExtraBold'}>Datos de Facturación:</SText>
                <SText>RS: {data?.factura?.razon_social || data?.factura?.razon_social != '' ? data?.factura?.razon_social : "usuario no puso RS"}</SText>
                <SText>NIT: {data?.factura?.nit || data?.factura?.nit != '' ? data?.factura?.nit : "usuario no puso nit"}</SText>
                <SHr />
                <SText font={'Montserrat-ExtraBold'}>Nota del cliente:</SText>
                <SText>{data?.nota_cliente}</SText>
            </SView>

            <SView>
                <SText font={'Montserrat-Bold'}>Hora del Pedido</SText>
                <SText font={'Montserrat-Bold'} fontSize={30}
                    style={{
                        alignItems: "center"
                    }}
                >{new SDate(data.fecha_on, "yyyy-MM-ddThh:mm").toString("hh:mm")}</SText>
            </SView>
        </SView>
    }

    componentDetallePedido() {
        let data = this.state.data;
        let detalleTapeke = {
            1: {
                sub_producto_detalle: [{
                    key: 'd119f-ed3450',
                    nombre: 'Recuerda que debes entregar:'
                }]
            },
            2: {
                sub_producto_detalle: [{
                    key: 'd119f-ed3451',
                    nombre: '• Cantidad generosa'
                }]
            },
            3: {
                sub_producto_detalle: [{
                    key: 'd119f-ed3452',
                    nombre: '• Excelente calidad'
                }]
            },
        };

        return <SView col={'xs-12'}>
            <SView row
                style={{
                    justifyContent: "space-between"
                }}
            >
                <SText font={'Montserrat-Bold'}>DETALLE DEL PEDIDO</SText>
                <SView center>
                    <SText font={'Montserrat-Bold'}>#{data.key.slice(0, 6)}</SText>
                    <SText color={STheme.color.gray} fontSize={10}>Código del pedido</SText>
                </SView>
            </SView>

            <SHr />
            {
                data.cantidad > 0 ?
                    this.cardProducto({
                        image: require("../../Assets/img/BOLSA-TAPEKE-MENU-APP.png"),
                        title: "Tapeke",
                        cantidad: data.cantidad,
                        precio: (data.cantidad * data.precio),
                        detalle: detalleTapeke
                    })
                    : null
            }

            {
                this.listCardProducts(data?.pedido_producto)
            }
        </SView >
    }

    listCardProducts(pedido_producto) {
        return pedido_producto?.map(prod => {
            return this.cardProducto({
                key: prod.key,
                image: SSocket.api.root + "producto/.128_" + prod.key + "?date=" + new Date().getTime(),
                title: prod.descripcion,
                cantidad: prod.cantidad,
                precio: prod?.precio_sin_descuento ? (prod?.precio_sin_descuento * prod.cantidad) : (prod.precio * prod.cantidad),
                detalle: prod.sub_productos,
                descuento: prod?.precio_sin_descuento ? (prod.cantidad * prod.precio_sin_descuento) - (prod.cantidad * prod.precio) : 0
            })
        })
    }

    cardProducto({ key, image, title, cantidad, precio, detalle, descuento }) {
        const cardDetalle = () => {
            let det = Object.values(detalle);
            if (det.length == 0) {
                return <SText color={STheme.color.gray} fontSize={10}>No hay subproducto</SText>
            }
            return det.map(det => {
                return Object.values(det.sub_producto_detalle).map(subdet => {
                    return <SText color={STheme.color.gray} fontSize={10} key={det.key}>{`${subdet.cantidad ? subdet.cantidad + "x" : ""} ${subdet.nombre} ${subdet.precio > 0 ? "- " + (subdet.precio * subdet.cantidad) + " Bs." : ""}`}</SText>
                })
            })
        };

        return <>
            <SView key={key} card row
                style={{
                    padding: 10,
                    borderRadius: 10
                }}
            >
                <SView height={60} width={60}>
                    <SImage src={require("../../Assets/img/no_image.jpeg")} style={{ borderRadius: 10 }} />
                    <SImage src={image} style={{ borderRadius: 10, position: 'absolute' }} />
                </SView>

                <SView
                    flex
                    style={{
                        marginLeft: 10
                    }}
                >
                    <SText col={"xs-12"}>{`${title}`}</SText>
                    {cardDetalle()}
                </SView>

                <SView center>
                    <SText color={STheme.color.primary}>Cantidad</SText>
                    <SText>{cantidad}</SText>
                    <SText color={STheme.color.primary}>Precio</SText>
                    <SText> Bs. {parseFloat(precio).toFixed(2)}</SText>
                    {
                        descuento > 0 ?
                            <>
                                <SText color={STheme.color.danger}>Descuento</SText>
                                <SText> Bs. {parseFloat(descuento).toFixed(2)}</SText>
                            </>
                            : null
                    }
                </SView>
            </SView>
            <SHr />
        </>
    }

    cardTypePedido() {
        return <SView col={'xs-12'} center card padding={10} borderRadius={5}>
            <SText color={STheme.color.gray}>{this.state.data.delivery > 0 ? "Entrega a domicilio" : "Recoger del lugar"}</SText>
        </SView>
    }

    labelDetallePedido({ label, labelColor = STheme.color.gray, value, color = STheme.color.gray, font, simbol = "" }) {
        return <SView row
            style={{
                justifyContent: "space-between"
            }}
        >
            <SText color={labelColor}>{label}</SText>
            <SText font={font ?? 'Montserrat-Medium'} color={color}>{typeof (value) === 'number' ? `${simbol} Bs. ${value}` : value}</SText>
        </SView>
    }

    totalProducto() {
        let total = 0

        if (this.state?.data?.pedido_producto) {
            Object.values(this.state?.data?.pedido_producto).map(prod => {
                if (prod.precio_sin_descuento) {
                    total += (prod.cantidad * prod.precio_sin_descuento)
                } else {
                    total += (prod.cantidad * prod.precio)
                }
            })
        }


        return total;
    }

    totalSubProductoDetalle() {
        let total = 0

        if (this.state.data.pedido_producto) {
            Object.values(this.state.data.pedido_producto).map(pp => {
                total += pp.monto_total_subproducto_detalle
            })
        }


        return total;
    }

    totalDescuentoIteamCubrePartner() {
        let total = 0

        if (this.state.data.pedido_producto) {
            Object.values(this.state.data.pedido_producto).map(prod => {
                if (prod.precio_sin_descuento) {
                    total += (prod.cantidad * prod.precio_sin_descuento) - (prod.cantidad * prod.precio)
                }
            })
        }

        return total;
    }

    detallePedido() {
        let data = this.state.data
        let totalTapeke = (data.cantidad * data.precio)
        let totalProducto = this.totalProducto()
        let totalSubProd = this.totalSubProductoDetalle();

        let descuento = this.totalDescuentoIteamCubrePartner();

        let total = totalTapeke
            + totalProducto + totalSubProd - (descuento)
        return <>
            <SText font={"Montserrat-SemiBold"}>DETALLE DE COMPRA</SText>
            {this.labelDetallePedido({ label: "Método de pago", value: "Online", color: STheme.color.text, font: 'Montserrat-SemiBold' })}
            {this.labelDetallePedido({ label: "Total Tapekes", value: totalTapeke ?? 0 })}
            {this.labelDetallePedido({ label: "Total Producto", value: totalProducto ?? 0 })}
            {this.labelDetallePedido({ label: "Total SubProducto", value: totalSubProd ?? 0 })}
            {this.labelDetallePedido({ label: "Descuento cubre Partner", value: descuento, color: STheme.color.danger, simbol: "-" })}
            <SHr color={STheme.color.gray} h={1} />
            {this.labelDetallePedido({ label: "Total:", labelColor: STheme.color.text, value: total, color: STheme.color.text })}
        </>
    }

    componentSoporte() {
        return <SView>
            <SText center fontSize={9} color={STheme.color.gray}>*El cliente puede pasar a recoger su pedido durante tu horario de atención, por lo tanto deberás reservarlo. En caso de que no pase, contactate con soporte.</SText>
            <SHr h={20} />
            <SView center row
                onPress={() => {
                    SNavigation.navigate("/soporte");
                }}
            >
                <SView height={30} width={30}>
                    <SImage src={require('../../Assets/img/contacto.png')} />
                </SView>
                <SText font={'Montserrat-SemiBold'} fontSize={15} style={{ paddingLeft: 10 }}>Contactar a Soporte</SText>
            </SView>
        </SView>
    }

    renderButtomAcceptar() {
        const data = this.state.data;
        return <SView
            col={'xs-12'}
            center
        >
            <SHr height={40} />
            {data.state == 'en_camino' ||
                data.state == 'entregado' ||
                data.state == 'no_recogido' ? (
                <SView
                    col={'xs-11'}
                    center
                    backgroundColor={'#96BE00'}
                    style={{ borderRadius: 4, overflow: 'hidden' }}
                >
                    <SHr height={20} />
                    <SView col={'xs-11'}>
                        <PedidoState data={data} />
                    </SView>
                    <SHr height={20} />
                </SView>
            ) : (
                <SButtom
                    style={{
                        backgroundColor: STheme.color.primary,
                        width: 300,
                        fontSize: 40,
                        borderRadius: 8,
                    }}
                    onPress={() => {
                        if (
                            data?.restaurante?.key !=
                            Model.restaurante.Action.getSelect()?.key
                        ) {
                            SPopup.alert(
                                'Este pedido es de otro restaurante.'
                            );
                            SNavigation.reset('/');
                            return;
                        }
                        var mensaje = '';
                        if (
                            data.state != 'listo' &&
                            data.state != 'esperando_conductor'
                        ) {
                            switch (data.state) {
                                case 'buscando_conductor':
                                    Popups.Alert.open({
                                        title: 'No se puede entregar el pedido.',
                                        label: 'No puede entregar porque seguimos buscando Driver para este pedido',
                                    });
                                    break;
                                case 'pagado':
                                    Popups.Alert.open({
                                        title: 'No se puede entregar el pedido.',
                                        label: 'No puede entregar porque aun no se encuentra listo o es para otro horario.',
                                    });
                                    break;
                                case 'entregado_conductor':
                                    Popups.Alert.open({
                                        title: 'No se puede entregar el pedido.',
                                        label: 'No puede entregar porque este pedido ya fue entregado a un driver.',
                                    });
                                    break;
                                default:
                                    Popups.Alert.open({
                                        title: 'No se puede entregar el pedido.',
                                        label:
                                            'No puedes entregar el pedido cuando se encuentra en estado ' +
                                            data.state,
                                    });
                                    break;
                            }
                        } else {
                            Model.pedido.Action.entregar(
                                this.pk,
                                this.props
                            )
                                .then(e => {
                                    Model.pedido.Action.CLEAR();
                                    SNavigation.goBack();
                                })
                                .catch(e => {
                                    Popups.Alert.open({
                                        title: 'No se puede entregar el pedido.',
                                        label: e.error,
                                    });
                                });
                        }
                    }}
                >
                    <SText color={'#fff'}>ENTREGAR</SText>
                </SButtom>
            )}
            <SHr height={40} />
        </SView>
    }
    renderContent() {
        if (!this.state.data) return <SLoad />;

        return <Container center={false}>
            <SHr h={20} />
            {this.componentUsuario()}
            <SHr h={20} />
            {this.componentDatosPedido()}
            <SHr h={20} />
            {this.componentDetallePedido()}
            <SHr h={20} />
            {this.cardTypePedido()}
            <SHr h={20} />
            <SView center>
                {this.imprimirComanda()}
            </SView>
            <SHr h={20} />
            {this.detallePedido()}
            <SHr h={20} />
            {/* TODO componente Mapas */}
            <MapaRastreo key_pedido={this.pk} data={this.state.data} />
            {/* <SView center border={"#FF00FF"}>
                <SText font={'Montserrat-Bold'}>Aca va el componente mapa para el rastreo y botónes de cambio de estados</SText>
            </SView> */}
            <SHr h={20} />
            {this.renderButtomAcceptar()}
            <SHr h={20} />
            {this.componentSoporte()}
            <SHr h={20} />
        </Container>;
    }

    render() {
        if (!this.state.ready) return <SLoad />;

        return (
            <SPage onRefresh={() => {
                this.loadData()
            }}
                header={<AccentBar />}
            >
                {this.renderContent()}
            </SPage>
        );
    }
}
const initStates = state => {
    return { state };
};
export default connect(initStates)(root);
