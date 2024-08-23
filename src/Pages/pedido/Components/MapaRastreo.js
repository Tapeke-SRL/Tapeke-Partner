import React, { Component } from 'react';
import { } from 'react-native';
import { SMapView, SText, STheme, SThread, SView } from 'servisofts-component';
import MarkerRestaurante from './MarkerRestaurante'


import SSocket from 'servisofts-socket';
import MarkerDriver from './MarkerDriver';

export default class MapaRastreo extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
        this.isRun = true
        this.hilo();
    }
    componentWillUnmount() {
        this.isRun = false;
    }
    hilo() {
        if (!this.isRun) return;
        const { key_conductor } = this.props.data
        this.buscarPosicionUsuario(key_conductor);
        new SThread(5000, "esperar_hilo").start(() => {
            if (!this.isRun) return;
            this.hilo();
        })
    }

    buscarPosicionUsuario(key_usuario) {
        if (!key_usuario) return;
        SSocket.sendPromise({
            component: "background_location",
            type: "getByKey",
            key_usuario: key_usuario
        }).then((resp) => {
            if (this.mapa) {
                const { restaurante, } = this.props.data
                if (resp?.data?.latitude && resp?.data?.longitude) {
                    this.mapa.fitToCoordinates([
                        { latitude: restaurante.latitude, longitude: restaurante.longitude },
                        { latitude: resp?.data?.latitude, longitude: resp?.data?.longitude },
                    ], {
                        edgePadding: {
                            top: 100,
                            bottom: 100,
                            left: 20,
                            right: 20
                        }
                    })
                } else {
                    this.mapa.animateToRegion({
                        latitude: restaurante.latitude, longitude: restaurante.longitude,
                        latitudeDelta: 0.03,
                        longitudeDelta: 0.03
                    })
                }
            }
            this.setState({ position: resp.data })
            console.log(resp);
        }).catch(resp => {
            console.error(resp);
        })
    }

    getMapa() {
        const { restaurante } = this.props.data
        let size = 50

        return <SMapView
            ref={ref => this.mapa = ref}
            initialRegion={{
                latitude: restaurante.latitude,
                longitude: restaurante.longitude,
                latitudeDelta: 0.03,
                longitudeDelta: 0.03
            }}>
            {/* <SMapView.SMarker latitude={direccion.latitude} longitude={direccion.longitude} /> */}
            <SMapView.SMarker width={size} height={size} latitude={restaurante.latitude} longitude={restaurante.longitude} >
                <MarkerRestaurante data={this.props.data?.restaurante} size={size} />
            </SMapView.SMarker>
            {this.state.position ? <SMapView.SMarker width={size} height={size} latitude={this.state?.position?.latitude} longitude={this.state?.position?.longitude} >
                <MarkerDriver data={{ key: this.props.data.key_conductor }} size={size} />
            </SMapView.SMarker> : null}
        </SMapView>
    }

    renderContent() {
        const { direccion, key_conductor, delivery, state } = this.props.data


        if (delivery <= 0) return <SText>{"Recoger del lugar"}</SText>
        // if (!key_conductor) return <SText>{"Sin conductor "}</SText>
        return <>
            {this.getMapa()}
        </>
    }

    renderMensage() {
        switch (this.props?.data?.state) {
            case "buscando_conductor": return "Buscando conductor...";
            case "confirmando_conductor": return "Confirmando conductor...";
            case "esperando_conductor": return "Conductor en camino a tu comercio";
            default: return this.props?.data?.state;
        }
    }
    render() {

        return <SView col={"xs-12"} height={270} style={{
            borderRadius: 16,
            overflow: "hidden"
        }} center>
            <SView style={{
                width: "100%",
                height: 35,
                backgroundColor: STheme.color.primary
            }} center>
                <SText color={STheme.color.white} fontSize={16} font='Montserrat-Medium'>{this.renderMensage()}</SText>
            </SView>
            {this.renderContent()}
        </SView>
    }
}
