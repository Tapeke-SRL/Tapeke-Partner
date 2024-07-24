import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SHr, SList, SNavigation, SPage, SText, SView, SPopup, STheme, SIcon, SImage, SLoad } from 'servisofts-component';
import Model from '../../Model';
import SSocket from 'servisofts-socket'
import PBarraFooter from '../../Components/PBarraFooter';
import CardCalificacionPedido from './Components/CardCalificacionPedido';
import TopBar from '../../Components/TopBar';
import Container from '../../Components/Container';
import FilterDate from '../../Components/FilterDate'


class root extends Component {
    static TOPBAR = <>
        <TopBar type={"usuario"} />
        <SView backgroundColor={"#96BE00"} height={20} col={"xs-12"}></SView>
    </>

    static FOOTER = <>
        <PBarraFooter url={"calificacion"} />
    </>

    constructor(props) {
        super(props);
        this.state = {
        };
        this.key = SNavigation.getParam("pk");
    }


    componentDidMount() {
        SSocket.sendPromise({
            component: "restaurante",
            type: "getByKey",
            key_restaurante: this.key 
        }).then(resp => {
            this.setState({ restaurante: resp.data })
        }).catch(e => {
            console.log(e.data);
        })

        Model.calificacion.Action.getMediaByRestaurante(this.key).then((resp) => {
            this.setState({ media: resp.data });
        }).catch(e => {
            console.error(e.data);
        })

        Model.calificacion.Action.getComentarios(this.key).then((resp) => {
            this.isEmptyCommet = Object.entries(resp.data).length === 0;
            this.getUserComentario(resp.data);
            this.setState({ data: resp.data });
        }).catch(e => {
            console.error(e.data);
        })
    }

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

    componentMediaCalificacion() {
        return (
            <SView flex center
                col={"xs-10"}
            >
                <SView row
                >
                    <SView height={65} width={120}>
                        <SImage src={require('../../Assets/img/estrella_calificaciones_promedio.png')} /* style={{resizeMode: "cover"}} */ />
                    </SView>
                    <SText color={STheme.color.text} fontSize={50}>
                        {parseFloat(this.state.media?.pedido_star_media ?? 0).toFixed(1).replace('.', ',')}
                    </SText>
                </SView>

                <SView >
                    <SText font={'Montserrat-Regular'} fontSize={14}>Tu calificación promedio actual</SText>
                </SView>
            </SView>
        )
    }

    componentMediaServicio(data) {
        if (!data) return null;
        return (<SView col={"xs-11"} height={180} style={{ borderWidth: 1, borderColor: STheme.color.lightGray, borderRadius: 8, padding: 8 }} row center backgroundColor={STheme.color.card} >
            <SView col={"xs-5"} center style={{ borderRightWidth: 1, borderColor: STheme.color.lightGray }}>
                <SIcon name={"CalServicio"} width={60} fill={STheme.color.card} />
            </SView>
            <SView col={"xs-7"} center >
                <SText color={STheme.color.darkGray} fontSize={24}>SERVICIO</SText>
                <SHr height={10} />
                <SView col={"xs-10"} center style={{ borderWidth: 2, borderColor: STheme.color.primary, backgroundColor: STheme.color.white, borderRadius: 8 }}>
                    <SText color={STheme.color.text} fontSize={32}>{(parseFloat(data.buen_servicio_media ?? 0) * parseFloat(data.cantidad ?? 0)).toFixed(0)}</SText>
                </SView>
            </SView>
        </SView>)
    }

    componentMediaCalidad(data) {
        return (<SView col={"xs-11"} height={180} style={{ borderWidth: 1, borderColor: STheme.color.lightGray, borderRadius: 8, padding: 8 }} row center backgroundColor={STheme.color.card} >
            <SView col={"xs-5"} center style={{ borderRightWidth: 1, borderColor: STheme.color.lightGray }}>
                <SIcon name={"CalCalidad"} width={60} fill={STheme.color.card} />
            </SView>
            <SView col={"xs-7"} center >
                <SText color={STheme.color.darkGray} fontSize={24}>CALIDAD</SText>
                <SHr height={10} />
                <SView col={"xs-10"} center style={{ borderWidth: 2, borderColor: STheme.color.primary, backgroundColor: STheme.color.white, borderRadius: 8 }}>
                    <SText color={STheme.color.text} fontSize={32}>{(parseFloat(data.buena_calidad_media ?? 0) * parseFloat(data.cantidad ?? 0)).toFixed(0)}</SText>
                </SView>
            </SView>
        </SView>)
    }

    componentMediaCantidad(data) {
        return (<SView col={"xs-11"} height={180} style={{ borderWidth: 1, borderColor: STheme.color.lightGray, borderRadius: 8, padding: 8 }} row center backgroundColor={STheme.color.card} >
            <SView col={"xs-5"} center style={{ borderRightWidth: 1, borderColor: STheme.color.lightGray }}>
                <SIcon name={"CalCantidad"} width={60} fill={STheme.color.card} />
            </SView>
            <SView col={"xs-7"} center >
                <SText color={STheme.color.darkGray} fontSize={24}>CANTIDAD</SText>
                <SHr height={10} />
                <SView col={"xs-10"} center style={{ borderWidth: 2, borderColor: STheme.color.primary, backgroundColor: STheme.color.white, borderRadius: 8 }}>
                    <SText color={STheme.color.text} fontSize={32}>{parseFloat((data.buena_cantidad_media ?? 0) * parseFloat(data.cantidad ?? 0)).toFixed(0)}</SText>
                </SView>
            </SView>
        </SView>)
    }

    componetNoComment() {
        return <>
            <SText>
                No hay comentarios
            </SText>
        </>
    }

    render() {
        if (!this.state.data) return <SLoad />
        return (<SPage
            hidden
            onRefresh={() => {
                Model.calificacion.Action.CLEAR();
                this.componentDidMount();
            }}
        >
            <Container center={false}>
                <FilterDate />
                <SView>
                    <SHr />
                    <SText font={'Montserrat-ExtraBold'} fontSize={14}>CALIFICACIÓN Y COMENTARIOS</SText>
                    {
                        this.state.restaurante ?
                        <SText font={"Montserrat-SemiBold"} color={STheme.color.primary} fontSize={12}>{this.state.restaurante.nombre}</SText>
                        : <SLoad/>
                    }
                    <SHr />
                </SView>

                <SView center>
                    {this.componentMediaCalificacion()}

                    <SHr h={20} />

                    <SView center col={"xs-11"}>
                        {
                            !this.isEmptyCommet ?
                                <SList
                                    data={this.state.data}
                                    limit={10}
                                    order={[{ key: "fecha_on", type: "date", order: "desc" }]}
                                    render={(obj) => {
                                        let usuario = this.state.usuarios ? this.state.usuarios[obj.key_usuario]?.usuario : false;
                                        return <CardCalificacionPedido usuario={usuario} data={obj} />
                                    }}
                                />
                                : this.componetNoComment()
                        }

                    </SView>
                </SView>
            </Container>
        </SPage>
        );
    }
}
const initStates = (state) => {
    return { state }
};
export default connect(initStates)(root);