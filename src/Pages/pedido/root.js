import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    SButtom,
    SHr,
    SLoad,
    SNavigation,
    SPage,
    SText,
    SView,
    SPopup,
    STheme,
    SImage,
    SMath,
    SIcon,
    SThread,
} from 'servisofts-component';
import Container from '../../Components/Container';
import Model from '../../Model';
import PedidoState from './Components/PedidoState';
import SSocket from 'servisofts-socket';
import Popups from '../../Components/Popups';
import AccentBar from '../../Components/AccentBar';

class root extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
        };
        this.pk = SNavigation.getParam('pk');
        // this.data = {};
        // this.dataUsuario={};
    }

    componentDidMount() {
        // Model.pedido.Action.CLEAR();
        Model.pedido.Action.getDetalle(this.pk, true);
        new SThread(200, 'pedido_detalle_thre', true).start(() => {
            this.setState({loading: false});
        });
    }

    loadData() {
        this.data = Model.pedido.Action.getDetalle(this.pk);
        if (!this.data) return false;
        this.dataUsuario = Model.usuario.Action.getByKey(this.data.key_usuario);
        if (this.data.key_conductor) {
            this.dataConductor = Model.usuario.Action.getByKey(
                this.data.key_conductor
            );
        }
        // if (!this.dataUsuario) return false;
        if (!this.data.key) {
            SPopup.alert('Aun no se que paso');
            SNavigation.goBack('/');
            return null;
        }
        if (
            this.data?.restaurante?.key != Model.restaurante.Action.getSelect()
        ) {
            SPopup.alert('Este pedido es de otro restaurante.');
            SNavigation.goBack('/');
            return null;
        }

        return true;
    }

    getTipoEntrega() {
        if (this.data.delivery > 0) {
            return <SText>Entrega a domicilio</SText>;
        }
        return <SText>Recoger del lugar</SText>;
    }
    getConductor() {
        if (this.data.delivery > 0 && !this.data.key_conductor) {
            return <SText>Conductor no asignado</SText>;
        } else if (!this.data.key_conductor) {
            return null;
        }
        // if (!this.data.key_conductor) return null;
        return (
            <SView
                col={'xs-12'}
                center
                style={{backgroundColor: STheme.color.white}}
            >
                <SView col={'xs-11'} row center>
                    <SView col={'xs-12'}>
                        <SHr height={15} />
                        <SText
                            fontSize={18}
                            font={'Roboto'}
                            style={{fontWeight: 'bold'}}
                            color={STheme.color.darkGray}
                        >
                            Conductor
                        </SText>
                        <SHr height={15} />
                    </SView>
                    <SView col={'xs-12'} row>
                        {this.data.delivery == 0 ? (
                            <SView
                                col={'xs-12'}
                                row
                                center
                                backgroundColor={STheme.color.primary}
                                style={{borderRadius: 4, overflow: 'hidden'}}
                            >
                                <SHr height={20} />
                                <SView col={'xs-11'} row center>
                                    <SIcon
                                        name='Shopper'
                                        width={35}
                                        fill={STheme.color.white}
                                    />
                                    <SText
                                        fontSize={15}
                                        font={'Roboto'}
                                        color={STheme.color.white}
                                    >
                                        Cliente recoge pedido en local
                                    </SText>
                                </SView>
                                <SHr height={20} />
                            </SView>
                        ) : (
                            <SView row col={'xs-12'}>
                                <SView
                                    center
                                    width={70}
                                    height={70}
                                    backgroundColor={'transparent'}
                                    style={{
                                        borderRadius: 8,
                                        overflow: 'hidden',
                                    }}
                                >
                                    {/* <SImage src={`${SSocket.api.root}usuario/${this.data.key_usuario}`} style={{ width: "100%", position: "relative", resizeMode: "cover" }} /> */}
                                    <SIcon
                                        width={70}
                                        height={70}
                                        name={'PedDelivery'}
                                        fill={STheme.color.primary}
                                    />
                                </SView>
                                <SView center flex>
                                    <SView col={'xs-1'}></SView>
                                    <SView col={'xs-11'} row>
                                        <SView col={'xs-12'}>
                                            <SText
                                                font={'Roboto'}
                                                color={STheme.color.text}
                                                fontSize={16}
                                                style={{fontWeight: 'bold'}}
                                            >
                                                {this.dataConductor?.Nombres +
                                                    ' ' +
                                                    this.dataConductor
                                                        ?.Apellidos}
                                            </SText>
                                        </SView>
                                        <SHr height={10} />
                                        <SView
                                            col={'xs-12'}
                                            style={{
                                                justifyContent: 'flex-start',
                                            }}
                                        >
                                            <SText
                                                color={STheme.color.darkGray}
                                                fontSize={16}
                                                font={'Roboto'}
                                                style={{fontWeight: 'bold'}}
                                            >
                                                Telf:{' '}
                                                {this.dataConductor?.Telefono}{' '}
                                            </SText>
                                        </SView>
                                    </SView>
                                    <SHr height={5} />
                                </SView>
                            </SView>
                        )}
                    </SView>
                </SView>
                <SHr height={18} />
            </SView>
        );
    }

    getTipoPago(datas) {
        var tipo = 'Pago online';
        if (datas.tipo_pago) {
            var efectivo = datas.tipo_pago.find(o => o.type == 'efectivo');
            if (efectivo) {
                tipo = 'Efectivo';
            }
        }
        return tipo;
    }

    contenido(data) {
        // if (!this.loadData()) return <SLoad />
        if (!data) return <SLoad />;
        // if (!dataUsuario) return <SView />;
        this.data = data;
        return (
            <SView col={'xs-12'} row backgroundColor={STheme.color.card} center>
                <SHr height={18} />
                <SView
                    col={'xs-12'}
                    center
                    style={{backgroundColor: STheme.color.white}}
                >
                    <SView col={'xs-11'} row center>
                        <SView col={'xs-12'}>
                            <SHr height={15} />
                            <SText
                                fontSize={18}
                                font={'Roboto'}
                                style={{fontWeight: 'bold'}}
                                color={STheme.color.darkGray}
                            >
                                Cliente
                            </SText>
                            <SHr height={15} />
                        </SView>
                        <SView col={'xs-12'} row>
                            <SView
                                center
                                width={70}
                                backgroundColor={STheme.color.card}
                                height={70}
                                style={{borderRadius: 8, overflow: 'hidden'}}
                            >
                                <SImage
                                    src={`${SSocket.api.root}usuario/${this.data.key_usuario}`}
                                    style={{
                                        width: '100%',
                                        position: 'relative',
                                        resizeMode: 'cover',
                                    }}
                                />
                            </SView>
                            <SView flex center row>
                                <SView col={'xs-1'}></SView>
                                <SView col={'xs-11'} row>
                                    <SView col={'xs-12'}>
                                        <SText
                                            font={'Roboto'}
                                            color={STheme.color.text}
                                            fontSize={16}
                                            style={{fontWeight: 'bold'}}
                                        >
                                            {this.dataUsuario?.Nombres +
                                                ' ' +
                                                this.dataUsuario?.Apellidos}
                                        </SText>
                                    </SView>
                                    <SHr height={10} />
                                    <SView
                                        col={'xs-12'}
                                        style={{justifyContent: 'flex-start'}}
                                    >
                                        <SText
                                            color={STheme.color.darkGray}
                                            fontSize={16}
                                            font={'Roboto'}
                                            style={{fontWeight: 'bold'}}
                                        >
                                            Telf: {this.dataUsuario?.Telefono}
                                        </SText>
                                    </SView>
                                </SView>
                                <SHr height={5} />
                            </SView>
                        </SView>
                    </SView>
                    <SHr height={18} />
                </SView>

                <SHr height={18} />

                <SView
                    col={'xs-12'}
                    center
                    row
                    style={{backgroundColor: STheme.color.white}}
                >
                    <SView col={'xs-11'} row center>
                        <SView col={'xs-12'}>
                            <SHr height={15} />
                            <SText
                                fontSize={18}
                                font={'Roboto'}
                                style={{fontWeight: 'bold'}}
                                color={STheme.color.darkGray}
                            >
                                Detalle del pedido
                            </SText>
                            <SHr height={15} />
                        </SView>
                        {/* <SHr height={15} /> */}
                        <SView col={'xs-12'} row center>
                            <SView
                                width={84}
                                height={84}
                                center
                                backgroundColor={STheme.color.card}
                                style={{borderRadius: 8, overflow: 'hidden'}}
                            >
                                <SImage
                                    src={`${SSocket.api.root}restaurante/${this.data.restaurante.key}`}
                                    style={{
                                        width: '100%',
                                        position: 'relative',
                                        resizeMode: 'cover',
                                    }}
                                />
                            </SView>
                            <SView flex center row>
                                <SView col={'xs-1'}></SView>
                                <SView col={'xs-11'} row>
                                    <SView col={'xs-12'}>
                                        <SText
                                            color={STheme.color.text}
                                            fontSize={14}
                                            bold
                                        >
                                            {this.data.restaurante?.nombre}
                                        </SText>
                                    </SView>
                                    <SHr height={15} />
                                    <SView
                                        col={'xs-6'}
                                        style={{justifyContent: 'flex-start'}}
                                    >
                                        <SText
                                            fontSize={14}
                                            font={'Roboto'}
                                            color={STheme.color.primary}
                                            bold
                                        >
                                            {' '}
                                            Precio
                                        </SText>
                                        <SHr height={5} />
                                        <SText
                                            fontSize={20}
                                            font={'Roboto'}
                                            bold
                                        >
                                            Bs. {this.data.pack?.precio ?? 0}{' '}
                                        </SText>
                                    </SView>
                                    <SView col={'xs-6'} center row>
                                        <SView col={'xs-12'} center>
                                            <SText
                                                fontSize={14}
                                                font={'Roboto'}
                                                color={STheme.color.primary}
                                                bold
                                            >
                                                Cantidad
                                            </SText>
                                        </SView>
                                        <SHr height={5} />
                                        <SView col={'xs-12'} center>
                                            <SView
                                                col={'xs-6'}
                                                center
                                                style={{
                                                    height: 40,
                                                    backgroundColor:
                                                        STheme.color.card,
                                                    borderRadius: 6,
                                                }}
                                            >
                                                <SText
                                                    fontSize={14}
                                                    font={'Roboto'}
                                                >
                                                    {' '}
                                                    {this.data.cantidad ??
                                                        0}{' '}
                                                </SText>
                                            </SView>
                                        </SView>
                                    </SView>
                                </SView>
                                <SHr height={5} />
                            </SView>
                        </SView>
                        <SHr height={18} />
                    </SView>
                </SView>
                <SHr height={18} />
                {this.getTipoEntrega()}
                <SHr height={18} />

                <SView
                    col={'xs-12'}
                    row
                    center
                    style={{backgroundColor: STheme.color.white}}
                >
                    <SView col={'xs-11'} row center>
                        <SView col={'xs-12'}>
                            <SHr height={15} />
                            <SText
                                fontSize={18}
                                font={'Roboto'}
                                style={{fontWeight: 'bold'}}
                                color={STheme.color.darkGray}
                            >
                                Detalle de Compra
                            </SText>
                            <SHr height={15} />
                        </SView>
                        <SHr height={15} />
                        <SView col={'xs-6'}>
                            <SText
                                style={{textAlign: 'justify'}}
                                fontSize={15}
                                font={'Roboto'}
                            >
                                Método de pago
                            </SText>
                        </SView>
                        <SView col={'xs-6'} style={{alignItems: 'flex-end'}}>
                            <SText fontSize={15} font={'Roboto'}>
                                {this.getTipoPago(this.data)}
                            </SText>
                        </SView>
                        <SHr height={10} />
                        <SView col={'xs-6'}>
                            <SText
                                style={{textAlign: 'justify'}}
                                fontSize={15}
                                font={'Roboto'}
                            >
                                Total
                            </SText>
                        </SView>
                        <SView col={'xs-6'} style={{alignItems: 'flex-end'}}>
                            <SText fontSize={15} font={'Roboto'}>
                                Bs.{' '}
                                {SMath.formatMoney(
                                    (this.data.pack?.precio ?? 0) *
                                        this.data.cantidad
                                )}
                            </SText>
                        </SView>
                        <SHr height={10} />
                        {/* <SView col={"xs-6"} >
                            <SText style={{ textAlign: "justify" }} fontSize={15} font={"Roboto"} >Envío</SText>
                        </SView>
                        <SView col={"xs-6"} style={{ alignItems: "flex-end" }}>
                            <SText fontSize={15} font={"Roboto"} >Bs.  {SMath.formatMoney(parseFloat(this.data.delivery ?? 0))}</SText>
                        </SView> */}
                        <SView
                            col={'xs-12'}
                            style={{
                                borderBottomWidth: 1,
                                borderColor: STheme.color.lightGray,
                            }}
                        ></SView>
                        <SHr height={10} />
                        <SView col={'xs-6'}>
                            <SText
                                style={{
                                    textAlign: 'justify',
                                    fontWeight: 'bold',
                                }}
                                fontSize={15}
                                font={'Roboto'}
                            >
                                Total:
                            </SText>
                        </SView>
                        <SView col={'xs-6'} style={{alignItems: 'flex-end'}}>
                            <SText
                                fontSize={15}
                                font={'Roboto'}
                                style={{fontWeight: 'bold'}}
                            >
                                Bs.{' '}
                                {SMath.formatMoney(
                                    (this.data.pack?.precio ?? 0) *
                                        this.data.cantidad
                                )}
                            </SText>
                        </SView>
                        <SHr height={15} />
                    </SView>
                </SView>
                <SHr height={18} />

                {this.getConductor()}

                <SHr height={18} />
                <SView
                    col={'xs-11'}
                    center
                    style={{backgroundColor: STheme.color.white}}
                >
                    <SHr height={40} />
                    {this.data.state == 'en_camino' ||
                    this.data.state == 'entregado' ||
                    this.data.state == 'no_recogido' ? (
                        <SView
                            col={'xs-11'}
                            center
                            backgroundColor={'#96BE00'}
                            style={{borderRadius: 4, overflow: 'hidden'}}
                        >
                            <SHr height={20} />
                            <SView col={'xs-11'}>
                                {/* <SText font={"Roboto"} center fontSize={18} color={STheme.color.white}>Mensaje: {mensaje2}</SText> */}
                                <PedidoState data={data} />
                            </SView>
                            <SHr height={20} />
                        </SView>
                    ) : (
                        <SButtom
                            style={{
                                backgroundColor: STheme.color.primary,
                                width: 300,
                                fontSize: 40,
                                borderRadius: 8,
                            }}
                            onPress={() => {
                                if (
                                    this.data?.restaurante?.key !=
                                    Model.restaurante.Action.getSelect()
                                ) {
                                    SPopup.alert(
                                        'Este pedido es de otro restaurante.'
                                    );
                                    SNavigation.reset('/');
                                    return;
                                }
                                var mensaje = '';
                                if (
                                    this.data.state != 'listo' &&
                                    this.data.state != 'esperando_conductor'
                                ) {
                                    // switch (this.data.state) {
                                    //     case "pendiente_pago":
                                    //         mensaje = "Su pedido está pendiente de pago";
                                    //         break;
                                    //     case "pago_en_proceso":
                                    //         mensaje = "Su pedido está en procceso de pago";
                                    //         break;
                                    //     case "pagado":
                                    //         mensaje = "Su pedido está pagado";
                                    //         break;
                                    //     case "timeout_pago": //TODO: duda en el mesaje
                                    //         mensaje = "Su pedido está en espera de pago";
                                    //         break;
                                    // }
                                    // mensaje += " pero aún no está listo.";
                                    switch (this.data.state) {
                                        case 'buscando_conductor':
                                            Popups.Alert.open({
                                                title: 'No se puede entregar el pedido.',
                                                label: 'No puede entregar porque seguimos buscando Driver para este pedido',
                                            });
                                            break;
                                        case 'pagado':
                                            Popups.Alert.open({
                                                title: 'No se puede entregar el pedido.',
                                                label: 'No puede entregar porque aun no se encuentra listo o es para otro horario.',
                                            });
                                            break;
                                        case 'entregado_conductor':
                                            Popups.Alert.open({
                                                title: 'No se puede entregar el pedido.',
                                                label: 'No puede entregar porque este pedido ya fue entregado a un driver.',
                                            });
                                            break;
                                        default:
                                            Popups.Alert.open({
                                                title: 'No se puede entregar el pedido.',
                                                label:
                                                    'No puedes entregar el pedido cuando se encuentra en estado ' +
                                                    this.data.state,
                                            });
                                            break;
                                    }
                                    // Popups.Alert.open({
                                    //     title: "No se puede entregar el pedido.",
                                    //     label: "No puedes entregar el pedido cuando se encuentra en estado " + this.data.state
                                    // })
                                    // SPopup.alert(<PedidoState data={data} />);
                                } else {
                                    Model.pedido.Action.entregar(
                                        this.pk,
                                        this.props
                                    )
                                        .then(e => {
                                            Model.pedido.Action.CLEAR();
                                            SNavigation.goBack();
                                        })
                                        .catch(e => {
                                            Popups.Alert.open({
                                                title: 'No se puede entregar el pedido.',
                                                label: e.error,
                                            });
                                        });
                                }
                            }}
                        >
                            {' '}
                            ENTREGAR{' '}
                        </SButtom>
                    )}
                    <SHr height={40} />
                </SView>
            </SView>
        );
    }

    render_content() {
        if (this.state.loading) return <SLoad />;
        if (!this.loadData()) return <SLoad />;
        return <Container>{this.contenido(this.data)}</Container>;
    }

    render() {
        return (
            <SPage
                onRefresh={() => {
                    Model.pedido.Action.CLEAR();
                }}
                header={<AccentBar />}
            >
                {this.render_content()}
            </SPage>
        );
    }
}
const initStates = state => {
    return {state};
};
export default connect(initStates)(root);
