import React, { Component } from 'react';
import { SForm, SGradient, SHr, SImage, SLoad, SMath, SNavigation, SPage, SPopup, SStorage, SText, STheme, SView, SIcon } from 'servisofts-component';

type PropsType = {

}

export default class InicieSession extends Component<PropsType> {
    static POPUP_CODE = "POPUP_TAPEKES_AGOTADOS";
    static open(props: PropsType) {
        SPopup.open({
            key: this.POPUP_CODE,
            content: <InicieSession {...props} />
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
    render() {
        return <SView width={362} height={286} center style={{ borderRadius: 8 }} withoutFeedback backgroundColor={STheme.color.background}   >
            <SHr height={30} />
            <SView col={"xs-12"}>
                <SText color={STheme.color.darkGray} style={{ fontSize: 20 }} bold center >Iniciar sesión</SText>
            </SView>
            <SHr height={30} />
            <SView col={"xs-11"} center>
                <SText fontSize={14} color={STheme.color.primary} center >Para aprovechar al máximo esta experiencia, por favor inicia sesión.</SText>
            </SView>
            <SView flex/>
            <SView width={140} height={44} center backgroundColor={STheme.color.primary} style={{ borderRadius: 8 }}
                onPress={() => {
                    InicieSession.close();
                    SNavigation.navigate("/login")
                }}  >
                <SText fontSize={14} color={STheme.color.white} bold>INICIAR</SText>
            </SView>
            <SHr height={30} />
        </SView>
    }
}