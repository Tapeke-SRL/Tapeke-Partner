import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    SButtom,
    SHr,
    SLoad,
    SNavigation,
    SPage,
    SText,
    SView,
    SPopup,
    STheme,
    SImage,
    SMath,
    SIcon,
    SThread,
    SList
} from 'servisofts-component';
import Container from '../../Components/Container';
import Model from '../../Model';
import PedidoState from './Components/PedidoState';
import SSocket from 'servisofts-socket';
import Popups from '../../Components/Popups';
import AccentBar from '../../Components/AccentBar';
import { Platform } from 'react-native';
import Html2Canvas from 'html2canvas';
import jspdf from 'jspdf';
import { Parent } from '.';

class root extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
        };
        this.pk = SNavigation.getParam('pk');
        // this.data = {};
        // this.dataUsuario={};
    }

    componentDidMount() {
        // Model.pedido.Action.CLEAR();
        Model.pedido.Action.getDetalle(this.pk, true);
        new SThread(200, 'pedido_detalle_thre', true).start(() => {
            this.setState({ loading: false });
        });
    }

    loadData() {
        this.data = Model.pedido.Action.getDetalle(this.pk);
        if (!this.data) return false;
        this.dataUsuario = Model.usuario.Action.getByKey(this.data.key_usuario);
        if (this.data.key_conductor) {
            this.dataConductor = Model.usuario.Action.getByKey(
                this.data.key_conductor
            );
        }
        // if (!this.dataUsuario) return false;
        if (!this.data.key) {
            SPopup.alert('Aun no se que paso');
            SNavigation.goBack('/');
            return null;
        }
        if (
            this.data?.restaurante?.key != Model.restaurante.Action.getSelect()
        ) {
            SPopup.alert('Este pedido es de otro restaurante.');
            SNavigation.goBack('/');
            return null;
        }
        return true;
    }

    getTipoEntrega() {
        if (this.data.delivery > 0) {
            return <SText>Entrega a domicilio</SText>;
        }
        return <SText>Recoger del lugar</SText>;
    }

    getConductor() {
        if (this.data.delivery > 0 && !this.data.key_conductor) {
            return <SText>Conductor no asignado</SText>;
        } else if (!this.data.key_conductor) {
            return null;
        }
        // if (!this.data.key_conductor) return null;
        return (
            <SView
                col={'xs-12'}
                center
                style={{ backgroundColor: STheme.color.white }}
            >
                <SView col={'xs-11'} row center>
                    <SView col={'xs-12'}>
                        <SHr height={15} />
                        <SText
                            fontSize={18}
                            font={'Roboto'}
                            style={{ fontWeight: 'bold' }}
                            color={STheme.color.darkGray}
                        >
                            Conductor
                        </SText>
                        <SHr height={15} />
                    </SView>
                    <SView col={'xs-12'} row>
                        {this.data.delivery == 0 ? (
                            <SView
                                col={'xs-12'}
                                row
                                center
                                backgroundColor={STheme.color.primary}
                                style={{ borderRadius: 4, overflow: 'hidden' }}
                            >
                                <SHr height={20} />
                                <SView col={'xs-11'} row center>
                                    <SIcon
                                        name='Shopper'
                                        width={35}
                                        fill={STheme.color.white}
                                    />
                                    <SText
                                        fontSize={15}
                                        font={'Roboto'}
                                        color={STheme.color.white}
                                    >
                                        Cliente recoge pedido en local
                                    </SText>
                                </SView>
                                <SHr height={20} />
                            </SView>
                        ) : (
                            <SView row col={'xs-12'}>
                                <SView
                                    center
                                    width={70}
                                    height={70}
                                    backgroundColor={'transparent'}
                                    style={{
                                        borderRadius: 8,
                                        overflow: 'hidden',
                                    }}
                                >
                                    {/* <SImage src={`${SSocket.api.root}usuario/${this.data.key_usuario}`} style={{ width: "100%", position: "relative", resizeMode: "cover" }} /> */}
                                    <SIcon
                                        width={70}
                                        height={70}
                                        name={'PedDelivery'}
                                        fill={STheme.color.primary}
                                    />
                                </SView>
                                <SView center flex>
                                    <SView col={'xs-1'}></SView>
                                    <SView col={'xs-11'} row>
                                        <SView col={'xs-12'}>
                                            <SText
                                                font={'Roboto'}
                                                color={STheme.color.text}
                                                fontSize={16}
                                                style={{ fontWeight: 'bold' }}
                                            >
                                                {this.dataConductor?.Nombres +
                                                    ' ' +
                                                    this.dataConductor
                                                        ?.Apellidos}
                                            </SText>
                                        </SView>
                                        <SHr height={10} />
                                        <SView
                                            col={'xs-12'}
                                            style={{
                                                justifyContent: 'flex-start',
                                            }}
                                        >
                                            <SText
                                                color={STheme.color.darkGray}
                                                fontSize={16}
                                                font={'Roboto'}
                                                style={{ fontWeight: 'bold' }}
                                            >
                                                Telf:{' '}
                                                {this.dataConductor?.Telefono}{' '}
                                            </SText>
                                        </SView>
                                    </SView>
                                    <SHr height={5} />
                                </SView>
                            </SView>
                        )}
                    </SView>
                </SView>
                <SHr height={18} />
            </SView>
        );
    }

    getTipoPago(datas) {
        var tipo = 'Pago online';
        if (datas.tipo_pago) {
            var efectivo = datas.tipo_pago.find(o => o.type == 'efectivo');
            if (efectivo) {
                tipo = 'Efectivo';
            }
        }
        return tipo;
    }

    detalleTapeke() {
        return <>
            <SText
                fontSize={15}
                font={'Roboto'}
                style={{ fontWeight: 'bold' }}
            >
                Detalle del Tapeke:
            </SText>
            <SHr height={8} />

            <SView col={'xs-12'} row center>
                <SView
                    width={80}
                    height={80}
                    center
                    backgroundColor={STheme.color.card}
                    style={{ borderRadius: 8, overflow: 'hidden' }}
                >
                    <SImage
                        src={require(`../../Assets/img/BOLSA-TAPEKE-MENU-APP.png`)}
                        style={{
                            width: '100%',
                            position: 'relative',
                            resizeMode: 'cover',
                        }}
                    />
                </SView>

                <SView flex center row>
                    <SView col={'xs-1'}></SView>
                    <SView col={'xs-11'} row>
                        <SView col={'xs-12'}>
                            <SText
                                color={STheme.color.text}
                                fontSize={12}
                                bold
                            >
                                {this.data.restaurante?.nombre}
                            </SText>
                        </SView>
                        <SHr height={15} />
                        <SView
                            col={'xs-6'}
                            style={{ justifyContent: 'flex-start' }}
                        >
                            <SText
                                fontSize={14}
                                font={'Roboto'}
                                color={STheme.color.primary}
                                bold
                            >
                                {' '}
                                Precio
                            </SText>
                            <SHr height={5} />
                            <SText
                                fontSize={20}
                                font={'Roboto'}
                                bold
                            >
                                Bs. {this.data.pack?.precio ?? 0}{' '}
                            </SText>
                        </SView>
                        <SView col={'xs-6'} center row>
                            <SView col={'xs-12'} center>
                                <SText
                                    fontSize={14}
                                    font={'Roboto'}
                                    color={STheme.color.primary}
                                    bold
                                >
                                    Cantidad
                                </SText>
                            </SView>
                            <SHr height={5} />
                            <SView col={'xs-12'} center>
                                <SView
                                    col={'xs-6'}
                                    center
                                    style={{
                                        height: 40,
                                        backgroundColor:
                                            STheme.color.card,
                                        borderRadius: 6,
                                    }}
                                >
                                    <SText
                                        fontSize={14}
                                        font={'Roboto'}
                                    >
                                        {' '}
                                        {this.data.cantidad ??
                                            0}{' '}
                                    </SText>
                                </SView>
                            </SView>
                        </SView>
                    </SView>
                </SView>
            </SView>
        </>
    }

    calcularTotales() {
        if (!this.data) return;
        let totales = {
            totalTapeke: 0,
            totalProducto: 0,
            totalSubProducto: 0,

            totalDescuentoProducto: 0,
            totalDescuentoItem: 0,
            total: 0,
        }

        totales.totalTapeke = (this.data?.cantidad * this.data?.precio);

        if (!!this.data?.pedido_producto) {
            Object.values(this.data?.pedido_producto).map((prod) => {
                if (prod.precio_sin_descuento) {
                    totales.totalProducto += (prod.cantidad * prod.precio_sin_descuento);
                    totales.totalDescuentoItem += (prod.precio_sin_descuento - prod.precio) * prod.cantidad;
                } else {
                    totales.totalProducto += (prod.cantidad * prod.precio);
                }

                if (prod.sub_productos) {
                    Object.values(prod.sub_productos).map((sub) => {
                        if (sub.sub_producto_detalle) {
                            Object.values(sub.sub_producto_detalle).map((subDet) => {
                                totales.totalSubProducto += (subDet?.precio * subDet?.cantidad) * prod?.cantidad;
                            });
                        }
                    });
                }
            });
        }

        if (!!this.data?.descuentos) {
            Object.values(this.data?.descuentos).map((desc) => {
                totales.totalDescuentoProducto += desc?.total_descuento_producto;
            });
        }

        totales.totalDescuentoProducto += totales.totalDescuentoItem;
        totales.total = (totales.totalTapeke + totales.totalProducto + totales.totalSubProducto - (totales.totalDescuentoProducto));

        return totales;
    }

    

    imprimirComanda() {
        if (Platform.OS === 'web') {
            return <>
                <SView
                    style={{
                        backgroundColor: STheme.color.primary,
                        padding: 10,
                        borderRadius: 8,
                        width: 200,
                        height: 50,
                    }}
                    onPress={() => {
                        SNavigation.navigate(Parent.path + '/comanda', { pk: this.pk });
                    }}
                    center>
                    <SText
                        style={{
                            color: STheme.color.white,
                            fontSize: 18,
                        }}
                    >Imprimir Comanda</SText>
                </SView>
            </>
        }
    }

    detalleProducto() {
        const renderSubProd = (pedido_producto) => {
            if (pedido_producto.sub_productos) {
                return Object.values(pedido_producto.sub_productos).map((sub) => {
                    return <>
                        <SView>
                            <SText style={{ fontWeight: 'bold' }}>Nombre: {sub?.nombre}</SText>
                            {sub.sub_producto_detalle ? renderSubProdDet(sub.sub_producto_detalle) : ""}
                        </SView>
                    </>
                })
            }
        }

        const renderSubProdDet = (sub_producto_detalle) => {
            return Object.values(sub_producto_detalle).map((subDet) => {
                return <>
                    <SView card padding={5} margin={5}>
                        <SView row flex>
                            <SView flex>
                                <SText style={{ fontWeight: 'bold' }}>Nombre: {subDet?.nombre}</SText>
                                <SText>Cantidad: {subDet?.cantidad}</SText>
                                <SText>Precio: {subDet?.precio ? `${SMath.formatMoney(subDet?.precio)} Bs.` : "No tiene precio"}</SText>
                                <SText>{subDet?.precio ? `Total: ${SMath.formatMoney(subDet?.precio * subDet?.cantidad)} Bs.` : null}</SText>
                            </SView>
                        </SView>
                    </SView>
                </>
            })
        }

        const productoConDescuento = (pedido_producto) => {
            let itemDescuento = pedido_producto?.precio_sin_descuento - pedido_producto?.precio ?? 0;
            if (pedido_producto.precio_sin_descuento) {
                return <>
                    <SText
                        fontSize={14}
                        font={'Roboto'}
                        color={STheme.color.primary}
                        bold
                    >
                        {' '}
                        Precio
                    </SText>
                    <SHr height={5} />
                    <SText
                        fontSize={20}
                        font={'Roboto'}
                        bold
                    >
                        Bs. {pedido_producto?.precio_sin_descuento ?? 0}{' '}
                    </SText>
                    {itemDescuento > 0 ?
                        <SText
                            fontSize={12}
                            font={'Roboto'}
                            color={STheme.color.danger}
                            bold
                        >
                            - {itemDescuento} Bs. Descuento
                        </SText> : null
                    }
                </>
            }
        }

        if (!!this.data?.pedido_producto) {
            return <>
                <SView col={'xs-12'} >
                    <SText
                        fontSize={15}
                        font={'Roboto'}
                        style={{ fontWeight: 'bold' }}
                        center
                    >
                        Detalle del Producto:
                    </SText>
                    <SHr height={8} />

                    <SList
                        data={this.data?.pedido_producto}
                        render={(pedido_producto) => {
                            return <>
                                <SView col={'xs-12'} height={130} row center card>
                                    <SView
                                        width={80}
                                        height={80}
                                        center
                                        backgroundColor={STheme.color.card}
                                        style={{ borderRadius: 8, overflow: 'hidden' }}
                                    >
                                        <SImage src={Model.producto._get_image_download_path(SSocket.api, pedido_producto?.key_producto)} />
                                    </SView>

                                    <SView flex center row>
                                        <SView col={'xs-1'}></SView>
                                        <SView col={'xs-11'} row>
                                            <SView col={'xs-12'}>
                                                <SText
                                                    color={STheme.color.text}
                                                    fontSize={12}
                                                    bold
                                                >
                                                    {pedido_producto?.descripcion}
                                                </SText>
                                            </SView>
                                            <SHr height={15} />
                                            <SView
                                                col={'xs-6'}
                                                style={{ justifyContent: 'flex-start' }}
                                            >
                                                {productoConDescuento(pedido_producto)}
                                            </SView>
                                            <SView col={'xs-6'} center row>
                                                <SView col={'xs-12'} center>
                                                    <SText
                                                        fontSize={14}
                                                        font={'Roboto'}
                                                        color={STheme.color.primary}
                                                        bold
                                                    >
                                                        Cantidad
                                                    </SText>
                                                </SView>
                                                <SHr height={5} />
                                                <SView col={'xs-12'} center>
                                                    <SView
                                                        col={'xs-6'}
                                                        center
                                                        style={{
                                                            height: 40,
                                                            backgroundColor:
                                                                STheme.color.card,
                                                            borderRadius: 6,
                                                        }}
                                                    >
                                                        <SText
                                                            fontSize={14}
                                                            font={'Roboto'}
                                                        >
                                                            {' '}
                                                            {pedido_producto?.cantidad ??
                                                                0}{' '}
                                                        </SText>
                                                    </SView>
                                                </SView>
                                            </SView>
                                        </SView>
                                    </SView>
                                </SView>
                                <SHr h={10} />
                                <SView>
                                    {pedido_producto?.sub_productos?.length > 0 ? <>
                                        <SHr h={1} color={STheme.color.primary} />
                                        <SText center color={STheme.color.primary}>Detalle Sub Producto</SText>
                                        <SHr h={1} color={STheme.color.primary} />
                                    </> : null}

                                    {renderSubProd(pedido_producto)}
                                </SView>
                            </>
                        }}
                    />
                </SView>
            </>
        }
    }

    detallePedido() {
        return <>
            <SView
                col={'xs-12'}
                center
                row
                style={{ backgroundColor: STheme.color.white }}
            >
                <SHr height={15} />
                {this.imprimirComanda()}
                <SView col={'xs-11'} row center>
                    <SView col={'xs-12'}>
                        <SHr height={15} />
                        <SText
                            fontSize={18}
                            font={'Roboto'}
                            style={{ fontWeight: 'bold' }}
                            color={STheme.color.darkGray}
                        >
                            Detalle del pedido
                        </SText>
                        <SHr height={15} />
                    </SView>

                    {this.detalleTapeke()}

                    <SHr height={18} />
                    {this.detalleProducto()}
                </SView>
            </SView>
        </>
    }

    detalleCompra() {
        let total = this.calcularTotales();
        return <>
            <SView
                col={'xs-12'}
                row
                center
                style={{ backgroundColor: STheme.color.white }}
            >
                <SView col={'xs-11'} row center>
                    <SView col={'xs-12'}>
                        <SHr height={15} />
                        <SText
                            fontSize={18}
                            font={'Roboto'}
                            style={{ fontWeight: 'bold' }}
                            color={STheme.color.darkGray}
                        >
                            Detalle de Compra
                        </SText>
                        <SHr height={15} />
                    </SView>
                    <SHr height={15} />
                    <SView col={'xs-6'}>
                        <SText
                            style={{ textAlign: 'justify' }}
                            fontSize={15}
                            font={'Roboto'}
                        >
                            Método de pago
                        </SText>
                    </SView>
                    <SView col={'xs-6'} style={{ alignItems: 'flex-end' }}>
                        <SText fontSize={15} font={'Roboto'} flex>
                            {this.getTipoPago(this.data)}
                        </SText>
                    </SView>
                    <SHr height={10} />

                    <SView col={'xs-6'}>
                        <SText
                            style={{ textAlign: 'justify' }}
                            fontSize={15}
                            font={'Roboto'}
                        >
                            Total Tapekes
                        </SText>
                    </SView>
                    <SView col={'xs-6'} style={{ alignItems: 'flex-end' }}>
                        <SText fontSize={15} font={'Roboto'} flex>
                            Bs.{' '}
                            {SMath.formatMoney(
                                total.totalTapeke
                            )}
                        </SText>
                    </SView>

                    <SHr height={10} />
                    <SView col={'xs-6'}>
                        <SText
                            style={{ textAlign: 'justify' }}
                            fontSize={15}
                            font={'Roboto'}
                        >
                            Total Productos
                        </SText>
                    </SView>
                    <SView col={'xs-6'} style={{ alignItems: 'flex-end' }}>
                        <SText fontSize={15} font={'Roboto'} flex>
                            Bs.{' '}
                            {SMath.formatMoney(
                                total.totalProducto
                            )}
                        </SText>
                    </SView>

                    <SHr height={10} />
                    <SView col={'xs-6'}>
                        <SText
                            style={{ textAlign: 'justify' }}
                            fontSize={15}
                            font={'Roboto'}
                        >
                            Total SubProductos
                        </SText>
                    </SView>
                    <SView col={'xs-6'} style={{ alignItems: 'flex-end' }}>
                        <SText fontSize={15} font={'Roboto'} flex>
                            Bs.{' '}
                            {SMath.formatMoney(
                                total.totalSubProducto
                            )}
                        </SText>
                    </SView>

                    <SHr height={10} />
                    <SView col={'xs-6'}>
                        <SText
                            style={{ textAlign: 'justify' }}
                            fontSize={15}
                            font={'Roboto'}
                        >
                            Total Descuentos
                        </SText>
                    </SView>
                    <SView col={'xs-6'} style={{ alignItems: 'flex-end' }}>
                        <SText color={STheme.color.danger} fontSize={15} font={'Roboto'} flex>
                            - Bs.
                            {SMath.formatMoney(
                                total.totalDescuentoProducto
                            )}
                        </SText>
                    </SView>

                    <SHr height={10} />
                    <SView
                        col={'xs-12'}
                        style={{
                            borderBottomWidth: 1,
                            borderColor: STheme.color.lightGray,
                        }}
                    ></SView>
                    <SHr height={10} />
                    <SView col={'xs-6'}>
                        <SText
                            style={{
                                textAlign: 'justify',
                                fontWeight: 'bold',
                            }}
                            fontSize={15}
                            font={'Roboto'}
                        >
                            Total:
                        </SText>
                    </SView>
                    <SView col={'xs-6'} style={{ alignItems: 'flex-end' }}>
                        <SText
                            fontSize={15}
                            font={'Roboto'}
                            style={{ fontWeight: 'bold' }}
                        >
                            Bs.{' '}
                            {SMath.formatMoney(
                                total.total
                            )}
                        </SText>
                    </SView>
                    <SHr height={15} />
                </SView>
            </SView>
        </>
    }

    contenido(data) {
        if (!data) return <SLoad />;
        this.data = data;
        return (
            <SView col={'xs-12'} row backgroundColor={STheme.color.card} center>
                <SHr height={18} />
                <SView
                    col={'xs-12'}
                    center
                    style={{ backgroundColor: STheme.color.white }}
                >
                    <SView col={'xs-11'} row center>
                        <SView col={'xs-12'}>
                            <SHr height={15} />
                            <SText
                                fontSize={18}
                                font={'Roboto'}
                                style={{ fontWeight: 'bold' }}
                                color={STheme.color.darkGray}
                            >
                                Cliente
                            </SText>
                            <SHr height={15} />
                        </SView>
                        <SView col={'xs-12'} row>
                            <SView
                                center
                                width={70}
                                backgroundColor={STheme.color.card}
                                height={70}
                                style={{ borderRadius: 8, overflow: 'hidden' }}
                            >
                                <SImage
                                    src={`${SSocket.api.root}usuario/${this.data.key_usuario}`}
                                    style={{
                                        width: '100%',
                                        position: 'relative',
                                        resizeMode: 'cover',
                                    }}
                                />
                            </SView>
                            <SView flex center row>
                                <SView col={'xs-1'}></SView>
                                <SView col={'xs-11'} row>
                                    <SView col={'xs-12'}>
                                        <SText
                                            font={'Roboto'}
                                            color={STheme.color.text}
                                            fontSize={16}
                                            style={{ fontWeight: 'bold' }}
                                        >
                                            {this.dataUsuario?.Nombres +
                                                ' ' +
                                                this.dataUsuario?.Apellidos}
                                        </SText>
                                    </SView>
                                    <SHr height={10} />
                                    <SView
                                        col={'xs-12'}
                                        style={{ justifyContent: 'flex-start' }}
                                    >
                                        <SText
                                            color={STheme.color.darkGray}
                                            fontSize={16}
                                            font={'Roboto'}
                                            style={{ fontWeight: 'bold' }}
                                        >
                                            Telf: {this.dataUsuario?.Telefono}
                                        </SText>
                                    </SView>
                                    <SHr height={20} />
                                    <SText
                                        fontSize={14}
                                        font={'Roboto'}
                                        style={{ fontWeight: 'bold' }}
                                    // color={STheme.color.darkGray}
                                    >
                                        Datos de Facturación:
                                    </SText>
                                    <SHr height={5} />
                                    <SText>
                                        RS: {this.data?.factura?.razon_social ? this.data?.factura?.razon_social : 'El Usuario no puso Razón Social'}
                                    </SText>
                                    <SHr height={5} />
                                    <SText>
                                        NIT: {this.data?.factura?.nit ? this.data?.factura?.nit : `El Usuario no puso NIT`}
                                    </SText>
                                    <SHr height={20} />
                                    <SText
                                        fontSize={14}
                                        font={'Roboto'}
                                        style={{ fontWeight: 'bold' }}
                                    // color={STheme.color.darkGray}
                                    >
                                        Nota del cliente:
                                    </SText>
                                    <SHr height={10} />
                                    <SText>
                                        {this.data?.nota_cliente ? this.data?.nota_cliente : `El Usuario no puso nota al pedido`}
                                    </SText>
                                </SView>
                                <SHr height={5} />
                            </SView>
                        </SView>
                    </SView>
                    <SHr height={18} />
                </SView>

                <SHr height={18} />
                {this.detallePedido()}

                <SHr height={18} />
                {this.getTipoEntrega()}

                <SHr height={18} />
                {this.detalleCompra()}

                <SHr height={18} />
                {this.getConductor()}

                <SHr height={18} />
                <SView
                    col={'xs-11'}
                    center
                    style={{ backgroundColor: STheme.color.white }}
                >
                    <SHr height={40} />
                    {this.data.state == 'en_camino' ||
                        this.data.state == 'entregado' ||
                        this.data.state == 'no_recogido' ? (
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
                                    this.data?.restaurante?.key !=
                                    Model.restaurante.Action.getSelect()
                                ) {
                                    SPopup.alert(
                                        'Este pedido es de otro restaurante.'
                                    );
                                    SNavigation.reset('/');
                                    return;
                                }
                                var mensaje = '';
                                if (
                                    this.data.state != 'listo' &&
                                    this.data.state != 'esperando_conductor'
                                ) {
                                    switch (this.data.state) {
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
                                                    this.data.state,
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
            </SView>
        );
    }

    render_content() {
        if (this.state.loading) return <SLoad />;
        if (!this.loadData()) return <SLoad />;
        return <Container>{this.contenido(this.data)}</Container>;
    }

    render() {
        return (
            <SPage
                id="recibo"
                onRefresh={() => {
                    Model.pedido.Action.CLEAR();
                }}
                header={<AccentBar />}
            >
                {this.render_content()}
            </SPage>
        );
    }
}
const initStates = state => {
    return { state };
};
export default connect(initStates)(root);
