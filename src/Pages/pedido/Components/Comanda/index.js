import React from 'react';
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
    SThread,
    SImage
} from 'servisofts-component';
import Model from '../../../../Model';
import SSocket from 'servisofts-socket';
import AccentBar from '../../../../Components/AccentBar';
import { Platform } from 'react-native';
import html2canvas from 'html2canvas';
import jspdf from 'jspdf';

class Comanda extends React.Component {
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

        this.widthGlobal = '90%';
        this.styles = {
            hederClass: {
                fontSize: 12,
            },
            textClass: {
                width: this.widthGlobal,
                fontSize: 10,
                margin: '1px 0'
            },
            divLeft: {
                width: this.widthGlobal,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
            },
            separadorGuiones: {
                width: this.widthGlobal,
                border: 'none',
                borderTop: '1px dashed black'
            },
            separadorSolid: {
                width: this.widthGlobal,
                border: 'none',
                borderTop: '1px solid black'
            },
            separadorAltura: {
                border: 'none',
                margin: 0,
                height: 8
            },
            divMain: {
                width: this.widthGlobal,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            },
            divChild: {
                width: this.widthGlobal,
            },
            divSpaceBetween: {
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%'
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
                new SThread(50, "comanda", false).start(() => {
                    this.imprimirComanda();
                })
                if (this.usuario && this.data) this.setState({ loading: false });
            })
        });
    }

    calcularDescuentoCubreTapeke(obj) {
        let totalDesc = {
            totalDescCubreTapeke: 0,
            totalDescCubrePartner: 0,
            porcentajeCubreTapeke: 0,
            porcentajeCubrePartner: 0,
        };

        if (obj?.descuentos) {
            Object.values(obj.descuentos).map((desc) => {
                if (desc.cobertura) {
                    let coberturaTapeke = desc.total_descuento_producto * (desc.cobertura ?? 0);
                    let coberturaPartner = desc.total_descuento_producto - coberturaTapeke;

                    totalDesc.totalDescCubreTapeke += parseFloat(coberturaTapeke, 2);
                    totalDesc.totalDescCubrePartner += parseFloat(coberturaPartner, 2);
                    totalDesc.porcentajeCubreTapeke = desc.cobertura;
                    totalDesc.porcentajeCubrePartner = 1 - desc.cobertura;
                }

            });
        }

        return totalDesc;
    }

    calcularTotales() {
        if (!this.data) return;
        let totales = {
            totalTapeke: 0,
            totalProducto: 0,
            totalSubProducto: 0,

            totalDescCubrePartner: 0,
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

        let totalDesc = this.calcularDescuentoCubreTapeke(this.data);
        totales.totalDescCubrePartner = totalDesc.totalDescCubrePartner;

        totales.total = (totales.totalTapeke + totales.totalProducto + totales.totalSubProducto - (totales.totalDescCubrePartner));

        return totales;
    }

    tipoDePago() {
        if (this.data?.tipo_pago && this.data?.tipo_pago?.length > 0) {
            return !!this.data.tipo_pago.find(o => o.type == "efectivo") ? "Efectivo" : `Online - ${this.data.tipo_pago[0].type}`;
        } else {
            return "El pago con QR nunca se pago";
        }
    }


    detalleProducto() {
        const renderSubProd = (pedido_producto) => {
            if (pedido_producto.sub_productos) {
                return Object.values(pedido_producto.sub_productos).map((sub) => {
                    return <>
                        {sub.sub_producto_detalle ? renderSubProdDet(sub.sub_producto_detalle) : ""}
                    </>
                })
            }
        }

        const renderSubProdDet = (sub_producto_detalle) => {
            return Object.values(sub_producto_detalle).map((subDet) => {
                return <>
                    <div style={{ ...this.styles.divSpaceBetween }}>
                        <p style={{ ...this.styles.textClass, marginLeft: 15, width: 25 }}>{`- ${subDet?.cantidad}x`}</p>
                        <p style={{ ...this.styles.textClass }}>{subDet?.nombre}</p>
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

        const totalSubProductoDetalleIteam = (pedido_producto) => {
            let totalSub = 0;
            if (pedido_producto.sub_productos) {
                Object.values(pedido_producto.sub_productos).map((sub) => {
                    Object.values(sub.sub_producto_detalle).map((subDet) => {
                        totalSub += (subDet?.precio * subDet?.cantidad) * pedido_producto.cantidad;
                    })
                })
            }
            return totalSub;
        }

        if (!!this.data?.pedido_producto) {
            return <>
                {this.data?.pedido_producto.map((pedido_producto, index) => (
                    <div key={index} style={{ ...this.styles.divMain, width: '100%' }}>

                        <div style={{ ...this.styles.divSpaceBetween }}>
                            <p style={{ ...this.styles.textClass, width: 35 }}>
                                {pedido_producto?.cantidad ?? 0}x
                            </p>
                            <p style={{ ...this.styles.textClass, textAlign: 'left' }}>{pedido_producto?.descripcion}</p>
                            <p style={{ ...this.styles.textClass, textAlign: 'right' }}>Bs. {SMath.formatMoney((pedido_producto?.precio_sin_descuento * pedido_producto.cantidad) + totalSubProductoDetalleIteam(pedido_producto))} </p>
                        </div>

                        {renderSubProd(pedido_producto)}
                        <hr style={{ ...this.styles.separadorAltura }} />
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
            <div style={{ ...this.styles.divChild }}>
                <p style={{ ...this.styles.textClass }}>{label}:</p>
                <p style={{ ...this.styles.textClass, textAlign: 'end' }}>{val}</p>
            </div>
        </>
    }

    plantillaComanda() {
        let total = this.calcularTotales();

        return (
            <div
                id="recibo"
                style={{
                    width: this.sizeComanda.Rollo.width + "mm",
                    ...this.styles.divMain,
                    ...this.styles.borderNone
                }}
            >
                <hr style={{ height: '30px', border: 'none' }} />
                <div style={{ ...this.styles.divMain }}>
                    <p style={{ ...this.styles.textClass, textAlign: 'center' }}>* Documento NO FISCAL *</p>

                    <SImage src={require('../../../../Assets/img/logo_tapeke_black.png')} style={{ border: 'none', height: 35 }} />

                </div>
                <p style={{ ...this.styles.textClass, textAlign: 'center' }}>{this.data?.restaurante?.nombre}</p>

                <hr style={{ ...this.styles.separadorGuiones }} />
                <div style={{ ...this.styles.divMain }}>
                    <p style={{ ...this.styles.textClass, textAlign: 'center' }}>Santa Cruz, {new SDate(this.data.fecha_on, "yyyy-MM-ddThh:mm:ss").toString("dd de MONTH del yyyy")}</p>
                    <hr style={{ ...this.styles.separadorAltura }} />
                    <div style={{ ...this.styles.divSpaceBetween }}>
                        <div>
                            <p style={{ fontSize: 14, fontWeight: 'bold', textAlign: 'center', margin: 0 }}>{`# ${this.data?.key.slice(-6)}`}</p>
                            <p style={{ fontSize: 8, width: 'auto', textAlign: 'center', margin: 0 }}>Código de pedido</p>
                        </div>

                        <div>
                            <p style={{ fontSize: 14, fontWeight: 'bold', textAlign: 'center', margin: 0 }}>{new SDate(this.data.fecha_on, "yyyy-MM-ddThh:mm:ss").toString("hh:mm")}</p>
                            <p style={{ fontSize: 8, width: 'auto', textAlign: 'center', margin: 0 }}>Hora de ingreso del pedido</p>
                        </div>
                    </div>
                </div>
                <hr style={{ ...this.styles.separadorGuiones }} />


                <div style={{
                    ...this.styles.divMain,
                    width: '100%',
                }}>
                    <p style={{ ...this.styles.textClass }}>Nombre Cliente: {`${this.usuario.Nombres} ${this.usuario.Apellidos}`}</p>
                    <p style={{ ...this.styles.textClass }}>Teléfono: {this.usuario.Telefono}</p>
                    <p style={{ ...this.styles.textClass }}>Email: {this.data.factura.email}</p>

                    <hr style={{ ...this.styles.separadorAltura }} />
                    <p style={{ ...this.styles.textClass }}>Razón Social: {this.data.factura.razon_social ? this.data.factura.razon_social : "S/N"}</p>
                    <p style={{ ...this.styles.textClass }}>NIT: {this.data.factura.nit ? this.data.factura.nit : "S/N"}</p>

                    <hr style={{ ...this.styles.separadorAltura }} />
                    <div style={{ display: 'flex', width: '90%' }}>
                        <p style={{ ...this.styles.textClass, width: '50%' }}>Nota del Cliente:</p>
                        <p style={{ ...this.styles.textClass, alignText: 'left' }}>{this.data?.nota_cliente ? this.data?.nota_cliente : `El Usuario no puso nota al pedido`}</p>
                    </div>
                </div>

                <hr style={{ ...this.styles.separadorAltura }} />
                <hr style={{ ...this.styles.separadorGuiones }} />

                <div style={{ ...this.styles.divLeft }}>
                    <p style={{ ...this.styles.textClass, fontWeight: 'bold' }}>TAPEKES</p>

                    <div style={{ ...this.styles.divSpaceBetween }}>
                        <p style={{ ...this.styles.textClass }}>{this.data.cantidad} x     -</p>
                        <p style={{ ...this.styles.textClass, textAlign: 'right' }}>Bs. {SMath.formatMoney(this.data.precio * this.data.cantidad)}</p>
                    </div>

                    {
                        !!this.data?.pedido_producto ? <>
                            <hr style={{ ...this.styles.separadorAltura }} />
                            <p style={{ ...this.styles.textClass, fontWeight: 'bold' }}>íTEMS</p>
                            {this.detalleProducto()}
                        </> : null
                    }
                </div>
                <hr style={{ ...this.styles.separadorGuiones }} />
                <div style={{ width: this.widthGlobal }}>
                    <div style={{ ...this.styles.divSpaceBetween }}>
                        <p style={{ ...this.styles.textClass }}>{`Subtotal:`}</p>
                        <p style={{ ...this.styles.textClass, textAlign: 'right' }}>{`Bs. ${SMath.formatMoney(total.totalProducto + total.totalSubProducto)}`}</p>
                    </div>

                    <div style={{ ...this.styles.divSpaceBetween }}>
                        <p style={{ ...this.styles.textClass, fontSize: 8 }}>{`(-) Descuento Cubre Comercio:`}</p>
                        <p style={{ ...this.styles.textClass, textAlign: 'right' }}>{`Bs. ${SMath.formatMoney(total.totalDescCubrePartner)}`}</p>
                    </div>
                </div>

                <hr style={{ ...this.styles.separadorGuiones }} />
                <div
                    style={{
                        ...this.styles.divSpaceBetween,
                        fontWeight: 'bold',
                        width: this.widthGlobal,
                    }}>
                    <p style={{ ...this.styles.textClass, fontSize: 16 }}>Total Pedido:</p>
                    <p style={{ ...this.styles.textClass, fontSize: 16, textAlign: 'right' }}>Bs. {SMath.formatMoney(total.total)}</p>
                </div>

                <hr style={{ ...this.styles.separadorGuiones }} />
                <div style={{ ...this.styles.divSpaceBetween, width: this.widthGlobal, }}>
                    <p style={{ ...this.styles.textClass }}>Método de Pago:</p>
                    <p style={{ ...this.styles.textClass, textAlign: 'right' }}>{this.tipoDePago(this.data?.tipo_pago)}</p>
                </div>
                <hr style={{ ...this.styles.separadorGuiones }} />

                <hr style={{ height: '30px', border: 'none' }} />
            </div>
        );
    }

    imprimirComanda() {

        let input = document.getElementById('recibo');
        let heigthRollo = input.offsetHeight;
        let heigthRolloMm = heigthRollo * 0.2645833333;

        let size = this.sizeComanda.Rollo;
        this.sizeComanda.Rollo.height = heigthRolloMm;

        html2canvas(input, { scale: 2, scrollY: 0, scrollX: 0, height: heigthRollo, width: input.offsetWidth }).then((canvas) => {
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
        );
    }
}
const initStates = state => {
    return { state };
};
export default connect(initStates)(Comanda);
