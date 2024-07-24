import React, { Component } from 'react';
import { SDate, SText, STheme, SView } from 'servisofts-component';

export default class FilterDate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fecha_inicio: new SDate,
            fecha_fin: new SDate,

            select: {
                siete_dias: true,
                quince_dias: false,
                rango: false,
            }
        };

        this.styleView = {
            margin: 1,
            padding: 2,
            borderRadius: 5
        }

        this.styleText = {
            fontSize: 12
        }
    }

    render() {
        // Extraer la propiedad `center` si está presente en las props
        const { center, ...rest } = this.props;

        return (
            <SView col={"xs-12"} center row>
                <SView
                    center
                    col={"xs-4"}
                    backgroundColor={this.state.select.siete_dias ? STheme.color.primary : STheme.color.gray}
                    style={{ ...this.styleView }}
                >
                    <SText
                        color={this.state.select.siete_dias ? STheme.color.white : STheme.color.gray}
                        style={{ ...this.styleText }}
                    >
                        Últimos 7 dias
                    </SText>
                </SView>

                <SView
                    center
                    col={"xs-4"}
                    backgroundColor={this.state.select.siete_dias ? STheme.color.primary : STheme.color.gray}
                    style={{ ...this.styleView }}
                >
                    <SText
                        color={this.state.select.siete_dias ? STheme.color.white : STheme.color.gray}
                        style={{ ...this.styleText }}
                    >
                        Últimos 15 días
                    </SText>
                </SView>

                <SView
                    center
                    row
                    col={"xs-4"}
                    backgroundColor={this.state.select.siete_dias ? STheme.color.primary : STheme.color.gray}
                    style={{ ...this.styleView }}
                >
                    <SText
                        color={this.state.select.siete_dias ? STheme.color.white : STheme.color.gray}
                        style={{ ...this.styleText }}
                    >
                        Seleccionar Fecha V
                    </SText>

                </SView>
            </SView>
        );
    }
}
