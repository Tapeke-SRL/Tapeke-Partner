import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SButtom, SDate, SHr, SIcon, SImage, SList, SNavigation, SPage, SText, STheme, SThread, SView } from 'servisofts-component';
import Container from '../Components/Container';
// import { AccentBar, Container } from '../Components';
import Model from '../Model';

class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {

    }


    render_data() {
        var data = Model.usuario_notification.Action.getAll();
        return <SView col={"xs-12"}>
            <SList
                data={data}
                limit={10}
                order={[{ key: "fecha_on", order: "desc", peso: 1 }]}
                render={(obj) => {
                    const { title, body, fecha_on, fecha_visto } = obj;
                    return <SView col={"xs-12"} card style={{
                        padding: 4
                    }}>
                        <SView col={"xs-12"} row>
                            <SView flex />
                            <SText fontSize={10}>{new SDate(fecha_on, "yyyy-MM-ddThh:mm:ss").toString("yyyy-MM-dd hh:mm")}</SText>
                        </SView>
                        <SText bold>{title}</SText>
                        <SText fontSize={12}>{body}</SText>
                        <SHr />
                    </SView>
                }} />
        </SView>
    }
    render() {
        return (
            <SPage title={"Notificaciones"} onRefresh={(resolve)=>{
                Model.usuario_notification.Action.CLEAR();
            }} >
                <SView backgroundColor={"#96BE00"} height={20} col={"xs-12"}></SView>
                <Container>
                    {this.render_data()}
                </Container>
            </SPage>
        );
    }
}
const initStates = (state) => {
    return { state }
};
export default connect(initStates)(index);