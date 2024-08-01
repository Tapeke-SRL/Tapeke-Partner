import React from 'react';
import { connect } from 'react-redux';
import { SText, SView, SHr, SDate, SImage, SLoad, STheme, STable } from 'servisofts-component';
import DetalleBox2 from './DetalleBox2';

class CardHistorialPedido extends React.Component {
    constructor(props) {
        super(props);

        this.data = this.props.data;
    }

    renderColorState({ state }) {
        if (state == "entregado") return STheme.color.accent;
        if (state == "cancelado" || state == "timeout_pago" || state == "no_recogido") return STheme.color.danger;
        return STheme.color.warning;
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
                <SView col={"xs-12"} flex row 
                    style={{
                        justifyContent: "space-between",
                        alignItems: "space-between",
                    }}
                >
                    <SView col={"xs-8"}>
                        <SView row>
                            <SText
                                font={'Montserrat-Regular'}
                                fontSize={12}
                            >
                                Cliente:
                            </SText>
                            {this.props.usuario ?
                                <SText
                                    style={{
                                        paddingLeft: 1,
                                        maxWidth: 180,
                                    }}
                                    fontSize={12}
                                    font={'Montserrat-Regular'}
                                >{this.props.usuario.Nombres} {this.props.usuario.Apellidos}</SText>
                                : <SLoad />
                            }
                        </SView>
                        <SText fontSize={12}>{new SDate(this.data?.fecha_on, "yyyy-MM-ddThh:mm:ss").toString("dd de MONTH | hh:mm hrs.")}</SText>
                        <SText fontSize={10} color={this.renderColorState({ state: this.data?.state })}>{(this.data?.state).toUpperCase()}</SText>
                    </SView>
                    <SView col={"xs-4"} center>
                        <SText
                            font={'Montserrat-Regular'}
                            fontSize={12}
                        >
                            #{this.data.key.slice(0, 6)}
                        </SText>
                        <SText fontSize={10}>Código de pedido</SText>
                    </SView>
                </SView>

                <SView col={"xs-12"} >
                    <DetalleBox2 data={this.data} interline={0} padding={0} fontSize={10.5} />

                    <SHr height={10} />
                    <SView row
                        style={{ justifyContent: 'space-between', width: "100%" }}
                    >
                        <SText>Ver detalles del pedido</SText>
                    </SView>
                </SView>
            </SView>
        )
    }


}
const initStates = (state) => {
    return { state }
};
export default connect(initStates)(CardHistorialPedido);