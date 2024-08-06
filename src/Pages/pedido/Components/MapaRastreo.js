import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { SMapView, SMapView2, SText, SThread, SView } from 'servisofts-component';
import Model from '../../../Model';
import SSocket from 'servisofts-socket';

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
                            top: 10,
                            bottom: 10,
                            left: 100,
                            right: 100
                        }
                    })
                } else {
                    this.mapa.animateToRegion({
                        latitude: restaurante.latitude, longitude: restaurante.longitude,
                        latitudeDelta: 0.03,
                        longitudeDelta: 0.03
                    })
                    // this.mapa.fitToCoordinates([
                    //     { latitude: restaurante.latitude, longitude: restaurante.longitude },
                    // ], {
                    //     edgePadding: {
                    //         top: 10,
                    //         bottom: 10,
                    //         left: 100,
                    //         right: 100
                    //     }
                    // })
                }
            }
            this.setState({ position: resp.data })
            console.log(resp);
        }).catch(resp => {
            console.error(resp);
        })
    }


    renderContent() {
        const { direccion, restaurante, key_conductor, delivery } = this.props.data
        if (delivery <= 0) return <SText>{"Recoger del lugar"}</SText>
        // if (!key_conductor) return <SText>{"Sin conductor "}</SText>
        return <SMapView
            ref={ref => this.mapa = ref}
            initialRegion={{
                latitude: restaurante.latitude,
                longitude: restaurante.longitude,
                latitudeDelta: 0.03,
                longitudeDelta: 0.03
            }}>
            {/* <SMapView.SMarker latitude={direccion.latitude} longitude={direccion.longitude} /> */}
            <SMapView.SMarker latitude={restaurante.latitude} longitude={restaurante.longitude} />
            {this.state.position ? <SMapView.SMarker latitude={this.state?.position?.latitude} longitude={this.state?.position?.longitude} /> : null}
        </SMapView>
    }
    render() {

        return <SView col={"xs-12"} height={200} border={"#000"} center>
            {this.renderContent()}
        </SView>
    }
}
