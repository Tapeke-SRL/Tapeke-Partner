import React, { Component } from 'react';
import { SLoad, SView } from 'servisofts-component';

export default class Container extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        // Extraer la propiedad `center` si está presente en las props
        const { center, loading, ...rest } = this.props;
        if (loading) return <SLoad />
        return (
            <SView col={"xs-12"} center {...rest}>
                <SView
                    col={"xs-11 sm-10 md-8 lg-6 xl-4 xxl-3"}
                    center={center !== undefined ? center : true} // Aplicar `center` por defecto, pero permitir que sea removido
                    {...rest}
                >
                    {this.props.children}
                </SView>
            </SView>
        );
    }
}
