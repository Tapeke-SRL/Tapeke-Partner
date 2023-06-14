import React, { Component } from 'react';
import { Animated, View } from "react-native";

import { SText, SView } from 'servisofts-component';

type propsType = {

}

export default class CuadradoEnfoque extends Component<propsType> {
    static defaultProps: propsType = {

    }
    props: propsType;
    constructor(props) {
        super(props);
        this.state = {
        };

    }
    render() {
        return <SView col={"xs-12"} height style={{
            position:"absolute",
        }}>
            <SView style={{ flex: 1, width: '100%', height: 250, backgroundColor: 'rgba(0, 0, 0, 0.5)' }} row center>
            </SView>
            <View style={[{ flexDirection: 'row' }]}>
                <View style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', flex: 1, }} />
                <View
                    style={{ width: 250, height: 250, borderWidth: 3, borderColor: '#fcb602', backgroundColor: 'transparent', borderRadius: 1, }}
                />
                <View style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', flex: 1, }} />

            </View>
            <SView style={{ flex: 1, width: '100%', height: 250, backgroundColor: 'rgba(0, 0, 0, 0.5)' }} row center>
                <SText center style={{ marginTop: 14, width: 300, color: '#fff' }} > Coloque el código QR en el cuadro y se escaneará automáticamente. </SText>
            </SView>
        </SView>
    }
}