import React, { Component } from 'react';
import { SDate, SHr, SIcon, SMath, SPage, SText, STheme, SView } from 'servisofts-component';

class Pedido_item extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        const { state, precio, fecha, fecha_on, comision_restaurante, cantidad, key_pedido, horario, delivery, tipo_pago } = this.props.data;
        let tipo_pago_str = "Online";
        const diasSemana = ['LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB', 'DOM'];
        if (tipo_pago) {
            if (tipo_pago.find(a => a.type == "efectivo")) {
                tipo_pago_str = "Efectivo";
            }
        }
        return <SView col={"xs-12"} card row style={{
            padding: 9, borderRadius: 8
        }} center>
            <SView col={"xs-2.2"}
                height
                center
                style={{ borderRightColor: "#DADADA", borderRightWidth: 2 }}
            >
                <SText fontSize={11} color={STheme.color.gray} >
                    {diasSemana[new SDate(fecha).getDayOfWeek()]}
                </SText>
                <SText fontSize={11} color={STheme.color.gray}>
                    {fecha}
                </SText>
                {/* <SText fontSize={10.5} color={STheme.color.gray}> */}
                    {/* {new SDate(fecha).toString("hh:mm:ss")} */}
                {/* </SText> */}
            </SView>
            <SView col={"xs-3.5"} center
                height
                style={{ borderRightColor: "#DADADA", borderRightWidth: 2 }}
            >
                <SText bold fontSize={11} color={STheme.color.primary}>PRECIO</SText>
                <SText fontSize={12} bold>{"Bs."} {SMath.formatMoney(precio * cantidad)}</SText>
            </SView>
            <SView col={"xs-3.5"} center
                height
                style={{ borderRightColor: "#DADADA", borderRightWidth: 2 }}
            >
                <SText bold fontSize={11} color={STheme.color.primary}>COMISIÓN</SText>
                <SText bold fontSize={12} color={STheme.color.danger}> - Bs. {SMath.formatMoney(comision_restaurante ?? 0)}</SText>
            </SView>
            <SView col={"xs-2.8"} style={{ alignItems: "flex-end" }} height center>
                <SIcon name={(delivery > 0 ? "Idelivery" : "Irecoger")} width={30} fill={STheme.color.lightGray} />
                <SText bold fontSize={10} color="#96BE00"
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
                        <SText fontSize={10}
                            style={{
                                textTransform: "uppercase",
                                color: STheme.color.gray
                            }}
                        >{tipo_pago_str}</SText>
                    </SView>
                </SView>
            </SView>
            <SView flex />
            {/* <SText fontSize={10}>{horario?.porcentaje_comision}%</SText>
            <SHr />
            <SText bold fontSize={14}
                style={{
                    textTransform: "capitalize"
                }}
            >
                {state}
            </SText>
            <SView flex />
            <SText bold>{"Bs."} {SMath.formatMoney(precio)}</SText>
            <SView width={10} />
            <SText bold color={STheme.color.danger}> - {SMath.formatMoney(comision_restaurante ?? 0)}</SText> */}
        </SView>
    }
}
// const initStates = (state) => {
//     return { state }
// };
// export default connect(initStates)(Pedido_item);
export default (Pedido_item);