import React, { Component } from 'react';
import { SDate, SText, STheme, SView, SPopup } from 'servisofts-component';

export default class FilterDate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fecha_inicio: this.getFechaAtras(7),
            fecha_fin: new SDate().toString("yyyy-MM-dd"),
            select: {
                siete_dias: true,
                quince_dias: false,
                rango: false,
            }
        };

        this.props.onDateChange(this.state.fecha_inicio, this.state.fecha_fin);

        this.styleView = {
            margin: 1,
            padding: 2,
            borderRadius: 5
        };

        this.styleText = {
            fontSize: 11
        };
    }

    getFechaAtras(n) {
        const fechaActual = new Date();
        fechaActual.setDate(fechaActual.getDate() - n);
        return fechaActual.toISOString().split('T')[0];
    }

    changeSelect({ option, fecha_inicio, fecha_fin }) {
        fecha_inicio = fecha_inicio ?? "";
        fecha_fin = fecha_fin ?? new SDate().toString("yyyy-MM-dd");

        switch (option) {
            case 'siete_dias':
                fecha_inicio = this.getFechaAtras(7);
                break;
            case 'quince_dias':
                fecha_inicio = this.getFechaAtras(15);
                break;
        }

        this.setState({
            select: {
                siete_dias: option === 'siete_dias',
                quince_dias: option === 'quince_dias',
                rango: option === 'rango',
            },
            fecha_inicio,
            fecha_fin,
        }, () => {
            this.props.onDateChange(fecha_inicio, this.state.fecha_fin);
        });
    }

    render() {
        return (
            <>
                {/* <SView>
                    <SText>Fecha Inicio: {this.state.fecha_inicio}</SText>
                    <SText>Fecha Fin: {this.state.fecha_fin}</SText>
                </SView> */}
                <SView col={"xs-12"} center row>
                    <SView
                        center flex
                        col={"xs-4"}
                        backgroundColor={this.state.select.siete_dias ? STheme.color.primary : STheme.color.lightGray}
                        style={{
                            ...this.styleView
                        }}
                        onPress={() => this.changeSelect({ option: 'siete_dias' })}
                    >
                        <SText
                            color={this.state.select.siete_dias ? STheme.color.white : STheme.color.gray}
                            style={{
                                ...this.styleText
                            }}
                        >
                            Últimos 7 días
                        </SText>
                    </SView>

                    <SView
                        center
                        col={"xs-4"}
                        backgroundColor={this.state.select.quince_dias ? STheme.color.primary : STheme.color.lightGray}
                        style={{
                            ...this.styleView
                        }}
                        onPress={() => this.changeSelect({ option: 'quince_dias' })}
                    >
                        <SText
                            color={this.state.select.quince_dias ? STheme.color.white : STheme.color.gray}
                            style={{
                                ...this.styleText
                            }}
                        >
                            Últimos 15 días
                        </SText>
                    </SView>

                    <SView
                        center
                        row
                        col={"xs-4"}
                        backgroundColor={this.state.select.rango ? STheme.color.primary : STheme.color.lightGray}
                        style={{
                            ...this.styleView
                        }}
                        onPress={() => {
                            SPopup.dateBetween("Selecciona las fechas", (evt) => {
                                if (evt.fecha_fin < evt.fecha_inicio) {
                                    SPopup.alert('la fecha fin debe ser mayor a la fecha inicio')
                                    return
                                }

                                this.changeSelect({ option: 'rango', fecha_inicio: evt.fecha_inicio, fecha_fin: evt.fecha_fin })
                            });
                        }}
                    >
                        <SText
                            color={this.state.select.rango ? STheme.color.white : STheme.color.gray}
                            style={{
                                ...this.styleText,
                            }}
                        >
                            Seleccionar Fecha ▼
                        </SText>
                        {/* <SIcon name='Engranaje' width={18} fill={STheme.color.white} /> */}
                    </SView>
                </SView>
            </>
        );
    }
}
