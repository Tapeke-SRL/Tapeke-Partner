import React, { Component } from 'react'
import { SText, SView ,SPopup} from 'servisofts-component';
import states from './states';
export default class PedidoState extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        var data = this.props.data;
        const StateComponent = states[data.state];
        if (StateComponent) {
            return <StateComponent data={data} />
        }
        return <SText>{data.state}</SText>

    }
}