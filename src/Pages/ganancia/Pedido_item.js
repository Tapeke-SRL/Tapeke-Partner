import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SDate, SHr, SMath, SPage, SText, STheme, SView, SIcon, SNavigation } from 'servisofts-component';

class Pedido_item extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    calcularTotal(cantidad, precio, pedido_producto) {
        let total = cantidad * precio;

        if (pedido_producto) {
            Object.values(pedido_producto).map((prod) => {
                if (prod.precio_sin_descuento) {
                    total += (prod.cantidad * prod.precio_sin_descuento)
                } else {
                    total += (prod.cantidad * prod.precio)
                }

                if (prod.sub_productos) {
                    Object.values(prod.sub_productos).map((sub) => {
                        if (sub.sub_producto_detalle) {
                            Object.values(sub.sub_producto_detalle).map((subDet) => {
                                total += (subDet.cantidad * subDet.precio)
                            })
                        }
                    })
                }
            })
        }

        return total;
    }

    render() {
        const { key, state, precio, fecha, comision_restaurante, tipo_pago, cantidad, delivery, pedido_producto } = this.props.data;
        let tipo_pago_str = "Online";

        if (tipo_pago) {
            if (tipo_pago.find(a => a.type == "efectivo")) {
                tipo_pago_str = "Efectivo";
            }
        }
        return <SView col={"xs-12"} card row style={{
            padding: 9, borderRadius: 8
        }} center onPress={() => SNavigation.navigate("/pedido", { pk: key })}>
            <SView col={"xs-2.2"}
                height
                center
                style={{ borderRightColor: "#DADADA", borderRightWidth: 2 }}
            >
                <SText fontSize={15} color={STheme.color.gray} >
                    {new SDate(fecha, "yyyy-MM-dd").getDayOfWeekJson().textSmall}
                </SText>
                <SText fontSize={10} color={STheme.color.gray}>
                    {fecha}
                </SText>

            </SView>
            <SView col={"xs-3.5"} center
                height
                style={{ borderRightColor: "#DADADA", borderRightWidth: 2 }}
            >
                <SText fontSize={10} color={STheme.color.gray}>PRECIO</SText>
                <SText fontSize={14} >{"Bs."} {SMath.formatMoney(this.calcularTotal(cantidad, precio, pedido_producto))}</SText>
            </SView>
            <SView col={"xs-3.5"} center
                height
                style={{ borderRightColor: "#DADADA", borderRightWidth: 2 }}
            >
                <SText fontSize={10} color={STheme.color.gray}>COMISIÓN</SText>
                <SText fontSize={14} color={STheme.color.danger}> - Bs. {SMath.formatMoney(comision_restaurante ?? 0)}</SText>
            </SView>
            <SView col={"xs-2.8"} style={{ alignItems: "flex-end" }} height center>
                <SIcon name={(delivery > 0 ? "Idelivery" : "Irecoger")} width={30} fill={STheme.color.lightGray} />
                <SText fontSize={10} color={STheme.color.success}
                    style={{
                        textTransform: "uppercase"
                    }}
                >
                    {state}
                </SText>
                <SView style={{ alignItems: "flex-end" }}>
                    <SView col={"xs-12"} row center>
                        <SIcon name='Ipago' height={9} width={14} fill={STheme.color.lightGray} />
                        <SView width={5} />
                        <SText fontSize={8}
                            style={{
                                textTransform: "uppercase",
                                color: STheme.color.gray
                            }}
                        >{tipo_pago_str}</SText>
                    </SView>
                </SView>
            </SView>
            <SView flex />
        </SView>

    }
}
export default (Pedido_item);