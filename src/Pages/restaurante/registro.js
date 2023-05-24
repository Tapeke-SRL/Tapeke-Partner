import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SForm, SHr, SNavigation, SPage, SText, STheme, SView } from 'servisofts-component';
import Container from '../../Components/Container';
import PButtom from '../../Components/PButtom';
import Popups from '../../Components/Popups';
import Model from '../../Model';

class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <SPage >

                <Container>
                    <SHr h={32} />
                    <SView center>
                        <SText fontSize={18} bold color={STheme.color.primary}>REGISTRO DE RESTAURANTE</SText>
                        <SHr h={4} />
                        <SView col={"xs-5"} height={4} backgroundColor={STheme.color.primary} />
                    </SView>
                    <SForm
                        ref={(ref) => this.input = ref}
                        inputs={{
                            nombre_representante: { label: "Nombre del representante legal", required: true },
                            nit: { label: "NIT del local", required: true },
                            nombre: { label: "Nombre del local", required: true },
                            descripcion: { label: "Descripción", required: true },
                            telefono: { label: "Teléfono del local", type: "phone", required: true },
                            direccion: { label: "Dirección escrita", required: true },
                            ubicacion: {
                                label: "Ubicación GPS", required: false, value: !this.state?.ubicacion ? "" : this.state?.ubicacion?.latitude + "," + this.state?.ubicacion?.longitude,
                                onFocus: (value) => {
                                    // this._handlingFecha(value)
                                    // var fecha_fin_ = new SDate(value).addDay(data_paquete?.dias).toString("yyyy-MM-dd")
                                    // this.setState({
                                    //     fecha_fin: fecha_fin_
                                    // });
                                    SNavigation.navigate("/direccion/mapa", {
                                        callback: (resp) => {
                                            this.setState({ ubicacion: resp })
                                        }
                                    })
                                },
                            },
                            // horario: { label: "Horario de atención", required: true },


                        }}
                        onSubmit={(data) => {
                            delete data["ubicacion"];
                            Popups.AceptarCondiciones.open({
                                onPress: () => {
                                    Model.restaurante.Action.registro_by_partner({
                                        data: {
                                            latitude: this.state?.ubicacion?.latitude,
                                            longitude: this.state?.ubicacion?.longitude,
                                            ...data
                                        },
                                        key_usuario: Model.usuario.Action.getKey()
                                    }).then((resp) => {
                                        Model.usuario_restaurante.Action.registro({
                                            data: {
                                                key_restaurante: resp.data.key,
                                                key_usuario: Model.usuario.Action.getKey()
                                            }
                                        }).then((resp2) => {
                                            Model.restaurante.Action.CLEAR();
                                            Model.restaurante.Action.select(resp.data.key)
                                            SNavigation.reset("/");
                                        }).catch((e) => {
                                            console.error(e)
                                        })
                                    }).catch((e) => {
                                        console.error(e);
                                    })
                                }
                            });
                        }}
                    />
                    <SHr h={16} />
                    <PButtom width={"100%"} onPress={() => {
                        this.input.submit()

                    }}>REGISTRO</PButtom>
                </Container>

            </SPage>
        );
    }
}
const initStates = (state) => {
    return { state }
};
export default connect(initStates)(index);