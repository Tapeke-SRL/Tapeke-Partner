import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { SDate, SText, STheme, SView } from 'servisofts-component';

export default class SelectRol extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }


    renderItem(props) {
        // const { key, label, info } = props;
        return <SView col={"xs-12"} padding={8} center flex onPress={() => {
            if (this.props.onSelect) this.props.onSelect(props)
        }}>

            <SText col={"xs-12"} font='Montserrat-Medium' fontSize={14}>{props.descripcion}</SText>
            <SText col={"xs-12"} color={"#999"} fontSize={9}>{props.observacion}</SText>

        </SView>
    }
    minutesUntilEndOfDay() {
        // Obtén la hora actual
        const now = new Date();

        // Crea una nueva fecha para la medianoche de mañana
        const endOfDay = new Date(now);
        endOfDay.setHours(24, 0, 0, 0); // Establece la hora a medianoche

        // Calcula la diferencia en milisegundos entre la medianoche y la hora actual
        const diff = endOfDay - now;

        // Convierte la diferencia de milisegundos a minutos
        const minutes = Math.floor(diff / 1000 / 60);

        return minutes;
    }
    render() {
        return (
            <SView
                withoutFeedback
                style={[{
                    width: this.props?.style?.itemWidth,
                    height: 220,
                    // padding: 8,
                    justifyContent: "center",
                    alignItems: "center",
                    position: "absolute",
                    top: 0,
                    backgroundColor: "#fff",
                    borderColor: STheme.color.lightGray,
                    borderWidth: 1,
                    borderRadius: 8

                }, this.props.style]}>
                {this.props.roles.sort((a, b) => (a.index ?? 0) > (b.index ?? 0) ? 1 : -1).map((rol) => {
                    return this.renderItem(rol)
                })}
            </SView>
        );
    }
}
