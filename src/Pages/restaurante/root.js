import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SLoad, SNavigation, SPage, SText, SView, STheme, SImage, SHr, SDate, SIcon, SPopup, SThread, SSwitch, SList } from 'servisofts-component';
import Container from '../../Components/Container';
import Model from '../../Model';
import SSocket from 'servisofts-socket'
import FloatButtomQR from '../../Components/FloatButtomQR';
import PBarraFooter from '../../Components/PBarraFooter';
import TopBar from '../../Components/TopBar';
import CargaIcon from './CargaIcon';
import BarraCargando from '../../Components/BarraCargando';
import { Dimensions, Vibration } from 'react-native';
import SelectHabilitado from './producto/Components/SelectHabilitado';

const tiempoHabilitacion = (item: any) => {

  let label = "No disponible";
  if (item.habilitado) {
    label = "Disponible"
  }
  const ahora = new SDate();
  const fechaObjetivo = new SDate(item.fecha_habilitacion_automatica, "yyyy-MM-ddThh:mm:ss");

  const diferencia = fechaObjetivo.getTime() - ahora.getTime();
  if (diferencia < 0) {
    return "La fecha y hora ya han pasado";
  }

  const segundos = Math.floor(diferencia / 1000);
  const minutos = Math.floor(segundos / 60);
  const horas = Math.floor(minutos / 60);
  // const dias = Math.floor(horas / 24);

  if (!horas && !minutos && !segundos) {
    return `${label}`;
  }
  if (minutos <= 0) {
    return `${label}\npor ${segundos % 60} segundos`;
  }
  if (horas <= 0) {
    return `${label}\npor ${minutos % 60} minutos`;
  }

  return `${label}\npor ${horas % 24} horas`;
}




class index extends Component {
  static TOPBAR = <><TopBar type={"usuario"} />
    <SView backgroundColor={"#96BE00"} height={20} col={"xs-12"}></SView>
  </>

  static FOOTER = <>
    <PBarraFooter url={"pedido"} />
  </>

  constructor(props) {

    super(props);
    this.state = {
    };
    this.pk = SNavigation.getParam("pk");
    this.isRun = false;

  }

  componentDidMount() {
    new SThread(200).start(() => {

      this.setState({ ready: true })
    })

    if (!this.pk) {
      SNavigation.navigate("/root")
    }

    this.isRun = true;
    this.hilo();
  }

  loadData() {
    const arrRest = Model.restaurante.Action.getAll({
      key_partner: Model.usuario.Action.getKey()
    });

    if (!arrRest) return false;
    this.data = arrRest[this.pk];

    // if (!this.data) {
    //   SNavigation.replace("/");
    //   Model.restaurante.Action.select("");
    // }
    // Model.restaurante.Action.select(this.data);

    this.horario_proximo = Model.horario.Action.getByKeyRestauranteProximo(this.pk);
    if (!this.horario_proximo) return false;

    if (Object.values(this.horario_proximo).length !== 0) {
      this.pedidos = Model.pedido.Action.getVendidosData({ fecha: this.horario_proximo.fecha, key_pack: this.horario_proximo.key_pack, key_restaurante: this.pk });
    }

    if (this.pedidos?.length > 0) {
      let keys = [...new Set(Object.values(this.pedidos).map(a => a.key_usuario).filter(key => key !== null))];

      // SSocket.sendPromise({
      //   version: "2.0",
      //   service: "usuario",
      //   component: "usuario",
      //   type: "getAllKeys",
      //   keys: keys,
      // }).then(resp => {
      //   this.setState({ usuarios: resp.data })
      // }).catch(e2 => {
      //   SPopup.alert(e2.error)
      // })
    }

    if (!this.pedidos) return false;

    return true;
  }

  componentWillUnmount() {
    this.isRun = false;
  }

  hilo() {
    if (!this.isRun) return;
    new SThread(1000 * 60, "hilo_pedido", true).start(() => {
      this.hilo();
      Model.horario.Action.getByKeyRestauranteProximo(this.pk, true)
    })
  }

