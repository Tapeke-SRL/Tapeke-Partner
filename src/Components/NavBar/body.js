import React from 'react';
import { SView, SImage, SNavigation, STheme, SIcon, SText, SScrollView2, SThread, SLoad, SScroll, SHr, SDate } from 'servisofts-component';
import SSocket from 'servisofts-socket';
import Model from '../../Model';
// import CerrarSession from '../../Pages/Usuario/Page/Perfil/CerrarSession';
import packageJson from "../../../package.json";
const APPversion = packageJson.version;
import NavBar from '.';


export default class body extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            load: false,
            time: new SDate().getTime()
        };
    }


    componentDidMount() {
        new SThread(100, "load-bar-data", true).start(() => {
            this.setState({ load: true })
        })
    }

    item({ url, label, icon, onPress }) {
        console.log(icon + " 999")
        return <SView col={"xs-11"} height={60} border={'transparent'} row onPress={() => {
            if (onPress) {
                onPress();
            }
            if (url) {
                SNavigation.navigate(url);
            }
            NavBar.close();
        }}  >
            <SView col={"xs-10"} height style={{ justifyContent: 'flex-start', }} row center>
                <SIcon fill="#666666" name={icon} width={28} height={27} />
                <SText tyle={{ paddingLeft: 5, color: "#666666", fontSize: 18 }} >{label}</SText>
            </SView>
            <SView col={"xs-2"} height style={{ justifyContent: 'flex-end', }} row center>
                <SIcon name={"Icon1"} width={20} height={20} />
            </SView>
        </SView>

    }
    renderUserData() {
        var usuario = Model.usuario.Action.getUsuarioLog();
        if (!usuario) return <SView col={"xs-12"} center height onPress={() => {
            SNavigation.navigate("/login")
            NavBar.close();
        }}>
            <SText color={STheme.color.secondary} fontSize={18} center>{"Inicia sesión en tapeke."}</SText>
            {/* <SText color={STheme.color.l} fontSize={12} center>{"Algunas funciones se encuentran desactivadas hasta que inicies session con un usuario."}</SText> */}
        </SView>;
        return <SView row col={"xs-12"}>
            <SView col={"xs-3"} center style={{ textAlign: "right" }} height>
                <SView style={{
                    width: 50,
                    height: 50, borderRadius: 30, overflow: "hidden", borderWidth: 1, borderColor: "#fff"
                }}>
                    <SView style={{
                        position: "absolute"
                    }}>
                        <SIcon name='InputUser' />
                    </SView>
                    <SView style={{
                        position: "absolute"
                    }}>
                        <SImage src={SSocket.api.root + "usuario/" + usuario?.key} style={{
                            width: "100%",
                            height: "100%",
                            resizeMode: "cover"
                        }} />
                    </SView>
                    <SImage src={SSocket.api.root + "usuario/" + usuario?.key + "?date=" + this.state.time} style={{
                        width: "100%",
                        height: "100%",
                        resizeMode: "cover"
                    }} />
                </SView>
            </SView>
            <SView col={"xs-9"} onPress={() => {
                SNavigation.navigate('/profile');
                NavBar.close();
            }}>
                <SText
                    style={{ color: "#fff", fontSize: 20, }}>{usuario?.Nombres}</SText>
                {/* style={{ color: "#fff", fontSize: 20, }}>Editar</SText> */}
                <SView height={22} style={{
                    // paddingLeft: 6,
                    alignItems: 'center',
                }} row>
                    <SText fontSize={12} color={"#eee"} style={{
                        // textDecorationLine: 'underline',
                    }}>Ver perfil </SText>
                    <SIcon name="Ver" width={9} color="#fff" />
                </SView>
            </SView>
        </SView>
    }

    renderIcon({ label, path, params, icon, image, onPress, requireUser, noWithUser }) {
        let color = "#666666";
        let sizeIcon = 22;
        if (requireUser) {
            if (!Model.usuario.Action.getKey()) {
                return null;
            }
        }
        if (noWithUser) {
            if (Model.usuario.Action.getKey()) {
                return null;
            }
        }
        return <SView col={"xs-11"} row
            style={{
                paddingTop: 12,
                paddingBottom: 12
            }}
            onPress={() => {
                if (onPress) {
                    onPress()
                    return;
                }
                SNavigation.navigate(path, params); NavBar.close();
            }}  >
            <SView col={"xs-10"} height style={{ justifyContent: 'flex-start', }} row center >
                {/* <SHr height={17} /> */}
                {/* <SView width={25} height={25} center> */}
                {icon ? <SIcon fill={color} width={sizeIcon} height={sizeIcon} name={icon} /> : null}
                {image ?
                    <SView width={sizeIcon} height={sizeIcon}>
                        <SImage src={image} />
                    </SView>
                    : null}
                {/* </SView> */}
                <SText flex style={{ paddingLeft: 5, color: color, fontSize: 14 }} >{label}</SText>
                {/* <SHr height={17} /> */}
            </SView>
            <SView col={"xs-2"} height style={{ alignItems: "flex-end" }} center>
                <SIcon fill={color} name={"Icon1"} height={sizeIcon} />
            </SView>
        </SView>
    }

    render() {
        // if (!this.state.width) return null;
        // var usuario = this.props?.state?.usuarioReducer?.usuarioLog;
        // if (!usuario) {
        // SNavigation.reset('/');
        // return <SView />
        // }
        if (!this.state.load) return <>
            <SView col={"xs-12"} backgroundColor={STheme.color.primary} width="100%" height={105} center style={{ borderBottomRightRadius: 20, borderBottomLeftRadius: 20 }} >
                {this.renderUserData()}
            </SView>
            <SHr height={20} />
            <SLoad />
        </>
        return <>
            <SView col={"xs-12"} backgroundColor={STheme.color.primary} width="100%" height={105} center style={{ borderBottomRightRadius: 20, borderBottomLeftRadius: 20 }} >
                {this.renderUserData()}
            </SView>
            <SHr height={20} />
            <SScrollView2 disableHorizontal contentContainerStyle={{ width: "100%" }} >
                <SView col={"xs-12"} center  >
                    {this.renderIcon({ label: "Productos", icon: "menu", path: "/restaurante/producto", params: { key_restaurante: Model.restaurante.Action.getSelect() } })}
                    {this.renderIcon({ label: "Notificaciones", icon: "mNotification", path: "/notificaciones", requireUser: true })}
                    {this.renderIcon({
                        label: "Mis comercios", image: require("../../Assets/img/comercio.png"), path: "/", onPress: () => {
                            SNavigation.replace("/root")
                            NavBar.close();

                        },
                    })}
                    {this.renderIcon({ label: "Calificación", icon: 'Mcalificacion', path: "/calificacion", params: { pk: Model.restaurante.Action.getSelect() }, requireUser: true })}
                    {this.renderIcon({ label: "Ganancias", image: require("../../Assets/img/ganancia.png"), path: "/ganancia", requireUser: true })}
                    {this.renderIcon({ label: "Historial de pedidos", image: require("../../Assets/img/historial_de_pedido.png"), path: "/reporte/hitorialPedidos", params: { pk: Model.restaurante.Action.getSelect() }, requireUser: true })}
                    
                    {/* TODO Falta componente para navegació Administra usuario */}
                    {this.renderIcon({ label: "Administra usuarios", image: require("../../Assets/img/administrar_usuarios.png"), path: "/roles", params: { key_restaurante: Model.restaurante.Action.getSelect() }, requireUser: true })}
                    {this.renderIcon({ label: "Cuentas bancarias", icon: "Icuenta", path: "/restaurante_cuenta", requireUser: true })}
                    {this.renderIcon({ label: "Información legal", icon: "mSoporte", path: "/condiciones", requireUser: false })}
                    {this.renderIcon({
                        label: "Cerrar sesión", icon: "mSession", requireUser: true,
                        onPress: () => {
                            // Model._events.CLEAR();
                            Model.usuario.Action.unlogin();
                            SNavigation.reset("/", { noDir: true });
                            NavBar.close();
                        }
                    })}
                    {this.renderIcon({ label: "Iniciar Sesión", icon: "mSession", path: "/login", noWithUser: true })}


                    {/* {this.renderIcon({ label: "Inicio", icon: "Inicio", path: "/root" })} */}
                    {/* {this.renderIcon({ label: "Inicio", icon: "mInicio", path: "/" })} */}
                    {/* {this.renderIcon({ label: "Mis direcciones", icon: "Direccion", path: "/direccion", requireUser: true })} */}
                    {/* {this.renderIcon({ label: "Cupones", icon: "mCupon", path: "/cupones", requireUser: true })} */}
                    {/* {this.renderIcon({ label: "Mi Billetera Tapeke", icon: "Billetera", path: "/billetera", requireUser: true })} */}
                    {/* {this.renderIcon({ label: "Soporte", icon: "Soporte", path: "/ayuda" })} */}
                    {/* {this.renderIcon({ label: "Contactos", icon: "Contacto", path: "/contacto" })} */}
                    {/* {this.renderIcon({ label: "Información legal", icon: "Legal", path: "/ayuda/terminos_y_condiciones" })} */}
                    {/* {this.renderIcon({ label: "Mis compras", icon: "Compras", path: "/misCompras", requireUser: true })} */}
                    {/* {this.renderIcon({ label: "Novedades", icon: "Novedades", path: "/novedades" })} */}

                    <SHr />
                    <SView col={"xs-11"} style={{
                        borderBottomWidth: 1,
                        borderBottomColor: STheme.color.primary,
                    }} />
                    <SHr />

                    <SHr height={20} />

                    <SView col={"xs-9.5 md-5.8 xl-3.8"} center style={{ bottom: 0, }}>
                        <SIcon name={"Logo"} height={65} fill={STheme.color.primary} />
                    </SView>
                    <SView row >
                        <SText style={{ paddingLeft: 5, paddingTop: 2, color: "#666666", fontSize: 18 }} >Version {APPversion}</SText>
                    </SView>
                </SView>
                <SHr height={50} />
            </SScrollView2>
            <SView height={20} col={"xs-12"} backgroundColor={STheme.color.accent} />
        </>
    }
}