import React, { Component } from 'react';
import { SHr, SIcon, SPopup, SText, STheme, SView } from 'servisofts-component';

export default class PopupCerrarRestaurante extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };

    }
    render() {
        return (
            <SView center width={300} height={180} backgroundColor={STheme.color.background} borderRadius={20} >
                <SView center row>
                    <SView >
                        <SIcon center name="reloj" fill={STheme.color.primary} height={30} width={30} />
                    </SView>
                    <SText font={"Montserrat-Bold"} fontSize={20} style={{ paddingLeft: 5 }}>Cerrar Comercio</SText>
                </SView>
                <SHr />
                <SView>
                    <SText center color={STheme.color.gray} fontSize={11}>
                        {`Tu comercio abrirá automáticamente ${this.props.labelText ? `dentro de ${this.props.labelText > 1 ? `${this.props.labelText} horas` : `${this.props.labelText} hora`}` : "el día de mañana o en el subsiguiente horario de atención"
                            }.`}
                    </SText>
                    <SHr />
                    <SText center color={STheme.color.gray} fontSize={11}>Puedes volver a abrir tu comercio en cualquier momento</SText>
                </SView>
                <SHr />
                <SView center backgroundColor={STheme.color.primary} padding={2} width={80} borderRadius={8}
                    onPress={() => {
                        SPopup.close(this.props.keyPopup)
                    }}
                >
                    <SText font={"Montserrat"} color={STheme.color.white}>Aceptar</SText>
                </SView>
            </SView>
        );
    }
}
