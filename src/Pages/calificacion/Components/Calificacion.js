import React from 'react';
import { connect } from 'react-redux';
import { SIcon, SLoad, SNavigation, SPage, SPopup, SScrollView2, SText, STheme, SView, SHr, SList, SDate, SImage } from 'servisofts-component';
import Model from '../../../Model';
import SSocket from 'servisofts-socket'
class Calificacion extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.UsuarioLogeado = this.props.state.usuarioReducer.usuarioLog.key;
        this.key = SNavigation.getParam("pk");
    }

    componentDidMount() {
        Model.calificacion.Action.getMediaByRestaurante(this.key).then((resp) => {
            this.setState({ media: resp.data });
        }).catch(e => {

        })
        Model.calificacion.Action.getComentarios(this.key).then((resp) => {
            this.setState({ data: resp.data });
        }).catch(e => {

        })
    }

    getEstrellas(data) {
        return (<SView col={"xs-11"} height={180} style={{ borderWidth: 1, borderColor: STheme.color.lightGray, borderRadius: 8 }} row center backgroundColor={STheme.color.card} >
            <SHr height={10} />
            <SView col={"xs-5"} center style={{ borderRightWidth: 1, borderColor: STheme.color.lightGray }}>
                <SIcon name={"CalEstrella"} width={60} fill={STheme.color.primary} />
            </SView>
            <SView col={"xs-7"} center >
                <SText color={STheme.color.darkGray} fontSize={24}>ESTRELLAS</SText>
                <SHr height={10} />
                <SView col={"xs-10"} center style={{ borderWidth: 2, borderColor: STheme.color.primary, backgroundColor: STheme.color.white, borderRadius: 8 }}>
                    <SText color={STheme.color.text} fontSize={32}>{parseFloat(data.star_media ?? 0).toFixed(0)}</SText>
                </SView>
            </SView>
            <SHr height={10} />
        </SView>)
    }

    getcalificacion1(data) {
        if (!data) return null;
        return (<SView col={"xs-11"} height={180} style={{ borderWidth: 1, borderColor: STheme.color.lightGray, borderRadius: 8, padding: 8 }} row center backgroundColor={STheme.color.card} >
            <SView col={"xs-5"} center style={{ borderRightWidth: 1, borderColor: STheme.color.lightGray }}>
                <SIcon name={"CalServicio"} width={60} fill={STheme.color.card} />
            </SView>
            <SView col={"xs-7"} center >
                <SText color={STheme.color.darkGray} fontSize={24}>SERVICIO</SText>
                <SHr height={10} />
                <SView col={"xs-10"} center style={{ borderWidth: 2, borderColor: STheme.color.primary, backgroundColor: STheme.color.white, borderRadius: 8 }}>
                    <SText color={STheme.color.text} fontSize={32}>{parseFloat(data.buen_servicio_media ?? 0).toFixed(0)}%</SText>
                </SView>
            </SView>
        </SView>)
    }

    getcalificacion2(data) {
        return (<SView col={"xs-11"} height={180} style={{ borderWidth: 1, borderColor: STheme.color.lightGray, borderRadius: 8, padding: 8 }} row center backgroundColor={STheme.color.card} >
            <SView col={"xs-5"} center style={{ borderRightWidth: 1, borderColor: STheme.color.lightGray }}>
                <SIcon name={"CalCalidad"} width={60} fill={STheme.color.card} />
            </SView>
            <SView col={"xs-7"} center >
                <SText color={STheme.color.darkGray} fontSize={24}>CALIDAD</SText>
                <SHr height={10} />
                <SView col={"xs-10"} center style={{ borderWidth: 2, borderColor: STheme.color.primary, backgroundColor: STheme.color.white, borderRadius: 8 }}>
                    <SText color={STheme.color.text} fontSize={32}>{parseFloat((data.buena_calidad_media ?? 0) * 100).toFixed(0)}%</SText>
                </SView>
            </SView>
        </SView>)
    }

    getcalificacion3(data) {
        return (<SView col={"xs-11"} height={180} style={{ borderWidth: 1, borderColor: STheme.color.lightGray, borderRadius: 8, padding: 8 }} row center backgroundColor={STheme.color.card} >
            {/* <SHr height={10} /> */}
            <SView col={"xs-5"} center style={{ borderRightWidth: 1, borderColor: STheme.color.lightGray }}>
                <SIcon name={"CalCantidad"} width={60} fill={STheme.color.card} />
            </SView>
            <SView col={"xs-7"} center >
                <SText color={STheme.color.darkGray} fontSize={24}>CANTIDAD</SText>
                <SHr height={10} />
                <SView col={"xs-10"} center style={{ borderWidth: 2, borderColor: STheme.color.primary, backgroundColor: STheme.color.white, borderRadius: 8 }}>
                    <SText color={STheme.color.text} fontSize={32}>{parseFloat((data.buena_cantidad_media ?? 0) * 100).toFixed(0)}%</SText>
                </SView>
            </SView>
            {/* <SHr height={10} /> */}
        </SView>)
    }

    // getComentarios() {
    //     return (<SView col={"xs-11"}  style={{ borderWidth: 1, borderColor: STheme.color.lightGray, borderRadius: 8 }} center backgroundColor={STheme.color.card} >
    //         <SHr height={10} />
    //         <SView col={"xs-5"} center style={{ borderRightWidth: 1, borderColor: STheme.color.lightGray }}>
    //             <SIcon name={"calComentario"} width={60} fill={STheme.color.card} />
    //         </SView>
    //         <SView col={"xs-7"} center >
    //             <SText color={STheme.color.darkGray} fontSize={24}>COMENTARIOS</SText>
    //         </SView>
    //         <SHr height={10} />
    //     </SView>)
    // }


    render_comentarios() {
        var usuarios = Model.usuario.Action.getAll();
        if (!this.state.data || !usuarios) return null;
        console.log(this.state.data);
        return <SList data={this.state.data}
            limit={5}
            order={[{ key: "fecha_on", type: "date", order: "desc" }]}
            render={(obj) => {
                var usuario = Model.usuario.Action.getByKey(obj.key_usuario);
                return <SView col={"xs-12"} card center style={{
                    padding: 4
                }}>
                    <SView col={"xs-12"} row center>
                        <SView width={30} height={30} card>
                            <SImage src={Model.usuario._get_image_download_path(SSocket.api, obj.key_usuario)} />
                        </SView>
                        <SView width={4} />
                        <SText bold >{usuario?.Nombres} {usuario?.Apellidos}</SText>
                        <SView flex />
                    </SView>
                    <SHr height={4} />
                    <SText col={"xs-12"}>{obj.comentario}</SText>
                    <SHr height={4} />
                    <SView col={"xs-12"} row>
                        <SView flex />
                        <SText fontSize={12}>{new SDate(obj.fecha_on).toString("yyyy-MM-dd hh:mm")}</SText>
                    </SView>
                </SView>
            }}
        />
    }

    render() {
        if (!this.state.media) return null;
        return (
            <>
                <SHr height={15} />
                {this.getEstrellas(this.state.media)}
                <SHr height={15} />
                {this.getcalificacion2(this.state.media)}
                <SHr height={15} />
                {this.getcalificacion3(this.state.media)}
                <SHr height={15} />
                {this.getcalificacion1(this.state.media)}
                <SHr height={100} />
                {this.render_comentarios()}
                <SHr height={100} />

            </>
        )
    }


}
const initStates = (state) => {
    return { state }
};
export default connect(initStates)(Calificacion);