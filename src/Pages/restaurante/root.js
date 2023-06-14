import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SLoad, SNavigation, SPage, SText, SView, STheme, SImage, SHr, SDate, SIcon, SPopup, SThread } from 'servisofts-component';
import Container from '../../Components/Container';
import Model from '../../Model';
import SSocket from 'servisofts-socket'
import FloatButtomQR from '../../Components/FloatButtomQR';
import PBarraFooter from '../../Components/PBarraFooter';
import TopBar from '../../Components/TopBar';
import CargaIcon from './CargaIcon';
import BarraCargando from '../../Components/BarraCargando';


class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.pk = SNavigation.getParam("pk");
    this.isRun = false;

  }

  componentDidMount() {
    this.isRun = true;
    this.hilo();
  }
  componentWillUnmount() {
    this.isRun = false;
  }
  hilo() {
    if (!this.isRun) return;
    new SThread(1000 * 60, "hilo_pedido", true).start(() => {
      this.hilo();
      Model.horario.Action.getByKeyRestauranteProximo(this.pk, true)
      // if (this.horario_proximo) {
      // if (new SDate().isAfter(new SDate(this.horario_proximo.fecha_fin, "yyyy-MM-dd hh:mm:ss.S"))) {
      // Model.horario.Action.getByKeyRestauranteProximo(this.pk, true)
      // }
      // }

    })
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
            {/* <SView col={"xs-12"}>
                            <SHr height={15} />
                            <SText fontSize={18} font={"Roboto"} style={{ fontWeight: "bold" }} color={STheme.color.darkGray}>Cliente</SText>
                            <SHr height={15} />
                        </SView> */}
            <SView col={"xs-12"} row >
              <SView center width={70} card height={70} style={{ borderRadius: 8, overflow: 'hidden', }}>
                <SImage src={`${SSocket.api.root}restaurante/${this.data.key}`} style={{ width: "100%", position: "relative", resizeMode: "cover" }} />
              </SView>
              <SView flex center row >
                <SView col={"xs-1"}  >
                </SView>
                <SView col={"xs-11"} row >
                  <SView col={"xs-12"} >
                    <SText font={"Roboto"} color={STheme.color.text} fontSize={16} style={{ fontWeight: "bold" }}  >{this.data.nombre + " "}</SText>
                  </SView>
                  <SHr height={10} />
                  <SView col={"xs-12"} style={{ justifyContent: 'flex-start', }}>
                    <SText color={STheme.color.darkGray} fontSize={14} font={"Roboto"}>Telf: {this.data.telefono}</SText>
                    <SText color={STheme.color.darkGray} fontSize={14} font={"Roboto"}>{this.data.descripcion}</SText>
                  </SView>
                </SView>
                <SHr height={5} />
              </SView>

            </SView>
            <SView width={40} height={40} style={{ position: "absolute", top: 8, right: 8, padding: 4 }} center onPress={() => {
              SNavigation.navigate("/restaurante/edit", { pk: this.pk })
            }}>
              <SIcon name={"Ajustes"} width={20} />
            </SView>
          </SView>
          <SHr height={18} />
        </SView>
        {/* <SHr height={8} /> */}
      </SView>
    )
  }

  getContent(dataPackVendidos) {
    // var dataHorarioCercano = dataPackVendidos
    if (Object.keys(dataPackVendidos).length === 0) return <SView center col><SText>NO HAY PEDIDOS</SText></SView>
    // if (!dataPackVendidos) return null;

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
      //datos UserInfo
      var dataUsuario = Model.usuario.Action.getByKey(obj.key_usuario);
      // if (!dataUsuario) return <SView />;

      let entregado = obj.state == "entregado" || obj.state == "entregado_conductor" || obj.state == "conductor_llego";
      let error = obj.state == "cancelado" || obj.state == "no_recogido";
      return <>
        <SView col={"xs-12"} style={{ borderWidth: 1, borderColor: STheme.color.lightGray, borderRadius: 8 }} row center backgroundColor={STheme.color.card}
          onPress={() => { SNavigation.navigate("/pedido", { pk: obj.key }); }}
        //   onPress={() => {
        //     //SPopup.open({ key: "ubicacion", content: this.popupOpcionDistancia() });
        //     //SPopup.alert();
        // }}
        >
          <SHr height={10} />
          <SView col={"xs-11"} row center>
            <SView col={"xs-3"} center>
              <SView width={60} height={60} style={{ borderRadius: 8, overflow: "hidden" }}>
                <SImage src={SSocket.api.root + "usuario/" + dataUsuario?.key} style={{
                  resizeMode: "cover", width: "100%",
                  height: "100%",
                  borderRadius: 8, overflow: "hidden"
                }} />
              </SView>
            </SView>
            <SView col={"xs-3"} center style={{ borderRightWidth: 1, borderColor: STheme.color.lightGray }}>
              <SText font={"Roboto"} fontSize={13} color={STheme.color.primary}>PACKS</SText>
              <SText font={"Roboto"} fontSize={24} color={STheme.color.text}>x {obj.cantidad}</SText>
            </SView>
            <SView col={"xs-6"} row >
              <SView col={"xs-1"} ></SView>
              <SView row col={"xs-11"} >
                <SView row col={"xs-12"} >
                  <SText font={"Roboto"} fontSize={12} color={STheme.color.primary}>Nombre: </SText>
                  <SText font={"Roboto"} fontSize={12} color={STheme.color.text}>{dataUsuario?.Nombres} {dataUsuario?.Apellidos}</SText>
                </SView>
                <SView row col={"xs-12"}>
                  <SText font={"Roboto"} fontSize={12} color={STheme.color.primary}>Total: </SText>
                  <SText font={"Roboto"} fontSize={12} color={STheme.color.text}>Bs. {montoTotal}</SText>
                </SView>
                <SView col={"xs-12"} flex style={{ alignItems: "flex-end", bottom: -5 }}>
                  <SView width={35} height={35} style={{ borderRadius: 100, }} backgroundColor={!!error ? STheme.color.danger : (!!entregado ? STheme.color.success : STheme.color.lightGray)} center>
                    <SIcon name="Aspa" width={20} height={20}></SIcon>
                  </SView>
                </SView>
              </SView>
            </SView>
            <SHr height={10} />
          </SView>
        </SView>
        <SHr height={10} />
      </>

    })
  }

  contenidoBody(horarioProximo, pack, pedido) {

    if (!this.loadData()) return <SLoad />
    var dataHorarioCercano = horarioProximo
    if (!dataHorarioCercano) return <SText color={STheme.color.danger}>No tine horarios registrados.</SText>

    let fecha = new SDate(dataHorarioCercano.fecha, "yyyy-MM-dd");
    let label = fecha.toString("DAY");
    if (fecha.isCurDate()) {
      label = "Hoy"
    }
    label = label + " " + dataHorarioCercano.hora_inicio + " - " + dataHorarioCercano.hora_fin
    //Pack
    // var dataPack = pack
    // if (!dataPack) return < SText color={STheme.color.danger} > No tiene horarios registrados.</SText >
    var dataPackVendidos = pedido
    if (!dataPackVendidos) return <SView />;
    var cant = 0;
    dataPackVendidos.map(o => cant += parseFloat((o.state == "cancelado" || o.state == "no_recogido") ? 0 : (o.cantidad ?? 0)))
    return <>
      <SHr height={20} />
      <SText font={"Roboto"} center fontSize={24}  >{label.replace(/^\w/, (c) => c.toUpperCase())} Hrs.</SText>
      {/* <SHr height={10} /> */}
      {/* <SView col={"xs-11"} row center height={25} backgroundColor={'transparent'}>
        <SIcon name="Carga" width={270} />
        <CargaIcon width={270} porcent={(cant + 0.09) / (dataHorarioCercano.cantidad)} />
      </SView> */}
      <SHr height={10} />
      {/* <SText font={"Roboto"} fontSize={16}>{dataHorarioCercano.extraData.text},  {new SDate(dataHorarioCercano.fecha, "yyyy-MM-dd").toString("dd de MONTH, yyyy")} </SText> */}
      <SText font={"Roboto"} style={{ fontWeight: "bold" }} fontSize={16}>( {cant} / {dataHorarioCercano.cantidad} )</SText>
      <SHr height={20} />
      <SView col={"xs-11"} style={{ borderBottomWidth: 2, borderColor: STheme.color.primary }}></SView>
      <SHr height={20} />
      <SView col={"xs-11"} row    >
        {this.getContent(dataPackVendidos)}
      </SView>
    </>
  }



  loadData() {
    this.data = Model.restaurante.Action.getByKey(this.pk);
    this.horario_proximo = Model.horario.Action.getByKeyRestauranteProximo(this.pk);
    if (!this.data) return false;
    if (!this.horario_proximo) return false;
    // this.pack = Model.pack.Action.getByKeyHorario(this.horario_proximo.key);
    // if (!this.pack) return null;
    this.pedidos = Model.pedido.Action.getVendidosData({ fecha: this.horario_proximo.fecha, key_pack: this.horario_proximo.key_pack, key_restaurante: this.pk });
    if (!this.pedidos) return false;
    return true;
  }

  aumentar_cantidad_pedidos() {
    if (!this.loadData()) return null
    // if (new SDate().isAfter(this.horario_proximo.sdate)) return null;
    if (new SDate().isAfter(new SDate(this.horario_proximo.fecha_fin, "yyyy-MM-dd hh:mm:ss.S"))) return null;
    return <SView col={"xs-11"} center
      card row
      height={57}
      onPress={() => {
        SNavigation.navigate("/restaurante/addmore", { pk: this.pk });
      }}
      style={{
        borderRadius: 8
      }}
    >
      <SView col={"xs-10.8"} style={{ padding: 8 }} >
        <SText fontSize={14} bold >¿Quieres vender más tapekes?</SText>
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
    // console.log(this.horario_proximo)
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
        {/* <SText fontSize={15} bold >¿Quieres ampliar el horario actual?</SText> */}
        <SText fontSize={14} bold >¿Deseas modificar el horario de entrega?</SText>
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
      {/* <SText fontSize={12}>Espera un tiempo para que puedan </SText> */}
      <BarraCargando />
    </SView>
  }
  render_content() {
    this.loadData();
    if (!this.data) return <SLoad />
    if (this.data.estado == 2) {
      return <Container center >
        <SHr h={32} />
        <SView width={260}>
          <SText center bold fontSize={16} >{"Su registro fue realizado correctamente"}</SText>
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
    // if (!this.loadData()) return <SLoad />
    return <Container>
      {this.getCabecera(this.data)}
      {this.aumentar_cantidad_pedidos()}
      <SHr h={8} />
      {this.modificar_horario()}
      {this.render_hora_extra()}
      <SHr h={8} />
      {this.contenidoBody(this.horario_proximo, this.pack, this.pedidos)}
    </Container>
  }
  render() {
    return (<>
      <SPage title={'Pedidos próximos'}
        hidden
        header={<><TopBar type={"usuario"} /><SView backgroundColor={"#96BE00"} height={20} col={"xs-12"}></SView></>}
        footer={<PBarraFooter url={"pedido"} />}
        onRefresh={(resolve) => {
          Model.restaurante.Action.CLEAR();
          Model.horario.Action.CLEAR();
          Model.pack.Action.CLEAR();
          Model.pedido.Action.CLEAR();
          Model.pack_extra.Action.CLEAR();
          if (resolve) resolve();
        }}
      >
        <SHr height={20} />
        {/* <SText onPress={() => {
          SNavigation.navigate("/test")
        }}>Test</SText> */}
        {this.render_content()}
      </SPage>
      <FloatButtomQR />
    </>
    );
  }
}
const initStates = (state) => {
  return { state }
};
export default connect(initStates)(index);