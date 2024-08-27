import React, { Component } from 'react'
import { SMapView, SPage, SText, SView, } from 'servisofts-component'
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'
class test extends Component {
    render() {
        return (
            <SPage disableScroll>
                <MapView
                    provider={""}
                    style={{
                        width:"100%",
                        height: "100%"
                    }}

                    initialRegion={{
                        latitude: 1,
                        longitude: 1,
                        latitudeDelta: 0.1,
                        longitudeDelta: 0.1
                    }}
                >
                    <SMapView.SMarker latitude={0.1} longitude={0.1}>
                        <SView>
                            <SText>{"Hola"}</SText>
                        </SView>
                    </SMapView.SMarker>
                </MapView>
            </SPage>
        )
    }
}

export default test