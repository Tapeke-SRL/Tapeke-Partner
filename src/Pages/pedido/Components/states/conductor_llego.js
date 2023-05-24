import React, { Component } from 'react';
import { SButtom, SDate, SHr, SIcon, SImage, SInput, SList, SMath, SNavigation, SPage, SPopup, SText, STheme, SView } from 'servisofts-component';
import Container from '../../../../Components/Container';
import PButtom from '../../../../Components/PButtom';
import Model from '../../../../Model';
import SSocket from 'servisofts-socket'
import BarraCargando from '../../../../Components/BarraCargando';
export default class conductor_llego extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    handleOnPress() {
        Model.pedido.Action.action("entregar", this.props.data.key, {}).then((resp) => {
            console.log(resp);
        })

    }
    renderUsuario() {
        const { key_usuario } = this.props.data;
        var usuario = Model.usuario.Action.getByKey(key_usuario);
        return <SView col={"xs-12"} center card row>
            <SView width={60} height={60} style={{ padding: 8 }}>
                <SView flex height card style={{ borderRadius: 8, overflow: "hidden" }}>
                    <SImage enablePreview src={SSocket.api.root + "usuario/" + key_usuario} style={{ resizeMode: "cover" }} /></SView>
            </SView>
            <SView flex >
                <SText bold fontSize={16}>{usuario?.Nombres} {usuario?.Apellidos}</SText>
                <SText fontSize={14}>{usuario?.Telefono}</SText>
            </SView>
        </SView>
    }


    renderPedido() {
        const { restaurante, cantidad, fecha, horario } = this.props.data;
        // var usuario = Model.usuario.Action.getByKey(key_usuario);
        return <SView col={"xs-12"} center card row height={120}>
            <SView width={80} height={80} style={{ padding: 8 }}>
                <SView flex height card style={{ borderRadius: 8, overflow: "hidden" }}>
                    <SImage enablePreview src={SSocket.api.root + "restaurante/" + restaurante.key} style={{ resizeMode: "cover" }} /></SView>
            </SView>
            <SView flex >
                <SText bold fontSize={16}>{restaurante.nombre}</SText>
                <SText fontSize={12}>{new SDate(fecha, "yyyy-MM-dd").toString("dd de MONTH")}  {horario.hora_inicio} - {horario.hora_fin}</SText>
            </SView>
            <SView width={100} center>
                <SText fontSize={14} bold>{cantidad}</SText>
                <SText fontSize={12} color={STheme.color.lightGray}>Cantidad</SText>
            </SView>
        </SView>
    }


    renderInstrucciones() {
        return <SView col={"xs-12"} center >
            <SText bold fontSize={16}>Entrega el pedido al cliente y confirma la entrega.</SText>
            <SHr height={20} />
            <BarraCargando />
        </SView>
    }
    renderDetallePago() {
        const { payment_type, precio, cantidad, delivery } = this.props.data;
        return <SView col={"xs-12"} center card style={{
            padding: 8
        }}>
            <SView row col={"xs-12"}>
                <SText col={"xs-6"}>Metodo de pago</SText>
                <SText col={"xs-6"} style={{ alignItems: 'flex-end', }}>{payment_type}</SText>
            </SView>
            <SHr />
            <SHr />
            <SView row col={"xs-12"}>
                <SText col={"xs-6"}>{cantidad} x Tapekes</SText>
                <SText col={"xs-6"} style={{ alignItems: 'flex-end', }}>Bs. {SMath.formatMoney(precio)}</SText>
            </SView>
            <SHr />
            <SHr />
            <SView row col={"xs-12"}>
                <SText col={"xs-6"}>Delivery</SText>
                <SText col={"xs-6"} style={{ alignItems: 'flex-end', }} >Bs. {SMath.formatMoney(delivery)}</SText>
            </SView>
            <SHr />
            <SHr height={1} color={STheme.color.lightGray} />
            <SHr />
            <SView row col={"xs-12"}>
                <SText col={"xs-6"}></SText>
                <SText col={"xs-6"} style={{ alignItems: 'flex-end', }} bold>Bs. {SMath.formatMoney(delivery + (precio * cantidad))}</SText>
            </SView>
        </SView>
    }
    render() {
        return (
            <SPage preventBack>
                <Container>
                    <SHr height={50} />
                    {this.renderInstrucciones()}
                    <SHr height={50} />
                    <SText col={"xs-12"}>Detalle del pedido:</SText>
                    <SHr />
                    {this.renderPedido()}
                    <SHr height={20} />
                    <SText col={"xs-12"}>Detalle del cliente:</SText>
                    <SHr />
                    {this.renderUsuario()}
                    <SHr height={50} />
                    <SText col={"xs-12"}>Detalle del pago:</SText>
                    <SHr />
                    {this.renderDetallePago()}
                    <SHr height={50} />
                    <PButtom onPress={this.handleOnPress.bind(this)}>Confirmar entrega</PButtom>
                    <SHr height={50} />
                    {/* <SText>{JSON.stringify(this.props.data, "\n", "\t")}</SText> */}
                </Container>
            </SPage >
        );
    }
}
