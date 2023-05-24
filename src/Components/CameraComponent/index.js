import React, { Component } from 'react';
import { SIcon, SImage, SNavigation, SPage, SText, STheme, SView } from "servisofts-component";
import CuadradoEnfoque from './CuadradoEnfoque';

export default class CameraComponent extends Component {
  render() {
    return (
      <SView style={{ flex: 1 }} center backgroundColor='#000'>
        <SText color={"#fff"}>CAMERA NOT IMPLEMENT ON WEB</SText>
        <CuadradoEnfoque />
      </SView>
    );
  }

}