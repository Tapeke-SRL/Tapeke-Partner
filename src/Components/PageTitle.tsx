import React from "react";
import { SPage, SText, STheme, SView } from "servisofts-component";
import Model from "../Model";

type PageTitlePropsType = {
    title: string,
}
export default class PageTitle extends React.Component<PageTitlePropsType> {
    render() {
        const restaurante = Model.restaurante.Action.getSelect();
        return <SView col={"xs-12"}>
            {/* <SText font='Montserrat-ExtraBold' fontSize={16}>{this.props.title}</SText> */}
            <SText font='Montserrat-Bold' fontSize={16}>{this.props.title}</SText>
            <SText font={"Montserrat-SemiBold"} fontSize={14} color={STheme.color.primary} >{restaurante?.nombre}</SText>
        </SView>
    }
}