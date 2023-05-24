import React, { Component } from 'react';
import { SForm, SGradient, SHr, SImage, SLoad, SMath, SNavigation, SPage, SPopup, SStorage, SText, STheme, SView, SIcon } from 'servisofts-component';

type PropsType = {
    title: "",
    label: ""
}

export default class Alert extends Component<PropsType> {
    static POPUP_CODE = "POPUP_BILLETERA SIN FONDO";
    static open(props: PropsType) {
        SPopup.open({
            key: this.POPUP_CODE,
            content: <Alert {...props} />
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
        return <SView col={"xs-12"} height={286} center style={{ borderRadius: 32, borderWidth: 2, borderColor:STheme.color.card }} withoutFeedback backgroundColor={STheme.color.background}   >
            <SHr height={30} />
            <SView col={"xs-12"}>
                <SText color={STheme.color.darkGray} style={{ fontSize: 20 }} bold center >{this.props.title}</SText>
            </SView>
            <SHr height={30} />
            <SView col={"xs-11"} center>
                <SText fontSize={14} color={STheme.color.primary} center >{this.props.label}</SText>
            </SView>
            <SView flex />
            <SView width={140} height={44} center backgroundColor={STheme.color.primary} style={{ borderRadius: 8 }}
                onPress={() => {
                    Alert.close();
                }}  >
                <SText fontSize={14} color={STheme.color.white} bold>ACEPTAR</SText>
            </SView>
            <SHr height={30} />
        </SView>
    }
}