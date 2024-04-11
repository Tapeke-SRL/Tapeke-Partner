import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SPopup, SDate, SHr, SIcon, SList, SLoad, SMath, SNavigation, SPage, SText, STheme, SView } from 'servisofts-component';
import TopBar from '../../Components/TopBar';
import Model from '../../Model';
import SSocket from 'servisofts-socket'
import Pedido_item from './Pedido_item';
import Container from '../../Components/Container';
class root extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ultima_conciliacion: {},
            data: {}
        };

    }

    componentDidMount() {
        if (!Model.restaurante.Action.getSelect()) {
            SNavigation.goBack();
            return;
        }
        this.getDatos();
    }

    getDatos() {
        this.setState({ data: null })
        this.setState({ ultima_conciliacion: null })
        SSocket.sendPromise({
            component: "pedido",
            type: "getPendientesConciliacion",
            key_restaurante: Model.restaurante.Action.getSelect(),
        }).then(resp => {
            this.setState({ data: resp.data })
            this.setState({ ultima_conciliacion: resp.ultima_conciliacion })
        }).catch(e => {
            console.error(e)
        })
    }

    calcularMontos() {
        if (!this.state.data) return;

        let total = {
            efectivo: 0,
            linea: 0,
            comision_efectivo: 0,
            comision_linea: 0,
            total: 0,

            totalComisionEfectivo: 0,
            totalComisionLinea: 0,

            cantTapDel: 0,
            montoIngTapDel: 0,

            cantProdDel: 0,
            montoIngProdDel: 0,

            cantTapRecoger: 0,
            montoIngTapRecoger: 0,

            cantProdRecoger: 0,
            montoIngProdRecoger: 0,

            totalDesc: {
                totalDescCubreTapeke: 0,
                totalDescCubrePartner: 0,
            },

            totalDescCubreTapeke: 0,
            totalDescCubrePartner: 0,

            totalDescEfectivo: 0,
            totalDescLinea: 0,

            totalDescProducto: 0,
            totalDescDelivery: 0,
            totalDescuento: 0,

            totalPorConciliar: 0
        }

        const calcularTotalProd = (obj) => {
            let totalProd = 0;
            // total += obj.cantidad * obj.precio;
            if (obj.pedido_producto) {
                Object.values(obj.pedido_producto).map((prod) => {
                    if (prod.precio_sin_descuento) {
                        totalProd += (prod.cantidad * prod.precio_sin_descuento)

                        // Calcular descuento Tapeke
                        total.totalDescCubreTapeke += (prod.cantidad * (prod.precio_sin_descuento - prod.precio))
                    } else {
                        totalProd += (prod.cantidad * prod.precio)
                    }

                    if (prod.sub_productos) {
                        Object.values(prod.sub_productos).map((sub) => {
                            if (sub.sub_producto_detalle) {
                                Object.values(sub.sub_producto_detalle).map((subDet) => {
                                    totalProd += (subDet.cantidad * subDet.precio)
                                })
                            }
                        })
                    }
                })
            }
            return totalProd;
        }

        const calcularTotalDescuento = (obj) => {
            let totalDesc = 0;
            if (obj) {
                totalDesc = obj.total_descuento_producto - obj.total_descuento_delivery
            }
            return parseFloat(totalDesc, 2);
        }

        const contadorProd = (obj) => {
            let cantidad = 0;
            if (obj.pedido_producto) {
                Object.values(obj.pedido_producto).map((prod) => {
                    cantidad += 1;
                })
            }
            return cantidad;
        }

        this.keys_pedidos = [];
        let totalDesc = this.calcularDescuentoCubreTapeke(null);
        Object.values(this.state.data).map(obj => {
            this.keys_pedidos.push(obj.key);

            totalDesc = this.calcularDescuentoCubreTapeke(obj);
            total.totalDescCubreTapeke += totalDesc.totalDescCubreTapeke;
            total.totalDescCubrePartner += totalDesc.totalDescCubrePartner;

            if (obj.delivery > 0) {
                total.cantTapDel += obj.cantidad;
                total.montoIngTapDel += obj.cantidad * obj.precio;

                total.cantProdDel += contadorProd(obj);
                total.montoIngProdDel += calcularTotalProd(obj) - (calcularTotalDescuento(obj));
            } else {
                total.cantTapRecoger += obj.cantidad;
                total.montoIngTapRecoger += obj.cantidad * obj.precio;

                total.cantProdRecoger = contadorProd(obj);
                total.montoIngProdRecoger += calcularTotalProd(obj) - (calcularTotalDescuento(obj));
            }

            if (!obj.tipo_pago) return;

            if (obj.tipo_pago.find(a => a.type == "efectivo")) {
                total.efectivo += ((obj.cantidad * obj.precio) + calcularTotalProd(obj) - (calcularTotalDescuento(obj)));
                total.comision_efectivo += obj.comision_restaurante;
                totalDesc = this.calcularDescuentoCubreTapeke(obj);
                total.totalDescEfectivo = (totalDesc.totalDescCubreTapeke ?? 0) + (totalDesc.totalDescCubrePartner ?? 0);
                total.totalComisionEfectivo += obj.comision_restaurante;
            } else {
                total.linea += ((obj.cantidad * obj.precio) + calcularTotalProd(obj) - (calcularTotalDescuento(obj)));
                total.comision_linea += obj.comision_restaurante;
                totalDesc = this.calcularDescuentoCubreTapeke(obj);
                total.totalDescLinea = totalDesc.totalDescCubreTapeke + totalDesc.totalDescCubrePartner;
                total.totalComisionLinea += obj.comision_restaurante;
            }

            total.totalDescProducto += obj.total_descuento_producto;
            total.totalDescDelivery += obj.total_descuento_delivery;
            total.totalDescuento = total.totalDescProducto + total.totalDescDelivery;

            total.total += ((obj.cantidad * obj.precio) + calcularTotalProd(obj));
        })

        total.totalDescCubrePartner = total.totalDescCubrePartner - (total.totalDescEfectivo * totalDesc.porcentajeCubrePartner);

        {
            this.ganancias({
                total_ingresos: total.total,
                linea: total.linea,
                efectivo: total.efectivo,
                comision_tapeke_efectivo: total.totalComisionEfectivo,
                comision_tapeke_linea: total.totalComisionLinea,
                deuda: this.deuda,
                descuento_cubre_tapeke: total.totalDescCubreTapeke,
                descuento_cubre_partner: total.totalDescCubrePartner,
                total_por_conciliar: total.totalPorConciliar
            })
        }

        total.totalPorConciliar = total.linea + total.totalDescCubreTapeke - total.totalDescCubrePartner - (total.comision_linea + total.comision_efectivo);

        total.total = (total.total) - (total.totalDescuento);
        return total;
    }

    head({ cantidadTotal }) {
        return <SView col={"xs-12"} row center card
            style={{
                borderRadius: 8
            }}
        >
            <SHr height={10} />
            <SText color={STheme.color.gray} fontSize={16} bold>{this.state.fecha} </SText>
            <SHr />
            <SView flex height={2} />
            <SText color={STheme.color.text} bold fontSize={30}>Bs. {SMath.formatMoney(cantidadTotal)}</SText>
            <SHr height={10} />
            <SText color={STheme.color.text} fontSize={16} bold>TOTAL INGRESOS</SText>
            <SHr height={10} />
        </SView>
    }

    cardComodin({ title, titleLeft, labelLeft, titleRight, labelRight }) {
        return <SView col={"xs-12"} row center
            card
            style={{
                borderRadius: 8
            }}
        >
            <SHr height={10} />
            <SText fontSize={20} color={STheme.color.gray} bold>{title}</SText>
            <SHr height={5} />
            <SView height={2} col={"xs-10"} style={{
                borderBottomColor: STheme.color.gray,
                borderBottomWidth: 2
            }} />
            <SHr height={5} />
            <SView col={"xs-6"} row center
                style={{
                    borderRightColor: STheme.color.gray,
                    borderRightWidth: 2
                }}
            >
                <SText fontSize={14} color={STheme.color.text} center bold>{titleLeft}</SText>
                <SHr />
                <SText fontSize={20} color={STheme.color.text}>Bs. </SText>
                <SText fontSize={20} bold color={STheme.color.text}>{SMath.formatMoney(labelLeft)}</SText>
                <SHr />
            </SView>
            <SView col={"xs-6"} row center>
                <SText fontSize={14} color={STheme.color.text} bold>{titleRight}</SText>
                <SHr />
                <SText fontSize={20} color={STheme.color.text}>Bs. </SText>
                <SText fontSize={20} bold color={STheme.color.text}>{SMath.formatMoney(labelRight)}</SText>
                <SHr />
            </SView>
            <SHr height={15} />
        </SView>
    }

    cardDetalle({ col, title, cantTap, montoIngTap, cantProd, montoIngProd }) {

        const subCard = ({ label, cantidad, monto }) => {
            let fontSizeTitle = 12;
            let fontSizeLabel = 14;
            return <>
                <SHr height={10} />
                <SView row center>
                    <SText fontSize={fontSizeTitle} color={STheme.color.text} width={50} center bold>{label}</SText>
                    <SHr />
                    <SText fontSize={fontSizeLabel} bold color={STheme.color.text}>{cantidad}</SText>
                    <SHr />
                </SView>

                <SView row center>
                    <SText fontSize={fontSizeTitle} color={STheme.color.text} bold>INGRESOS</SText>
                    <SHr />
                    <SText fontSize={fontSizeLabel} color={STheme.color.text}>Bs. </SText>
                    <SText fontSize={fontSizeLabel} bold color={STheme.color.text}>{SMath.formatMoney(monto)}</SText>
                    <SHr />
                </SView>
            </>
        }

        return <>
            <SView col={col} row center
                card
                style={{
                    borderRadius: 8
                }}
            >
                <SHr height={10} />
                <SText fontSize={15} style={{
                    color: STheme.color.text,
                    borderBottomWidth: 1,
                    borderColor: STheme.color.lightGray,
                }} bold>
                    {title}
                </SText>

                {subCard({ label: "CANTIDAD TAPEKES", cantidad: cantTap, monto: montoIngTap })}
                {subCard({ label: "CANTIDAD PRODUCTOS", cantidad: cantProd, monto: montoIngProd })}
            </SView>
        </>
    }

    cardsDetalle({
        cantTapDel,
        montoIngTapDel,
        cantProdDel,
        montoIngProdDel,
        cantTapRecoger,
        montoIngTapRecoger,
        cantProdRecoger,
        montoIngProdRecoger
    }) {
        return <SView col={"xs-12"} row center>

            {this.cardDetalle({
                col: "xs-6",
                title: "Delivery",
                cantTap: cantTapDel,
                montoIngTap: montoIngTapDel,
                cantProd: cantProdDel,
                montoIngProd: montoIngProdDel
            })}

            {this.cardDetalle({
                col: "xs-6",
                title: "Recoger del lugar",
                cantTap: cantTapRecoger,
                montoIngTap: montoIngTapRecoger,
                cantProd: cantProdRecoger,
                montoIngProd: montoIngProdRecoger
            })}
        </SView>
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


    labelGanancia({ label, value, color, simbolo }) {
        return <>
            <SHr height={5} />
            <SView col={"xs-10"} row center >
                <SView col={"xs-6"} row center style={{ justifyContent: 'flex-start' }}>
                    <SText fontSize={13} color={STheme.color.text} center >{label}</SText>
                </SView>
                <SView col={"xs-6"} row center style={{ justifyContent: 'flex-end', }} >
                    <SText fontSize={13} color={!color ? STheme.color.text : color} center >{simbolo ? simbolo : ""} Bs. {SMath.formatMoney(value)}</SText>
                </SView>
            </SView>
            <SView height={2} col={"xs-10"} style={{
                borderBottomColor: STheme.color.lightGray,
                borderBottomWidth: 1
            }} />
            <SHr height={15} />
        </>
    }

    ganancias({ total_ingresos, linea, efectivo, comision_tapeke_efectivo, comision_tapeke_linea, deuda, descuento_cubre_tapeke, descuento_cubre_partner, total_por_conciliar }) {
        return <SView col={"xs-12"} row center
            card
            style={{
                borderRadius: 8
            }}
        >
            <SHr height={10} />
            <SText fontSize={20} color={STheme.color.gray} bold>GANANCIAS</SText>
            <SHr height={2} color={STheme.color.gray} />
            <SHr height={5} />

            {this.labelGanancia({ label: "Total Ingresos", value: total_ingresos, color: STheme.color.text })}

            <SText fontSize={15} color={STheme.color.gray} bold>Detalle Pago</SText>

            {this.labelGanancia({ label: "Ingresos en Efectivo", value: efectivo/* , color: STheme.color.success, simbolo: "+" */ })}

            {this.labelGanancia({ label: "Ingresos en Linea", value: linea/* , color: STheme.color.danger, simbolo: "-" */ })}

            {this.labelGanancia({ label: "Descuento cubre Tapeke", value: descuento_cubre_tapeke/* , color: STheme.color.success, simbolo: "+" */ })}

            {this.labelGanancia({ label: "Descuento cubre Partner en linea", value: descuento_cubre_partner/* , color: STheme.color.danger, simbolo: "-" */ })}

            {this.labelGanancia({ label: `Comisión Tapeke Efectivo`, value: comision_tapeke_efectivo/* , color: STheme.color.danger, simbolo: "-" */ })}

            {this.labelGanancia({ label: `Comisión Tapeke Linea`, value: comision_tapeke_linea/* , color: STheme.color.danger, simbolo: "-" */ })}

            {this.labelGanancia({ label: `Total`, value: (total_por_conciliar*-1) })}

            <SHr height={15} />
        </SView>
    }

    getTableDetail(totales) {
        if (!this.state.data) return <SLoad />

        let total = totales;

        this.deuda = parseFloat((total.linea) - (total.comision_linea + total.comision_efectivo)).toFixed(2);

        return <SView col={"xs-12"} >
            <SHr />
            <SText>Última conciliación: {new SDate(this.state?.ultima_conciliacion?.fecha_cierre).toString("yyyy-MM-dd")}</SText>
            <SText># Pedidos por Conciliar: {Object.values(this.state.data).length}</SText>
            <SHr />

            {this.head({ cantidadTotal: total.total })}

            <SHr height={10} />
            {/* {this.cardsDetalle({ cantidadDelivery: total.cantidad_delivery, gananciaDelivery: total.total_delivery, cantidadRecoger: total.cantidad_recoger, gananciaRecoger: total.total_recoger })} */}
            {this.cardsDetalle({
                cantTapDel: total.cantTapDel,
                montoIngTapDel: total.montoIngTapDel,
                cantProdDel: total.cantProdDel,
                montoIngProdDel: total.montoIngProdDel,
                cantTapRecoger: total.cantTapRecoger,
                montoIngTapRecoger: total.montoIngTapRecoger,
                cantProdRecoger: total.cantProdRecoger,
                montoIngProdRecoger: total.montoIngProdRecoger
            })}

            <SHr height={10} />
            {this.cardComodin({ title: "Pagos", titleLeft: "Efectivo", labelLeft: total.efectivo, titleRight: "Linea", labelRight: total.linea })}

            <SHr height={10} />
            {this.cardComodin({ title: "Descuentos", titleLeft: "Efectivo", labelLeft: total.totalDescEfectivo, titleRight: "Linea", labelRight: total.totalDescLinea })}
            {this.cardComodin({ title: "", titleLeft: "Cubre Tapeke", labelLeft: total.totalDescCubreTapeke, titleRight: "Cubre Partner", labelRight: total.totalDescCubrePartner })}

            <SHr height={10} />
            {this.ganancias({
                total_ingresos: total.total,
                linea: total.linea,
                efectivo: total.efectivo,
                comision_tapeke_efectivo: total.totalComisionEfectivo,
                comision_tapeke_linea: total.totalComisionLinea,
                deuda: this.deuda,
                descuento_cubre_tapeke: total.totalDescCubreTapeke,
                descuento_cubre_partner: total.totalDescCubrePartner,
                total_por_conciliar: total.totalPorConciliar
            })}
            <SHr height={10} />

        </SView>
    }

    historialPedidos() {
        return <>
            <SHr height={25} />
            <SView col={"xs-12"} row >
                <SText bold fontSize={20} >Historial de     </SText>
            </SView>
            <SHr height={10} />
            <SView col={"xs-10"} backgroundColor={STheme.color.primary} center
                height={30}
                style={{
                    borderRadius: 8
                }}
                onPress={() => {
                    SPopup.dateBetween("Selecciona las fechas", (evt) => {
                        evt.conciliado = false
                        SNavigation.navigate("/ganancia/tablaPedido", evt);
                    });
                }}
            >
                <SText fontSize={12} color={STheme.color.white} bold>Ver tabla pedidos por conciliar</SText>
            </SView>
            <SHr height={10} />
            {this.getListaPedidos()}
            <SHr height={30} />
        </>
    }

    getListaPedidos() {
        if (!this.state.data) return <SLoad type='skeleton' col={"xs-12"} height={50} />
        return <SList
            data={this.state.data}
            order={[{ key: "fecha", order: "desc", peso: 1, }]}
            limit={5}
            render={(obj) => {
                return <Pedido_item data={obj} />
            }} />
    }

    render() {
        let totales = this.calcularMontos();
        return (<SPage hidden header={<><TopBar type={"default"} title={"Ganancias"} />
            <SView backgroundColor={"#96BE00"} height={20} col={"xs-12"}></SView></>}
            onRefresh={(resolve) => {
                this.getDatos();
            }}>
            <Container>
                {/* {this.getHeader()} */}
                {this.getTableDetail(totales)}
                {this.historialPedidos()}
            </Container>
        </SPage>
        );
    }
}
const initStates = (state) => {
    return { state }
};
export default connect(initStates)(root);