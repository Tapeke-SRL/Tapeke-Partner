import React, { Component } from 'react'
import { SDate, SLoad, SNavigation, SPage, SMath, STable2, SPopup } from 'servisofts-component'
import SSocket from 'servisofts-socket'
import { BuildCustomHeader } from '.'
import { connect } from 'react-redux'
import Model from '../../Model'
import historial from './historial'
import historialPedido from '../reporte/historialPedido'

class tablaPedido extends Component {
  conciliado;

  state = {
    data: {}
  }
  constructor(props) {
    super(props);
    this.params = SNavigation.getAllParams() ?? {}
    this.title = ''
    if (SNavigation.getParam("conciliado")) {
      this.conciliado = SNavigation.getParam("conciliado");
    }

    if (SNavigation.getParam("historialPedido")) {
      this.historialPedido = SNavigation.getParam("historialPedido");
    }
  }

  componentDidMount() {
    if (!Model.restaurante.Action.getSelect()?.key) {
      SNavigation.goBack();
      return;
    }
    this.getDatos();
  }

  getDatos() {
    let peticion = {};
    if (this.historialPedido) {
      peticion = {
        component: 'pedido',
        type: 'getByRestauranteEntreFechas',
        fecha_inicio: this.params.fecha_inicio,
        fecha_fin: this.params.fecha_fin,
      };
    } else {
      peticion = {
        component: "pedido",
        type: this.conciliado ? "getConciliadas" : "getPendientesConciliacion",
      };
      this.title = this.conciliado ? "conciliados" : "no conciliados";
    }

    SSocket.sendPromise({
      ...peticion,
      key_restaurante: Model.restaurante.Action.getSelect()?.key,
    }).then(resp => {
      let keys = [...new Set(
        Object.values(resp.data)
          .flatMap(a => [a.key_usuario, a.key_conductor])
          .filter(key => key !== null)
      )];
      SSocket.sendPromise({
        version: "2.0",
        service: "usuario",
        component: "usuario",
        type: "getAllKeys",
        keys: keys,
      }).then(e2 => {
        Object.values(resp.data).map(a => {
          a.usuario = e2?.data[a.key_usuario]?.usuario ?? {}
          a.usuario_conductor = e2?.data[a.key_conductor]?.usuario ?? {}
        })
        this.setState({ data: resp.data })
      }).catch(e2 => {
        SPopup.alert(e2.error)
      })
    }).catch(e => {
      console.error(e)
    })
  }

  tipoDePago(tipo_pago) {
    if (tipo_pago && tipo_pago?.length > 0) {
      return !!Object.values(tipo_pago).find(o => o.type == "efectivo") ? "Efectivo" : `Online - ${tipo_pago[0].type}`;
    } else {
      return "El pago con QR nunca se pago";
    }
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
    let calculo = (pedido.cantidad * pedido.precio) + this.calcularTotalProdYSub(pedido) - (pedido.comision_restaurante + this.calcularDescuentoCobertura(pedido, 'partner'));
    return calculo;
  }

