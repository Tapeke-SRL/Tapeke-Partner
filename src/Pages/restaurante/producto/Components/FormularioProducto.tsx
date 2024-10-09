import React, {
    Component,
    forwardRef,
    useImperativeHandle,
    useRef,
    useState,
} from 'react';
import {
    Switch,
    View,
    Text,
    TextInput,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import {
    SHr,
    SSwitch,
    SNavigation,
    SView,
    STheme,
    SText,
    SForm,
    SPopup,
    SNotification,
} from 'servisofts-component';
import Input from './Input';

const color = '#000000';
const colorGray = '#999999';
const colorGray2 = '#BBBBBB';
const colorCard = '#EEEEEE';
const font = 'Montserrat';

export default class FormularioProducto extends Component<any> {
    _inputs: any = {};
    // static TOPBAR = <TopBar type={"usuario_back"} />

    state: any;
    constructor(props: any) {
        super(props);
        this.state = {
            mayor_edad: this.props.producto?.mayor_edad ?? false,
            ley_seca: this.props.producto?.ley_seca ?? false,

            descuento_monto: this.props.producto?.descuento_monto ?? 0,
            descuento_porcentaje:
                this.props.producto?.descuento_porcentaje ?? 0,
        };
    }

    handleChange_descuento(data: any, val: any) {
        if (val) {
            SPopup.openContainer({
                render: (props: {close: () => void}) => {
                    return (
                        <SView col={'xs-11'} center>
                            <SHr h={30} />
                            <SText bold>Crear un descuento de producto</SText>
                            <SHr />
                            <SForm
                                inputs={{
                                    descuento_monto: {
                                        label: 'Descuento Monto',
                                        type: 'number',
                                    },
                                    descuento_porcentaje: {
                                        label: 'Descuento Porcentaje',
                                        type: 'number',
                                    },
                                }}
                                onSubmitName={'ACEPTAR'}
                                onSubmit={(val: {
                                    descuento_porcentaje: string;
                                    descuento_monto: string;
                                }) => {
                                    props.close();

                                    let descuento_monto = parseFloat(
                                        val.descuento_monto
                                    );

                                    let descuento_porcentaje = parseFloat(
                                        val.descuento_porcentaje
                                    );

                                    if (descuento_porcentaje) {
                                        if (descuento_monto > 0) {
                                            SNotification.send({
                                                body: 'Solo puede asignar un solo descuento a las vez.',
                                                time: 5000,
                                                color: STheme.color.danger,
                                                title: 'Error',
                                            });
                                            return;
                                        }

                                        if (descuento_porcentaje <= 100) {
                                            descuento_porcentaje =
                                                descuento_porcentaje / 100;
                                        } else {
                                            SNotification.send({
                                                body: 'El porcentaje del descuento tiene que estar entre 0 y 100',
                                                time: 5000,
                                                color: STheme.color.danger,
                                                title: 'Error',
                                            });
                                            return;
                                        }
                                    }

                                    if (descuento_monto) {
                                        if (descuento_porcentaje > 0) {
                                            SNotification.send({
                                                body: 'Solo puede asignar un solo descuento a las vez.',
                                                time: 5000,
                                                color: STheme.color.danger,
                                                title: 'Error',
                                            });
                                            return;
                                        }

                                        if (
                                            descuento_monto >
                                            this._inputs['precio'].getValue()
                                        ) {
                                            SNotification.send({
                                                body: 'El descuento monto no puede ser mayor al precio del producto.',
                                                time: 5000,
                                                color: STheme.color.danger,
                                                title: 'Error',
                                            });
                                            return;
                                        }
                                    }

                                    this.setState({
                                        descuento_monto: descuento_monto
                                            ? descuento_monto
                                            : 0,
                                        descuento_porcentaje:
                                            descuento_porcentaje
                                                ? descuento_porcentaje
                                                : 0,
                                    });
                                }}
                            />
                            <SHr h={30} />
                        </SView>
                    );
                },
                key: undefined,
            });
        } else {
            SPopup.confirm({
                title: '¿Esta seguro de desactivar el descuento producto?',
                onPress: () => {
                    this.setState({
                        descuento_monto: 0,
                        descuento_porcentaje: 0,
                    });
                },
            });
        }
    }

    handleGuardar() {
        let resp: any = {};
        Object.keys(this._inputs).map(k => {
            resp[k] = this._inputs[k].getValue();
        });

        this.props.producto.nombre = resp.nombre;
        this.props.producto.index = resp.index;
        this.props.producto.descripcion = resp.descripcion;
        this.props.producto.key_categoria_producto =
            resp.key_categoria_producto;
        this.props.producto.precio = resp.precio;
        this.props.producto.limite_compra = resp.limite_compra;
        this.props.producto.mayor_edad = this.state.mayor_edad; // Guardar el estado del Switch
        this.props.producto.ley_seca = this.state.ley_seca; // Guardar el estado del Switch

        this.props.producto.categoria =
            this._inputs['key_categoria_producto'].getData();

        this.props.producto.key_restaurante = this.props.key_restaurante;

        this.props.producto.descuento_porcentaje =
            this.state.descuento_porcentaje;
        this.props.producto.descuento_monto = this.state.descuento_monto;

        return resp;
    }

    componentDescuento(producto: any) {
        let descuentoMonto =
            producto.descuento_monto || producto.descuento_monto > 0
                ? true
                : false;
        let descuentoPorcentaje =
            producto.descuento_porcentaje || producto.descuento_porcentaje > 0
                ? true
                : false;

        let descuentoBool = descuentoMonto || descuentoPorcentaje;

        let colorDescuentoMontoText =
            producto?.descuento_monto || producto?.descuento_monto > 0
                ? '#000'
                : STheme.color.gray;
        let colorDescuentoPorcentajeText =
            producto?.descuento_porcentaje || producto?.descuento_porcentaje > 0
                ? '#000'
                : STheme.color.gray;

        return (
            <SView col={'xs-6'} style={{}}>
                <SView
                    row
                    flex
                    style={{
                        padding: 10,
                        backgroundColor: '#F5F5F5',
                        borderWidth: 1,
                        borderColor: '#DDD',
                        borderTopStartRadius: 10,
                        borderTopEndRadius: 10,
                        justifyContent: 'space-evenly',
                    }}
                >
                    <SText center fontSize={10} font={'Montserrat-Bold'}>
                        APLICAR DESCUENTO
                    </SText>
                    <SSwitch
                        key={producto?.key}
                        size={15}
                        scale={2.3}
                        color={STheme.color.white}
                        onChange={this.handleChange_descuento.bind(
                            this,
                            producto
                        )}
                        value={descuentoBool}
                    />
                </SView>
                <SView
                    row
                    style={{
                        padding: 10,
                        borderLeftWidth: 1,
                        borderRightWidth: 1,
                        borderColor: '#DDD',
                        justifyContent: 'space-between',
                    }}
                >
                    <SText flex fontSize={11} color={colorDescuentoMontoText}>
                        Descuento Monto
                    </SText>
                    <SText fontSize={11} color={colorDescuentoMontoText}>
                        Bs. {producto?.descuento_monto ?? 0}
                    </SText>
                </SView>
                <SView
                    row
                    style={{
                        padding: 10,
                        borderWidth: 1,
                        borderColor: '#DDD',
                        borderBottomStartRadius: 10,
                        borderBottomEndRadius: 10,
                        justifyContent: 'space-between',
                    }}
                >
                    <SText
                        flex
                        fontSize={11}
                        color={colorDescuentoPorcentajeText}
                    >
                        Descuento Porcentaje
                    </SText>
                    <SText fontSize={11} color={colorDescuentoPorcentajeText}>
                        {producto?.descuento_porcentaje * 100}%
                    </SText>
                </SView>
                <SHr />
                <SText center fontSize={9} color={'#CCCCCC'}>
                    Descuento al precio del produco. El cliente podrá ver el
                    precio original y el precio final con descuento.
                </SText>
            </SView>
        );
    }

    render() {
        const data = this.props.producto ?? {};
        return (
            <SView col={'xs-12'}>
                <SView
                    row
                    col={'xs-12'}
                    style={{
                        justifyContent: 'space-between',
                    }}
                >
                    <Input
                        ref={ref => (this._inputs['nombre'] = ref)}
                        col={'xs-7'}
                        defaultValue={data.nombre}
                        label={'Nombre del Producto/Item *'}
                        info={'Ejemplo: Hamburguesa clasica, Pir de limón'}
                        placeholder={'Nombre del Producto/Item'}
                        onSubmitEditing={() => this._inputs['index'].focus()}
                    />
                    <Input
                        ref={ref => (this._inputs['index'] = ref)}
                        col={'xs-4.5'}
                        label={'Index *'}
                        defaultValue={(data.index ?? '') + ''}
                        filter={(e: any) => {
                            return e.replace(/[^0-9]/g, '');
                        }}
                        info={'Orden de posicionamiento en lista'}
                        placeholder={'0'}
                        keyboardType={'numeric'}
                        onSubmitEditing={() =>
                            this._inputs['descripcion'].focus()
                        }
                    />
                </SView>
                <SHr h={16} />
                <Input
                    ref={ref => (this._inputs['descripcion'] = ref)}
                    col={'xs-12'}
                    defaultValue={data.descripcion}
                    label={'Descripción del Producto/Item'}
                    info={'Ejemplo: 150gr carne, queso cheddar, tocino.'}
                    placeholder={'Descripción del Producto/Item'}
                    multiline
                    height={70}
                    inputStyle={{
                        paddingTop: 8,
                        textAlignVertical: 'top',
                    }}
                    onSubmitEditing={() =>
                        this._inputs['key_categoria_producto'].focus()
                    }
                />
                <SHr h={16} />
                <SView
                    row
                    col={'xs-12'}
                    style={{
                        justifyContent: 'space-between',
                    }}
                >
                    <Input
                        ref={ref =>
                            (this._inputs['key_categoria_producto'] = ref)
                        }
                        col={'xs-7'}
                        onPress={(e: any) => {
                            SNavigation.navigate(
                                '/restaurante/categoria_producto/list',
                                {
                                    key_restaurante: this.props.key_restaurante,
                                    onSelect: (cp: any) => {
                                        console.log(cp);
                                        this._inputs[
                                            'key_categoria_producto'
                                        ].setValue(cp.key);
                                        this._inputs[
                                            'key_categoria_producto'
                                        ].setData(cp);
                                    },
                                }
                            );
                        }}
                        defaultData={data.categoria}
                        renderValue={({data, value}) => {
                            return data?.nombre;
                        }}
                        defaultValue={data.key_categoria_producto}
                        label={'Categoría *'}
                        info={'Ejemplo: Hamburgesas, Bebidas, Postres'}
                        placeholder={'Elegi una Categoría'}
                        onSubmitEditing={() => this._inputs['precio'].focus()}
                    />

                    <Input
                        ref={ref => (this._inputs['limite_compra'] = ref)}
                        col={'xs-4.5'}
                        defaultValue={data.limite_compra}
                        label={'Límite de Compra *'}
                        filter={(e: any) => {
                            return e.replace(/[^0-9]/g, '');
                        }}
                        info={
                            'Cantidad de productos/items que se podrá comprar en cada pedido, si pones 0 no abra limite.'
                        }
                        placeholder={'0'}
                        keyboardType={'numeric'}
                    />
                </SView>
                <SHr h={16} />
                <SView
                    row
                    col={'xs-12'}
                    style={{
                        justifyContent: 'space-between',
                    }}
                >
                    <SView row col={'xs-7'}>
                        <SText flex fontSize={11} font={'Montserrat-Bold'}>
                            Mayor de edad:
                        </SText>
                        <SSwitch
                            key={this.state.mayor_edad}
                            scale={2.3}
                            size={16}
                            color={STheme.color.white}
                            onChange={value =>
                                this.setState({mayor_edad: value})
                            }
                            value={this.state.mayor_edad}
                        />
                    </SView>

                    <SView row col={'xs-4.5'}>
                        <SText flex fontSize={11} font={'Montserrat-Bold'}>
                            Ley Seca:
                        </SText>
                        <SSwitch
                            key={this.state.ley_seca}
                            scale={2.3}
                            size={16}
                            color={STheme.color.white}
                            onChange={value => this.setState({ley_seca: value})}
                            value={this.state.ley_seca}
                        />
                    </SView>
                </SView>
                <SHr h={16} />
                <SView row center col={'xs-12'}>
                    <Input
                        ref={ref => (this._inputs['precio'] = ref)}
                        col={'xs-4.5'}
                        label={'Precio Bs. *'}
                        defaultValue={
                            !data.precio
                                ? null
                                : parseFloat(data.precio).toFixed(2)
                        }
                        keyboardType={'numeric'}
                        // info={"Orden de posicionamiento en lista"}
                        filter={(e: any) => {
                            // Permite solo números, un único punto o coma
                            let numericText = e.replace(/[^0-9.,]/g, '');

                            // Reemplaza comas con puntos para manejar ambos como decimales
                            numericText = numericText.replace(/,/g, '.');

                            const parts = numericText.split('.');

                            if (parts.length > 2) {
                                // Si hay más de un punto, elimina los extras
                                numericText = parts[0] + '.' + parts[1];
                            }

                            if (parts[1] && parts[1].length > 2) {
                                // Limita a dos decimales
                                numericText =
                                    parts[0] + '.' + parts[1].slice(0, 2);
                            }
                            return numericText;
                        }}
                        placeholder={'Bs. 0,00'}
                        onSubmitEditing={() =>
                            this._inputs['limite_compra'].focus()
                        }
                    />
                </SView>
                <SHr h={16} />
                <SView center>
                    {this.componentDescuento({
                        descuento_monto: this.state.descuento_monto,
                        descuento_porcentaje: this.state.descuento_porcentaje,
                    })}
                </SView>
            </SView>
        );
    }
}
