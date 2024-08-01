import React, { Component } from 'react';
import { connect } from 'react-redux';
import { STheme, SHr, SIcon, SLoad, SNavigation, SPage, SText, SView, SThread } from 'servisofts-component';
import SSocket from 'servisofts-socket';
import Model from '../../Model';
import { Linking } from 'react-native';
import AccentBar from '../../Components/AccentBar';
import Container from '../../Components/Container';
import Popups from '../../Components/Popups';
import TopBar from '../../Components/TopBar';
import PBarraFooter from '../../Components/PBarraFooter';


class root extends Component {
    static TOPBAR = <>
        <TopBar type={"usuario"} />
        <SView backgroundColor={"#96BE00"} height={20} col={"xs-12"}></SView>
    </>

    static FOOTER = <>
        <SView flex />
        <PBarraFooter url={"soporte"} />
    </>

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
        new SThread(100, "load").start(() => { this.setState({ ready: true }) })

        SSocket.sendPromise({
            component: "enviroment",
            type: "getByKey",
            key: "support_phone",
            key_usuario: Model.usuario.Action.getKey(),
        }).then(res => {
            this.setState({ telefono: res.data });
        }).catch(e => {
            console.error(e);
        })
    }

    item({ url, label, requireUser, redirectLink }) {
        return <SView col={"xs-12"} center backgroundColor={STheme.color.card} style={{ borderRadius: 16, borderLeftWidth: 20, borderColor: STheme.color.primary }} onPress={() => {
            if (requireUser && !Model.usuario.Action.getKey()) {
                Popups.InicieSession.open();
                return;
            }
            if (url) {
                SNavigation.navigate(url)
            }

            if (redirectLink) {
                Linking.openURL(redirectLink)
            }
        }}>
            <SHr height={20} />
            <SView col={"xs-12"} row center >
                <SView col={"xs-11"} row >
                    <SView width={20}></SView>
                    <SText color={STheme.color.text} fontSize={16}>{label}</SText>
                </SView>
                <SView col={"xs-1"} style={{}} >
                    <SIcon name={'Cayudaflecha'} height={20} width={14} fill={STheme.color.card} />
                </SView>
            </SView>
            <SHr height={20} />
        </SView>
    }

    render() {
        if (!this.state.ready) return <SLoad />
        return (<SPage
            hidden
            title={"Soporte"}
            onRefresh={(re) => {
                Model.horario.Action.CLEAR();
            }}
        >
            <Container>
                <SHr height={35} />
                {/* {this.item({
                    url: "/condiciones",
                    label: "Términos y condiciones"
                })} */}

                <SHr height={15} />
                {this.item({
                    // url: "/chat",
                    redirectLink: `https://api.whatsapp.com/send?phone=${this?.state?.telefono ?? "59171634228"}`,
                    label: "Chat",
                    requireUser: false
                })}
                <SHr height={40} />
                {/* <PButtom onPress={()=>{
                    SNavigation.navigate("/soporte/chat")
                }}>CONTÁCTANOS</PButtom> */}
            </Container>
        </SPage>
        );
    }
}
const initStates = (state) => {
    return { state }
};
export default connect(initStates)(root);