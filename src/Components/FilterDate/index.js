import React, { Component } from 'react';
import { SView } from 'servisofts-component';

export default class Container extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        // Extraer la propiedad `center` si está presente en las props
        const { center, ...rest } = this.props;

        return (
            <SView col={"xs-12"} center {...rest}>
                
            </SView>
        );
    }
}
