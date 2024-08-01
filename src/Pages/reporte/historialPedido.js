import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SForm, SHr, SList, SNavigation, SPage, SPopup, SText, STheme, SView, SLoad, SThread } from 'servisofts-component';
import Container from '../../Components/Container';
import SSocket from 'servisofts-socket';
import Model from '../../Model'
import FilterDate from '../../Components/FilterDate'
import { FlatList } from 'react-native';
import CardHistorialPedido from './Components/CardHistorialPedido.js'
import usuario_app from '../../Model/tapeke/usuario_app';


class historialPedido extends Component {
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
            this.getUserComentario(rest.data);
            this.setState({ data: rest.data })
        }).catch(e => {
            console.log(e.data);
        })
    }

    handleDateChange = (fecha_inicio, fecha_fin) => {
        this.setState({ fecha_inicio, fecha_fin });
    };

    getUserComentario(data) {
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

        const space = 10;

        return (
            <SPage title={'Historial de Pedidos'}>
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

                    <SView center col={"xs-12ß"}>
                        {/* <SList
                            data={this.state.data}
                            limit={10}
                            // filter={a => a.fecha_on >= this.state.fecha_inicio && a.fecha_on <= this.state.fecha_fin}
                            order={[{ key: "fecha_on", type: "date", order: "desc" }]}
                            render={(obj) => {
                                return <SText>{obj.key}</SText>
                            }}
                        /> */}

                        <FlatList
                            data={this.state.data}
                            renderItem={obj => {
                                let usuario = this.state.usuarios ? this.state.usuarios[obj.item.key_usuario]?.usuario : false;
                                return <CardHistorialPedido data={obj.item} usuario={usuario} />
                            }}
                            showsHorizontalScrollIndicator={true}
                            ListHeaderComponent={() => <SView width={space} />}
                            ItemSeparatorComponent={() => <SView width={space} />}
                            ListFooterComponent={() => <SView width={space} />}
                            style={{ flex: 1 }}
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