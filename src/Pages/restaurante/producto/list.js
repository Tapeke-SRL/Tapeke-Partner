import React, { Component } from 'react';
import { View, Text, ScrollView, StyleSheet, SectionList, Vibration } from 'react-native';
import { SIcon, SImage, SLoad, SNavigation, SPage, SText, STheme, SThread, SView } from 'servisofts-component';
import TopBar from '../../../Components/TopBar';
import SSocket from 'servisofts-socket';



const renderSectionSeparator = () => (
    <View style={styles.sectionSeparator} />
);


const BtnEditar = ({ onPress }) => {
    return <SView width={30} height={30} onPress={onPress}>
        <SImage src={require("../../../Assets/img/EDITAR2.png")} />
    </SView>
}

export default class list extends Component {
    static TOPBAR = <TopBar type={"default"} title='Productos' />
    constructor(props) {
        super(props);
        this.state = {
            openSections: {}
        };
        this.key_restaurante = SNavigation.getParam("key_restaurante")

    }
    componentDidMount() {
        if (!this.key_restaurante) {
            SNavigation.goBack();
            return;
        }
        new SThread(100).start(() => {
            this.setState({ ready: true })
        })
        this.getData();
    }

    async getData() {
        const categorias = await SSocket.sendPromise({
            component: "categoria_producto",
            type: "getAll",
            key_restaurante: this.key_restaurante
        })

        const productos = await SSocket.sendPromise({
            component: "producto",
            type: "getAll",
            key_restaurante: this.key_restaurante
        })

        let ARRAY = [];
        Object.values(categorias.data).map(categoria => {
            const data = Object.values(productos.data).filter(prd => prd.estado > 0 && prd.key_categoria_producto == categoria.key)
            ARRAY.push({
                ...categoria,
                cantidad: data.length,
                data: data

            })
            // categoria.productos = 
        })
        ARRAY = ARRAY.sort((a, b) => a.index - b.index)
        this.setState({ data: ARRAY })
    }
    render() {
        if (!this.state.ready) return <SLoad />
        if (!this.state.data) return <SLoad />
        const renderItem = ({ item }) => (
            <SView col={"xs-12"} row >
                <View style={styles.item}>
                    <SView col={"xs-12"} row>
                        <SView style={{ width: 40, height: 40, borderRadius: 4, overflow: "hidden" }} card>
                            <SImage src={SSocket.api.root + "producto/.128_" + item.key} style={{
                                resizeMode: "cover"
                            }} />
                        </SView>
                        <SView width={8} />
                        <SView flex style={{ justifyContent: "center" }}>
                            <SText style={{ fontSize: 12, }} bold>{item?.nombre}</SText>
                            <SText style={{ fontSize: 10, color: STheme.color.lightGray }} >{"Sin subproductos"}</SText>
                        </SView>
                        <SView height style={{ justifyContent: "center" }}>
                            <SText style={{ fontSize: 10, color: STheme.color.lightGray }} >{"Disponible"}</SText>
                        </SView>
                    </SView>
                </View >
                <SView width={40} center height>
                    <BtnEditar />
                </SView>
            </SView >
        );

        const renderSectionHeader = ({ section }) => (
            <SView width={"100%"} row>
                <SView style={[styles.header, this.state.openSections[section.key] ? {
                    borderBottomLeftRadius: 0,
                    borderBottomRightRadius: 0,
                } : {

                }]} onPress={() => {
                    Vibration.vibrate(300)
                    if (!this.state.openSections[section.key]) {
                        this.state.openSections[section.key] = section
                    } else {
                        delete this.state.openSections[section.key]
                    }
                    this.setState({ ...this.state })
                }} row>
                    <SView flex>
                        <SText style={{ fontSize: 14, }} bold>{section?.nombre}</SText>
                        <SText color={STheme.color.lightGray} fontSize={12}>{section.cantidad > 0 ? section.cantidad + " productos" : "Sin productos"}</SText>
                    </SView>
                    <SView height center>
                        <SView width={16} height={16} style={{
                            transform: [
                                { rotate: this.state.openSections[section.key] ? "90deg" : "270deg" }
                            ]
                        }}>
                            <SIcon name='Back' fill={STheme.color.lightGray} />
                        </SView>
                    </SView>
                </SView>
                <SView width={40} center height>
                    {!this.state.openSections[section.key] ? <BtnEditar /> : null}
                </SView>
            </SView>
        );
        const renderEmptySection = () => (
            <View style={styles.emptySection} />
        );

        return <SectionList
            contentContainerStyle={{
                padding: 8,
                width: "100%",

            }}
            sections={this.state.data.map(sec => ({
                ...sec,
                data: this.state.openSections[sec.key] ? sec.data : [renderEmptySection]
            }))}
            keyExtractor={(item, index) => item.key}
            // SectionSeparatorComponent={renderSectionSeparator}
            renderItem={({ item, index }) => (typeof item === 'function' ? item() : renderItem({ item, index }))}
            renderSectionHeader={renderSectionHeader}
            // ItemSeparatorComponent={() => <View style={styles.sectionSeparator} />}
            SectionSeparatorComponent={(d) => {
                if (d.trailingItem) return null;
                return <View style={styles.sectionSeparator} />
            }}

        />
    }
}

const styles = StyleSheet.create({
    item: {
        flex: 1,
        padding: 8,
        paddingTop: 12,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: "#CCC",
    },
    title: {
        fontSize: 16,
    },

    header: {
        flex: 1,
        padding: 8,
        paddingTop: 16,
        paddingBottom: 16,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
        borderWidth: 1,
        borderColor: "#DDD",
        // backgroundColor: '#f4f4f4',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    sectionSeparator: {
        height: 12,
        width: "100%",
    },
    emptySection: {
        height: 0,
    },
});
