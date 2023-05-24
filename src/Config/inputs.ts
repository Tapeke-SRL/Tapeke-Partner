import { SInputsCofig, STheme } from 'servisofts-component';
const inputs = (): SInputsCofig => {
    return {
        "default": {
            "LabelStyle": {
                position: "absolute",
                top: -10,
                left: 0,
                fontSize: 14,
                width: "100%",
                color: STheme.color.text,
            },
            "View": {
                borderWidth: 2,
                borderColor: "#E0E0E0" + "40",
                height: 55,
                borderRadius: 16,
                marginTop: 50,

            },
            "InputText": {
                fontSize: 16,
                paddingStart: 20,
                color: STheme.color.text,
                backgroundColor: "#E0E0E0" + "55",
                placeholderTextColor: STheme.color.gray,
                // height: 55,
                borderRadius: 16,
            },
            "error": {
                borderRadius: 16,
                borderColor: STheme.color.danger,
            },
            "placeholder": {
                color: STheme.color.gray,
            }
        }
    }
}
export default inputs;
