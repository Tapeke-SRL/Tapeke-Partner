import React, { Component } from 'react';
import { SForm, SGradient, SHr, SImage, SLoad, SMath, SNavigation, SPage, SPopup, SStorage, SText, STheme, SView, SIcon } from 'servisofts-component';

type PropsType = {
    onPress: any
}

export default class AceptarCondiciones extends Component<PropsType> {
    static POPUP_CODE = "POPUP_ACEPTAR_CONDICIONES";
    static open(props: PropsType) {
        SPopup.open({
            key: this.POPUP_CODE,
            content: <AceptarCondiciones {...props} />
        })
    }
    static close() {
        SPopup.close(this.POPUP_CODE)
    }
    constructor(props) {
        super(props);
        this.state = {
        };

    }
    handlePress = () => {
        if (this.props.onPress) {
            this.props.onPress()
        }
        AceptarCondiciones.close();
    }

    render() {
        return <SView width={362} height={286} center row style={{ borderRadius: 8 }} withoutFeedback backgroundColor={STheme.color.background}   >
            <SView col={"xs-11"} center>
                <SView width={100} height={100}>
                    <SIcon name={"Manos"} />
                </SView>
                <SText fontSize={14} center bold color={STheme.color.gray}>{"“Acepto que toda la información brindada es verdadera y me pertenece. Entiendo que cualquier intento de proveer información incorrecta o documentos falsos será motivo de prohibición de ingreso a la aplicación Tapeke Partners.”"}</SText>
            </SView>
            <SView col={"xs-12"} center>
                <SHr height={15} />
                <SView width={140} height={44} center backgroundColor={STheme.color.primary} style={{ borderRadius: 8 }}
                    onPress={this.handlePress}  >
                    <SText fontSize={14} color={STheme.color.white} bold>Aceptar</SText>
                </SView>
                <SHr height={15} />
            </SView>
        </SView >
    }
}