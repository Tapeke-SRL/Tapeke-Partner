import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { SHr, SIcon, SImage, SPage, SText, STheme, SView } from 'servisofts-component';
import TopBar from '../../Components/TopBar';
import PBarraFooter from '../../Components/PBarraFooter';
import PageTitle from '../../Components/PageTitle';
import Container from '../../Components/Container';
import ListaDeHorarios from './Components/ListaDeHorarios';
import Model from '../../Model';
import CierreProgramado from './Components/CierreProgramado';

export default class root extends Component {
    static TOPBAR = <>
        <TopBar type={"usuario"} />
        <SView backgroundColor={"#96BE00"} height={20} col={"xs-12"}></SView>
    </>;
    static FOOTER = <>
        <PBarraFooter url={"calendario"} />
    </>
    constructor(props) {
        super(props);
        this.state = {
            // type: "horario"
            type: "cierre"
        };
    }

    render() {
        const restaurante = Model.restaurante.Action.getSelect();
        return <SPage hidden>
            <Container>
                <SHr />
                <PageTitle title={"HORARIOS"} />
                <SHr />
                <SView col={"xs-12"} row>
                    <SView flex row style={{
                        padding: 6, backgroundColor: this.state.type == "horario" ? STheme.color.primary : "#ccc", borderRadius: 16
                    }} center onPress={() => this.setState({ type: "horario" })}>
                        <SView width={4} />
                        <SView width={16} height={16}>
                            <SImage src={require("../../Assets/img/borrar.png")} />
                            {/* <SIcon name=' .'/> */}
                        </SView>
                        <SView width={4} />
                        <SText color={this.state.type == "horario" ? STheme.color.white : STheme.color.text} >{"Horario normal"}</SText>
                        <SView width={4} />
                    </SView>
                    <SView width={50} />
                    <SView flex row style={{
                        padding: 6,
                        backgroundColor: this.state.type == "cierre" ? STheme.color.primary : "#ccc",
                        borderRadius: 16
                    }} center onPress={() => this.setState({ type: "cierre" })}>
                        <SView width={4} />
                        <SView width={16} height={16}>
                            <SImage src={require("../../Assets/img/borrar.png")} />
                            {/* <SIcon name=' .'/> */}
                        </SView>
                        <SView width={4} />
                        <SText color={this.state.type == "cierre" ? STheme.color.white : STheme.color.text} >{"Cierres programados"}</SText>
                        <SView width={4} />
                    </SView>
                </SView>
                <SHr h={36} />
                {this.state.type == "cierre" ? <CierreProgramado key_restaurante={restaurante.key} /> : <ListaDeHorarios key_restaurante={restaurante.key} />}
            </Container>
        </SPage>
    }
}
