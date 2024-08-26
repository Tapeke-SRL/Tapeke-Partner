import React from 'react';
import { connect } from 'react-redux';
import { SText, SView, SHr, SDate, SImage, SLoad, STheme, STable } from 'servisofts-component';
import Model from '../../../Model';
import SSocket from 'servisofts-socket'
class CardCalificacionPedido extends React.Component {
    constructor(props) {
        super(props);

        this.data = this.props.data;
    }

    render() {
        return (
            <SView key={this.data?.key} col={"xs-12"} center
                border={STheme.color.lightGray}
                style={{
                    padding: 14,
                    borderRadius: 12
                }}
            >
                <SView col={"xs-12"} row center>
                    <SView>
                        <SView row>
                            {/* <SText font={'Montserrat-Regular'} fontSize={12}>Cliente:</SText> */}
                            <SText font={'Montserrat'} fontSize={12}>Cliente:</SText>
                            {this.props.usuario ?
                                <SText
                                    style={{
                                        paddingLeft: 1,
                                        maxWidth: 180,
                                    }}
                                    fontSize={12}
                                    // font={'Montserrat-Regular'}
                                    font={'Montserrat'}
                                >{this.props.usuario.Nombres} {this.props.usuario.Apellidos}</SText>
                                : <SLoad />
                            }
                        </SView>

                        <SText fontSize={12}>{new SDate(this.data?.fecha_on).toString("yyyy-MM-dd hh:mm")}</SText>
                        <SText fontSize={12}>Código de pedido: #{this.data?.key.slice(0, 6)}</SText>
                    </SView>

                    <SView flex>
                        <SView center row
                            style={{
                                position: 'absolute',
                                top: -14,
                                right: 7
                            }}
                        >
                            <SView height={55} width={35}>
                                <SImage src={require('../../../Assets/img/estrella_calificacion_pedido.png')} style={{ resizeMode: "cover" }} />
                            </SView>
                            <SText
                                center
                                font={'Montserrat-Medium'}
                                fontSize={this.data?.pedido_star ? 40 : 20}
                                style={{
                                    paddingLeft: 5
                                }}
                            >{this.data?.pedido_star ? this.data?.pedido_star : "No Califico"}</SText>
                        </SView>
                    </SView>
                </SView>

                <SHr h={10} />

                <SView col={"xs-12"}>
                    <SText >Comentario:</SText>
                    <SHr />
                    <SView card
                        style={{
                            padding: 10
                        }}
                    >
                        <SText
                            col={"xs-12"}
                            font={'Montserrat-Medium'}
                            color={this.data?.comentario ? STheme.color.text : STheme.color.gray}
                        >{this.data?.comentario ? this.data?.comentario : "Sin Comentario"}</SText>
                    </SView>
                </SView>
            </SView >
        )
    }


}
const initStates = (state) => {
    return { state }
};
export default connect(initStates)(CardCalificacionPedido);