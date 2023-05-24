import React, { Component } from 'react';
import { SForm, SGradient, SHr, SImage, SLoad, SMath, SNavigation, SPage, SPopup, SStorage, SText, STheme, SView, SIcon } from 'servisofts-component';

type PropsType = {

}

export default class TapekesAgotados extends Component<PropsType> {
    static POPUP_CODE = "POPUP_TAPEKES_AGOTADOS";
    static open(props: PropsType) {
        SPopup.open({
            key: this.POPUP_CODE,
            content: <TapekesAgotados {...props} />
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
        return <SView width={362} height={286} center row style={{ borderRadius: 8 }} withoutFeedback backgroundColor={STheme.color.background}   >
            <SHr height={20} />
            <SView col={"xs-12"} height={35} center style={{ borderBottomWidth: 1, borderColor: STheme.color.primary }}>
                <SText color={STheme.color.darkGray} style={{ fontSize: 20 }} bold center >Tapekes agotados</SText>
            </SView>
            <SHr height={20} />
            <SView col={"xs-11"} center row>
                <SView col={"xs-11"} center >
                    <SIcon width={100} name='BilleteraVacio'></SIcon>
                </SView>
                <SView col={"xs-11"} center>
                    <SHr height={8} />
                    <SText fontSize={14} color={STheme.color.primary}  >Lo sentimos ya no se encontraron tapekes disponibles.</SText>
                </SView>
            </SView>
            <SView col={"xs-12"} center>
                <SHr height={15} />
                <SView width={140} height={44} center backgroundColor={STheme.color.primary} style={{ borderRadius: 8 }}
                    onPress={() => {
                        TapekesAgotados.close();
                    }}  >
                    <SText fontSize={14} color={STheme.color.white} bold>Volver</SText>
                </SView>
                <SHr height={15} />
            </SView>
        </SView>
    }
}