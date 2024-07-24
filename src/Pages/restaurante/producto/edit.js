import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { SNavigation, SPage, SText, SView } from 'servisofts-component';

export default class edit extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };

        this.key_restaurante = SNavigation.getParam("key_restaurante")
        this.pk = SNavigation.getParam("pk")
    }

    render() {
        return <SPage>
            <SText>{this.key_restaurante}</SText>
            <SText>{this.pk}</SText>
        </SPage>
    }
}
