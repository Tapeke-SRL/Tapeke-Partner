import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SButtom, SHr, SIcon, SImage, SLoad, SNavigation, SPage, SText, STheme, SView, SInput, SPopup } from 'servisofts-component';
import PButtom from '../../Components/PButtom';
import Model from '../../Model';
import { GeolocationMapSelect } from 'servisofts-rn-geolocation'
import PopupAutoCompleteDireccion from './Components/PopupAutoCompleteDireccion';
class index extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
        this.pk = SNavigation.getParam("pk")
        this.callback = SNavigation.getParam("callback");
        this.hiddeDescripcion = SNavigation.getParam("hiddeDescripcion");
        // if (typeof this.callback != "function") {
        //     SNavigation.replace("/")
        // }
    }

    getImput() {
        if (this.hiddeDescripcion) return null;

        //  if (!this.props.state.direccion_usuarioReducer.miDireccion) return null;
        return <SView col={"xs-12"} >
            <SInput fontSize={16} placeholder={"Nombre de la Ubicación"}
                isRequired={true}
                height={55}
                ref={(ref) => { this.inpNombreUbicacion = ref }}
            />
        </SView>
    }

    getComponentBottom() {
        return <SView col={"xs-12 sm-10 md-8 lg-6 xl-4"} height={280} row center>
            <SHr height={16} />
            <SView col={"xs-11"} center row border={'transparent'}>
                {/* {this.getImput()} */}
                <SHr height={10} />

                <SView col={"xs-12"}>
                    <SInput
                        style={{
                            backgroundColor: STheme.color.card + 1,
                            // height: 55,
                            // borderRadius: 16,
                            // color: STheme.color.text,
                            fontSize: 14
                        }}
                        editable={false}
                        placeholder={"Busca una dirección!"}
                        value={this.state?.data?.direccion ? `${this.state?.data?.direccion.substring(0, 40)}${this.state?.data?.direccion.length > 40 ? "..." : ""}` : ""}
                        // value={this.state?.data?.direccion}
                        onPress={() => {
                            SPopup.open({
                                key: "autocomplete", content:
                                    <PopupAutoCompleteDireccion region={this.state.data} callback={(resp) => {
                                        SPopup.close("autocomplete");
                                        this.state.data = resp;
                                        console.log(resp)
                                        // this.state.region = resp;
                                        this.mapa.getMap().animateToRegion({
                                            ...resp,
                                            latitudeDelta: 0.01,
                                            longitudeDelta: 0.01
                                        }, 1000);

                                        // this.state.dirType = "autoComplete"
                                        // this.state.nombre = resp.direccion;
                                        this.setState({ ...this.state });
                                    }} />
                            });
                        }}
                        iconR={<SIcon name={"SearchTapeke"} width={40} height={18} fill={STheme.color.primary} />}
                    />
                </SView>
            </SView>
            <SHr />
            <SView col={"xs-12"} row center border={'transparent'}>
                <SView width={40} center>
                    <SIcon name={'LocationTapeke'} height={14} width={14} />
                </SView>
                <SView width={200} onPress={() => {
                    if(this.mapa){
                        if(this.mapa?.map?.center){
                            console.log(this.mapa.map.center());
                        }

                    }
                    return;
                    this.map.getMap().center();
                    
                    // console.log("TODO: center map")
                }}>
                    <SText fontSize={15}   bold>Utilizar mi ubicación actual</SText>
                </SView>
            </SView>
            <SHr />
            <SView col={"xs-8.8"} row center border={'transparent'}  >
                <PButtom loading={this.state.loading} fontSize={16} onPress={() => {
                    // var descripcion = "";
                    // if (!this.hiddeDescripcion) {
                    //     if (!this.inpNombreUbicacion.verify()) {
                    //         return null;
                    //     }
                    //     descripcion = this.inpNombreUbicacion.getValue();
                    // }
                    var data = {
                        // descripcion: descripcion,
                        latitude: this.state?.data?.latitude,
                        longitude: this.state?.data?.longitude,
                        direccion: this.state?.data?.direccion,
                    }
                    if (this.callback) {
                        this.callback(data);
                         SNavigation.goBack();
                    } 

                }}>ELEGIR ESTA UBICACIÓN</PButtom>
            </SView>
            <SHr height={10} />
        </SView>
    }
    render() {
        return (
            // <SPage header={<AccentBar />} center disableScroll>
            <SPage  center disableScroll>
                <GeolocationMapSelect
                    ref={(map) => this.mapa = map}
                    icon={<SIcon name="MarcadorMapa" width={30} height={30} />}
                    onChange={(evt) => {
                        this.setState({ data: evt })
                    }} />
                {this.getComponentBottom()}
            </SPage>
        );
    }
}
const initStates = (state) => {
    return { state }
};
export default connect(initStates)(index);