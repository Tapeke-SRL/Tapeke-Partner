
import React, { Component } from 'react';
import { Linking, PermissionsAndroid } from 'react-native'
import { connect } from 'react-redux';
import { SDate, SHr, SIcon, SImage, SList, SLoad, SMapView, SMapView2, SMarker, SNavigation, SPage, SPopup, SScrollView2, SText, STheme, SView } from 'servisofts-component';
import BarraCargando from '../Components/BarraCargando';
import Container from '../Components/Container';
import Marker from '../Components/Marker';
import PBarraFooter from '../Components/PBarraFooter';
import TopBar from '../Components/TopBar';
import Model from '../Model';
import SSocket from 'servisofts-socket'
import PButtom2 from '../Components/PButtom2';
import PButtom from '../Components/PButtom';
class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };

    }

    render_item(data) {
        let obj = data.restaurante ?? {};

        return <SView col={"xs-12"} backgroundColor={STheme.color.card} row
            style={{
                borderWidth: 2, borderColor: STheme.color.lightGray,
                borderRadius: 8, overflow: 'hidden'
            }
            } center onPress={() => {
                Model.restaurante.Action.select(obj.key)
                SNavigation.navigate("/restaurante", { pk: `${obj.key}` });
                // SNavigation.replace("/restaurante", { pk: `${obj.key}` });
            }}>
            <SView col={"xs-3"} center row>
                <SHr height={10} />
                <SView width={70} height={70} style={{ borderRadius: 40, overflow: 'hidden', backgroundColor: '#eee', }}>
                    <SImage src={SSocket.api.root + "restaurante/" + obj.key} style={{ resizeMode: "cover", }} />
                </SView>
                <SHr height={10} />
            </SView>
            <SView flex col={"xs-9"}>
                <SHr height={10} />
                <SText font={"Roboto"} fontSize={16} bold color={STheme.color.primary}>{`${obj.nombre}  `}</SText>
                <SText font={"Roboto"} fontSize={13}>{`${obj.descripcion}`}</SText>
                <SText font={"Roboto"} fontSize={12} style={{ fontStyle: "italic" }}>{`${obj.direccion}`}</SText>
                <SHr height={10} />
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

        // if (Object.values(data).estado == "0") {
        //     return SNavigation.replace("/welcome")
        // }


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
            render={this.render_item.bind(this)} />
    }
    render() {


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
            header={<TopBar type={"usuario"} />}
        >
            <SView backgroundColor={"#96BE00"} height={20} col={"xs-12"}></SView>
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