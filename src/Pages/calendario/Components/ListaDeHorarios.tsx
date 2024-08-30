import React from 'react';
import { FlatList } from 'react-native';
import {
    SHr,
    SImage,
    SLoad,
    SPage,
    SPopup,
    SText,
    STheme,
    SView,
} from 'servisofts-component';
import SSocket from 'servisofts-socket';
import PopupErrorHorario from './PopupErrorHorario';
import EditarHorario from './EditarHorario';
import Model from '../../../Model';

const Dias = [
    { label: 'Lunes', dia: '0' },
    { label: 'Martes', dia: '1' },
    { label: 'Miercoles', dia: '2' },
    { label: 'Jueves', dia: '3' },
    { label: 'Viernes', dia: '4' },
    { label: 'Sabado', dia: '5' },
    { label: 'Domingo', dia: '6' },
];
export default class ListaDeHorarios extends React.Component<{
    key_restaurante: string;
    edit?: any;
}> {
    state: any = {};
    componentDidMount(): void {
        SSocket.sendPromise({
            component: 'horario',
            type: 'getAll',
            key_restaurante: this.props.key_restaurante,
        })
            .then((e: any) => {
                let dataDias: any = {
                    '0': [],
                    '1': [],
                    '2': [],
                    '3': [],
                    '4': [],
                    '5': [],
                    '6': [],
                };
                Object.values(e.data).map((a: any) => {
                    dataDias[a.dia + ''].push(a);
                });
                this.setState({ data: dataDias });
            })
            .catch(e => {
                console.error(e);
            });
    }
    renderHorarios(item: any) {
        // let dataDia = null
        if (!this.state.data) return <SLoad />;
        const dataDia = this.state.data[item.dia];
        // console.log(dataDia)
        if (dataDia.length <= 0)
            return (
                <SText fontSize={12} font={'Montserrat-Medium'}>
                    {'Cerrado'}
                </SText>
            );
        return dataDia
            .sort((a: any, b: any) => (a.hora_inicio > b.hora_inicio ? 1 : -1))
            .map((obj: any) => {
                return (
                    <SText fontSize={12} font={'Montserrat-Medium'}>
                        {obj.hora_inicio} - {obj.hora_fin}
                    </SText>
                );
            });
        {
            /* {!dataDia ? <SLoad /> : this.renderHorarios()} */
        }
    }

    render() {
        return (
            <FlatList
                style={{
                    width: '100%',
                }}
                data={Dias}
                ItemSeparatorComponent={() => {
                    return (
                        <SView
                            col={'xs-12'}
                            height={2}
                            style={{
                                borderBottomWidth: 1,
                                borderColor: STheme.color.lightGray,
                            }}
                        />
                    );
                }}
                renderItem={({ index, item }) => {
                    return (
                        <SView
                            col={'xs-12'}
                            row
                            center
                            style={{ minHeight: 60, paddingTop: 5 }}
                        >
                            <SView
                                width={100}
                                style={{
                                    justifyContent: 'center',
                                }}
                            >
                                <SText font={'Montserrat-Medium'}>
                                    {item.label}
                                </SText>
                            </SView>
                            <SView
                                flex
                                style={{
                                    alignItems: 'flex-end',
                                    justifyContent: 'center',
                                }}
                            >
                                {this.renderHorarios(item)}
                            </SView>
                            <SView width={8} />
                            {!this.props.edit ? null : (
                                <SView
                                    width={30}
                                    height={30}
                                    padding={2}
                                    onPress={() => {
                                        this.setState({ onEdit: item });
                                    }}
                                >
                                    <SImage
                                        src={require('../../../Assets/img/EDITAR2.png')}
                                    />
                                </SView>
                            )}
                        </SView>
                    );
                }}
                ListFooterComponent={() => {
                    const item = this.state.onEdit;
                    if (!item) return null;
                    if (!this.state.data) return <SLoad />;
                    const dataDia = this.state.data[item.dia];
                    return (
                        <EditarHorario
                            key_restaurante={this.props.key_restaurante}
                            dia={item}
                            data={dataDia}
                            onSave={e => {
                                SSocket.sendPromise({
                                    component: 'horario',
                                    type: 'editarNuevo',
                                    key_restaurante: this.props.key_restaurante,
                                    key_usuario: Model.usuario.Action.getKey(),
                                    dia: item.dia,
                                    data: e,
                                })
                                    .then(res => {
                                        console.log(res);
                                        this.state.data[item.dia] = e;
                                        this.setState({ onEdit: null });
                                    })
                                    .catch(err => {
                                        if (err.error) {
                                            SPopup.open({
                                                key: 'PopupErrorHorario',
                                                content: (
                                                    <PopupErrorHorario
                                                        errorHorario={err.error}
                                                    />
                                                ),
                                            });
                                        }
                                        console.log(err);
                                    });
                            }}
                        />
                    );
                }}
            />
        );
    }
}
