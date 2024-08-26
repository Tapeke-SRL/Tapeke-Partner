import React from 'react';
import { connect } from 'react-redux';
import { SText, SView, SHr, SDate, STheme, SNavigation } from 'servisofts-component';
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
                <SView col={"xs-12"} row
                    style={{
                        justifyContent: 'space-between'
                    }}
                >
                    <SView >
                        <SView row flex>
                            <SText
                                // font={'Montserrat-Regular'}
                                font={'Montserrat'}
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
                                    // font={'Montserrat-Regular'}
                                    font={'Montserrat'}
                                >{this.props.usuario.Nombres} {this.props.usuario.Apellidos}</SText>
                                : <SText>No se pillo el usuario</SText>
                            }
                        </SView>
                        <SText fontSize={12}>{new SDate(this.data?.fecha_on, "yyyy-MM-ddThh:mm:ss").toString("dd de MONTH | hh:mm hrs.")}</SText>
                        <SText fontSize={10} color={this.renderColorState({ state: this.data?.state })}>{(this.data?.state).replace(/_/g, " ").toUpperCase()}</SText>
                    </SView>
                    <SView center>
                        <SText
                            // font={'Montserrat-Regular'}
                            font={'Montserrat'}
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
                    <SView row center width>
                        <SText backgroundColor={STheme.color.lightGray} fontSize={12} padding={4} borderRadius={5}
                            onPress={() => {
                                SNavigation.navigate('/pedido', { pk: this.data.key })
                            }}
                        >Ver detalles del pedido</SText>
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