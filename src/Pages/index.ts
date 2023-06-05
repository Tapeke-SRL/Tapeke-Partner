import { SPage, SPageListProps } from 'servisofts-component';

import Root from './root.js';
import login from './login/index';
import profile from './profile';
import registro from './registro';
import pedido from './pedido';
import calendario from './calendario';
import calificacion from './calificacion';
import zona from './zona';
import welcome from './welcome';
import ganancia from './ganancia';
import trabajo from './trabajo';
import soporte from './soporte';
import sms from './sms';
import notification from './notification';
import notificaciones from './notificaciones';
import datos from './datos';
import documento from './documento';
import restaurante from './restaurante';
import direccion from './direccion';
import test from './test.js';

import camara from './camara';
import carga from './carga.js';
import condiciones from './condiciones';
import chat from './chat';
import restaurante_cuenta from './restaurante_cuenta';
import inicioChat from './inicioChat';
export default SPage.combinePages("/", {
    "": carga,
    "test":test,
    "root": Root,
    "welcome": welcome,
    ...login,
    "sms": sms,
    "notification": notification,
    "condiciones": condiciones,
    "inicioChat": inicioChat,
    notificaciones,
    ...registro,
    ...soporte,
    ...profile,
    ...pedido,
    ...calendario,
    ...calificacion,
    ...zona,
    ...ganancia,
    ...trabajo,
    ...datos,
    ...documento,
    ...restaurante,
    ...direccion,
    ...camara,
    ...chat,
    ...restaurante_cuenta
});