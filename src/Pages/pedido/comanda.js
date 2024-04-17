import React from 'react';
import { connect } from 'react-redux';
import {
    SPage
} from 'servisofts-component';
import Model from '../../Model';
import AccentBar from '../../Components/AccentBar';

import Comanda from './Components/Comanda';

class root extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <SPage
                onRefresh={() => {
                    Model.pedido.Action.CLEAR();
                }}
                header={<AccentBar />}
            >
                <Comanda />
            </SPage>
        );
    }
}
const initStates = state => {
    return { state };
};
export default connect(initStates)(root);
