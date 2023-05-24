import React, { Component } from 'react';
import { TouchableOpacity, View, Text } from "react-native";
import { SIcon, SNavigation, STheme } from 'servisofts-component';
const FloatButtomQR = (props) => {
    if (props.esconder) {
        return <View />
    }
    return (<TouchableOpacity onPress={() => {
        SNavigation.navigate("/camara");
    }}
        style={{
            position: "absolute",
            right: 10,
            bottom: 60,
            width: 50,
            height: 50,
            // borderWidth: STheme.color.secondary + "22",
            // borderColor: STheme.color.secondary + "22",
            justifyContent: "center",
            alignItems: "center",
            // margin: 4,
            ...props.style
        }}>
        <SIcon name={"BtnQR"} fill={STheme.color.secondary} />
        {/* <Svg name={"Add"} style={{
                width: "100%",
                height: "100%",
                // fill:"#C31"
            }} /> */}
    </TouchableOpacity >
    )
}
export default FloatButtomQR;