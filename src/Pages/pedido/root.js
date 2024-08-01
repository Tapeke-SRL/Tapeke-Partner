import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    SHr,
    SLoad,
    SNavigation,
    SPage,
    SText,
    SView,
    SPopup,
    STheme,
    SImage,
    SDate,
    SIcon,
    SThread,
    SList
} from 'servisofts-component';
import SSocket from 'servisofts-socket';
import Container from '../../Components/Container';
import Model from '../../Model';
import AccentBar from '../../Components/AccentBar';
import { Linking } from 'react-native';
import { Platform } from 'react-native';
import PedidoState from './Components/PedidoState';
import Popups from '../../Components/Popups';


class root extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
        this.pk = SNavigation.getParam('pk');
    }

    componentDidMount() {
        new SThread(200, 'pedido_detalle_thre', true).start(() => {
            this.setState({ ready: true });
        });

        this.loadData()
    }

    loadData() {
        SSocket.sendPromise({
            component: "pedido",
            type: "getDetalle",
            key_pedido: this.pk,
            key_usuario: Model.usuario.Action.getKey()
        }).then(res => {
            let data = res.data
            if (data?.restaurante?.key != Model.restaurante.Action.getSelect()?.key) {
                SPopup.alert('Este pedido es de otro restaurante.');
                SNavigation.goBack('/');
            }

            this.setState({ data: res.data })
        }).catch(err => {
            console.error(err.data)
        })
    }

    componentUsuario() {
        let borderRadius = 5;
        let redirectLink = `https://api.whatsapp.com/send?phone=${this?.state?.data?.factura?.phone.slice(5)}`
        return <>
            <SText font={'Montserrat-ExtraBold'} fontSize={16}>DATOS DEL CLIENTE</SText>
            <SText fontSize={11} color={STheme.color.gray}>(Si te falta algún item, para salvar el pedido, puedes comunicarte con el cliente presionando en el número de teléfono y ofrecer un producto equivalente al precio)</SText>
            <SHr />

            <SView row >
                <SView row flex
                    style={{
                        alignItems: "center"
                    }}
                >
                    {
                        this.usuario ?
                            <>
                                <SImage src={SSocket.api.root + "usuario/" + this.usuario?.key}
                                    style={{
                                        resizeMode: 'cover',
                                        width: 40,
                                        height: 40,
                                        marginRight: 10,
                                        borderRadius: 5
                                    }}
                                />

                                <SText fontSize={16}>{`${this.usuario?.Nombres} ${this.usuario?.Apellidos}`}</SText>
                            </>
                            : <SLoad />
                    }
                </SView>

                <SView row
                    // col={"xs-6"}
                    onPress={() => {
                        Linking.openURL(redirectLink)

                    }}
                >
                    <SView
                        center
                        height={40}
                        backgroundColor={"#7dcc00"}
                        style={{
                            padding: 5,
                            borderTopLeftRadius: borderRadius,
                            borderBottomLeftRadius: borderRadius
                        }}
                    >
                        <SIcon name={'whatsapp'} height={30} width={30} />
                    </SView>
                    <SView
                        center
                        height={40}
                        style={{
                            padding: 5,
                            backgroundColor: STheme.color.lightGray,
                            borderTopRightRadius: borderRadius,
                            borderBottomRightRadius: borderRadius
                        }}
                    >
                        <SText>{this.state.data?.factura?.phone}</SText>
                    </SView>
                </SView>
            </SView>
        </>
    }

    componentDatosPedido() {
        return <SView row
            style={{
                justifyContent: "space-between"
            }}
        >
            <SView>
                <SText font={'Montserrat-ExtraBold'}>Datos de Facturación:</SText>
                <SText>RS: {this.state.data?.factura?.razon_social ?? "usuario no puso RS"}</SText>
                <SText>NIT: {this.state.data?.factura?.nit ?? "usuario no puso nit"}</SText>
                <SHr />
                <SText font={'Montserrat-ExtraBold'}>Nota del cliente:</SText>
                <SText>{this.state.data?.nota_cliente}</SText>
            </SView>

            <SView>
                <SText font={'Montserrat-Bold'}>Hora del Pedido</SText>
                <SText font={'Montserrat-Bold'} fontSize={30}
                    style={{
                        alignItems: "center"
                    }}
                >{new SDate(this.state.data.fecha_on, "yyyy-MM-ddThh:mm").toString("hh:mm")}</SText>
            </SView>
        </SView>
    }

    componentDetallePedido() {
        return <SView row
            style={{
                justifyContent: "space-between"
            }}>
            <SText font={'Montserrat-Bold'}>DETALLE DEL PEDIDO</SText>
            <SView center>
                <SText font={'Montserrat-Bold'}>#{this.state.data.key.slice(0, 6)}</SText>
                <SText fontSize={10}>Código del pedido</SText>
            </SView>

            <SView>
                {this.cardProducto({ image: require("../../Assets/img/BOLSA-TAPEKE-MENU-APP.png"), title: "Tapeke", detalle: { key: 'dfdfsdfa-dgfgsfgs', nombre: 'hola' } })}
            </SView>

        </SView>
    }

    cardProducto({ key, image, title, cantidad, precio, detalle }) {
        const cardDetalle = () => {
            return Object.values(detalle).map(det => {
                return <SText>{det.nombre}</SText>
            })
        };

        return <SView card row
            style={{
                padding: 10
            }}
        >
            <SImage src={image} height={40} />
            <SView>
                <SText >{title}</SText>
                {cardDetalle()}
            </SView>
        </SView>
    }

    renderContent() {
        return <Container center={false}>
            <SHr h={20} />
            {this.componentUsuario()}
            <SHr h={20} />
            {this.componentDatosPedido()}
            <SHr h={20} />
            {this.componentDetallePedido()}
        </Container>;
    }

    render() {
        if (!this.state.ready) return <SLoad />;
        if (!this.state.data) return <SLoad />;

        this.usuario = Model.usuario.Action.getByKey(this.state.data.key_usuario);

        if (this.state.data.key_conductor) {
            this.conductor = Model.this.state.data.Action.getByKey(
                this.state.data.key_conductor
            );
        }

        return (
            <SPage
                id="recibo"
                onRefresh={() => {
                    this.loadData()
                }}
                header={<AccentBar />}
            >
                {this.renderContent()}
            </SPage>
        );
    }
}
const initStates = state => {
    return { state };
};
export default connect(initStates)(root);
