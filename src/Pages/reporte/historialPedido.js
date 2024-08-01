import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SForm, SHr, SList, SNavigation, SPage, SPopup, SText, STheme, SView, SLoad, SThread } from 'servisofts-component';
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
        <SView flex/>
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
        this.getData()
    }

    getData() {
        SSocket.sendPromise({
            component: "restaurante",
            type: "getByKey",
            key_restaurante: Model.restaurante.Action.getSelect()
        }).then(resp => {
            this.setState({ restaurante: resp.data })
        }).catch(e => {
            console.log(e.data);
        })

        SSocket.sendPromise({
            component: 'pedido',
            type: 'getByRestaurante',
            key_restaurante: Model.restaurante.Action.getSelect()
        }).then(rest => {
            this.getUser(rest.data);
            this.setState({ data: rest.data })
        }).catch(e => {
            console.log(e.data);
        })
    }

    handleDateChange = (fecha_inicio, fecha_fin) => {
        this.setState({ fecha_inicio, fecha_fin });
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

    render() {
        if (!this.state.ready) return <SLoad />
        if (!this.state.data) return <SLoad />

        const space = 50;

        return (
            <SPage
                hidden
                onRefresh={() => {
                    this.getData()
                }}
            >
                <Container center={false}>
                    <SView>
                        <SHr />
                        <SText font={'Montserrat-ExtraBold'} fontSize={14}>HISTORIAL DE PEDIDO</SText>
                        {
                            this.state.restaurante ?
                                <SText font={"Montserrat-SemiBold"} color={STheme.color.primary} fontSize={12}>{this.state.restaurante.nombre}</SText>
                                : <SLoad />
                        }
                        <SHr />
                    </SView>
                    <SHr />
                    <FilterDate onDateChange={this.handleDateChange} />
                    <SHr />

                    <SView center col={"xs-12"}>
                        <SList
                            data={this.state.data}
                            limit={10}
                            filter={a => a.fecha_on >= this.state.fecha_inicio && a.fecha_on <= this.state.fecha_fin}
                            order={[{ key: "fecha_on", type: "date", order: "desc" }]}
                            render={(obj) => {
                                let usuario = this.state.usuarios ? this.state.usuarios[obj.key_usuario]?.usuario : false;
                                return <CardHistorialPedido data={obj} usuario={usuario} />
                            }}
                        />
                    </SView>
                </Container>
            </SPage>
        );
    }
}
const initStates = (state) => {
    return { state }
};
export default connect(initStates)(historialPedido);