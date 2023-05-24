import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SForm, SHr, SLoad, SNavigation, SPage, SText, STheme, SView } from 'servisofts-component';
import Container from '../../Components/Container';
import PButtom from '../../Components/PButtom';
import Popups from '../../Components/Popups';
import Model from '../../Model';
import { Parent } from '.';

class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ubicacion: null
        };
        this.pk = SNavigation.getParam("pk")
    }

    loadData() {
        this.data = Model.restaurante.Action.getByKey(this.pk);
        if (!this.data) return null;
        return this.data;
    }
    render() {
        if (!this.loadData()) return <SLoad />
        return (
            <SPage >

                <Container>
                    <SHr h={32} />
                    <SView center>
                        <SText fontSize={18} bold color={STheme.color.primary}>EDITAR DATOS DEL RESTAURANTE</SText>
                        <SHr h={4} />
                        <SView col={"xs-5"} height={4} backgroundColor={STheme.color.primary} />
                    </SView>
                    <SForm
                        ref={(ref) => this.input = ref}
                        inputs={{
                            nombre_representante: { label: "Nombre del representante legal", required: true, defaultValue: this.data.nombre_representante },
                            nit: { label: "NIT del local", required: true, defaultValue: this.data.nit },
                            nombre: { label: "Nombre del local", required: true, defaultValue: this.data.nombre },
                            descripcion: { label: "Descripción", required: true, defaultValue: this.data.descripcion },
                            telefono: { label: "Teléfono del local", type: "phone", required: true, defaultValue: this.data.telefono },
                            direccion: { label: "Dirección escrita", required: true, defaultValue: this.data.direccion },
                            ubicacion: {
                                label: "Ubicación GPS", required: false, value: (this.data.latitude + "," + this.data.longitude) ?? this.state?.ubicacion?.direccion,
                                onFocus: (value) => {
                                    // this._handlingFecha(value)
                                    // var fecha_fin_ = new SDate(value).addDay(data_paquete?.dias).toString("yyyy-MM-dd")
                                    // this.setState({
                                    //     fecha_fin: fecha_fin_
                                    // });
                                    SNavigation.navigate("/direccion/mapa", {
                                        callback: (resp) => {
                                            console.log(resp)
                                            this.setState({ ubicacion: resp })
                                        }
                                    })
                                },
                            },
                            // horario: { label: "Horario de atención regular", required: true, defaultValue: this.data.horario },
                        }}
                        onSubmit={(data) => {
                            // Popups.AceptarCondiciones.open({
                            //     onPress: () => {
                            let data2 = {
                                ...this.data,
                                ...data,
                            }

                            if (this.state.ubicacion) {
                                data2.latitude = this.state.ubicacion.latitude;
                                data2.longitude = this.state.ubicacion.longitude;
                            }
                            Model.restaurante.Action.editar({
                                data: data2,
                                key_usuario: Model.usuario.Action.getKey()
                            }).then((resp) => {
                                Model.restaurante.Action.CLEAR()
                                SNavigation.goBack();
                            }).catch(e => {
                                console.error(e);
                            })

                            // Model.restaurante.Action.registro_by_partner({
                            //     data: {
                            //         ...data
                            //     },
                            //     key_usuario: Model.usuario.Action.getKey()
                            // }).then((resp) => {
                            //     Model.usuario_restaurante.Action.registro({
                            //         data: {
                            //             key_restaurante: resp.data.key,
                            //             key_usuario: Model.usuario.Action.getKey()
                            //         }
                            //     }).then((resp2) => {
                            //         Model.restaurante.Action.CLEAR();
                            //         Model.restaurante.Action.select(resp.data.key)
                            //         SNavigation.reset("/");
                            //     }).catch((e) => {
                            //         console.error(e)
                            //     })
                            // }).catch((e) => {
                            //     console.error(e);
                            // })

                            //     }
                            // });
                        }}
                    />
                    <SHr h={16} />
                    <PButtom width={"100%"} onPress={() => {
                        this.input.submit()
                    }}>EDITAR</PButtom>
                    <SHr h={25} />
                </Container>

            </SPage>
        );
    }
}
const initStates = (state) => {
    return { state }
};
export default connect(initStates)(index);