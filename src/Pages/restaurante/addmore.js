import React, { Component } from 'react';
import { connect } from 'react-redux';
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

  }

  render_content() {
    this.horario_proximo = Model.horario.Action.getByKeyRestauranteProximo(this.pk);
    if (!this.horario_proximo) return <SLoad />;
    this.pack = Model.pack.Action.getByKeyHorario(this.horario_proximo.key);
    if (!this.pack) return <SLoad />;
    return <Container>
      <SHr height={32} />
      <SText center fontSize={16} bold>¿Quieres aumentar la cantidad de tapekes disponibles para esta fecha?</SText>
      <SHr height={32} />
      <SText>¿Cuántos tapekes quieres aumentar?</SText>
      <SHr h={16} />
      <SInput ref={ref => this._input = ref} type='number' placeholder={"0"} style={{
        textAlign: "center"
      }} />
      <SText color={STheme.color.danger}>{this.state.error}</SText>
      <SHr h={16} />
      <PButtom loading={this.state.loading} onPress={() => {
        SPopup.confirm({
          title: "No se podrán disminuir los Tapekes luego, ¿Estás seguro de que deseas aumentar los Tapekes para este horario?.",
          onPress: () => {
            this.setState({ loading: true, error: "" });
            var cantidad = this._input.getValue()
            if (!cantidad) {
              this.setState({ loading: false, error: "Debe ingresar la cantidad." });
              return;
            }
            Model.pack_extra.Action.registro({
              data: {
                cantidad: cantidad,
                key_pack: this.pack.key,
                fecha: this.horario_proximo.fecha
              },
              key_usuario: Model.usuario.Action.getKey()
            }).then((resp) => {
              this.setState({ loading: false, error: "" });
              // Model.pack_extra.Action.CLEAR();
              Model.horario.Action.CLEAR();
              SNavigation.goBack();
            }).catch(e => {
              this.setState({ loading: false, error: e.error });
            })
          }
        })

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