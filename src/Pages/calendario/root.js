import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { SHr, SIcon, SImage, SNavigation, SNotification, SPage, SText, STheme, SView } from 'servisofts-component';
import TopBar from '../../Components/TopBar';
import PBarraFooter from '../../Components/PBarraFooter';
import PageTitle from '../../Components/PageTitle';
import Container from '../../Components/Container';
import ListaDeHorarios from './Components/ListaDeHorarios';
import Model from '../../Model';
import CierreProgramado from './Components/CierreProgramado';
import Roles from '../../Roles';

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
            type: "horario"
            // type: "cierre"
        };
    }

    componentDidMount() {
        this.getPermisoVer()
    }


    getPermisoVer() {
        Roles.getPermiso({
            key_rol: Model.restaurante.Action.getSelectKeyRol(),
            url: "/_partner/calendario",
            permiso: "ver"
        }).then(e => {
            this.setState({ ver: e })
            this.getPermisoEditar();
            this.getPermisoAgregarCierre()
        }).catch(e => {
            SNotification.send({
                title: "Acceso denegado",
                body: "No tienes permisos para ver esta pagina.",
                color: STheme.color.danger,
                time: 5000,
            })
            SNavigation.goBack();

            // this.getPermisoEditar();
            // this.getPermisoEliminar();

        })
    }
    getPermisoEditar() {
        Roles.getPermiso({
            key_rol: Model.restaurante.Action.getSelectKeyRol(),
            url: "/_partner/calendario",
            permiso: "edit"
        }).then(e => {
            this.setState({ edit: e })
        }).catch(e => {
        })
    }

    getPermisoAgregarCierre() {
        Roles.getPermiso({
            key_rol: Model.restaurante.Action.getSelectKeyRol(),
            url: "/_partner/calendario",
            permiso: "add_cierre"
        }).then(e => {
            this.setState({ add_cierre: e })
        }).catch(e => {

        })
    }
    render() {
        const restaurante = Model.restaurante.Action.getSelect();

        let style = {
            padding: 5,
            borderRadius: 16
        }

        return <SPage hidden>
            <Container>
                <SHr />
                <PageTitle title={"HORARIOS"} />
                <SHr />
                <SView border={"#FF00FF"} col={"xs-12"} row style={{ justifyContent: "space-evenly" }}>
                    <SView flex row center
                        style={{
                            ...style,
                            backgroundColor: this.state.type == "horario" ? STheme.color.primary : STheme.color.lightGray,
                        }}
                        onPress={() => this.setState({ type: "horario" })}>
                        <SView width={16} height={16}>
                            <SIcon name='reloj' fill={this.state.type == "horario" ? STheme.color.white : STheme.color.gray} />
                        </SView>
                        <SText fontSize={10} font={"Montserrat-SemiBold"} color={this.state.type == "horario" ? STheme.color.white : STheme.color.gray} style={{ paddingLeft: 5 }}>{"Horario normal"}</SText>
                    </SView>
                    <SView width={15} />
                    <SView flex row center
                        style={{
                            ...style,
                            backgroundColor: this.state.type == "cierre" ? STheme.color.primary : STheme.color.lightGray,
                        }}
                        onPress={() => this.setState({ type: "cierre" })}>
                        <SView width={16} height={16}>
                            <SIcon name='Calendario' fill={this.state.type == "cierre" ? STheme.color.white : STheme.color.gray} />
                        </SView>
                        <SText fontSize={10} font={"Montserrat-SemiBold"} color={this.state.type == "cierre" ? STheme.color.white : STheme.color.gray} style={{ paddingLeft: 5 }}>{"Cierres programados"}</SText>
                        {/* <SView width={4} /> */}
                    </SView>
                </SView>
                <SHr h={36} />
                {this.state.type == "cierre" ? <CierreProgramado key_restaurante={restaurante.key} add_cierre={this.state.add_cierre} /> : <ListaDeHorarios key_restaurante={restaurante.key} edit={this.state.edit} />}
            </Container>
        </SPage>
    }
}
