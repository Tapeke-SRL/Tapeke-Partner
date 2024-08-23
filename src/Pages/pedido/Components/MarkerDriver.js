import React from 'react';
import { SIcon, SImage, SView, STheme } from 'servisofts-component';
import SSocket from 'servisofts-socket';

const MarkerDriver = (props) => {
    var obj = props.data;
    var size = props.size ?? 60;
    const url = SSocket.api.root + "usuario/.128_" + obj.key;
    return <SView width={size} height={size} style={{ alignItems: 'center', }}>
        <SIcon name={"MarcadorMapa"} width={size} height={size} />
        <SView style={{
            position: 'absolute',
            top: size * 0.03,
            width: size * 0.56,
            height: size * 0.56,
            backgroundColor: STheme.color.primary,
            borderRadius: size,
            overflow: 'hidden',
        }} center>
            <SIcon name={"iconoDelivery"} fill={STheme.color.white} style={{
                position: 'absolute',
                resizeMode: 'cover',
                width: size * 0.56,
                height: size * 0.56,
            }} />
        </SView>
    </SView>
}
export default MarkerDriver;