import React, { Component } from 'react';
import { SHr, SIcon, SPopup, SText, STheme, SView } from 'servisofts-component';

export default class PopupErrorHorario extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    renderCardError(error) {
        const componenHoraError = ({ horas }) => {
            if (horas) {
                return <>
                    <SHr />
                    <SText>Hora 1:{` ${horas.Horario1.hora_inicio} - ${horas.Horario1.hora_fin}`}</SText>
                    <SText>Hora 2:{` ${horas.Horario2.hora_inicio} - ${horas.Horario2.hora_fin}`}</SText>
                </>
            }
        }

        return Object.values(error).map(obj => {
            return <>
                <SView width card center padding={10}>
                    <SText fontSize={12} color={STheme.color.danger}>{obj.error}</SText>
                    {obj.Horario1 && obj.Horario2 ? componenHoraError({ horas: { Horario1: obj.Horario1, Horario2: obj.Horario2 } }) : null}
                </SView>
                <SHr />
            </>
        })
    }
    render() {
        return (
            <SView center col={"xs-12"} height backgroundColor={STheme.color.background} borderRadius={20} padding={20}>
                <SText center color={STheme.color.danger} fontSize={14}>Errores Detectados</SText>
                <SHr />
                {this.renderCardError(this.props.errorHorario)}
            </SView>
        );
    }
}
