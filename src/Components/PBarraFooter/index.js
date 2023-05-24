import React, { Component } from 'react';

import { SView, SText, STheme, SGradient, SIcon, SNavigation } from 'servisofts-component'

export default class PBarraFooter extends Component {
	constructor(props) {
		super(props);
		this.state = {
		};
		this.page = SNavigation.getParam("page");
		// this.key_restaurante = SNavigation.getParam("key_restaurante");
		this.key_restaurante = SNavigation.getParam("pk");
	}

	getItem({ key, title, icon, url, params }) {
		var color = "#ffffff";
		var isSelect = (key == this.props.url)
		return <SView flex center height onPress={() => {
			SNavigation.navigate(url, params);
		}} >
			<SView style={{
				borderRadius: 16,
				backgroundColor: (isSelect ? "#ffffff44" : ""),
				width: 55,
				height: 45,
			}} center>
				<SView height={23} colSquare center >
					<SIcon name={icon} />
				</SView>
				<SView height={2} />
				<SText font={"Arial"} fontSize={8} center color={color}  >{title}</SText>
			</SView>
		</SView>


	}
	render() {
		return (
			<SView col={"xs-12"} height={50} border={'transparent'} style={{ backgroundColor: "#96BE00" }}
				// style={{ position: 'absolute', bottom: 0, backgroundColor: STheme.color.primary, overflow: 'hidden' }}	
			>
				<SView col={'xs-12'} row height >
					{this.getItem({ key: "pedido", title: 'Pedidos', icon: 'Mpedidos', url: '/restaurante', params: { pk: this.key_restaurante } })}
					{this.getItem({ key: "calendario", title: 'Calendario', icon: 'Mcalendario', url: '/calendario' , params: { pk: this.key_restaurante } })}
					{this.getItem({ key: "calificacion", title: 'Calificación', icon: 'Mcalificacion', url: '/calificacion', params: { pk: this.key_restaurante } })}
				</SView>
			</SView >
		);
	}
}
