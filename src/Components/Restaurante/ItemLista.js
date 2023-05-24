import React, { Component } from 'react';
import { SText, SView } from 'servisofts-component';
import { restaurantePropsType } from './types';

export type propsType = {
    data: restaurantePropsType
}

export default class index extends Component<propsType> {
    static defaultProps: propsType = {

    }
    props: propsType;
    constructor(props) {
        super(props);
        this.state = {
        };

    }
    render() {
        const data = this.props.data;
        return <SView col={'xs-12'}>
            <SText>{data.nombre}</SText>
        </SView>
    }
}