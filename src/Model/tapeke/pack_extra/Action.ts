import { SStorage } from "servisofts-component";
import { SAction } from "servisofts-model";
import SSocket from 'servisofts-socket'
import Model from "../..";

export default class Action extends SAction {


    getByKeyPack = (key_pack:any, props:any) => {
        var data = this.getAll(props);
        if (!data) return null;
        return Object.values(data).filter((item: any) => item.key_pack == key_pack)[0];
    }
}