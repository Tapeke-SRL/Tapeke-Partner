import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SHr, SIcon, SInput, SList, SLoad, SPage, SScroll, SText, STheme, SThread, SView } from 'servisofts-component';
import Model from '../../../Model';

class PopupAutoCompleteDireccion extends Component {
    constructor(props) {
        super(props);
        this.state = {
            locations: [
                {
                    "types": [
                        "shopping_mall",
                        "point_of_interest",
                        "establishment"
                    ],
                    "direccion": "Ventura Mall, esq. 4 ring, Avenida San Martín, Santa Cruz de la Sierra, Bolivia",
                    "place_id": "ChIJj536OYvn8ZMRPs7mR4esXdw"
                },
                {
                    "types": [
                        "restaurant",
                        "food",
                        "point_of_interest",
                        "establishment"
                    ],
                    "direccion": "Ventura Boulevard, Santa Cruz de la Sierra, Bolivia",
                    "place_id": "ChIJnyZYBQXn8ZMRPQDrmRb1Qm4"
                },
                {
                    "types": [
                        "point_of_interest",
                        "establishment"
                    ],
                    "direccion": "Ventura Arena, Santa Cruz de la Sierra, Bolivia",
                    "place_id": "ChIJz0dUoYvn8ZMRvfqdnnQe5IU"
                },
                {
                    "types": [
                        "local_government_office",
                        "point_of_interest",
                        "establishment"
                    ],
                    "direccion": "SEGIP Ventura Mall, Santa Cruz de la Sierra, Bolivia",
                    "place_id": "ChIJe5HUkYDn8ZMRtMdIMawbhXY"
                },
                {
                    "types": [
                        "point_of_interest",
                        "establishment"
                    ],
                    "direccion": "VENTURA FACTORY, Santa Cruz de la Sierra, Bolivia",
                    "place_id": "ChIJ-9x4q8vn8ZMRj-VPa0ijA6M"
                }
            ]
        };
    }

    render_data() {
        if (this.state.loading) return <SLoad />
        if (!this.state.locations) return <SText col={"xs-12"} center>Sin resultados</SText>

        return <SList
            col={"xs-12"}
            data={this.state.locations}
            limit={5}
            render={(obj) => {
                return <SView col={"xs-12"} height={64} row center border={"transparent"}>
                    <SView width={50} height={64} center>
                        <SView height={36} width={36} style={{ backgroundColor: '#E9EAEE', borderRadius: 50, }} center>
                            <SIcon name={'Marker'} height={24} width={40} fill={'#484848'} />
                        </SView>
                    </SView>
                    <SView width={8} />
                    <SView flex height={64} style={{ borderBottomWidth: 1, borderColor: STheme.color.lightGray, justifyContent: 'center', }}
                        onPress={() => {
                            Model.locationGoogle.Action.detail({ place_id: obj.place_id }).then(resp => {
                                if (this.props.callback) {
                                    this.props.callback({
                                        direccion: obj.direccion,
                                        latitude: resp.data.latitude,
                                        longitude: resp.data.longitude,
                                    })
                                }
                            }).catch(e => {
                                console.error(e);
                            })
                            // var aux = this.setState({ place_id: obj.place_id, direccion: obj.direccion });
                        }} >
                        <SText fontSize={12}   color={STheme.color.gray} >{obj.direccion}</SText>
                    </SView>
                </SView>
            }} />
    }
    render() {
        return (<SView col={"xs-11 sm-10 md-8 lg-6 xl-4"} backgroundColor={STheme.color.secondary}
            style={{
                borderRadius: 16,
                overflow: "hidden",
                padding: 8,
            }} withoutFeedback>
            <SHr />
            <SInput col={"xs-12"} placeholder={"Escribir direccion..."} style={{ borderWidth: 0, height: "100%" }}
                color={STheme.color.text} placeholderTextColor={STheme.color.gray} height={40} fontSize={12}
                onChangeText={(text) => {
                    // this.setState({ find: text })
                    if (text.length <= 3) {
                        this.setState({ locations: null })
                        return;
                    }

                    new SThread(600, "hilo_auto_complete_location", true).start(() => {
                        this.setState({ loading: true })
                        Model.locationGoogle.Action.autocomplete({
                            ...this.props.region,
                            direccion: text,
                        }).then(resp => {
                            this.state.locations = resp.data;
                            this.setState({ loading: false })
                            console.log(resp);
                        }).catch(e => {
                            this.setState({ loading: false })
                            console.error(e);
                        })
                    })

                }}
            />
            <SHr />
            <SView col={"xs-12"} height={350}>
                <SScroll>
                    {this.render_data()}
                </SScroll>
            </SView>
        </SView>
        );
    }
}
const initStates = (state) => {
    return { state }
};
export default connect(initStates)(PopupAutoCompleteDireccion);