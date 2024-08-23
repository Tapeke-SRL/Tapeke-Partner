import React from "react";
import { FlatList } from "react-native";
import { SDate, SHr, SIFechaAlert, SImage, SLoad, SNotification, SPage, SPopup, SText, STheme, SView, } from "servisofts-component";
import SSocket from "servisofts-socket";
import Model from "../../../Model";

export default class CierreProgramado extends React.Component<{ key_restaurante: string, add_cierre?: any }> {
    state: any = {
        fecha_select: "",
        data: null
    }

    componentDidMount(): void {
        SSocket.sendPromise({
            component: "restaurante_cierre_programado",
            type: "getAll",
            key_restaurante: this.props.key_restaurante,
            key_usuario: Model.usuario.Action.getKey(),
        }).then((e: any) => {
            this.setState({ data: Object.values(e.data) })
            console.log(e);
        }).catch(e => {
            console.error(e);
        })
    }
    renderAddCierre() {
        if(!this.props.add_cierre) return null;
        return <SText font={"Montserrat-Bold"} color={STheme.color.primary} onPress={() => {
            SPopup.open({
                key: "popupadd",
                content: <SView col={"xs-12"} backgroundColor="#fff" center withoutFeedback>
                    <SIFechaAlert onChange={(e) => {
                        console.log(e);
                        this.state.fecha_select = e.toString("yyyy-MM-ddThh:mm:ss") + "";
                    }} />
                    <SHr />
                    <SView col={"xs-12"} row center>
                        <SView style={{
                            padding: 8,
                            borderRadius: 4,
                            borderWidth: 1,
                            borderColor: STheme.color.primary
                        }} onPress={() => {
                            SPopup.close("popupadd")
                        }}>
                            <SText clean color={STheme.color.text}>{"Cerrar"}</SText>
                        </SView>
                        <SView width={100} />
                        <SText padding={8} backgroundColor={STheme.color.primary} style={{
                            borderRadius: 4,
                        }} color={STheme.color.text}
                            onPress={() => {
                                SPopup.close("popupadd")
                                SSocket.sendPromise({
                                    component: "restaurante_cierre_programado",
                                    type: "registro",
                                    key_restaurante: this.props.key_restaurante,
                                    key_usuario: Model.usuario.Action.getKey(),
                                    data: {
                                        key_restaurante: this.props.key_restaurante,
                                        key_usuario: Model.usuario.Action.getKey(),
                                        fecha_cierre: this.state.fecha_select
                                    }
                                }).then(e => {
                                    this.componentDidMount();
                                    SPopup.close("popupadd")
                                    console.log(e);
                                }).catch(e => {
                                    SNotification.send({
                                        title: "No se completo la accion.",
                                        body: "Ocurrio un error al agregar el cierre.",
                                        color: STheme.color.danger,
                                        time: 5000,
                                    })
                                    console.log(e);
                                })

                                // this.state.fecha_select
                            }}>{"Guardar"}</SText>
                    </SView>
                    <SHr />
                </SView>
            })
        }
        }> {"+ Agregar cierre programado"}</SText >
    }
    renderList() {
        if (!this.state.data) return <SLoad />
        const data = this.state.data.filter((a: any) => !!a.estado)
        if (data.length <= 0) return <SText>{"No tienes cierres programados"}</SText>
        return <FlatList
            style={{
                width: "100%",
            }}
            data={data.sort((a: any, b: any) => a.fecha_cierre > b.fecha_cierre ? 1 : -1)}
            ItemSeparatorComponent={() => <SHr />}
            renderItem={({ item, index }) => {
                return <SView col={"xs-12"} row>
                    <SView flex card center padding={8}>
                        <SText font={"Montserrat-Bold"} color={STheme.color.primary} col={"xs-12"}>{"Cierre programado"}</SText>
                        <SHr h={4} />
                        <SText font={"Montserrat-Medium"} col={"xs-12"} color={"#666"}>{new SDate(item.fecha_cierre, "yyyy-MM-ddThh:mm:ss").toString("DAY dd de MONTH yyyy")}</SText>
                    </SView>
                    <SView width={30} padding={6} onPress={() => {
                        // this.setState({ onEdit: item })
                        SPopup.confirm({
                            title: "¿Estás seguro que deseas eliminar este cierre programado?",
                            message: "Tu comercio volverá a estar abierto para recibir pedidos según tu horario normal",
                            onPress: () => {
                                item.estado = 0;
                                SSocket.sendPromise({
                                    component: "restaurante_cierre_programado",
                                    type: "editar",
                                    key_restaurante: this.props.key_restaurante,
                                    key_usuario: Model.usuario.Action.getKey(),
                                    data: item
                                }).then(e => {
                                    // SNotification.send({
                                    //     title: "Exito",
                                    //     body: "Cierre eliminado con exito.",
                                    //     color: STheme.color.success,
                                    //     time: 5000,
                                    // })
                                    this.setState({ ...this.state })
                                    console.log(e);
                                }).catch(e => {
                                    item.estado = 1;
                                    SNotification.send({
                                        title: "No se completo la accion.",
                                        body: "Ocurrio un error al eliminar el cierre.",
                                        color: STheme.color.danger,
                                        time: 5000,
                                    })
                                    console.log(e);
                                })

                            }
                        })
                    }}>
                        <SImage src={require("../../../Assets/img/borrar.png")} />
                    </SView>
                </SView>
            }}
        />
    }
    render() {
        return <SView col={"xs-12"} center>
            {this.renderList()}
            <SHr h={32} />
            {this.renderAddCierre()}
        </SView>
    }
}