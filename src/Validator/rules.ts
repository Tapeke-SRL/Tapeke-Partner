import { SDate } from "servisofts-component";
import Model from "../Model";

export type Rule = {
    resetTo: string,
    when: () => Promise<boolean>,
    black_list?: string[],// Block routes includes in black_list if when is true
    withe_list?: string[] // Block all routes not includes in withe_list if when is true

}
const rules: Rule[] = [
    {
        resetTo: "/",
        when: async () => { //existe usuario logueado
            return !!Model.usuario.Action.getUsuarioLog();
        },
        black_list: [
            "/welcome",
            "/registro/**",
            "/login"
        ],
    },
    {
        resetTo: "/welcome",
        when: async () => { //No existe usuario logueado
            return !Model.usuario.Action.getUsuarioLog()
        },
        withe_list: [
            "/welcome",
            "/login",
            "/registro/**",
            "/sms"
        ],
    },
    // {
    //     resetTo: "/datos",
    //     when: async () => { //Si el usuario_app tiene conflicto
    //         if (!Model.usuario.Action.getUsuarioLog()) {
    //             return false;
    //         }
    //         // var usuario = Model.usuario.Action.getByKey(Model.usuario.Action.getKey(), {}, "");
    //         // if (!usuario.enable) return true;
    //         return false;
    //     },
    //     withe_list: [

    //     ],

    // },
    
   
]
export default rules;