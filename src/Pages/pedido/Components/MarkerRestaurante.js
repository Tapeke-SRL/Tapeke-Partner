import React from 'react';
import { SIcon, SImage, SView } from 'servisofts-component';
import SSocket from 'servisofts-socket';

const MarkerRestaurante = (props) => {
    var obj = props.data;
    var size = props.size ?? 60;
    const url = SSocket.api.root + "restaurante/.128_" + obj.key;
    return <SView width={size} height={size} style={{ alignItems: 'center', }}>
        <SIcon name={"MarcadorMapa"} width={size} height={size} />
        <SView style={{
            position: 'absolute',
            top: size * 0.03,
            width: size * 0.56,
            height: size * 0.56,
            backgroundColor: "#ffffff66",
            borderRadius: size,
            overflow: 'hidden',
        }} center>
            <SImage src={url} style={{
                position: 'absolute',
                resizeMode: 'cover',
                width: size * 0.56,
                height: size * 0.56,
            }} />
        </SView>
    </SView>
}
export default MarkerRestaurante;