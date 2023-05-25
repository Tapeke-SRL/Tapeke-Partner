import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SButtom, SHr, SLoad, SNavigation, SPage, SText, SView, SPopup, STheme, SImage, SMath, SIcon } from 'servisofts-component';
import Container from '../../Components/Container';
import Model from '../../Model';
// import PedidoState from './Components/PedidoState';
import SSocket from 'servisofts-socket'
import PBarraFooter from '../../Components/PBarraFooter';
import Calificacion from './Components/Calificacion';
import AccentBar from '../../Components/AccentBar';
import TopBar from '../../Components/TopBar';


class root extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
        this.pk = SNavigation.getParam("pk");
        // this.data = {};
        // this.dataUsuario={};
    }

    render() {

        return (<SPage
            // title={"Calificación"}
            hidden
            footer={<PBarraFooter url={"calificacion"} />}
            onRefresh={() => {
                Model.calificacion.Action.CLEAR();
            }}
            header={<>
                <TopBar type={"usuario"} />
                <AccentBar />
            </>}
        // header={}
        >
            <Container>
                <Calificacion />
            </Container>
        </SPage>
        );
    }
}
const initStates = (state) => {
    return { state }
};
export default connect(initStates)(root);