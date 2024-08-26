import React, { Component, forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { View, Text, TextInput, KeyboardAvoidingView, Platform, KeyboardTypeOptions, TextInputProps, TouchableOpacity } from 'react-native';
import { SColType, SHr, SInput, SNavigation, SPage, SText, STheme, SThread, SView } from 'servisofts-component';

const color = "#000000"
const colorGray = "#999999"
const colorGray2 = "#BBBBBB"
const colorCard = "#EEEEEE"
const font = 'Montserrat'

type InputProps = {
    label?: string,
    info?: string,
    placeholder?: string,
    col?: any,
    multiline?: boolean,
    disabled?: boolean,
    height?: number | string,
    inputStyle?: TextInputProps["style"],
    onPress?: any,
    keyboardType?: KeyboardTypeOptions,
    onSubmitEditing?: any,
    defaultValue?: any,
    defaultData?: any,
    filter?: any,
    renderValue?: (evt: { value: any, data: any }) => any;
    onChangeText?: (txt: string) => any;
}

const Input = forwardRef((props: InputProps, ref) => {
    const [value, setValue] = useState(props.defaultValue);
    const [data, setData] = useState(props.defaultData ?? {});
    const inputRef = useRef<TextInput>(null);

    useImperativeHandle(ref, () => ({
        focus: () => {
            if (inputRef.current) inputRef.current.focus();
        },
        getValue: () => {
            return value;
        },
        setValue: (e: any) => {
            setValue(e)
        },
        getData: () => {
            return data;
        },
        setData: (e: any) => {
            setData(e)
        },
    }));
    return <SView col={props.col}>
        <SText fontSize={10} font={"Montserrat-Bold"} color={color}>{props.label}</SText>
        <SHr h={3} />
        <TouchableOpacity style={{
            width: "100%",
            height: props.height ?? 34,

        }} onPress={props.onPress}>
            <TextInput
                ref={inputRef}
                onChangeText={(e) => {
                    if (props.filter) e = props.filter(e);
                    setValue(e)
                    if (props.onChangeText) props.onChangeText(e);
                }}
                value={props.renderValue ? props.renderValue({ data: data, value: value }) : value}
                style={[{
                    width: "100%",
                    height: props.height ?? 34,
                    borderRadius: 5,
                    borderWidth: 0.5,
                    color: "#000",
                    borderColor: "#CCC",
                    backgroundColor: colorCard,
                    padding: 0,
                    paddingStart: 8,
                    fontFamily: "Montserrat",
                    textAlignVertical: "center",
                    fontSize: 10,
                }, props.inputStyle ?? {}]}
                keyboardType={props.keyboardType ?? "default"}
                multiline={props.multiline}
                pointerEvents={(props.onPress) ? "none" : "auto"}
                onSubmitEditing={props.onSubmitEditing}
                placeholderTextColor={colorGray2}
                editable={!props.onPress && !props.disabled}
                placeholder={props.placeholder} />
        </TouchableOpacity>
        <SText fontSize={6.5} font={"Montserrat-SemiBold"} color={colorGray2}>{props.info}</SText>
    </SView>
})

export default Input;



export const InputValidator = (props: { data: any, keys: string[] }) => {
    const faltantes: string[] = [];
    props.keys.map((k) => {
        if (!props.data[k]) faltantes.push(k);
    })
    return faltantes;
}