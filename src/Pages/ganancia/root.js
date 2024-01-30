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

    getLista() {
        if (!this.state.data) return <SLoad type='skeleton' col={"xs-12"} height={50} />
        //NOSE PORQUE VALIDABA ESTO AQUÍ SI NO LO USA, HACÌA QUE TODO EL BLOQUE SE QUEDE EN CARGANDO
        // if (!this.state?.ultima_conciliacion) return <SLoad type='skeleton' col={"xs-12"} height={50} /> 

        return <SList
            data={this.state.data}
            order={[{ key: "fecha", order: "desc", peso: 1, }]}
            limit={10}
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
        let totalIngreso = 0;
        const mesActual = ['', 'ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
        let totalOk = {
            efectivo: 0,
            linea: 0,
            comision_efectivo: 0,
            comision_linea: 0,
            total: 0,
            comision_total: 0
        }
        Object.values(this.state.data).map(obj => {

            let ganancia = (obj.cantidad * obj.precio) - obj.comision_restaurante;
            total += ganancia;
            if (parseInt(obj.delivery) > 0) {
                cantidad_delivery += obj.cantidad;
                total_delivery += (obj.cantidad * obj.precio);;
            } else {
                cantidad_recoger += obj.cantidad;
                total_recoger += (obj.cantidad * obj.precio);;
                console.log(ganancia)
            }

            if (obj.tipo_pago.find(a => a.type == "efectivo")) {
                totalOk.efectivo += obj.precio * obj.cantidad;
                totalOk.comision_efectivo += obj.comision_restaurante;
            } else {
                totalOk.linea += obj.precio * obj.cantidad;
                totalOk.comision_linea += obj.comision_restaurante;
            }
            totalIngreso += obj.cantidad * obj.precio;
            totalOk.comision_total += obj.comision_restaurante;
        })
        console.log(this.state?.ultima_conciliacion)
        return <SView col={"xs-12"} center>
            <SHr />
            <SView col={"xs-12"} row center backgroundColor={STheme.color.primary}
                style={{
                    borderRadius: 8
                }}
            >
                <SHr height={10} />
                {/* <SText color={'#FFCCA2'} fontSize={16} bold>DD MM - {new SDate().toString("dd")} {mesActual[new SDate().getMonth()]} </SText> */}
                <SView col={"xs-12"} center>
                    <SText color={'#FFCCA2'} center fontSize={14} bold>{(this.state?.ultima_conciliacion?.fecha_cierre) ? "Última conciliación realizada: " + new SDate(this.state?.ultima_conciliacion?.fecha_cierre).toString("yyyy-MM-dd") : "<Conciliación no realizada>"} </SText>
                </SView>
                <SHr />
                <SView flex height={2} />
                <SText color={STheme.color.white} bold fontSize={30}>Bs. {SMath.formatMoney(totalIngreso)}</SText>
                <SHr height={10} />
                <SText color={STheme.color.white} fontSize={16} bold>TOTAL INGRESOS</SText>
                <SHr height={10} />
            </SView>
            <SHr height={8} />
            <SView col={"xs-12"} row center
                backgroundColor={"#96BE00"}
                style={{
                    borderRadius: 8
                }}
            >
                <SHr height={10} />
                <SText fontSize={20} color={"#E7FD95"} bold>PAGOS</SText>
                <SHr height={5} />
                <SView height={2} col={"xs-10"} style={{
                    borderBottomColor: "#E7FD95",
                    borderBottomWidth: 2
                }} />
                <SHr height={5} />
                <SView col={"xs-6"} row center
                    style={{
                        borderRightColor: "#E7FD95",
                        borderRightWidth: 2
                    }}
                >
                    <SText fontSize={14} color={STheme.color.white} center bold>EN EFECTIVO</SText>
                    <SHr />
                    <SText fontSize={20} color={STheme.color.white}>Bs. </SText>
                    <SText fontSize={20} bold color={STheme.color.white}>{SMath.formatMoney(totalOk.efectivo)}</SText>
                    <SHr />
                </SView>
                <SView col={"xs-6"} row center>
                    <SText fontSize={14} color={STheme.color.white} bold>EN LÍNEA</SText>
                    <SHr />
                    <SText fontSize={20} color={STheme.color.white}>Bs. </SText>
                    <SText fontSize={20} bold color={STheme.color.white}>{SMath.formatMoney(totalOk.linea)}</SText>
                    <SHr />
                </SView>
                <SHr height={15} />
            </SView>
            <SHr height={8} />
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
                        <SText fontSize={12} color={STheme.color.white} center>CANTIDAD</SText>
                        <SHr />
                        <SText fontSize={22} bold color={STheme.color.white}>{cantidad_delivery}</SText>
                        <SHr />
                    </SView>
                    <SView col={"xxs-12 xs-12 sm-7 md-7 lg-7 xl-7"} row center>
                        <SText fontSize={12} color={STheme.color.white}>GANANCIA</SText>
                        <SHr />
                        <SText fontSize={18} color={STheme.color.white}>Bs. </SText>
                        <SText fontSize={22} bold color={STheme.color.white}>{SMath.formatMoney(total_delivery)}</SText>
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
                        <SText fontSize={12} color={STheme.color.white}>CANTIDAD</SText>
                        <SHr />
                        <SText fontSize={22} bold color={STheme.color.white}>{cantidad_recoger}</SText>
                        <SHr />
                    </SView>
                    <SView col={"xxs-12 xs-12 sm-7 md-7 lg-7 xl-7"} row center>
                        <SText fontSize={12} color={STheme.color.white}>GANANCIA</SText>
                        <SHr />
                        <SText fontSize={18} color={STheme.color.white}>Bs. </SText>
                        <SText fontSize={22} bold color={STheme.color.white}>{SMath.formatMoney(total_recoger)}</SText>
                        <SHr />
                    </SView>
                    <SHr height={10} />
                </SView>
            </SView>
            <SHr height={8} />
            <SView col={"xs-12"} row center
                backgroundColor={"#96BE00"}
                style={{
                    borderRadius: 8
                }}
            >
                <SHr height={10} />
                <SText fontSize={20} color={"#E7FD95"} bold>GANANCIAS EN LÍNEA</SText>
                <SHr height={5} />
                <SView height={2} col={"xs-5"} style={{
                    borderBottomColor: "#E7FD95",
                    borderBottomWidth: 2
                }} />
                <SHr height={15} />
                <SView col={"xs-10"} row center >
                    <SView col={"xs-6"} row center style={{ justifyContent: 'flex-start' }}>
                        <SText fontSize={13} color={STheme.color.white} center >Ingresos</SText>
                    </SView>
                    <SView col={"xs-6"} row center style={{ justifyContent: 'flex-end', }} >
                        <SText fontSize={13} color={STheme.color.white} center >Bs. {SMath.formatMoney(totalOk.linea)}</SText>
                    </SView>
                </SView>
                <SHr height={3} />
                <SView height={2} col={"xs-10"} style={{
                    borderBottomColor: "#ffffff",
                    borderBottomWidth: 1
                }} />
                <SView col={"xs-10"} row center >
                    <SView col={"xs-6"} row center style={{ justifyContent: 'flex-start' }}>
                        <SText fontSize={13} color={STheme.color.white} center >Gastos</SText>
                    </SView>
                    <SView col={"xs-6"} row center style={{ justifyContent: 'flex-end', }} >
                        <SText fontSize={13} color={STheme.color.white} center >Bs. {SMath.formatMoney(totalOk.comision_total)}</SText>
                    </SView>
                </SView>
                <SHr height={3} />
                <SView height={2} col={"xs-10"} style={{
                    borderBottomColor: "#ffffff",
                    borderBottomWidth: 1
                }} />
                <SView col={"xs-10"} row center >
                    <SView col={"xs-6"} row center style={{ justifyContent: 'flex-start' }}>
                        <SText fontSize={20} color={STheme.color.white} center >Total</SText>
                    </SView>
                    <SView col={"xs-6"} row center style={{ justifyContent: 'flex-end', }} >
                        <SText fontSize={20} color={STheme.color.white}>Bs.</SText>
                        <SText fontSize={20} bold color={STheme.color.white} center > {parseFloat((totalOk.linea - totalOk.comision_linea) - totalOk.comision_efectivo).toFixed(2)}</SText>
                    </SView>
                </SView>
                <SHr height={15} />
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
        return (<SPage hidden header={<><TopBar type={"default"} title={"Ganancias"} />
            <SView backgroundColor={"#96BE00"} height={20} col={"xs-12"}></SView></>}
            onRefresh={(resolve) => {
                this.getDatos();
            }}>

            <Container>
                <SHr />
                {this.getHeader()}
                <SHr height={25} />
                <SView col={"xs-12"} row >
                    <SText bold fontSize={20} >Historial de Pedidos</SText>
                </SView>

                <SHr height={10} />
                <SView col={"xs-10"} backgroundColor={STheme.color.primary} center
                    height={30}
                    style={{
                        borderRadius: 8
                    }}
                    onPress={() => {
                        SNavigation.navigate("/ganancia/tablaPedido", { conciliado: false });
                    }}
                >
                    <SText fontSize={12} color={STheme.color.white} bold>Ver tabla historial pedidos</SText>
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