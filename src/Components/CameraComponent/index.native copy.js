import React from "react";
import { Animated, PermissionsAndroid, StyleSheet, Text, View } from "react-native";
import { RNCamera } from "react-native-camera";
import ImageResizer from 'react-native-image-resizer';
import { SIcon, SImage, SNavigation, SPage, SText, STheme, SView } from "servisofts-component";

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
      type={this.state.camaraTipo ? RNCamera.Constants.Type.front : RNCamera.Constants.Type.back}
      flashMode={this.state.flash ? RNCamera.Constants.FlashMode.on : RNCamera.Constants.FlashMode.off}
      captureAudio={false}
      onBarCodeRead={this.onBarCodeRead}>
      <SView style={{ flex: 1, width: '100%', height: 250, backgroundColor: 'rgba(0, 0, 0, 0.5)' }} row center>
      </SView>


      <View style={[{ flexDirection: 'row' }]}>
        <View style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', flex: 1, }} />
        <Animated.View
          style={{ width: 250, height: 250, borderWidth: 3, borderColor: '#fcb602', backgroundColor: 'transparent', borderRadius: 1, }}
        />
        <View style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', flex: 1, }} />

      </View>

      <SView style={{ flex: 1, width: '100%', height: 250, backgroundColor: 'rgba(0, 0, 0, 0.5)' }} row center>
        <SText center style={{ marginTop: 14, width: 300, color: '#fff' }} > Coloque el código QR en el cuadro y se escaneará automáticamente. </SText>
      </SView>

    </RNCamera>
  }


  onBarCodeRead = (result) => {
    const { navigate } = this.props.navigation;
    const auxData = result;

    if (this.state.qr) return;

    const validador = "tapeke://pedido/";
    if (auxData.data.indexOf(validador) > -1) {
      var spliter = auxData.data.split(validador);
      if (spliter.length > 1) {
        this.state.qr = spliter[1];
        // alert(spliter[1]);    
        // alert(JSON.stringify(dataa.data));
         SNavigation.replace("pedido/", { key_pedido: spliter[1] });
      }
    }
  };



  render() {
    return (

      <SPage title={''} row style={{ overflow: 'hidden' }} >
        <SView flex>
          {this.showCamara()}
        </SView>
      </SPage>

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