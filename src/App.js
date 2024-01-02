import React from 'react';
import { Platform } from 'react-native'
import { SComponentContainer, SNavigation, SText, STheme } from 'servisofts-component';
import SSocket, { setProps } from 'servisofts-socket';
import Redux, { store } from './Redux';
import Config from "./Config";
import Assets from './Assets';
import Pages from './Pages';
import NavBar from './Components/NavBar';
import packageInfo from "../package.json"

import Firebase from './Firebase';
import DeviceKey from './Firebase/DeviceKey';
import ErrorBoundary from './Components/ErrorBoundary';

setProps(Config.socket);
Firebase.init();
DeviceKey.init();
const App = (props) => {
    return <Redux>
        <ErrorBoundary>
            <SComponentContainer
                // debug
                socket={SSocket}
                assets={Assets}
                inputs={Config.inputs}
                theme={{ themes: Config.theme, initialTheme: "default" }}
            >
                <SNavigation
                    props={{
                        title: 'Tapeke Partner', pages: Pages,
                        // validator: Validator
                    }}
                />
                <SSocket
                    store={store}
                    identificarse={(props) => {
                        var usuario = props.state.usuarioReducer.usuarioLog;
                        // console.log(DeviceKey.getKey());
                        return {
                            data: usuario ? usuario : {},
                            deviceKey: DeviceKey.getKey(),
                            firebase: {
                                platform: Platform.OS,
                                token: DeviceKey.getKey(),
                                key_usuario: usuario?.key,
                                app: Config.appName
                            }
                        };
                    }}
                />
                <NavBar />
                <SText style={{ position: "absolute", bottom: 2, right: 2, zIndex: 0, }} disabled fontSize={10} color={STheme.color.lightGray}>v{packageInfo.version}</SText>
            </SComponentContainer>
        </ErrorBoundary>
    </Redux>
}
export default App;