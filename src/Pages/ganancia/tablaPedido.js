import React, { Component } from 'react'
import { SDate, SLoad, SNavigation, SPage, SMath, STable2, SView } from 'servisofts-component'
import SSocket from 'servisofts-socket'
import { BuildCustomHeader } from '.'
import { connect } from 'react-redux'
import Model from '../../Model'
import pedido from '../pedido'

class tablaPedido extends Component {
  conciliado;

  state = {
    data: {}
  }
  constructor(props) {
    super(props);
    this.params = SNavigation.getAllParams() ?? {}
    this.conciliado = Boolean(this.params.conciliado);
  }

  componentDidMount() {
    if (!Model.restaurante.Action.getSelect()) {
      SNavigation.goBack();
      return;
    }
    this.getDatos();
  }

  tipoDePago(tipo_pago) {
    if (tipo_pago && tipo_pago?.length > 0) {
      return !!Object.values(tipo_pago).find(o => o.type == "efectivo") ? "Efectivo" : `Online - ${tipo_pago[0].type}`;
    } else {
      return "El pago con QR nunca se pago";
    }
  }

  getDatos() {
    let component;
    let type;

    if (this.conciliado) {
      component = "pedido";
      type = "getConciliadas";
    } else {
      component = "pedido";
      type = "getPendientesConciliacion";
    }

    SSocket.sendPromise({
      component: component,
      type: type,
      key_restaurante: Model.restaurante.Action.getSelect(),
      key_conciliacion_restaurante: this.params.key_conciliacion_restaurante
    }).then(resp => {
      this.setState({ data: resp.data })
    }).catch(e => {
      console.error(e)
    })
  }



  renderTable() {
    let users = Model.usuario.Action.getAll()
    if (!this.state.data) return <SLoad />
    if (!users) return <SLoad />
    return <STable2
      header={
        [
          { key: "index", label: "#" },
          { key: "fecha", label: "Fecha de Entrega", order: "desc", width: 100 },
          { key: "key", label: "Key Pedido", width: 250 },
          { key: "state", label: "Estado", width: 80 },
          { key: "key_usuario", label: "Usuario", width: 200, render: a => a ? users[a].Nombres + " " + users[a].Apellidos : "No se pillo el usuario" },
          { key: "key_conductor", label: "Driver", width: 200, render: a => a ? users[a].Nombres + " " + users[a].Apellidos : "Recoger del lugar" },
          
          { key: "cantidad", label: "Cantidad Tapekes", width: 110 },
          { key: "precio", label: "Precio Unitario Tapekes", width: 150, render: a => "Bs. " + SMath.formatMoney(a, 2) },
          { key: "-total_tapekes", label: "Total Tapekes", width: 150, render: a => "Bs. " + SMath.formatMoney((a.cantidad * a.precio), 2) },
          { key: "-total_menos_comision", label: "Total Tapekes - Comisión", width: 150, render: a => "Bs. " + SMath.formatMoney((a.cantidad * a.precio) - a.comision_restaurante, 2) },
          { key: "comision_restaurante", label: "Comisión Tapeke por venta", width: 160, render: a => "Bs. " + SMath.formatMoney(a, 2) },
          { key: "tipo_pago", label: "Tipo de Pago", width: 160, render: a =>this.tipoDePago(a) },
        ]
      }
      data={this.state.data} />
  }

  render() {
    return <SPage
      title={`Historial de pedidos ${this.conciliado ? "conciliados" : "no conciliados"}`}
      disableScroll
    >{this.renderTable()}</SPage>
  }
}
const initStates = (state) => {
  return { state }
};
export default connect(initStates)(tablaPedido);