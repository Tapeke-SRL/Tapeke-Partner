import React from 'react';
import { Animated } from 'react-native';
import { SView, SImage, SNavigation, STheme, SIcon, SText, SScrollView2 } from 'servisofts-component';
import { connect } from 'react-redux';
import SSocket from 'servisofts-socket';
import Model from '../../Model';
// import CerrarSession from '../../Pages/Usuario/Page/Perfil/CerrarSession';
const packageJson = require('../../../package.json');

class NavBar extends React.Component {
	static INSTACE = null;
	static open() {
		NavBar.INSTACE.fadeIn();
	}
	static close() {
		NavBar.INSTACE.fadeOut();
	}

	constructor(props) {
		super(props);
		this.state = {
			timeAnim: 350,
			isOpen: false,
		};
		NavBar.INSTACE = this;
		this.animSize = new Animated.Value(this.state.isOpen ? 1 : 0);
	}


	fadeIn() {
		this.setState({ isOpen: true });
		Animated.timing(this.animSize, {
			toValue: 1,
			duration: this.state.timeAnim,
			useNativeDriver: true
		}).start();
	}

	fadeOut() {

		Animated.timing(this.animSize, {
			toValue: 0,
			duration: 0,
			useNativeDriver: true
		}).start(() => {
			this.setState({ isOpen: false });
		});
	}

	item({ url, label, icon, onPress }) {
		return <SView col={"xs-11"} height={60} border={'transparent'} row onPress={() => {
			if (onPress) {
				onPress();
			}
			if (url) {
				SNavigation.navigate(url);
			}
			this.fadeOut();
		}}  >
			<SView col={"xs-10"} height style={{ justifyContent: 'flex-start', }} row center>
				<SIcon fill="#666666" name={icon} width={28} height={27} />
				<SText font={"Roboto"} style={{ paddingLeft: 5, color: "#666666", fontSize: 18 }} >{label}</SText>
			</SView>
			<SView col={"xs-2"} height style={{ justifyContent: 'flex-end', }} row center>
				<SIcon fill={STheme.color.secondary} name={"Icon1"} width={20} height={20} />
			</SView>
		</SView>

	}

	getNav() {
		if (!this.state.width) return null;
		var usuario = this.props.state.usuarioReducer.usuarioLog;
		if (!usuario) {
			// SNavigation.reset('/');
			return <SView />
		}
		return <SView col={"xs-9 md-6 xl-4"} height animated backgroundColor={STheme.color.background}
			style={{
				position: "absolute",
				// left: this.animSize.interpolate({
				// 	inputRange: [0, 1],
				// 	outputRange: ["-70%", "0%"],
				// }),
				transform: [{
					translateX: this.animSize.interpolate({
						inputRange: [0, 1],
						outputRange: [this.state.width * -0.7, 0],
					})
				}],
			}}
		>
			<SView col={"xs-12"} backgroundColor={STheme.color.primary} width="100%" height={105} center
				style={{ borderBottomRightRadius: 20, borderBottomLeftRadius: 20 }} row>
				<SView col={"xs-3"} center style={{ textAlign: "right" }} height>
					<SView style={{
						width: 50,
						height: 50, borderRadius: 30, overflow: "hidden", borderWidth: 1, borderColor: "#fff"
					}}>
						<SImage src={SSocket.api.root + "usuario/" + usuario.key + "?date=" + new Date().getTime()} style={{
							width: "100%",
							height: "100%",
							resizeMode: "cover"
						}} />
					</SView>
				</SView>
				<SView col={"xs-9"} onPress={() => {
					SNavigation.navigate('/profile');
					this.fadeOut();
				}}>
					<SText font={"Roboto-Bold"}
						style={{
							color: "#fff",
							fontSize: 20,
						}}>{usuario.Nombres}</SText>
					<SView height={22} onPress={() => {
						SNavigation.navigate('/profile')
						this.fadeOut();
					}} style={{
						paddingLeft: 6,
						alignItems: 'center',
					}} row>
						<SText fontSize={12} color={"#eee"} font='LondonTwo' style={{
							// textDecorationLine: 'underline',
						}}>Ver perfil </SText>
						<SIcon name="Ver" width={9} color="#fff" />
					</SView>
				</SView>
			</SView>
			<SView height={20} border={'transparent'} />

			<SScrollView2 disableHorizontal contentContainerStyle={{ width: "100%" }}>

				<SView col={"xs-12"} center>


					{this.item({ url: "/", label: "Inicio",icon: 'mInicio' })}
					{/* {this.item({ url: "/zona", label: "Zonas" })} */}
					{this.item({ url: "/ganancia", label: "Ganancias" ,icon: 'mGanancias'})}
					{this.item({
						label: "Mis restaurantes", onPress: () => {
							SNavigation.replace("/root")
						},
						icon: 'mRestaurante'
					})}
					{this.item({ label: "Notificaciones", url: "/notificaciones", icon: 'mNotification' })}
					{this.item({ url: "/soporte", label: "Soporte",icon: 'mSoporte' })}
					{this.item({ url: "/restaurante_cuenta", label: "Cuentas bancarias",icon: 'Icuenta' })}
					
					{/* {this.item({ url: "/documento", label: "Documento Usuario" })} */}
					{/* {this.item({ url: "/documento/moto", label: "Documento Moto" })} */}
					{this.item({
						label: "Cerrar sesión", onPress: () => {
							// Model.Action.
							Model.restaurante.Action.select("")
							Model.usuario.Action.unlogin();
						},
						icon: 'mSession'
					})}


					<SView col={"xs-9.5 md-5.8 xl-3.8"} center style={{ bottom: 0, }}>
						<SIcon name={"Logo"} height={70} />
					</SView>

					<SView row >
						<SText style={{ paddingLeft: 5, paddingTop: 2, color: "#666666", fontSize: 18 }} font={"LondonMM"}>Version {packageJson.version}</SText>
					</SView>

					<SView height={20} border={'transparent'} />

				</SView>
			</SScrollView2>
		</SView>
	}

	render() {
		NavBar.INSTACE = this;
		if (!this.state.isOpen) return null;
		return (
			<SView style={{
				position: "absolute",
				width: "100%",
				height: "100%",
				//backgroundColor: "#66000066",
				backgroundColor: STheme.color.card,
			}}
				onLayout={(event) => {
					this.setState({
						width: event.nativeEvent.layout.width
					});
				}}
				activeOpacity={1}
				onPress={() => {
					if (this.state.isOpen) {
						this.fadeOut();
					} else {
						this.fadeIn();
					}
				}
				}>
				{this.getNav()}
			</SView>
		);
	}
}

const initStates = (state) => {
	return { state }
};
export default connect(initStates)(NavBar);