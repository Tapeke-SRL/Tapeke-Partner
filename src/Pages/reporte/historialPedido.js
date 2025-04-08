import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SDate, SHr, SList, SNavigation, SPage, SPopup, SText, STheme, SView, SLoad, SThread, SIcon } from 'servisofts-component';
import Container from '../../Components/Container';
import SSocket from 'servisofts-socket';
import Model from '../../Model'
import FilterDate from '../../Components/FilterDate'
import CardHistorialPedido from './Components/CardHistorialPedido.js'
import TopBar from '../../Components/TopBar';
import PBarraFooter from '../../Components/PBarraFooter';

class historialPedido extends Component {
    static TOPBAR = <>
        <TopBar type={"usuario"} />
        <SView backgroundColor={"#96BE00"} height={20} col={"xs-12"}></SView>
    </>

    static FOOTER = <>
        <PBarraFooter />
    </>

    constructor(props) {
        super(props);
        this.state = {
        };
        this.params = SNavigation.getAllParams();
    }

    componentDidMount() {
        new SThread(200).start(() => {
            this.setState({ ready: true })
        })
    }


    handleDateChange = (fecha_inicio, fecha_fin) => {
        this.fecha_inicio = fecha_inicio;
        this.fecha_fin = fecha_fin
        SSocket.sendPromise({
            component: 'pedido',
            type: 'getByRestauranteEntreFechas',
            key_restaurante: Model.restaurante.Action.getSelect()?.key,
            fecha_inicio: fecha_inicio,
            fecha_fin: fecha_fin
        }).then(rest => {
            this.getUser(rest.data);
            this.setState({ data: rest.data })
        }).catch(e => {
            console.log(e.data);
        })
    };

    getUser(data) {
        let keys = [...new Set(Object.values(data).map(a => a.key_usuario).filter(key => key !== null))];

        SSocket.sendPromise({
            version: "2.0",
            service: "usuario",
            component: "usuario",
            type: "getAllKeys",
            keys: keys,
        }).then(resp => {
            this.setState({ usuarios: resp.data })
        }).catch(e2 => {
            SPopup.alert(e2.error)
        })
    }


    renderContenido() {
        const restaurante = Model.restaurante.Action.getSelect();

        if (!this.state.ready) return <SLoad />
        // if (!this.state.data) return <SLoad />

        return <Container center={false}>
            <SView flex row style={{justifyContent: 'space-between', alignItems: 'flex-end'}}>
                <SView>
                    <SHr />
                    <SText font={'Montserrat-Bold'} fontSize={16}>HISTORIAL DE PEDIDO</SText>
                    {/* <SText font={'Montserrat-ExtraBold'} fontSize={16}>HISTORIAL DE PEDIDO</SText> */}
                    <SText font={"Montserrat-SemiBold"} color={STheme.color.primary} fontSize={14}>{restaurante.nombre}</SText>
                    <SHr />
                </SView>
                <SView onPress={env => {
                    SNavigation.navigate("/ganancia/tablaPedido", { historialPedido: true, fecha_inicio: this.filterDate.state.fecha_inicio, fecha_fin: this.filterDate.state.fecha_fin });
                }} center>
                    <SIcon
                        name={"Excel"}
                        fill={STheme.color.text}
                        width={40}
                        height={40}
                    />
                </SView>
            </SView>
            <SHr />
            <FilterDate ref={(ref) => { this.filterDate = ref }} onDateChange={this.handleDateChange} />
            <SHr />

            <SView center col={"xs-12"}>
                <SList
                    data={this.state.data}
                    limit={10}
                    order={[{ key: "fecha_on", type: "date", order: "desc" }]}
                    render={(obj) => {
                        let usuario = this.state.usuarios ? this.state.usuarios[obj.key_usuario]?.usuario : false;
                        return <CardHistorialPedido data={obj} usuario={usuario} />
                    }}
                />
            </SView>
        </Container>
    }

    render() {
        return (
            <SPage
                hidden
                onRefresh={(e) => {
                    if(this.fecha_inicio && this.fecha_fin){
                        this.handleDateChange(this.fecha_inicio, this.fecha_fin)
                    }
                    
                }}
            >
                {this.renderContenido()}
            </SPage>
        );
    }
}
const initStates = (state) => {
    return { state }
};
export default connect(initStates)(historialPedido);