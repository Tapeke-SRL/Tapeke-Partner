import React, { Component } from 'react';
import { SButtom, SHr, SIcon, SImage, SInput, SList, SMapView, SNavigation, SPage, SPopup, SText, STheme, SView } from 'servisofts-component';
import BarraCargando from '../../../../Components/BarraCargando';
import Marker from '../../../../Components/Marker';
import PButtom from '../../../../Components/PButtom';
import Model from '../../../../Model';
import SSocket from 'servisofts-socket';

export default class confirmando_conductor extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    handleOnPress = () => {
        //  Se llama para confirmar el pedido
        Model.pedido.Action.action("confirmar_conductor", this.props.data.key, {});
    }
    render() {
        var data = this.props.data;
        const { restaurante, direccion } = data;
        return (
            <SPage hidden disableScroll>
                <SView col={"xs-12"} center height>
                    <SView col={"xs-12"} height={100} center>
                        <SText fontSize={18} bold>Confirmar pedido</SText>
                        <SHr height={16} />
                        <SView col={"xs-11"}>
                            <BarraCargando />
                        </SView>
                    </SView>
                    <SMapView initialRegion={{
                        latitude: (direccion.latitude + restaurante.latitude) / 2,
                        longitude: (direccion.longitude + restaurante.longitude) / 2,
                        latitudeDelta: 0.03,
                        longitudeDelta: 0.03
                    }}>
                        <SMapView.SMarker latitude={direccion.latitude} longitude={direccion.longitude} />
                        <Marker latitude={restaurante.latitude} longitude={restaurante.longitude} data={restaurante} />
                    </SMapView>
                    <SView col={"xs-12"} center>
                        {/* <SHr height={16} /> */}
                        {/* <SText bold fontSize={16}>Dirígete a recoger el pedido</SText> */}
                        <SHr height={16} />
                        {/* <SView col={"xs-11"} center row>
                            <SText fontSize={16}>Hora de entrega:</SText>
                            <SView flex />
                            <SText fontSize={22}>{data.horario.hora_inicio} - {data.horario.hora_fin}</SText>
                        </SView> */}
                        <SHr height={8} />
                        <SView col={"xs-11"} center row>
                            <SView width={60} height={60} style={{
                                padding: 4
                            }}>
                                <SImage src={SSocket.api.root + 'restaurante/' + data.restaurante.key} />
                            </SView>
                            <SView flex>
                                <SText bold>{data.restaurante.nombre}</SText>
                                <SText color={STheme.color.lightGray}>Restaurante</SText>
                            </SView>
                            <SView center>
                                <SView width={100} center>
                                    <SText bold>{data.cantidad}</SText>
                                    <SText color={STheme.color.lightGray}>Cantidad</SText>
                                </SView>
                            </SView>
                        </SView>
                        <SHr height={16} />
                        <PButtom onPress={this.handleOnPress}>CONFIRMAR</PButtom>
                        <SHr height={16} />

                    </SView>

                </SView>
            </SPage >
        );
    }
}
