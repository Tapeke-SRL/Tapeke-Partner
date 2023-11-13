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
    this.horario_proximo;
    if (this.key_horario) {
      this.horario_proximo = Model.horario.Action.getByKey(this.key_horario)
    } else {
      this.horario_proximo = Model.horario.Action.getByKeyRestauranteProximo(this.pk);
      this.fecha = this.horario_proximo?.fecha
    }
    if (!this.horario_proximo) return <SLoad />;
    this.pack = Model.pack.Action.getByKeyHorario(this.horario_proximo.key);
    if (!this.pack) return <SLoad />;

    if (new SDate(this.fecha + "T" + this.horario_proximo.hora_fin, "yyyy-MM-ddThh:mm").isBefore(new SDate())) {
      SPopup.alert("No se puede modificar un horario ya pasado");
      SNavigation.goBack();
      return <SText>El horario ya se vencio</SText>
    }
    return <Container>
      <SHr height={32} />
      <SText center fontSize={16} bold>¿Quieres modificar el horario de atención para este día?</SText>
      <SHr height={32} />
      <SText>¿En qué horario atenderás?</SText>
      <SHr h={16} />
      {/* <SView row> */}
      <SView col={"xs-12"} row>
        <SInput label={"Hora de apertura"} col={"xs-6"} ref={ref => this._input_hi = ref} type='hour' required defaultValue={this.horario_proximo.hora_inicio} />
        <SInput label={"Hora de cierre"} col={"xs-6"} ref={ref => this._input_hf = ref} type='hour' required defaultValue={this.horario_proximo.hora_fin} />
      </SView>
      {/* </SView> */}
      <SText color={STheme.color.danger}>{this.state.error}</SText>
      <SHr h={16} />
      <PButtom loading={this.state.loading} onPress={() => {
        let hi = this._input_hi.getValue();
        let hf = this._input_hf.getValue();

        if (hi.length != 5) {
          SPopup.alert("La hora inicio debe ser el formato 24:00");
          return;
        }
        if (hf.length != 5) {
          SPopup.alert("La hora fin debe ser el formato 24:00");
          return;
        }
        let dhi = new SDate(hi, "hh:mm");
        let dhf = new SDate(hf, "hh:mm");
        console.log(dhi.diffTime(dhf))
        if (dhi.diffTime(dhf) < (1000 * 60 * 30)) {
          SPopup.alert("La hora inicio debe ser mayor a la hora fin por minimo 30 minutos. ");
          return;
        }

        console.log(new SDate(hi, "hh:mm"), new SDate(hf, "hh:mm"))
        // SNavigation.goBack();
        Model.horario.Action.editar({
          data: {
            ...this.horario_proximo,
            estado: 1,
            hora_inicio: hi,
            hora_fin: hf,
          },
          key_usuario: Model.usuario.Action.getKey(),
        }).then((resp) => {
          Model.horario.Action.CLEAR();
          SNavigation.goBack();
          // Model.pack.Action.registro({
          //   data: {
          //     key_horario: resp.data.key,
          //     cantidad: cantidad,
          //     precio: precio
          //   },
          //   key_usuario: Model.usuario.Action.getKey()
          // }).then((resp) => {
          //   console.log(resp)
          //   SNavigation.goBack();
          // }).catch((e) => console.error(e))

        }).catch(e => {
          console.error(e);
          SPopup.alert("Error de servidor. " + e?.error)

        })
        // this.setState({ loading: true, error: "" });
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

    </Container>
  }

  render() {
    return (<SPage title={''}>
      <SView backgroundColor={"#96BE00"} height={20} col={"xs-12"}></SView>
      {this.render_content()}
    </SPage>
    );
  }
}
const initStates = (state) => {
  return { state }
};
export default connect(initStates)(index);