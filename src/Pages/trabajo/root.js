
import React, { Component } from 'react';
import { Linking, PermissionsAndroid } from 'react-native'
import { connect } from 'react-redux';
import { SDate, SHr, SIcon, SList, SLoad, SMapView, SMapView2, SMarker, SNavigation, SPage, SPopup, SScrollView2, SText, STheme, SView } from 'servisofts-component';
import BarraCargando from '../../Components/BarraCargando';
import Marker from '../../Components/Marker';
import TopBar from '../../Components/TopBar';
import Model from '../../Model';

class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }


    getZona(key_zona) {
        const zonas = Model.zona.Action.getByKey(key_zona);
        if (!zonas) return null;
        var obj = zonas;
        return <SMapView.SCircle
            strokeColor={STheme.color.primary + "44"}
            // strokeOpacity={0.8}
            strokeWidth={2}
            fillColor={STheme.color.primary + "44"}
            // fillOpacity={0.3}
            center={{
                latitude: obj.latitude,
                longitude: obj.longitude
            }}
            radius={obj.radio}

        />

    }



   
    getLocation() {
        var location = Model.background_location.Action.getCurrentLocation();
        if (!location) return null;
        return <SMapView.SMarker latitude={location.latitude} longitude={location.longitude} />
    }
    render() {
        var trabajo = Model.conductor_horario.Action.getEnCurso();
        if (!trabajo) return null;
        console.log(trabajo)
        if (!trabajo.key) {
            SNavigation.reset("/")
            return null;
        }
        const zona = Model.zona.Action.getByKey(trabajo.key_zona);
        if (!zona) return null;

        return (
            <SPage title={'index'} hidden disableScroll center onRefresh={() => {
                Model.conductor_horario.Action.CLEAR();
            }}>
                <TopBar type={"usuario"} />
                <SView col={"xs-12"} height={100} center backgroundColor={STheme.color.barColor}>
                    <SText center col={"xs-10"} color={STheme.color.secondary}>{"Trabajo en curso dirígete a la zona asignada y actívate para recibir envíos."}</SText>
                    <SHr />
                    {/* <SText>{trabajo.hora_fin}</SText> */}
                    {this.getSwicth()}
                </SView>
                <SView col={"xs-12"} flex>
                    <SMapView initialRegion={{
                        latitude: zona.latitude,
                        longitude: zona.longitude,
                        latitudeDelta: (zona.radio * 2) * 0.000009,
                        longitudeDelta: (zona.radio * 2) * 0.000009,
                    }}
                        showsUserLocation={true}
                        onPress={(evt) => {
                            console.log("Envio ubic", evt)
                            Model.background_location.Action.onChange({
                                ...evt.coordinate,
                                rotation: 1,
                            });
                        }}
                    >
                        <></>
                        {this.getZona(trabajo.key_zona)}
                        {this.getLocation()}
                    </SMapView>
                </SView>
            </SPage>
        );
    }
}
const initStates = (state) => {
    return { state }
};
export default connect(initStates)(index);