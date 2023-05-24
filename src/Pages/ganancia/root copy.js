import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SButtom, SDate, SHr, SIcon, SList, SLoad, SMath, SNavigation, SPage, SText, STheme, SView } from 'servisofts-component';
import TopBar from '../../Components/TopBar';
import Model from '../../Model';
import SSocket from 'servisofts-socket'
import Pedido_item from './Pedido_item';
import Container from '../../Components/Container';
class root extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };

    }

    componentDidMount() {
        if(!Model.restaurante.Action.getSelect()){
            SNavigation.goBack();
            return;
        }
        this.getDatos();
    }
    getDatos() {
        this.setState({ data: null })
        SSocket.sendPromise({
            component: "pedido",
            type: "getPendientesConciliacion",
            key_restaurante: Model.restaurante.Action.getSelect(),
        }).then(resp => {
            this.setState({ data: resp.data })
        }).catch(e => {
            console.error(e)
        })
    }

    getLista() {
        if (!this.state.data) return <SLoad type='skeleton' col={"xs-12"} height={50} />
        return <SList
            data={this.state.data}
            order={[{ key: "fecha_on", order: "desc", peso: 1, }]}
            render={(obj) => {
                return <Pedido_item data={obj} />
            }} />
    }

    getHeader() {
        if (!this.state.data) return <SLoad type='skeleton' col={"xs-12"} height={80} />
        let total = 0;
        let cantidad_delivery = 0;
        let total_delivery = 0;
        let cantidad_recoger = 0;
        let total_recoger = 0;

        Object.values(this.state.data).map(obj => {
            let ganancia = (obj.cantidad * obj.precio) - obj.comision_restaurante;
            total += ganancia;
            if (obj.delivery > 0) {
                cantidad_delivery += 1;
                total_delivery += ganancia;
            } else {
                cantidad_recoger += 1;
                total_recoger += ganancia;
            }
        })
        return <SView col={"xs-12"} center>
            <SHr />
            <SView col={"xs-12"} row center backgroundColor={STheme.color.primary}
                style={{
                    borderRadius: 8
                }}
            >
                <SHr height={10} />
                <SText color={STheme.color.white} fontSize={16} bold>GANANCIAS DE LA SEMANA</SText>
                <SHr />
                <SView flex height={2} />
                <SText color={STheme.color.white} bold fontSize={30}>Bs. {SMath.formatMoney(total)}</SText>
                <SHr height={10} />
            </SView>
            <SHr height={15} />
            <SView col={"xs-12"} row center>
                <SView col={"xs-5.75"} row center
                    backgroundColor={"#96BE00"}
                    style={{
                        borderRadius: 8
                    }}
                >
                    <SHr height={10} />
                    <SText fontSize={20} color={STheme.color.white} bold>Delivery</SText>
                    <SHr />
                    <SView col={"xs-12"} row center>
                        <SHr />
                        <SIcon name='Idelivery' height={56} fill={STheme.color.white} />
                    </SView>
                    <SHr height={15} />
                    <SView col={"xxs-12 xs-12 sm-5 md-5 lg-5 xl-5"} row center>
                        <SText fontSize={14} color={STheme.color.white} center>CANTIDAD</SText>
                        <SHr />
                        <SText fontSize={25} bold color={STheme.color.white}>{cantidad_delivery}</SText>
                        <SHr />
                    </SView>
                    <SView col={"xxs-12 xs-12 sm-7 md-7 lg-7 xl-7"} row center>
                        <SText fontSize={14} color={STheme.color.white}>GANANCIA</SText>
                        <SHr />
                        <SText fontSize={20} color={STheme.color.white}>Bs. </SText>
                        <SText fontSize={25} bold color={STheme.color.white}>{SMath.formatMoney(total_delivery)}</SText>
                        <SHr />
                    </SView>
                    <SHr height={10} />
                </SView>
                <SView col={"xs-0.5"} />
                <SView col={"xs-5.75"} row center
                    backgroundColor={"#96BE00"}
                    style={{
                        borderRadius: 8
                    }}
                >
                    <SHr height={10} />
                    <SText fontSize={20} color={STheme.color.white} bold>Retiro del local</SText>
                    <SHr />
                    <SView col={"xs-12"} row center>
                        <SHr />
                        <SIcon name='Irecoger' height={56} fill={STheme.color.white} />
                    </SView>
                    <SHr height={15} />
                    <SView col={"xxs-12 xs-12 sm-5 md-5 lg-5 xl-5"} row center>
                        <SText fontSize={14} color={STheme.color.white}>CANTIDAD</SText>
                        <SHr />
                        <SText fontSize={25} bold color={STheme.color.white}>{cantidad_recoger}</SText>
                        <SHr />
                    </SView>
                    <SView col={"xxs-12 xs-12 sm-7 md-7 lg-7 xl-7"} row center>
                        <SText fontSize={14} color={STheme.color.white}>GANANCIA</SText>
                        <SHr />
                        <SText fontSize={20} color={STheme.color.white}>Bs. </SText>
                        <SText fontSize={25} bold color={STheme.color.white}>{SMath.formatMoney(total_recoger)}</SText>
                        <SHr />
                    </SView>
                    <SHr height={10} />

                </SView>
            </SView>
            <SHr height={15} />
            <SView col={"xs-12"} flex center >
                <SView col={"xs-10"} backgroundColor={STheme.color.primary} center
                    height={55}
                    style={{
                        borderRadius: 8
                    }}
                    onPress={() => {
                        SNavigation.navigate("/ganancia/historial");
                    }}
                >
                    <SView row>
                        <SIcon name='Iganancia' height={27} width={27} />
                        <SView width={8} />
                        <SText fontSize={15} color={STheme.color.white} bold>Ver historial de conciliaciones</SText>
                    </SView>
                </SView>
            </SView>
        </SView>
    }
    render() {
        return (<SPage hidden header={<TopBar type={"default"} title={"Ganancias"} />}
            onRefresh={(resolve) => {
                this.getDatos();
            }}>
            <SView backgroundColor={"#96BE00"} height={20} col={"xs-12"}></SView>
            <Container>
                <SHr />
                {this.getHeader()}
                <SHr height={25} />
                <SView col={"xs-12"} flex>
                    <SText bold fontSize={20} >Historial de Pedidos</SText>
                </SView>
                <SHr height={10} />
                {this.getLista()}
                <SHr height={30} />
            </Container>
        </SPage>
        );
    }
}
const initStates = (state) => {
    return { state }
};
export default connect(initStates)(root);