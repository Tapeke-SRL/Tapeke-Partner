import React, { Component } from 'react';
import { connect } from 'react-redux';
import { KeyboardAvoidingView, Platform, Keyboard } from 'react-native'
import { SHr, SNavigation, SPage, SText, SView, STheme, SImage, SLoad, SButtom, SIcon, SWebView, STable2, SMath, SDate, SList, SInput, } from 'servisofts-component';
import { Container, PButtom } from '../../Components';
import Model from '../../Model';


class index extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.pk = SNavigation.getParam("pk");
    }

    load_data() {
        this.data = Model.chat.Action.getByKey(this.pk)
        this.mensajes = Model.chat_mensaje.Action.getAllByKeyChat(this.pk);
        if (!this.mensajes) return null;
        return this.data;
    }

    render_mensajes() {
        if (!this.load_data()) return <SLoad />
        return <SList
            data={this.mensajes}
            render={(obj) => {
                return <SView card col={"xs-12"}>
                    <SText>{obj.descripcion}</SText>
                </SView>
            }}
        />
    }
    render_data() {
        if (!this.load_data()) return <SLoad />
        return <SView col={"xs-12"} card style={{
            padding: 8
        }} row>
            <SView width={50} style={{
                padding: 8,
            }} onPress={() => {
                SNavigation.goBack();
            }}>
                <SIcon name='Back' width={10} />
            </SView>
            <SView flex>
                <SText bold fontSize={16}>{this.data.descripcion}</SText>
                <SText>{this.data.observacion}</SText>
            </SView>
            <SHr />
        </SView>
    }
    renderFooter() {
        return <SView col={"xs-12"} height={50} card row>

            <SView flex>
                <SInput ref={ref => this.chat_inp = ref} placeholder={"Escribe el mensaje"} />
            </SView>
            <SButtom type={"outline"} onPress={() => {
                var txt = this.chat_inp.getValue();
                this.chat_inp.setValue("");
                Model.chat_mensaje.Action.registro({
                    data: {
                        descripcion: txt,
                        observacion: "",
                        tipo: "text"
                    },
                    key_chat: this.pk,
                    key_usuario: Model.usuario.Action.getKey()
                }).then((resp) => {
                    console.log(resp);
                }).catch((e) => {
                    console.error(e);
                })
            }}>
                SEND
            </SButtom>
        </SView>
    }
    render() {
        return <SView col={"xs-12"} flex  >
            <SView col={"xs-12"} >
                {this.render_data()}
            </SView>
            <SView col={"xs-12"} flex  >
                <KeyboardAvoidingView
                    keyboardVerticalOffset={20}
                    behavior={Platform.OS === "ios" ? "padding" : null}
                    style={{ flex: 1 }}
                >
                    <SView flex col={"xs-12"}>
                        {this.render_mensajes()}
                    </SView>
                    <SView col={"xs-12"} height={50} >
                        {this.renderFooter()}
                    </SView>
                </KeyboardAvoidingView>
            </SView>
        </SView >
    }
}
const initStates = (state) => {
    return { state }
};
export default connect(initStates)(index);