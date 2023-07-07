import { SThemeThemes } from 'servisofts-component';

const MapStyle = [
  {
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
]
const theme: SThemeThemes = {
  default: {
    barStyle: "light-content",
    barColor: "#FA790E",
    text: "#000000",
    primary: "#FA790E",
    secondary: "#ffffff",
    info: "#96BE00",
    background: "#ffffff",
    card: "#eeeeee99",
    mapStyle: MapStyle,
    accent: "#96BE00"

  },
  dark: {
    barStyle: "light-content",
    barColor: "#FA790E",
    text: "#000000",
    primary: "#FA790E",
    secondary: "#ffffff",
    info: "#96BE00",
    background: "#ffffff",
    card: "#eeeeee99",
    mapStyle: MapStyle,
    accent: "#96BE00"
  }
}
// const theme: SThemeThemes = {
//     default: {
//         barStyle: "light-content",
//         barColor: "#FA790E",
//         text: "#000000",
//         primary: "#FA790E",
//         secondary: "#ffffff",
//         info: "#96BE00",
//         background: "#ffffff",
//         card: "#eeeeee99",
//         mapStyle: MapStyle,
//         accent: "#96BE00"

//     },
//     dark: {
//         barStyle: "light-content",
//         barColor: "#FA790E",
//         text: "#ffffff",
//         primary: "#FA790E",
//         secondary: "#000000",
//         info: "#96BE00",
//         background: "#000000",
//         card: "#44444499",
//         mapStyle: MapStyle
//     }
// }
export default theme;