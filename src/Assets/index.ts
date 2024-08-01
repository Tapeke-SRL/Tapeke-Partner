import { SAssets } from 'servisofts-component';

import Logo, { ReactComponent as LogoW } from './svg/logo.svg';
import logoCompleto, { ReactComponent as logoCompletoW } from './svg/logoCompleto.svg';
import profile2, { ReactComponent as profile2W } from './svg/profile2.svg';
import mensajeria, { ReactComponent as mensajeriaW } from './svg/mensajeria.svg';
import pedidos, { ReactComponent as pedidosW } from './svg/pedidos.svg';
import transporte, { ReactComponent as transporteW } from './svg/transporte.svg';
import pointer, { ReactComponent as pointerW } from './svg/pointer.svg';
import addicon, { ReactComponent as addiconW } from './svg/addicon.svg';
import marcadorMapa, { ReactComponent as marcadorMapaW } from './svg/marcadorMapa.svg';
import Password, { ReactComponent as PasswordW } from './svg/password.svg';
import Conductor, { ReactComponent as ConductorW } from './svg/conductor.svg';
import Date, { ReactComponent as DateW } from './svg/date.svg';

import Restaurante, { ReactComponent as RestauranteW } from './svg/restaurante.svg';
import Aspa, { ReactComponent as AspaW } from './svg/aspa.svg';
import Shopper, { ReactComponent as ShopperW } from './svg/shopper.svg';

import AyudaFlecha, { ReactComponent as AyudaFlechaW } from './svg/ayudaFlecha.svg';
import Idelivery, { ReactComponent as IdeliveryW } from './svg/idelivery.svg';
import Irecoger, { ReactComponent as IrecogerW } from './svg/irecoger.svg';
import Soporte, { ReactComponent as SoporteW } from './svg/soporte.svg';

import mInicio, { ReactComponent as mInicioW } from './svg/mInicio.svg';
import mGanancias, { ReactComponent as mGananciasW } from './svg/mGanancias.svg';
import mSoporte, { ReactComponent as mSoporteW } from './svg/mSoporte.svg';
import mRestaurante, { ReactComponent as mRestauranteW } from './svg/mRestaurante.svg';
import mNotification, { ReactComponent as mNotificationW } from './svg/mNotification.svg';
import mSession, { ReactComponent as mSessionW } from './svg/mSession.svg';
import Icon1, { ReactComponent as Icon1W } from './svg/icon1.svg';
import Manos, { ReactComponent as ManosW } from './svg/manos.svg';
import Ipago, { ReactComponent as IpagoW } from './svg/ipago.svg';
import Iarrowd, { ReactComponent as IarrowdW } from './svg/iarrowd.svg';
import Iganancia, { ReactComponent as IgananciaW } from './svg/iganancia.svg';
import Ichat, { ReactComponent as IchatW } from './svg/irchat.svg';
import Icuenta, { ReactComponent as IcuentaW } from './svg/icuenta.svg';

import SearchTapeke, { ReactComponent as SearchTapekeW } from './svg/searchTapeke.svg';
import LocationTapeke, { ReactComponent as LocationTapekeW } from './svg/locationTapeke.svg';

import Camara from "./svg/camara";
import Imputs from "./svg/imputs";
import Pedidos from "./svg/pedido";
import Calificacion from "./svg/calificacion";

import Message, { ReactComponent as MessageW } from './svg/message.svg';

import menu, { ReactComponent as menuW } from './svg/menu.svg';
import iconoRestaurante, { ReactComponent as iconoRestauranteW } from './svg/iconoRestaurante.svg';
import reloj, { ReactComponent as relojW } from './svg/reloj.svg';
import tapekeMenu, { ReactComponent as tapekeMenuW } from './svg/tapekeMenu.svg';

import whatsapp, { ReactComponent as whatsappW } from './svg/whatsapp.svg';






const Assets: SAssets = {
    svg: {
        "Logo": { Native: Logo, Web: LogoW },
        "logoCompleto": { Native: logoCompleto, Web: logoCompletoW },
        "profile2": { Native: profile2, Web: profile2W },
        "mensajeria": { Native: mensajeria, Web: mensajeriaW },
        "pedidos": { Native: pedidos, Web: pedidosW },
        "transporte": { Native: transporte, Web: transporteW },
        "pointer": { Native: pointer, Web: pointerW },
        "addicon": { Native: addicon, Web: addiconW },
        "MarcadorMapa": { Native: marcadorMapa, Web: marcadorMapaW },
        "InputPassword": { Native: Password, Web: PasswordW },
        "Conductor": { Native: Conductor, Web: ConductorW },
        "Date": { Native: Date, Web: DateW },

        "Restaurante": { Native: Restaurante, Web: RestauranteW },
        "Aspa": { Native: Aspa, Web: AspaW },
        "Shopper": { Native: Shopper, Web: ShopperW },

        "AyudaFlecha": { Native: AyudaFlecha, Web: AyudaFlechaW },
        "Idelivery": { Native: Idelivery, Web: IdeliveryW },
        "Irecoger": { Native: Irecoger, Web: IrecogerW },
        "Soporte": { Native: Soporte, Web: SoporteW },

        "mInicio": { Native: mInicio, Web: mInicioW },
        "mGanancias": { Native: mGanancias, Web: mGananciasW },
        "mSoporte": { Native: mSoporte, Web: mSoporteW },
        "mRestaurante": { Native: mRestaurante, Web: mRestauranteW },
        "mNotification": { Native: mNotification, Web: mNotificationW },
        "mSession": { Native: mSession, Web: mSessionW },
        "Icon1": { Native: Icon1, Web: Icon1W },
        "Manos": { Native: Manos, Web: ManosW },
        "Ipago": { Native: Ipago, Web: IpagoW },
        "Iarrowd": { Native: Iarrowd, Web: IarrowdW },
        "Iganancia": { Native: Iganancia, Web: IgananciaW },
        "Ichat": { Native: Ichat, Web: IchatW },
        "Icuenta": { Native: Icuenta, Web: IcuentaW },

        "SearchTapeke": { Native: SearchTapeke, Web: SearchTapekeW },
        "LocationTapeke": { Native: LocationTapeke, Web: LocationTapekeW },

        "Message": { Native: Message, Web: MessageW },

        "menu": { Native: menu, Web: menuW },
        "iconoRestaurante": { Native: iconoRestaurante, Web: iconoRestauranteW },
        "reloj": { Native: reloj, Web: relojW },
        "tapekeMenu": { Native: tapekeMenu, Web: tapekeMenuW },

        "whatsapp": { Native: whatsapp, Web: whatsappW },



        ...Camara,
        ...Imputs,
        ...Pedidos,
        ...Calificacion

    }
}

export default Assets;