  detalleIteams(pedido_producto) {
    let detalleIteam = "";

    if (pedido_producto) {
      let total = 0;

      pedido_producto.forEach(p => {
        detalleIteam += `${p.cantidad} X ${p.descripcion}`;
        if (p.precio_sin_descuento) {
          total += (p.cantidad * p.precio_sin_descuento)
        } else {
          total += (p.cantidad * p.precio)
        }

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

  calcularDescuentoCobertura(obj, controller) {
    let totalDesc = {
      totalDescCubreTapeke: 0,
      totalDescCubrePartner: 0,
      porcentajeCubreTapeke: 0,
      porcentajeCubrePartner: 0,
    };


    if (obj?.descuentos) {
      Object.values(obj.descuentos).map((desc) => {
        if (desc.cobertura) {
          let descuentoTotal = (desc.total_descuento_producto ?? 0) + (desc.total_descuento_tapeke ?? 0);
          let coberturaTapeke = descuentoTotal * (desc.cobertura ?? 0);
          let coberturaPartner = descuentoTotal - coberturaTapeke;

          // TODO implementacion de descuentos delivery que cubre partner.

          totalDesc.totalDescCubreTapeke += parseFloat(coberturaTapeke, 2);
          totalDesc.totalDescCubrePartner += parseFloat(coberturaPartner, 2);
          totalDesc.porcentajeCubreTapeke = desc.cobertura;
          totalDesc.porcentajeCubrePartner = 1 - desc.cobertura;
        }
      });
    }

    if (obj?.pedido_producto) {
      // TODO aca va que este tipo de descuento lo cuebre el partner.
      const exclude = ['pollos campeón', 'sakura brasas']
      Object.values(obj.pedido_producto).map((prod) => {
        if (prod.descuento_monto) {
          let coberturaTapeke = 0.50;
          if (exclude.some(nombre => obj.restaurante.nombre.toLowerCase().includes(nombre.toLowerCase()))) {
            coberturaTapeke = 1;
          }
          let coberturaPartner = 1 - coberturaTapeke;
          let monto = (prod.cantidad * (prod.precio_sin_descuento - prod.precio))

          totalDesc.totalDescCubreTapeke += monto * coberturaTapeke;
          totalDesc.totalDescCubrePartner += monto * coberturaPartner
        } else {
          totalDesc.totalDescCubreTapeke += (prod.cantidad * (prod.precio_sin_descuento - prod.precio))
        }
      })
    }

    switch (controller) {
      case 'tapeke':
        // console.log(`totalDescCubreTapeke: ${obj.key} : ${totalDesc.totalDescCubreTapeke}`);
        return totalDesc.totalDescCubreTapeke;

      case 'partner':
        // console.log(`totalDescCubrePartner: ${obj.key} : ${totalDesc.totalDescCubrePartner}`);
        return totalDesc.totalDescCubrePartner;

      default:
        return totalDesc;
    }
  }

  calcularTotalProdYSub(obj) {
    let totalProd = 0;
    // total += obj.cantidad * obj.precio;
    if (obj.pedido_producto) {
      Object.values(obj.pedido_producto).map((prod) => {
        if (prod.precio_sin_descuento) {
          totalProd += (prod.cantidad * prod.precio_sin_descuento)
        } else {
          totalProd += (prod.cantidad * prod.precio)
        }

        if (prod.sub_productos) {
          Object.values(prod.sub_productos).map((sub) => {
            if (sub.sub_producto_detalle) {
              Object.values(sub.sub_producto_detalle).map((subDet) => {
                totalProd += (subDet.cantidad * subDet.precio)
              })
            }
          })
        }
      })
    }
    return totalProd;
  }

  totalProducto(obj) {
    let totalProd = 0;
    // total += obj.cantidad * obj.precio;
    if (obj.pedido_producto) {
      Object.values(obj.pedido_producto).map((prod) => {
        if (prod.precio_sin_descuento) {
          totalProd += (prod.cantidad * prod.precio_sin_descuento)
        } else {
          totalProd += (prod.cantidad * prod.precio)
        }
      })
    }
    return totalProd;
  }

  renderTable() {
    if (!this.state.data) return <SLoad />
    return <STable2
      header={
        [
          { key: "index", label: "#" },
          { key: "restaurante/nombre", label: "Sucursal", width: 200 },
          { key: "fecha", label: "Fecha de Entrega", order: "desc", width: 100 },
          { key: "key", label: "Key Pedido", width: 250 },
          { key: "state", label: "Estado", width: 80 },
          { key: "usuario", label: "Usuario", width: 250, center: true, render: val => `${val.Nombres} ${val.Apellidos}` },
          { key: "usuario_conductor", label: "Driver", width: 250, center: true, render: val => Object.values(val).length > 0 ? `${val.Nombres} ${val.Apellidos}` : "No tiene driver" },

          { key: "cantidad", label: "Cantidad Tapekes", width: 110 },
          { key: "precio", label: "Precio Unitario Tapekes", width: 150, render: a => "Bs. " + SMath.formatMoney(a, 2) },
          { key: "-total_tapekes", label: "Total Tapekes", width: 150, render: a => "Bs. " + SMath.formatMoney((a.cantidad * a.precio), 2) },

          // Productos
          { key: "-cantidad_producto", label: "Cantidad Items", width: 150, render: a => this.cantidadProductos(a.pedido_producto) },
          { key: "-total_productos", label: "Total Iteams", width: 150, render: a => 'Bs. ' + SMath.formatMoney(this.totalProducto(a)) },
          { key: "-total_producto_sub_producto", label: "Total Subiteams", width: 150, render: a => 'Bs. ' + SMath.formatMoney(this.totalSubProductos(a.pedido_producto)) },
          { key: "-detalle_iteams", label: "Detalle Iteams", width: 400, render: a => this.detalleIteams(a.pedido_producto) },

          // Descuentos
          { key: "-descuentos_cubre_partner", label: "Descuentos Cubre Partner", width: 150, render: a => 'Bs. ' + SMath.formatMoney(this.calcularDescuentoCobertura(a, 'partner')) },
          { key: "-descuentos_cubre_tapeke", label: "Descuentos Cubre Tapeke", width: 150, render: a => 'Bs. ' + SMath.formatMoney(this.calcularDescuentoCobertura(a, 'tapeke')) },

          { key: "-ganancia_partner", label: "Total Iteams + Subiteams", width: 150, render: a => 'Bs. ' + SMath.formatMoney(this.calcularTotalProdYSub(a)) },

          { key: "comision_restaurante", label: "Comisión Tapeke por venta", width: 160, render: a => "Bs. " + SMath.formatMoney(a, 2) },
          { key: "-total_menos_comision", label: "Total Venta - Comisión - Desc Cubre Partner", width: 200, render: a => "Bs. " + SMath.formatMoney(this.gananciaPartner(a)) },
          { key: "tipo_pago", label: "Tipo de Pago", width: 160, render: a => this.tipoDePago(a) },
        ]
      }
      data={this.state.data} />
  }

  render() {

    return <SPage
      title={`Historial de pedidos ${this.title}`}
      disableScroll
    >{this.renderTable()}</SPage>
  }
}
const initStates = (state) => {
  return { state }
};
export default connect(initStates)(tablaPedido);