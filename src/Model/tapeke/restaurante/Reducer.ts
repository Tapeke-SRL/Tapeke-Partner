import { SStorage } from "servisofts-component";
import { SReducer } from "servisofts-model";

export default class Reducer extends SReducer {
    initialState(extra?: {}) {
        var initState = super.initialState(extra);
        SStorage.getItem("rest_select", (itm) => {
            if (!itm) return;
            initState.rest_select = itm;
        });
        return initState;
    }


}