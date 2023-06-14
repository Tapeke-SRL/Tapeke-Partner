import { Text, View } from 'react-native'
import React, { Component } from 'react'
import { SDate, SInput, SPage, SText, SView } from 'servisofts-component'
import Model from '../Model'
import { connect } from 'react-redux';
class test extends Component {

    render() {
        let users = Model.usuario.Action.getLastEdit("1980-01-01T00:00:00.000")
        // let users = Model.usuario.Action.getLastEdit(new SDate().toString("yyyy-MM-ddThh:mm:ss"))
        let cantidad = 0;
        if (users) {
            cantidad = Object.keys(users).length;
        }
        return (
            <SPage>
                <SView col={"xs-12"} center>
                    <SText bold fontSize={20}>{cantidad}</SText>
                    {/* <SInput type={"date"} defaultValue={}/> */}
                </SView>
                <SText>{JSON.stringify(users, "\n", "\t")}</SText>
            </SPage>
        )
    }
}

const initStates = (state) => {
    return { state }
};
export default connect(initStates)(test);