import React, { Component } from 'react'
import { SDate, SLoad, SNavigation, SPage, SMath, STable2, SView } from 'servisofts-component'
import SSocket from 'servisofts-socket'
import { BuildCustomHeader } from '.'
import { connect } from 'react-redux'
import Model from '../../Model'

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

      if (this.params.fecha_fin && this.params.fecha_inicio) {
        const fechaInicio = new SDate(this.params.fecha_inicio, "yyyy-MM-dd")
        const fechaFin = new SDate(this.params.fecha_fin, "yyyy-MM-dd");
  
        let datosFiltrados = Object.values(resp.data).filter(d => {
          let fecha = new SDate(d.fecha, "yyyy-MM-dd")
          if (fecha.isAfter(fechaInicio) && fecha.isBefore(fechaFin)) {
            return d;
          }
        });
  
  
        this.setState({ data: datosFiltrados })
      }else{
        this.setState({ data: resp })
      }

    }).catch(e => {
      console.error(e)
    })
  }

  cantidadProductos(pedido_producto) {
    let cantidad = 0;
    if (pedido_producto) {
      pedido_producto.forEach(p => {
        cantidad += p.cantidad;
      });
    }
    return cantidad;
  }

  totalSubProductos(pedido_producto) {
    let total = 0;
    if (pedido_producto) {
      pedido_producto.forEach(p => {
        if (p.sub_productos) {
          p.sub_productos.forEach(sp => {
            if (sp.sub_producto_detalle) {
              sp.sub_producto_detalle.forEach(spd => {
                total += spd.cantidad * spd.precio;
              });
            }
          });
        }
      });
    }
    return total;
  }

  gananciaPartner(pedido) {
    let calculo = (pedido.cantidad * pedido.precio) + pedido.total_productos + this.totalSubProductos(pedido.pedido_producto) - pedido.comision_restaurante;
    return calculo;
  }

  detalleIteams(pedido_producto) {
    let detalleIteam = "";

    if (pedido_producto) {
      let total = 0;

      pedido_producto.forEach(p => {
        detalleIteam += `${p.cantidad} X ${p.descripcion}`;
        total += p.cantidad * p.precio;

        if (p.sub_productos) {
          p.sub_productos.forEach(sp => {
            if (sp.sub_producto_detalle) {
              sp.sub_producto_detalle.forEach(spd => {
                detalleIteam += ` ${spd.nombre} `;
                total += spd.cantidad * spd.precio;
              });
            }
          });
        }

        detalleIteam += `= ${total} Bs. |`;
        total = 0;
      });
    }

    if (detalleIteam == "") {
      return "No hay productos en el pedido";
    }

    return detalleIteam.toUpperCase();
  }

  renderTable() {
    let users = Model.usuario.Action.getAll()
    if (!this.state.data) return <SLoad />
    if (!users) return <SLoad />
    return <STable2
      header={
        [
          { key: "index", label: "#" },
          { key: "restaurante/nombre", label: "Sucursal", width: 200 },
          { key: "fecha", label: "Fecha de Entrega", order: "desc", width: 100 },
          { key: "key", label: "Key Pedido", width: 250 },
          { key: "state", label: "Estado", width: 80 },
          { key: "key_usuario", label: "Usuario", width: 200, render: a => a ? users[a]?.Nombres + " " + users[a]?.Apellidos : "No se pillo el usuario" },
          { key: "key_conductor", label: "Driver", width: 200, render: a => a ? users[a]?.Nombres + " " + users[a]?.Apellidos : "Recoger del lugar" },

          { key: "cantidad", label: "Cantidad Tapekes", width: 110 },
          { key: "precio", label: "Precio Unitario Tapekes", width: 150, render: a => "Bs. " + SMath.formatMoney(a, 2) },
          { key: "-total_tapekes", label: "Total Tapekes", width: 150, render: a => "Bs. " + SMath.formatMoney((a.cantidad * a.precio), 2) },

          // Productos
          { key: "-cantidad_producto", label: "Cantidad Items", width: 150, render: a => this.cantidadProductos(a.pedido_producto) },
          { key: "total_productos", label: "Total Iteams", width: 150, render: a => a },
          { key: "-total_producto_sub_producto", label: "Total Subiteams", width: 150, render: a => this.totalSubProductos(a.pedido_producto) },
          { key: "-detalle_iteams", label: "Detalle Iteams", width: 400, render: a => this.detalleIteams(a.pedido_producto) },
          { key: "-ganancia_partner", label: "Total Iteams + Subiteams", width: 150, render: a => a.total_productos + this.totalSubProductos(a.pedido_producto) },

          { key: "comision_restaurante", label: "Comisión Tapeke por venta", width: 160, render: a => "Bs. " + SMath.formatMoney(a, 2) },
          { key: "-total_menos_comision", label: "Total Venta - Comisión", width: 150, render: a => "Bs. " + SMath.formatMoney(this.gananciaPartner(a)) },
          { key: "tipo_pago", label: "Tipo de Pago", width: 160, render: a => this.tipoDePago(a) },
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