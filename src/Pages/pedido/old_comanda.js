import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    SHr,
    SLoad,
    SNavigation,
    SPage,
    SText,
    SView,
    SDate,
    STheme,
    SMath,
    SThread
} from 'servisofts-component';
import Model from '../../Model';
import SSocket from 'servisofts-socket';
import AccentBar from '../../Components/AccentBar';
import { Platform } from 'react-native';
import Html2Canvas from 'html2canvas';
import jspdf from 'jspdf';
import https from 'https';

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

        let widthGlobal = '90%';
        this.styles = {
            hederClass: {
                fontSize: 12,
            },
            textClass: {
                width: widthGlobal,
                fontSize: 10,
                margin: '1px 0'
            },
            divLeft: {
                width: widthGlobal,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
            },
            separadorGuiones: {
                width: widthGlobal,
                border: 'none',
                borderTop: '1px dashed black'
            },
            separadorSolid: {
                width: widthGlobal,
                border: 'none',
                borderTop: '1px solid black'
            },
            separadorAltura: {
                border: 'none',
                height: '1px'
            },
            divMain: {
                width: widthGlobal,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            },
            divChild: {
                width: widthGlobal,
            },
            borderNone: {
                border: 'none'
            }
        };
    }

    componentDidMount() {
        SSocket.sendPromise({
            component: "pedido",
            type: "getDetalle",
            key_pedido: this.pk
        }).then((res) => {
            let key_usuario = res.data.key_usuario;
            SSocket.sendPromise({
                version: "2.0",
                service: "usuario",
                component: "usuario",
                type: "getAllKeys",
                keys: [key_usuario],
            }).then(e2 => {
                this.usuario = e2?.data[key_usuario]?.usuario ?? {}
                this.data = res.data;
                this.getBase64Image('https://repo.tapekeapp.com/image/logo_tapeke_black.png', (base64Image) => {
                    this.base64LogoTapekeBlack = base64Image;
                    this.forceUpdate();
                });
                new SThread(100, "comanda", false).start(() => {
                    this.imprimirComanda();
                })
                if (this.usuario && this.data) this.setState({ loading: false });
            })
        });
    }

    getBase64Image(imgUrl, callback) {
        https.get(imgUrl, (res) => {
            const data = [];

            res.on('data', (chunk) => {
                data.push(chunk);
            }).on('end', () => {
                const buffer = Buffer.concat(data);
                callback(buffer.toString('base64'));
            });
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

    detalleProducto() {
        const renderSubProd = (pedido_producto) => {
            if (pedido_producto.sub_productos) {
                return Object.values(pedido_producto.sub_productos).map((sub) => {
                    return <>
                        <p style={{ ...this.styles.textClass }}>Sub producto: {sub?.nombre}</p>
                        {sub.sub_producto_detalle ? renderSubProdDet(sub.sub_producto_detalle) : ""}
                    </>
                })
            }
        }

        const renderSubProdDet = (sub_producto_detalle) => {
            return Object.values(sub_producto_detalle).map((subDet) => {
                return <>
                    <div style={{ ...this.styles.divChild, ...this.styles.divLeft }}>
                        <p style={{ ...this.styles.textClass }}>Descripción: {subDet?.nombre}</p>
                        <p style={{ ...this.styles.textClass }}>Cantidad: {subDet?.cantidad}</p>
                        <p style={{ ...this.styles.textClass }}>Precio: {subDet?.precio ? `${SMath.formatMoney(subDet?.precio)} Bs.` : "No tiene precio"}</p>
                        <p style={{ ...this.styles.textClass }}>{subDet?.precio ? `Total: ${SMath.formatMoney(subDet?.precio * subDet?.cantidad)} Bs.` : null}</p>
                        <hr style={{ ...this.styles.separadorGuiones }} />
                    </div>
                </>
            })
        }

        const productoConDescuento = (pedido_producto) => {
            let itemDescuento = pedido_producto?.precio_sin_descuento - pedido_producto?.precio ?? 0;
            if (pedido_producto.precio_sin_descuento) {
                return <>
                    <p style={{ ...this.styles.textClass }}>Precio: {pedido_producto?.precio_sin_descuento} Bs.</p>

                    {itemDescuento > 0 ?
                        <p style={{ ...this.styles.textClass }}>
                            Descuento: - {itemDescuento} Bs.
                        </p> : null
                    }
                </>
            }
        }

        if (!!this.data?.pedido_producto) {
            return <>
                {this.data?.pedido_producto.map((pedido_producto, index) => (
                    <div key={index} style={{ ...this.styles.divMain }}>
                        <div style={{ ...this.styles.divChild }} >
                            <p style={{ ...this.styles.textClass, fontWeight: 'bold' }}>{pedido_producto?.descripcion}</p>
                            <div>
                                {productoConDescuento(pedido_producto)}
                            </div>
                            <p style={{ ...this.styles.textClass }}>
                                Cantidad: {pedido_producto?.cantidad ?? 0}
                            </p>
                        </div>

                        {pedido_producto?.sub_productos?.length > 0 ? <>
                            <div style={{ ...this.styles.divChild, textAlign: 'center' }}>
                                <hr style={{ ...this.styles.separadorGuiones }} />
                                <p style={this.styles.textClass}>Detalle Sub Producto</p>
                                <hr style={{ ...this.styles.separadorGuiones }} />
                            </div>
                        </> : null}

                        {renderSubProd(pedido_producto)}
                        <hr style={{ ...this.styles.separadorAltura }} />
                        <hr style={{ ...this.styles.separadorGuiones }} />
                    </div>
                ))}
            </>
        }
    }


    cropImage(img, h, y) {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, y, img.width, img.height, 0, 0, img.width, img.height);
        return canvas.toDataURL('image/png');
    }

    labelDetallePedido({ label, simbol, money, value }) {
        let val = `${simbol ? simbol : ''} ${money ? ' ' + money : ''} ${typeof (value) == 'number' ? SMath.formatMoney(value) : value}`.trim();

        return <>
            <div style={{ ...this.styles.divChild, display: 'flex', justifyContent: 'space-between' }}>
                <p style={{ ...this.styles.textClass }}>{label}:</p>
                <p style={{ ...this.styles.textClass, textAlign: 'end' }}>{val}</p>
            </div>
        </>
    }

    plantillaComanda() {
        let total = this.calcularTotales();
        let fecha_on = new SDate(this.data.fecha_on, "yyyy-MM-ddThh:mm:ss").toString("yyyy-MM-dd hh:mm:ss")

        return (
            <div
                id="recibo"
                style={{
                    width: this.sizeComanda.Rollo.width + "mm",
                    ...this.styles.divMain,
                    ...this.styles.borderNone
                }}
            >
                <hr style={{ height: '2cm', ...this.styles.borderNone }} />
                <div style={{ ...this.styles.divMain }}>
                    <hr style={{ height: '1cm', border: 'none' }} />
                    <img src={`data:image/png;base64,${this.base64LogoTapekeBlack}`} alt="Logo Tapeke Black" style={{ width: '80px' }} />
                    <h2 style={{ fontSize: 16, ...this.styles.borderNone }}>Comanda Tapeke</h2>
                </div>

                <p style={{ ...this.styles.textClass }}>Fecha de realización pedido: {fecha_on}</p>

                <hr style={{ ...this.styles.separadorGuiones }} />
                <div style={{
                    ...this.styles.divMain,
                }}>
                    <h3 style={{ ...this.styles.hederClass }}>Datos para Facturación</h3>
                    <p style={{ ...this.styles.textClass, textAlign: 'center' }}>Razón Social: {this.data.factura.razon_social ? this.data.factura.razon_social : "S/N"}</p>
                    <p style={{ ...this.styles.textClass, textAlign: 'center' }}>NIT: {this.data.factura.nit ? this.data.factura.nit : "S/N"}</p>
                    <p style={{ ...this.styles.textClass, textAlign: 'center' }}>Email: {this.data.factura.email}</p>
                </div>
                <hr style={{ ...this.styles.separadorAltura }} />
                <hr style={{ ...this.styles.separadorGuiones }} />

                <div style={{ ...this.styles.divLeft }}>
                    <h3 style={{ ...this.styles.hederClass }}>Datos del Cliente</h3>
                    <p style={{ ...this.styles.textClass }}>Nombre Cliente: {`${this.usuario.Nombres} ${this.usuario.Apellidos}`}</p>
                    <p style={{ ...this.styles.textClass }}>Teléfono: {this.usuario.Telefono}</p>
                    <p style={{ ...this.styles.textClass }}>Nota del Cliente: {this.data?.nota_cliente ? this.data?.nota_cliente : `El Usuario no puso nota al pedido`}</p>
                </div>
                <hr style={{ ...this.styles.separadorAltura }} />
                <hr style={{ ...this.styles.separadorGuiones }} />

                <div style={{ ...this.styles.divLeft }}>
                    <p style={{ ...this.styles.textClass, fontWeight: 'bold' }}>Tapekes del Pedido</p>
                    <p style={{ ...this.styles.textClass }}>Cantidad: {this.data.cantidad}</p>
                    <p style={{ ...this.styles.textClass }}>Precio: {this.data.precio}</p>
                    <p style={{ ...this.styles.textClass }}>Total: {this.data.precio * this.data.cantidad}</p>

                    {
                        !!this.data?.pedido_producto ? <>
                            <hr style={{ ...this.styles.separadorAltura }} />
                            <p style={{ ...this.styles.textClass, fontWeight: 'bold' }}>Productos del Pedido</p>
                            {this.detalleProducto()}
                        </> : null
                    }


                </div>

                <h3 style={{ ...this.styles.hederClass, ...this.styles.borderNone }}>Detalle del Pedido</h3>
                <div style={{ ...this.styles.divMain }}>
                    {this.labelDetallePedido({ label: 'Método de pago', value: this.getTipoPago(this.data) })}
                    {this.labelDetallePedido({ label: 'Total Tapekes:', money: 'Bs.', value: total.totalTapeke })}
                    {this.labelDetallePedido({ label: 'Total Productos:', money: 'Bs.', value: total.totalProducto })}
                    {this.labelDetallePedido({ label: 'Total Descuentos:', simbol: '-', money: 'Bs.', value: total.totalDescuentoProducto })}
                    <hr style={{ ...this.styles.separadorSolid }}></hr>
                    {this.labelDetallePedido({ label: 'Total:', money: 'Bs.', value: total.total })}
                </div>

                <hr style={{ height: '4cm', ...this.styles.borderNone }} />
            </div>
        );
    }

    imprimirComanda() {
        let input = document.getElementById('recibo');
        let heigthRollo = input.offsetHeight;
        let heigthRolloMm = heigthRollo * 0.2645833333; 

        let size = this.sizeComanda.Rollo;
        this.sizeComanda.Rollo.height = heigthRolloMm;

        Html2Canvas(input, { scale: 2, scrollY: 0, scrollX: 0, height: heigthRollo, width: input.offsetWidth }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jspdf('p', 'mm', [size.width, size.height]);
            const ratio = canvas.height / pdf.internal.pageSize.getHeight();

            let imgHeight = pdf.internal.pageSize.getHeight() * ratio;
            var npages = Math.ceil(canvas.height / imgHeight);

            for (var i = 0; i < npages; i++) {
                var imgTemp = this.cropImage(canvas, imgHeight, imgHeight * i);
                pdf.addImage(imgTemp, "PNG", 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight());
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
                        center
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
