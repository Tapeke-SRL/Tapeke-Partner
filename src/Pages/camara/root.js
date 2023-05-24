import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SLoad, SNavigation, SPage, SText, SView, STheme, SImage, SHr, SDate, SIcon } from 'servisofts-component';
import CameraComponent from '../../Components/CameraComponent';


class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <SPage title={''} disableScroll >
        <CameraComponent />
      </SPage>
    );
  }
}
const initStates = (state) => {
  return { state }
};
export default connect(initStates)(index);