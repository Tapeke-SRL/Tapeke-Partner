import React from "react";
import { SHr, SImage, SNotification, SPage, SText, STheme, SUuid, SView } from "servisofts-component";
import Switch from "../../../Components/Switch";
import Input from "./Input";
import Model from "../../../Model";

export default class EditarHorario extends React.Component<{ dia: any, data: any[], key_restaurante: string, onSave: (e: any[]) => void }> {

    state = {
        data: [...this.props.data]
    }

    filterHorario(e: string) {
        // Permitir solo números y el carácter ':'
        let filtered = e.replace(/[^0-9:]/g, '');

        // Formatear a HH:MM
        const parts = filtered.split(':');
        if (parts.length > 2) return ''; // No más de un ':'

        let hh = parts[0] || '';
        let mm = parts[1] || '';

        // Limitar los valores de las horas y minutos
        if (hh.length > 2) hh = hh.slice(0, 2);
        if (mm.length > 2) mm = mm.slice(0, 2);

        // Asegurarse de que horas y minutos sean válidos
        if (hh.length === 2 && parseInt(hh, 10) > 23) hh = '23';
        if (mm.length === 2 && parseInt(mm, 10) > 59) mm = '59';

        // Unir de nuevo si hay minutos
        if (hh.length === 2 && !filtered.includes(':')) {
            filtered = `${hh}:${mm}`;
        } else {
            filtered = `${hh}${mm ? ':' + mm : ''}`;
        }

        return filtered;
    }


    renderInput(obj: any) {
        return <SView col={"xs-12"} row center key={obj.key}>
            <SText>De</SText>
            <SView width={4} />
            <Input inputStyle={{
                // width: 140,
                flex: 1,
                textAlign: "center",
                fontSize: 14,
                height: 34
            }}
                keyboardType="numeric"
                placeholder="HH:MM"
                defaultValue={obj.hora_inicio}
                filter={this.filterHorario.bind(this)}
                onChangeText={e => {
                    obj.hora_inicio = e
                }}
            />
            <SView width={4} />
            <SText>Hasta</SText>
            <SView width={4} />
            <Input inputStyle={{
                // width: 140,
                flex: 1,
                textAlign: "center",
                fontSize: 14,
                height: 34
            }}
                defaultValue={obj.hora_fin}
                keyboardType="numeric"
                placeholder="HH:MM"
                filter={this.filterHorario.bind(this)}
                onChangeText={e => {
                    obj.hora_fin = e
                }}
            />
            <SView width={4} />
            <SView width={34} height={34} center style={{
                borderWidth: 1,
                borderRadius: 4,
                borderColor: "#CCC",
            }} onPress={(e) => {
                const index = this.state.data.findIndex(a => a?.key === obj?.key);
                if (index === -1) return;
                const newData = [...this.state.data];
                newData.splice(index, 1);
                this.setState({ data: newData });
            }}>
                <SView width={20} height={20} >
                    <SImage src={require("../../../Assets/img/borrar.png")} />
                </SView>
            </SView>
        </SView >
    }
    renderData() {
        if (this.state.data.length <= 0) return <SText col={"xs-12"} center fontSize={14} color={STheme.color.gray}>Cerrado por hoy</SText>
        return this.state.data.sort((a, b) => (a.hora_inicio > b.hora_inicio) || !a.hora_inicio ? 1 : -1).map((da) => {
            return <>
                {this.renderInput(da)}
                <SHr />
            </>
        })
    }

    guardar() {

        const formatTime = (time: any) => {
            // Eliminar caracteres no numéricos y no ':'
            let filtered = time.replace(/[^0-9:]/g, '');

            // Separar en partes
            const parts = filtered.split(':');
            let hh = parts[0] || '';
            let mm = parts[1] || '';

            // Agregar ceros a la izquierda si es necesario
            hh = hh.padStart(2, '0');
            mm = mm.padStart(2, '0');

            // Limitar los valores de las horas y minutos
            if (parseInt(hh, 10) > 23) hh = '23';
            if (parseInt(mm, 10) > 59) mm = '59';

            // Unir de nuevo si no tiene minutos
            if (filtered.includes(':')) {
                return `${hh}:${mm}`;
            }
            return `${hh}:00`; // Si no incluye ':', asumir minutos '00'
        }
        const timeToMinutes = (time: any) => {
            const [hh, mm] = time.split(':').map(Number);
            return hh * 60 + mm;
        };

        let valid = true;
        let errorMessage = "";

        let newData = this.state.data.filter(a => !(!a.hora_inicio && !a.hora_fin))
        newData = newData.map((a) => {
            if (!a.hora_inicio) {
                valid = false;
                errorMessage = "Falta la hora de apertura."
                return;
            }
            if (!a.hora_fin) {
                valid = false;
                errorMessage = "Falta la hora de cierre."
                return;
            }
            const formattedHoraInicio = formatTime(a.hora_inicio);
            const formattedHoraFin = formatTime(a.hora_fin);

            if (timeToMinutes(formattedHoraInicio) >= timeToMinutes(formattedHoraFin)) {
                valid = false;
                errorMessage = "La hora de apertura debe ser mayor a la hora de cierre."
                return null;
            }

            return {
                ...a,
                hora_inicio: formattedHoraInicio,
                hora_fin: formattedHoraFin,
            };
        });
        if (!valid) {
            SNotification.send({
                title: "Verifique los datos",
                body: errorMessage,
                color: STheme.color.danger,
                time: 5000,
            })
            console.log("No valido")
            return;
        }
        console.log(newData);
        this.props.onSave(newData)
        console.log(this.state)
    }
    addNew() {
        this.state.data.push({
            key: SUuid(),
            dia: this.props.dia.dia,
            hora_inicio: null,
            hora_fin: null,
            key_restaurante: this.props.key_restaurante,
            key_usuario: Model.usuario.Action.getKey()
        })
        this.setState({ ...this.state })
    }
    render() {
        return <SView col={"xs-12"} center>
            <SHr h={40} />
            <SView col={"xs-12"} row height={40}>
                <SView flex>
                    <SText>{this.props.dia.label}</SText>
                </SView>
                <SView >
                    <Switch value={this.state.data.length > 0} color={"#fff"} onChange={e => {
                        if (!e) {
                            this.setState({ data: [] })
                        } else {
                            if (this.props.data.length <= 0) {
                                this.addNew()
                                return;
                            }
                            this.setState({ data: [...this.props.data] })
                        }
                    }} />
                </SView>
            </SView>
            {this.renderData()}
            <SHr h={16}/>
            <SText col={"xs-12"} color={STheme.color.primary} style={{ textAlign:"right"}} font={"Montserrat-Bold"} onPress={() => {
                this.addNew()
            }}>{"+ Agregar turno"}</SText>
            <SHr h={20}/>
            <SText color={STheme.color.primary} font={"Montserrat-Bold"} onPress={() => {
                this.guardar()
            }}>{"Guardar"}</SText>
            <SHr h={50} />
        </SView >
    }
}