  habilitacion_tapeke() {
    SPopup.confirm({
      title: `¿Seguro que desea ${this.data?.tapeke_deshabilitado ? "habilitar" : "deshabilitar"} los Tapekes?`,
      message: `${this.data?.tapeke_deshabilitado ? "" : "Si deshabilita los Tapekes, no podrá vender más Tapekes hasta que los habilite nuevamente"}, IMPORTANTE: todas las acciones están siendo registradas.`,
      onPress: () => {
        let type;
        if (this.data?.tapeke_deshabilitado) {
          type = "enable_tapeke"
        } else {
          type = "disable_tapeke"
        }

        SSocket.sendPromise({
          component: "restaurante",
          type: type,
          key_usuario: Model.usuario.Action.getKey(),
          key_restaurante: this.pk
        }).then((e) => {
          Model.restaurante.Action._dispatch(e);
          console.log(e)
        })
      }
    })
  }


  handlerPress = (e: any) => {
    Vibration.vibrate(100)
    const key_popup = "popupkey";
    let top = 225;
    let left = 1000;
    SPopup.open({
      key: key_popup,
      type: "2",
      content: <SelectHabilitado
        style={{
          top: top,
          // left: left,
        }}
        onSelect={(select: any) => {
          let tipo = false;
          console.log(select.key)
          let fecha_habilitacion_automatica = "null"
          if (select.key != "true" && select.key != "false") {
            console.log("entro aca")
            let num = select.key;
            if (select.key < 0) {
              tipo = true;
              num = num * -1;
            } else {
              tipo = false;
            }
            fecha_habilitacion_automatica = new SDate().addMinute(parseInt(num)).toString("yyyy-MM-ddThh:mm:ss");
          } else {
            tipo = (select.key == "true")
            console.log("entro aca", tipo)
          }
          console.log(tipo)
          SSocket.sendPromise({
            component: "restaurante",
            type: "editar",
            key_usuario: Model.usuario.Action.getKey(),
            data: {
              key: this.pk,
              habilitado: tipo,
              accion_habilitacion_automatica: (tipo) ? "false" : "true",
              fecha_habilitacion_automatica: fecha_habilitacion_automatica
            }

          }).then(f => {
            this.data.habilitado = f.data.habilitado;
            this.data.fecha_habilitacion_automatica = f.data.fecha_habilitacion_automatica;

            Model.restaurante.Action._dispatch({
              ...f,
              data: this.data
            });
            this.setState({ ...this.state })
            console.log(f);
          }).catch(e => {
            console.error(e);
          })
          SPopup.close(key_popup)
        }
        }
      />
    })
    // })
  }
  getCabecera(data) {
    this.data = data;
    var usuario = Model.usuario.Action.getUsuarioLog();

    if (!usuario) return <SView />;

    return (
      <SView col={"xs-12"} row backgroundColor={STheme.color.card} center>
        {/* <SHr height={18} /> */}
        <SView col={"xs-12"} center style={{ backgroundColor: STheme.color.white }}>
          <SHr height={20} />
          <SView col={"xs-11"} row center>
            {/* <SView col={"xs-12"}> */}
            {/* <SHr height={15} /> */}
            {/* <SText fontSize={18} font={"Roboto"} style={{ fontWeight: "bold" }} color={STheme.color.darkGray}>Cliente</SText> */}
            {/* <S Hr height={15} /> */}
            {/* </SView> */}
            <SView col={"xs-12"} row >
              <SView center width={70} card height={70} style={{ borderRadius: 8, overflow: 'hidden', }}>
                <SImage src={`${SSocket.api.root}restaurante/.128_${this.data.key}`} style={{ width: "100%", position: "relative", resizeMode: "cover" }} />
              </SView>
              <SView flex center row >
                <SView col={"xs-11"} >
                  <SView row center col={"xs-12"} style={{ justifyContent: "space-between" }}>
                    <SText font={"Montserrat-Bold"} color={STheme.color.text} fontSize={14} >{this.data.nombre + " "}</SText>

                    <SView width={35} height={35} center onPress={() => {
                      SNavigation.navigate("/restaurante/edit", { pk: this.pk })
                    }}>
                      <SImage src={require("../../Assets/img/EDITAR2.png")} />
                    </SView>
                  </SView>
                  <SView col={"xs-12"} style={{ justifyContent: 'flex-start', }}>
                    <SText color={STheme.color.darkGray} fontSize={14} font={"Roboto"}>Telf: {this.data.telefono}</SText>
                  </SView>
                </SView>
                <SHr height={5} />
              </SView>
            </SView>

            <SHr h={10} />
            <SView center >


              <SView row /* onPress={this.handlerPress.bind(this)} */>
                <SText>Cerrar Comercio: </SText>
                <SSwitch center size={20} loading={this.state.loading} onChange={() => { this.handlerPress() }} value={!this.data?.habilitado} />

                {/* <SView>
                  <SView col={"xs-12"} row style={{
                    alignItems: "center",
                  }} >
                    <SView height={8} width={8} style={{
                      borderRadius: 100,
                      backgroundColor: !this.data.habilitado ? STheme.color.danger : STheme.color.success
                    }}>

                    </SView>
                    <SView width={4} />
                    <SText color={"#666"} fontSize={10} >{tiempoHabilitacion(this.data)}</SText>
                  </SView>
                </SView> */}

              </SView>
              <SHr h={30} />
              <SView row >
                <SText fontSize={14} color={STheme.color.darkGray} >Vender Tapekes:  {this.data.tapeke_deshabilitado} </SText>
                <SSwitch center size={20} loading={this.state.loading} onChange={this.habilitacion_tapeke.bind(this)} value={!this.data?.tapeke_deshabilitado ? !this.data?.tapeke_deshabilitado : true} />
              </SView>
            </SView>
          </SView>
          <SHr height={18} />
        </SView>
        {/* <SHr height={8} /> */}
      </SView >
    )
  }

