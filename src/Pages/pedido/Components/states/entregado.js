import React, { Component } from 'react';
import { SButtom, SHr, SIcon, SInput, SList, SNavigation, SPage, SPopup, SText, STheme, SView } from 'servisofts-component';
import PButtom from '../../../../Components/PButtom';
import Model from '../../../../Model';

export default class conductor_llego extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    render() {
        return (
            <SPage center hidden disableScroll>
                <SText color={STheme.color.white} fontSize={18} bold>Tapeke entregado con éxito</SText>
                <SHr height={32} />
                <PButtom onPress={() => {
                    SNavigation.reset("/");
                }}>SALIR</PButtom>
            </SPage >
        );
    }
}
