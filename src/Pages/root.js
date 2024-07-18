
import React, { Component } from 'react';
import { Linking, PermissionsAndroid } from 'react-native'
import { connect } from 'react-redux';
import { SDate, SHr, SIcon, SImage, SList, SLoad, SMapView, SMapView2, SMarker, SNavigation, SPage, SPopup, SScrollView2, SText, STheme, SThread, SView } from 'servisofts-component';
import Container from '../Components/Container';
import TopBar from '../Components/TopBar';
import Model from '../Model';
import SSocket from 'servisofts-socket'
import PButtom from '../Components/PButtom';
class index extends Component {
    static TOPBAR = <>
        <TopBar type={"usuario"} />
        <SView backgroundColor={"#96BE00"} height={20} col={"xs-12"}></SView>
    </>
    constructor(props) {
        super(props);
        this.state = {
        };

    }

    componentDidMount() {
        new SThread(200,"asdsa").start(() => {
            this.setState({ ready: true })
        })
    }
    render_item(data) {
        let obj = data.restaurante ?? {};

        return <SView col={"xs-12"} backgroundColor={STheme.color.card} row
            style={{
                borderWidth: 1, borderColor: STheme.color.lightGray,
                borderRadius: 8, overflow: 'hidden'
            }
            } center onPress={() => {
                Model.restaurante.Action.select(obj.key)
                SNavigation.navigate("/restaurante", { pk: `${obj.key}` });
                // SNavigation.replace("/restaurante", { pk: `${obj.key}` });
            }}>
            <SView width={58} center row>
                <SHr height={4} />
                <SView width={50} height={50} style={{ borderRadius: 4, overflow: 'hidden', backgroundColor: '#eee', }}>
                    <SImage src={SSocket.api.root + "restaurante/.128_" + obj.key} style={{ resizeMode: "cover", }} />
                </SView>
                <SHr height={4} />
            </SView>
            <SView flex
                style={{
                    justifyContent: 'center',
                    paddingLeft: 16
                }}
            >
                <SText font={"Roboto"} fontSize={16} bold color={STheme.color.primary}>{`${obj.nombre}  `}</SText>
                {/* <SText font={"Roboto"} fontSize={13}>{`${obj.descripcion}`}</SText> */}
                {/* <SText font={"Roboto"} fontSize={12} style={{ fontStyle: "italic" }}>{`${obj.direccion}`}</SText> */}
            </SView>
        </SView >
    }

    render_list() {
        if (!Model.usuario.Action.getUsuarioLog()) {
            return <SView />;
        }
        var data = Model.usuario_restaurante.Action.getAllBy({ key_usuario: Model.usuario.Action.getKey() })
        var restaurantes = Model.restaurante.Action.getAll({
            key_partner: Model.usuario.Action.getKey()
        });
        if (!data || !restaurantes) return <SLoad />

        let arr = Object.values(data).map(obj => {
            obj.restaurante = restaurantes[obj.key_restaurante];
            return obj
        })
        arr = arr.filter((a) => a.estado != 0 && a?.restaurante?.estado > 0);


        if (arr.length <= 0) {
            return <SView col={"xs-12"} center height={600}>
                <SHr h={20} />
                <SText fontSize={18} bold>No tienes restaurantes asignados.</SText>
                <SHr h={20} />
                <SView col={"xs-12"} flex >
                    <SImage src={require("../Assets/img/logo_no_rest.png")} />
                </SView>
                <SHr h={20} />
                <PButtom onPress={() => {
                    SNavigation.navigate("/restaurante/registro");
                }}>¿Quieres registrar tu restaurante?</PButtom>
                <SHr h={20} />
                <PButtom onPress={() => {
                    SNavigation.navigate("/chat");
                }}>¿Perteneces a un resturante?</PButtom>
                {/* <SText>ya perteneces a un restaurante y no aparece en esta lista? Click aqui.</SText> */}
                <SHr h={20} />
            </SView>
        }

        return <SList
            buscador
            data={arr}
            render={this.render_item.bind(this)}
        />
    }
    render() {
        if (!this.state.ready) return <SLoad />

        return (<SPage
            hidden
            // title={"Selecciona un restaurante"}
            onRefresh={(resolve) => {
                Model.usuario_restaurante.Action.CLEAR();
                Model.restaurante.Action.CLEAR();
                if (resolve) {
                    resolve();
                }
            }}
        >
            <Container>
                <SHr height={10} />
                {this.render_list()}
                <SHr height={15} />
            </Container>
        </SPage>);
    }
}
const initStates = (state) => {
    return { state }
};
export default connect(initStates)(index);