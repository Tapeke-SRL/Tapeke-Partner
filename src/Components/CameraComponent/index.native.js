import React from "react";
import { Animated, PermissionsAndroid, StyleSheet, Text, View } from "react-native";
import { RNCamera } from "react-native-camera";
import ImageResizer from 'react-native-image-resizer';
import { SIcon, SImage, SNavigation, SPage, SPopup, SText, STheme, SView } from "servisofts-component";
import CuadradoEnfoque from "./CuadradoEnfoque";
import Model from "../../Model";

class CameraComponent extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      flash: false,
      camaraTipo: RNCamera.Constants.Type.back,
      fotoData: null,
      existeText: null,
    }
  }

  componentDidMount() {
    this.state.qr = null;
  }

  
  showCamara() {
    return <RNCamera
      ref={(ref) => { this.camera = ref; }}
      autoFocus={RNCamera.Constants.AutoFocus.on}
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      type={RNCamera.Constants.Type.back}
      flashMode={this.state.flash ? RNCamera.Constants.FlashMode.on : RNCamera.Constants.FlashMode.off}
      captureAudio={false}
      onBarCodeRead={this.onBarCodeRead}>
      <CuadradoEnfoque />
    </RNCamera>
  }


  onBarCodeRead = (result) => {
    // SPopup.alert("Se esta leyendo un QR...")
    const auxData = result;
    const validador = "tapeke://pedido/";
    if (auxData.data.indexOf(validador) > -1) {
      var spliter = auxData.data.split(validador);
      if (spliter.length > 1) {
        this.state.qr = spliter[1];
        SNavigation.navigate("/pedido", { pk: spliter[1] });
      }
    }
  };



  render() {
    return (
      <SView style={{ flex: 1 }}>
        {this.showCamara()}
      </SView>

    );
  }




  takePicture = async () => {
    if (this.camera) {
      const options = { quality: 0.5, base64: true };
      const data = await this.camera.takePictureAsync(options);
      //aqui lo rezi
      ImageResizer.createResizedImage(data.uri, 1024, 1024, 'PNG', 100, 0).then((response) => {

        console.log("Alvaro alto" + response.height + ' ancho ' + response.width);
        this.setState({ fotoData: response })

      }).catch((err) => {

      });
      // console.log("Alvaro alto" + data.height + ' ancho ' + data.width);

    }
  };

}
export default CameraComponent