  tipoDePago(tipo_pago) {
    if (tipo_pago && tipo_pago?.length > 0) {
      return !!tipo_pago.find(o => o.type == "efectivo") ? "Efectivo" : `Online - ${tipo_pago[0].type}`;
    } else {
      return;
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

  cardPedido(obj) {
    var montoTotal = obj.cantidad * obj.precio;

    let entregado = obj.state == "entregado" || obj.state == "entregado_conductor" || obj.state == "conductor_llego";
    let error = obj.state == "cancelado" || obj.state == "no_recogido";

    let paddingLeftText = 1

    return <SView col={"xs-12"}
      style={{
        borderWidth: 1,
        borderColor: STheme.color.lightGray,
        borderRadius: 8,
        padding: 6,
        marginBottom: 10
      }}
      row backgroundColor={STheme.color.card}
      onPress={() => { SNavigation.navigate("/pedido", { pk: obj.key }); }}
    >

      <SView col={"xs-5"}
        // backgroundColor="#ff00ff"
        flex
        style={{
          borderRightWidth: 1,
          borderColor: STheme.color.lightGray
        }}>

        <SText center h={15} fontSize={10}>#{obj.key.substr(0, 6)}</SText>

        <SView col={"xs-12"}
          flex row
          style={{
            justifyContent: 'space-evenly',
            alignItems: 'center',
          }}
        >
          {
            obj.cantidad > 0 ?
              <SView flex center>
                <SText fontSize={14} color={STheme.color.primary}>TAPEKE</SText>
                <SText fontSize={12} color={STheme.color.text} bold>x {obj.cantidad}</SText>
              </SView>
              : null
          }


          {obj.pedido_producto ?
            <SView flex center>
              <SText fontSize={14} color={STheme.color.primary}>ÍTEMS</SText>
              <SText fontSize={12} color={STheme.color.text} bold>x {this.cantidadProductos(obj.pedido_producto)}</SText>
            </SView>
            : null
          }

        </SView>
      </SView>

      <SView col={"xs-7"}
        padding={5}
      >
        <SView
          row
        >
          <SView
            flex
            col={"xs-10"}
          >
            <SView>
              <SText font={"Roboto"} fontSize={12} color={STheme.color.primary}>Cliente: </SText>
              <SText font={"Roboto"} fontSize={12} color={STheme.color.text}>{dataUsuario?.Nombres} {dataUsuario?.Apellidos}</SText>
            </SView>

            <SText font={"Roboto"} fontSize={12} color={STheme.color.primary}>Total:
              <SText font={"Roboto"} fontSize={12} color={STheme.color.text}
                style={{ paddingLeft: paddingLeftText }}>
                Bs. {montoTotal}
              </SText>
            </SText>
          </SView>

          <SView
            col={"xs-2"}
            center
          >
            <SText flex center fontSize={10}>{new SDate(obj.fecha_on, "yyyy-MM-dd hh:mm:ss.S").toString("hh:mm")}</SText>
            <SView width={25} height={25}
              center
              style={{ borderRadius: 100 }}
              backgroundColor={!!error ? STheme.color.danger : (!!entregado ? STheme.color.accent : STheme.color.lightGray)} >
              <SIcon name="Aspa" width={10} height={10}></SIcon>
            </SView>
          </SView>
        </SView>
        <SHr />
        <SView>
          <SText font={"Roboto"} fontSize={12} color={STheme.color.primary}>Método de pago:
            <SText font={"Roboto"} fontSize={12} color={STheme.color.text}
              style={{ paddingLeft: paddingLeftText }}>
              {this.tipoDePago(obj.tipo_pago)}
            </SText>
          </SText>

          <SText font={"Roboto"} fontSize={12} color={STheme.color.primary}>Tipo de entrega:
            <SText font={"Roboto"} fontSize={12} color={STheme.color.text}
              style={{ paddingLeft: paddingLeftText }}>
              {obj.delivery && obj.delivery > 0 ? "Delivery" : "Recoger"}
            </SText>
          </SText>
        </SView>

      </SView>
    </SView>
  }

  listPedido(dataPackVendidos) {
    if (Object.keys(dataPackVendidos).length === 0) return <SView center col><SText>NO HAY PEDIDOS</SText></SView>

    let arr = Object.values(dataPackVendidos).sort((a, b) => {
      let pesoA = 0;
      let pesoB = 0;
      if (a.state == "pagado" || a.state == "listo" || a.state == "esperando_conductor" || a.state == "buscando_conductor" || a.state == "confirmando_conductor") pesoA = 3;
      if (b.state == "pagado" || b.state == "listo" || b.state == "esperando_conductor" || b.state == "buscando_conductor" || b.state == "confirmando_conductor") pesoB = 3;
      if (a.state == "entregado" || a.state == "entregado_conductor" || a.state == "conductor_llego") pesoA = 2;
      if (b.state == "entregado" || b.state == "entregado_conductor" || b.state == "conductor_llego") pesoB = 2;
      if (a.state == "cancelado" || a.state == "no_recogido") pesoA = 1;
      if (b.state == "cancelado" || b.state == "no_recogido") pesoB = 1;
      return pesoB - pesoA
    })


    return arr.map((obj, index) => {
      var montoTotal = obj.cantidad * obj.precio;
      var dataUsuario = Model.usuario.Action.getByKey(obj.key_usuario);
      // var dataUsuario = { Nombres: "ERROR", Apellidos: "SLOW" } // TODO

      let entregado = obj.state == "entregado" || obj.state == "entregado_conductor" || obj.state == "conductor_llego";
      let error = obj.state == "cancelado" || obj.state == "no_recogido";

      let paddingLeftText = 1

      return <SView col={"xs-12"}
        style={{
          borderWidth: 1,
          borderColor: STheme.color.lightGray,
          borderRadius: 8,
          padding: 6,
          marginBottom: 10
        }}
        row backgroundColor={STheme.color.card}
        onPress={() => { SNavigation.navigate("/pedido", { pk: obj.key }); }}
      >

        <SView col={"xs-5"}
          // backgroundColor="#ff00ff"
          flex
          style={{
            borderRightWidth: 1,
            borderColor: STheme.color.lightGray
          }}>

          <SText center h={15} fontSize={10}>#{obj.key.substr(0, 6)}</SText>

          <SView col={"xs-12"}
            flex row
            style={{
              justifyContent: 'space-evenly',
              alignItems: 'center',
            }}
          >
            {
              obj.cantidad > 0 ?
                <SView flex center>
                  <SText fontSize={14} color={STheme.color.primary}>TAPEKE</SText>
                  <SText fontSize={12} color={STheme.color.text} bold>x {obj.cantidad}</SText>
                </SView>
                : null
            }


            {obj.pedido_producto ?
              <SView flex center>
                <SText fontSize={14} color={STheme.color.primary}>ÍTEMS</SText>
                <SText fontSize={12} color={STheme.color.text} bold>x {this.cantidadProductos(obj.pedido_producto)}</SText>
              </SView>
              : null
            }

          </SView>
        </SView>

        <SView col={"xs-7"}
          padding={5}
        >
          <SView
            row
          >
            <SView
              flex
              col={"xs-10"}
            >
              <SView>
                <SText font={"Roboto"} fontSize={12} color={STheme.color.primary}>Cliente: </SText>
                <SText font={"Roboto"} fontSize={12} color={STheme.color.text}>{dataUsuario?.Nombres} {dataUsuario?.Apellidos}</SText>
              </SView>

              <SText font={"Roboto"} fontSize={12} color={STheme.color.primary}>Total:
                <SText font={"Roboto"} fontSize={12} color={STheme.color.text}
                  style={{ paddingLeft: paddingLeftText }}>
                  Bs. {montoTotal}
                </SText>
              </SText>
            </SView>

            <SView
              col={"xs-2"}
              center
            >
              <SText flex center fontSize={10}>{new SDate(obj.fecha_on, "yyyy-MM-dd hh:mm:ss.S").toString("hh:mm")}</SText>
              <SView width={25} height={25}
                center
                style={{ borderRadius: 100 }}
                backgroundColor={!!error ? STheme.color.danger : (!!entregado ? STheme.color.accent : STheme.color.lightGray)} >
                <SIcon name="Aspa" width={10} height={10}></SIcon>
              </SView>
            </SView>
          </SView>
          <SHr />
          <SView>
            <SText font={"Roboto"} fontSize={12} color={STheme.color.primary}>Método de pago:
              <SText font={"Roboto"} fontSize={12} color={STheme.color.text}
                style={{ paddingLeft: paddingLeftText }}>
                {this.tipoDePago(obj.tipo_pago)}
              </SText>
            </SText>

            <SText font={"Roboto"} fontSize={12} color={STheme.color.primary}>Tipo de entrega:
              <SText font={"Roboto"} fontSize={12} color={STheme.color.text}
                style={{ paddingLeft: paddingLeftText }}>
                {obj.delivery && obj.delivery > 0 ? "Delivery" : "Recoger"}
              </SText>
            </SText>
          </SView>

        </SView>
      </SView>
    })
  }

  contenidoBody(horarioProximo, pedido) {
    let dataHorarioCercano = horarioProximo;
    let fecha = new SDate(dataHorarioCercano.fecha, "yyyy-MM-dd");
    let label = fecha.toString("DAY");
    if (fecha.isCurDate()) {
      label = "Hoy"
    } ``
    label = label + " " + dataHorarioCercano.hora_inicio + " - " + dataHorarioCercano.hora_fin

    var dataPackVendidos = pedido
    if (!dataPackVendidos) return <SLoad />;
    var cant = 0;

    dataPackVendidos.map(o => cant += parseFloat((o.state == "cancelado" || o.state == "no_recogido") ? 0 : (o.cantidad ?? 0)))
    return <>
      <SHr height={20} />
      <SText center fontSize={24}  >{label.replace(/^\w/, (c) => c.toUpperCase())} Hrs.</SText>
      <SHr height={10} />
      <SText style={{ fontWeight: "bold" }} fontSize={16}>( {cant} / {dataHorarioCercano.cantidad} )</SText>
      <SHr height={20} />
      <SView col={"xs-11"} style={{ borderBottomWidth: 2, borderColor: STheme.color.primary }}></SView>
      <SHr height={20} />
      <SView col={"xs-11"} row    >
        {this.listPedido(dataPackVendidos)}
      </SView>
    </>
  }

  aumentar_cantidad_pedidos() {
    if (!this.loadData()) return null
    if (new SDate().isAfter(new SDate(this.horario_proximo.fecha_fin, "yyyy-MM-dd hh:mm:ss.S"))) return null;
    return <SView col={"xs-11"} center
      card row
      height={57}
      onPress={() => {
        if (!this.data?.tapeke_deshabilitado) {
          SNavigation.navigate("/restaurante/addmore", { pk: this.pk });
        } else {
          SPopup.alert("No puedes aumentar la cantidad de Tapekes, ya que tienes los tapekes deshabilitados.")
        }
      }}
      style={{
        borderRadius: 8
      }}
    >
      <SView col={"xs-10.8"} style={{ padding: 8 }} >
        <SText font={"Montserrat-SemiBold"} fontSize={14} >¿Quieres vender más tapekes?</SText>
      </SView>
      <SView col={"xs-1.2"} backgroundColor={STheme.color.primary}
        height center
        style={{
          borderBottomRightRadius: 8,
          borderTopRightRadius: 8
        }}
      >
        <SIcon name='Iarrowd' height={25} />
      </SView>
    </SView>
  }

  modificar_horario() {
    if (!this.loadData()) return null
    if (new SDate().isAfter(new SDate(this.horario_proximo.fecha_fin, "yyyy-MM-dd hh:mm:ss.S"))) return null;
    return <SView col={"xs-11"} center
      card row
      height={57}
      onPress={() => {
        SPopup.confirm({
          title: "¿Desea modificar el horario de entrega?",
          message: "Todos los " + new SDate(this.horario_proximo.fecha_fin, "yyyy-MM-dd hh:mm:ss.S").toString("DAY") + " se atenderá en los horarios registrados, si se modifica el horario afecta a la planificación futura.",
          onPress: () => {
            SNavigation.navigate("/restaurante/modificarHorario", { pk: this.pk })
          }
        })
      }}
      style={{
        borderRadius: 8
      }}
    >
      <SView col={"xs-10.8"} style={{ padding: 8 }}>
        <SText font={"Montserrat-SemiBold"} fontSize={14} >¿Deseas modificar el horario de entrega?</SText>
      </SView>
      <SView col={"xs-1.2"} backgroundColor={"#96BE00"}
        height center
        style={{
          borderBottomRightRadius: 8,
          borderTopRightRadius: 8
        }}
      >
        <SIcon name='Iarrowd' height={25} />
      </SView>
    </SView>
  }

  render_hora_extra() {
    if (!this.loadData()) return null
    if (!new SDate().isAfter(new SDate(this.horario_proximo.fecha_fin, "yyyy-MM-dd hh:mm:ss.S"))) return null;

    return <SView col={"xs-12"} center>
      <SText bold fontSize={18}>EN HORA EXTRA</SText>
      <SHr />
      <BarraCargando />
    </SView>
  }

  renderHorario() {
    if (!this.horario_proximo) return <SLoad />;

    if (Object.values(this.horario_proximo).length === 0) {
      return this.noHorario();
    } else {
      return <>
        {this.aumentar_cantidad_pedidos()}
        <SHr h={8} />
        {/* {this.modificar_horario()} */}
        {this.render_hora_extra()}
        <SHr h={8} />
        {this.contenidoBody(this.horario_proximo, this.pedidos)}
      </>
    }
  }


  render_content() {
    if (!this.state.ready) return <SLoad />

    this.loadData();

    if (!this.data) return <SLoad />

    if (this.data.estado == 2) {
      return <Container center>
        <SHr h={32} />
        <SView width={260}>
          <SText center fontSize={16} >{"Su registro fue realizado correctamente"}</SText>
          <SHr h={16} />
        </SView>
        <SImage src={require("../../Assets/img/registro.png")} style={{
          height: 340
        }} />
        <SHr h={15} />

        <SView width={280} card
          style={{
            borderRadius: 15,
            borderWidth: 2,
            borderColor: STheme.color.primary,
            padding: 12
          }}>
          <SText center fontSize={16} >{"Revisaremos la información enviada y le notificaremos para proseguir con la afiliación correspondiente."}</SText>
        </SView>
        <SHr h={32} />
      </Container>
    }

    return <Container>
      {this.getCabecera(this.data)}

      <SHr />
      {this.renderHorario()}
    </Container>
  }

  noHorario() {
    return <SView center>
      <SText color={STheme.color.danger}>No tine horarios registrados.</SText>
    </SView>
  }

  renderContenido() {
    if (!this.state.ready) return <SLoad />
    return <>
      <SHr height={20} />
      {this.render_content()}
    </>
  }
  render() {

    return (<>
      <SPage title={'Pedidos próximos'}
        hidden
        // footer={(!this.data || this.data?.estado == 2 ? null : <PBarraFooter url={"pedido"} />)}
        onRefresh={(resolve) => {
          this.data = null;
          Model.restaurante.Action.CLEAR();
          Model.horario.Action.CLEAR();
          Model.pack.Action.CLEAR();
          Model.pedido.Action.CLEAR();
          Model.pack_extra.Action.CLEAR();
          // Model.usuario.Action.CLEAR();
          if (resolve) resolve();
        }}
      >
        {this.renderContenido()}
        {(!this.data || this.data?.estado == 2 ? null : <FloatButtomQR />)}
      </SPage>

    </>
    );
  }
}
const initStates = (state) => {
  return { state }
};
export default connect(initStates)(index);