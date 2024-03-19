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
    SDate,
    STheme,
    SImage,
    SMath,
    SIcon,
    SThread,
    SList
} from 'servisofts-component';
import Model from '../../Model';
import SSocket from 'servisofts-socket';
import AccentBar from '../../Components/AccentBar';
import { Platform } from 'react-native';
import Html2Canvas from 'html2canvas';
import jspdf from 'jspdf';

class root extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
        };
        this.pk = SNavigation.getParam('pk');

        this.sizeComanda = {
            Letter: { width: 220, height: 280 },//mm
            Legal: { width: 220, height: 360 }, //mm
            Rollo: { width: 80, height: 0 }, //mm
        }

        this.generateComanda = true;
    }

    componentDidMount() {
        SSocket.sendPromise({
            component: "pedido",
            type: "getDetalle",
            key_pedido: this.pk
        }).then((res) => {
            this.data = res.data;
            this.setState({ loading: false });
            this.imprimirComanda()
        });
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


    cropImage(img, h, y) {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, y, img.width, img.height, 0, 0, img.width, img.height);
        return canvas.toDataURL('image/png');
    }

    plantillaComanda() {
        let total = this.calcularTotales();
        let fecha_on = new SDate(this.data.fecha_on, "yyyy-MM-ddThh:mm:ss").toString("yyyy-MM-dd hh:mm:ss")
        return (
            <div
                id="recibo"
                style={{
                    width: this.sizeComanda.Rollo.width + "mm",
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 14,
                }}
            >
                <h2>Comanda Tapeke</h2>
                <p>Fecha de realización: {fecha_on}</p>
                {/* <p>Total de productos sin descuento: {this.data.total_productos_sin_descuento}</p> */}
                <p>Comisión del restaurante: {this.data.comision_restaurante}</p>
                {/* <p>Precio: {this.data.precio}</p> */}
                <h3>Factura</h3>
                <p>Teléfono: {this.data.factura.phone}</p>
                <p>NIT: {this.data.factura.nit ? this.data.factura.nit : "S/N"}</p>
                <p>Razón social: {this.data.factura.razon_social ? this.data.factura.razon_social : "S/N"}</p>
                <p>Email: {this.data.factura.email}</p>

                <h3>Productos del pedido</h3>
                <ul>
                    {this.data.pedido_producto.map((producto, index) => (
                        <li key={index}>
                            <p>Descripción: {producto.descripcion}</p>
                            <p>Precio: {producto.precio}</p>
                            <p>Cantidad: {producto.cantidad}</p>
                        </li>
                    ))}
                </ul>

                <h3>Detalle del Pedido</h3>
                <div>
                    <p>Método de pago: {this.getTipoPago(this.data)}</p>
                    <p>
                        Total Tapekes: Bs. {
                            SMath.formatMoney(
                                total.totalTapeke
                            )}
                    </p>
                    <p>
                        Total Productos: Bs. {
                            SMath.formatMoney(
                                total.totalProducto
                            )}
                    </p>
                    <p>
                        Total SubProductos: Bs. {
                            SMath.formatMoney(
                                total.totalSubProducto
                            )}
                    </p>
                    <p>
                        Total Descuentos: - Bs. {
                            SMath.formatMoney(
                                total.totalDescuentoProducto
                            )}
                    </p>
                    <hr style={{ borderTop: 1, borderColor: "black" }}></hr>
                    <p>
                        Total: Bs. {
                            SMath.formatMoney(
                                total.total
                            )}
                    </p>
                </div>
            </div>
        );
    }

    imprimirComanda() {
        let size = this.sizeComanda.Rollo;
        let input = document.getElementById('recibo');
        let heigthRollo = input.offsetHeight;
        let heigthRolloMm = heigthRollo * 0.2645833333;

        this.sizeComanda.Rollo.height = heigthRolloMm;

        Html2Canvas(input, { scrollY: 0, scrollX: 0, }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jspdf('p', 'mm', [size.width, size.height]);
            const ratio = canvas.width / pdf.internal.pageSize.getWidth();

            let space = 10;
            const imgHeight = (pdf.internal.pageSize.getHeight() * ratio);
            var npages = Math.ceil(canvas.height / imgHeight);

            for (var i = 0; i < npages; i++) {
                var imgTemp = this.cropImage(canvas, imgHeight, imgHeight * i);
                pdf.addImage(imgTemp, "PNG", 0, 0, pdf.internal.pageSize.getWidth(), imgHeight / ratio);
                if (i < npages - 1) {
                    pdf.addPage();
                }
            }

            const newWindow = window.open(pdf.output("bloburl"), '_blank');
            if (newWindow) {
                newWindow.onload = function () {
                    newWindow.print();
                };
            }
            this.generateComanda = false
        });
    }

    render_content() {
        if (this.state.loading) return <SLoad />;

        return <>
            {this.plantillaComanda()}
        </>
    }

    volverImprimirComanda() {
        if (Platform.OS === 'web') {
            return <>
                <SView
                    style={{
                        backgroundColor: STheme.color.primary,
                        margin: 20,
                        width: 200,
                        padding: 10,
                        borderRadius: 8,
                        fontSize: 20,
                    }}
                    onPress={() => {
                        this.imprimirComanda()
                    }}
                    center>
                    <SText
                        style={{
                            color: STheme.color.white,
                        }}
                    >Volver a Imprimir</SText>
                </SView>
            </>
        }
    }

    render() {
        return (
            <SPage
                onRefresh={() => {
                    Model.pedido.Action.CLEAR();
                }}
                header={<AccentBar />}
            >
                <SView center>
                    {this.volverImprimirComanda()}
                    <SView
                        style={{
                            width: this.sizeComanda.Rollo.width + "mm",
                            borderRadius: 8,
                            borderColor: 'lightgray',
                            borderWidth: 1,
                            borderStyle: 'solid',
                            backgroundColor: STheme.color.background,
                        }}
                    >
                        {this.render_content()}
                    </SView>
                    <SHr height={30} />
                </SView>
            </SPage>
        );
    }
}
const initStates = state => {
    return { state };
};
export default connect(initStates)(root);
