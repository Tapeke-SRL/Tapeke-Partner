import React, { Component } from 'react';

import { SView, SText, SIcon, SNavigation, SImage } from 'servisofts-component'
import Model from '../../Model';

export default class PBarraFooter extends Component {
	constructor(props) {
		super(props);
		this.state = {
		};
		this.page = SNavigation.getParam("page");
		this.key_restaurante = Model.restaurante.Action.getKey()
	}

	getItem({ key, title, icon, image, url, params, width }) {
		var color = "#ffffff";
		var isSelect = (key == this.props.url)
		let sizeIcon = 23;
		let fontSize = 10
		return <SView flex center height onPress={() => {
			SNavigation.navigate(url, params);
		}} >
			<SView style={{
				borderRadius: 16,
				backgroundColor: (isSelect ? "#ffffff44" : ""),
				width: width ? width : 55,
				height: 45,
			}} center>
				<SView height={sizeIcon} colSquare center >
					{
						icon ?
							<SIcon fill={color} name={icon} />
							: null
					}

					{
						image ?
							<SImage src={image} />
							: null
					}
				</SView>
				<SView height={2} />
				<SText font={"Arial"} fontSize={fontSize} center color={color}  >{title}</SText>
			</SView>
		</SView>


	}
	render() {
		return (
			<SView col={"xs-12"} height={50} border={'transparent'} style={{ backgroundColor: "#96BE00" }}
			// style={{ position: 'absolute', bottom: 0, backgroundColor: STheme.color.primary, overflow: 'hidden' }}	
			>
				<SView col={'xs-12'} row height >
					{this.getItem({ key: "pedido", title: 'Pedidos', image: require('../../Assets/img/icon_pedido.png'), url: '/restaurante', params: { pk: this.key_restaurante } })}
					{this.getItem({ key: "menu", title: 'Menú', icon: 'tapekeMenu', url: '/restaurante/producto', params: { key_restaurante: this.key_restaurante } })}
					{this.getItem({ key: "calendario", title: 'Horarios', icon: 'reloj', url: '/calendario', width: 100, params: { key_restaurante: this.key_restaurante } })}
					{this.getItem({ key: "soporte", title: 'Soporte', icon: 'Soporte', url: '/soporte' })}
					{/* {this.getItem({ key: "calificacion", title: 'Calificación', icon: 'Mcalificacion', url: '/calificacion', params: { pk: this.key_restaurante } })} */}
				</SView>
			</SView >
		);
	}
}
