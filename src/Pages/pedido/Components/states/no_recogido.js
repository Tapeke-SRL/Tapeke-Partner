import React, { Component } from 'react';
import { SButtom, SHr, SIcon, SInput, SList, SNavigation, SPage, SPopup, SText, STheme, SView } from 'servisofts-component';
import PButtom from '../../../../Components/PButtom';
import Model from '../../../../Model';

export default class no_recogido extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    render() {
        // Model.viaje.Action.CLEAR();
        return (
            <SPage center hidden disableScroll>
                <SText>NO LLEGASTE A TIEMPO PARA RECOGER EL PEDIDO</SText>
                <SText>TODO: Por definir que pasa cuando no llega a tiempo un conductor a recoger el pedido</SText>
                {/* <SText>{JSON.stringify(this.props.data)}</SText> */}
                <PButtom onPress={() => {
                    Model.pedido.Action.action("cancelar", this.props.data.key, {});
                    // Model.pedido.Action.CLEAR();
                    SNavigation.reset("/");
                }}>SALIR</PButtom>
            </SPage >
        );
    }
}
