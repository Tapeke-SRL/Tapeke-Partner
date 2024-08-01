
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SDate, SHr, SIcon, SImage, SList, SLoad, SMapView, SMapView2, SMarker, SNavigation, SPage, SPopup, SScrollView2, SText, STheme, SThread, SView } from 'servisofts-component';
import Model from '../Model';
import packageInfo from "../../package.json";
import SSocket from 'servisofts-socket';

const versionToNumber = (v) => {
    const array = v.split("\.");
    const vl = 100;
    let vn = 0;
    for (let i = 0; i < array.length; i++) {
        const element = array[array.length - i - 1];
        const vp = Math.pow(vl, i);
        vn += (vp * element)
    }
    console.log(vn)
    return vn;
}

class index extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
        };

    }

navigate=false;
    componentDidMount() {
        new SThread(1000, "loading_app").start(() => {
            if(this.navigate)return;
            if (!Model.usuario.Action.getKey()) {
                SNavigation.reset("/welcome");
            } else {
                var select = Model.restaurante.Action.getSelect()?.key;
                if (!select) {
                    SNavigation.reset("/root");
                } else {
                    SNavigation.reset("/restaurante", { pk: select });
                }


            }

        })
        console.log("sakdnalkdnaslkdnaslkdnaslkdnasldasnlkdnalksdnaslkdnsadas d;asl dalks jdlaskdlaksj");
        SSocket.sendPromise({
            component: "enviroment",
            type: "getByKey",
            key: "version_partner"
        }).then(e => {
            console.log(e);
            if (!e.data) return;
            const versionRequired = e.data
            if (versionToNumber(versionRequired) > versionToNumber(packageInfo.version)) {
                SNavigation.replace("/version_required")
                this.navigate=true;
                return;
            }
            // DataBaseContainer.sync();

        }).catch(e => {
            console.error(e)
        })
    }
    render() {
        return (
            <SPage center hidden disableScroll>
                <SView col={"xs-12"} height center>
                    <SIcon name='logoCompleto' width={100} height={100} fill={"#fff"} />
                    {/* <SText>cargando</SText> */}
                </SView>
            </SPage>
        );
    }
}
const initStates = (state) => {
    return { state }
};
export default connect(initStates)(index);