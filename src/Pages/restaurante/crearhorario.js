import React, { Component } from 'react';
import { connect } from 'react-redux';
import { DatePickerIOS, TimePickerAndroid } from 'react-native'
import { SLoad, SNavigation, SPage, SText, SView, STheme, SImage, SHr, SDate, SIcon, SPopup, SInput } from 'servisofts-component';
import Container from '../../Components/Container';
import PBarraFooter from '../../Components/PBarraFooter';
import PButtom from '../../Components/PButtom';
import PButtom2 from '../../Components/PButtom2';
import TopBar from '../../Components/TopBar';
import Model from '../../Model';
class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.pk = SNavigation.getParam("pk");
    this.key_horario = SNavigation.getParam("key_horario");
    this.fecha = SNavigation.getParam("fecha");
  }

  render_content() {
    let dow = new SDate(this.fecha, "yyyy-MM-dd").getDayOfWeek();
    let duracion_minima = Model.enviroment.Action.getByKey("partner_duracion_minima_de_un_horario");
    return <Container>
      <SHr height={32} />
      <SText center fontSize={16} bold>¿Quieres crear un horario de atención para esta fecha?</SText>
      <SText>{this.fecha}</SText>
      <SHr height={32} />
      <SText>¿En qué horario atenderás?</SText>
      <SHr h={16} />
      {/* <SView row> */}
      <SView col={"xs-12"} row style={{
        justifyContent: "space-between"
      }}>
        <SInput label={"Hora de apertura"} col={"xs-5.5"} ref={ref => this._input_hi = ref} type='hour' required defaultValue={""} />
        <SInput label={"Hora de cierre"} col={"xs-5.5"} ref={ref => this._input_hf = ref} type='hour' required defaultValue={""} />
        <SInput label={"Cantidad"} col={"xs-5.5"} ref={ref => this._input_cantidad = ref} type='number' required defaultValue={"0"} />
        <SInput label={"Precio"} col={"xs-5.5"} ref={ref => this._input_precio = ref} type='money' required defaultValue={parseFloat(15).toFixed(2)} />
      </SView>
      {/* </SView> */}
      <SText color={STheme.color.danger}>{this.state.error}</SText>
      <SHr h={16} />
      <PButtom loading={this.state.loading} onPress={() => {
        let cantidad = this._input_cantidad.getValue();
        let precio = this._input_precio.getValue();
        let hi = this._input_hi.getValue();
        let hf = this._input_hf.getValue();
        if (!duracion_minima) {
          SPopup.alert("Ocurrio un error de conexion, verifique su internet y recargue la ventana.");
          return
        }
        let dhi = new SDate(hi, "hh:mm");
        let dhf = new SDate(hf, "hh:mm");
        console.log(dhi.diffTime(dhf))
        if (dhi.diffTime(dhf) < (1000 * parseFloat(duracion_minima.value))) {
          SPopup.alert("La hora inicio debe ser mayor a la hora fin por minimo " + (parseFloat(duracion_minima.value) / 60).toFixed(0) + " minutos. ");
          return;
        }
        this.setState({ loading: true })
        Model.horario.Action.registro({
          data: {
            dia: dow,
            hora_inicio: hi,
            hora_fin: hf,
            key_restaurante: this.pk,
          },
          key_usuario: Model.usuario.Action.getKey(),
        }).then((resp) => {
          Model.pack.Action.registro({
            data: {
              key_horario: resp.data.key,
              cantidad: cantidad,
              precio: precio
            },
            key_usuario: Model.usuario.Action.getKey()
          }).then((resp) => {
            this.setState({ loading: false })
            console.log(resp)
            SNavigation.goBack();
          }).catch((e) => {
            this.setState({ loading: false })
            SPopup.alert(e.error)
            console.error(e)
          })

        }).catch(e => {
          this.setState({ loading: false })
          SPopup.alert(e.error)
          console.error(e);

        })
        console.log(new SDate(hi, "hh:mm"), new SDate(hf, "hh:mm"))
        // SNavigation.goBack();

        // this.setState({loading: true, error: "" });
        // var cantidad = this._input.getValue()
        // if (!cantidad) {
        //   this.setState({ loading: false, error: "Deve ingresar la cantidad." });
        //   return;
        // }
        // Model.pack_extra.Action.registro({
        //   data: {
        //     cantidad: cantidad,
        //     key_pack: this.pack.key,
        //     fecha: this.horario_proximo.fecha
        //   },
        //   key_usuario: Model.usuario.Action.getKey()
        // }).then((resp) => {
        //   this.setState({ loading: false, error: "" });
        // }).catch(e => {
        //   this.setState({ loading: false, error: e.error });
        // })
      }}>Confirmar</PButtom>

    </Container >
  }

  render() {
    return (<SPage title={''}
      header={<SView backgroundColor={"#96BE00"} height={20} col={"xs-12"}></SView>}
      onRefresh={(calback) => {
        Model.enviroment.Action.CLEAR();
        if (calback) calback()
      }}>
      {this.render_content()}
    </SPage>
    );
  }
}
const initStates = (state) => {
  return { state }
};
export default connect(initStates)(index);