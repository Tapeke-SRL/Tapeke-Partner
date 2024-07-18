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
try {
    if (Platform.OS == "web") {
        if ((window.location.href + "").startsWith("https")) {
            Firebase.init();
        } else if ((window.location.href + "").startsWith("http://localhost")) {
            Firebase.init();
        } else {
            console.log("No se activara el Fireabase Por que no contamos con SSL")
        }
    } else {
        Firebase.init();
    }
} catch (e) {
    console.log(e);
}

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
                    linking={{
                        prefixes: ["https://partner.tapekeapp.com/", "http://partner.tapekeapp.com/"],
                        getInitialURL: () => {
                            // Firebase.getInitialURL(); // TODO volver a activar
                        }
                    }}
                />
                <SSocket
                    store={store}
                    identificarse={(props) => {
                        var usuario = props.state.usuarioReducer.usuarioLog;
                        // console.log(DeviceKey.getKey());
                        let tags = {
                            platform: Platform.OS,
                            user_type: "undefined",
                            app: Config.appName,
                            app_version: packageInfo.version
                        };
                        if (usuario) {
                            tags["key_usuario"] = usuario?.key;
                            // tags["user_type"] = "admin"
                        }

                        return {
                            data: usuario ? usuario : {},
                            deviceKey: DeviceKey.getKey(),
                            firebase: {
                                tags: tags,
                                platform: Platform.OS,
                                token: DeviceKey.getKey(),
                                key_usuario: usuario?.key,
                                app: Config.appName,
                                descripcion: Platform.select({
                                    "web": `Web ${window.navigator.userAgent}`,
                                    "android": `Android ${Platform?.constants?.Version}, ${Platform?.constants?.Manufacturer} ${Platform?.constants?.Brand} ${Platform?.constants?.Model}`,
                                    "ios": `IOS ${Platform?.Version}, ${Platform?.constants?.systemName}`,
                                }),
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