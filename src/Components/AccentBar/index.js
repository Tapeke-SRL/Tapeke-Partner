import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { STheme, SView } from 'servisofts-component';

export default class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <SView backgroundColor={STheme.color.accent} height={20} col={"xs-12"}>

            </SView>
        );
    }
}
