import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SForm, SHr, SNavigation, SPage, SPopup, SText, SView, SIcon, STheme } from 'servisofts-component';
import Container from '../../Components/Container';
import Model from '../../Model';
import BtnSend from './components/BtnSend';
import Header from './components/Header';

class root extends Component {
    constructor(props) {
        super(props);
        this.state = {
            envio: 0
        };
        this.params = SNavigation.getAllParams();
    }

    render() {
        var defaultData = {
            ...this.params,
        };
        return (
            <SPage title={'Registro de usuario'}>
                <Container>
                    <Header title={"Bienvenido a Tapeke"} />
                    <SForm
                        ref={(form) => { this.form = form; }}
                        col={"xs-12"}
                        inputProps={{
                            col: "xs-12",
                            separation: 16
                        }}
                        style={{
                            alignItems: "center",
                        }}
                        inputs={{
                            Nombres: { placeholder: "Nombres", isRequired: true, defaultValue: defaultData.Nombres },
                            Apellidos: { placeholder: "Apellidos", isRequired: true, defaultValue: defaultData.Apellidos },
                            Correo: { placeholder: "Correo", type: "email", isRequired: true, defaultValue: defaultData.Correo },
                        }}
                        onSubmit={(values) => {
                            if (this.state.envio == 0) {
                                SPopup.alert('Debes aceptar los términos y condiciones');
                                // var error = "Debes aceptar los términos y condiciones"
                                // SPopup.open({ key: "errorRegistro", content: this.alertError(error) });
                            } else {

                                Model.usuario.Action.validateRegistro({
                                    ...values,
                                    Telefono: "+591 xxxxxxx"
                                }).then(resp => {
                                    if (!this.params.type) {
                                        SNavigation.navigate("/registro/password", {
                                            ...this.params,
                                            ...values,
                                        })
                                    } else {
                                        SNavigation.navigate("/registro/telefono", {
                                            ...this.params,
                                            ...values,
                                        })
                                    }
                                }).catch(e => {
                                    SPopup.alert("Ya existe un usuario con este correo.")
                                })

                            }


                        }}
                    />
                    <SHr height={20} />
                    <SView col={'xs-12'} flex row backgroundColor={'transparent'}>
                        <SView
                            // col={'xs-1'}
                            width={50}
                            onPress={() => {
                                this.setState(this.state.envio == 0 ? { envio: 1 } : { envio: 0 });
                            }}>
                            <SIcon
                                name={this.state.envio != 0 ? 'IconCheckedOk' : 'IconChecked'}
                                fill={STheme.color.primary}
                                width={30}
                                height={30}></SIcon>
                        </SView>
                        <SView
                            // col={'xs-11'}

                            // style={{ alignItems: 'center' }}
                            onPress={() => {
                                SNavigation.navigate('/condiciones');
                            }}>
                            <SText
                                color={STheme.color.text}
                                fontSize={14}
                                style={{ textDecorationLine: 'underline' }}>
                                Aceptar términos y condiciones
                            </SText>
                        </SView>
                    </SView>
                    <SHr height={30} />
                    <BtnSend onPress={() => this.form.submit()}>{"CONTINUAR"}</BtnSend>
                </Container>
                <SHr height={30} />
            </SPage>
        );
    }
}
const initStates = (state) => {
    return { state }
};
export default connect(initStates)(root);