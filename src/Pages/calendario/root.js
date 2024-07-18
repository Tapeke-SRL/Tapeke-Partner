import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SButtom, SHr, SLoad, SNavigation, SPage, SText, SView, SPopup, STheme, SImage, SMath, SIcon, SScrollView2, SDate, SList, SList2, SThread } from 'servisofts-component';
import Container from '../../Components/Container';
import SSocket from 'servisofts-socket'
import PBarraFooter from '../../Components/PBarraFooter';
import Model from '../../Model';
import AccentBar from '../../Components/AccentBar';
import TopBar from '../../Components/TopBar';



class root extends Component {
    static TOPBAR = <TopBar type={"usuario"} />;
    static FOOTER = <>
        <PBarraFooter url={"calendario"} />
    </>
    constructor(props) {
        super(props);
        this.state = {
            // curDay: new SDate("2023-03-06", "yyyy-MM-dd")
            curDay: new SDate()
        };
        this.pk = SNavigation.getParam("pk");
    }
    componentDidMount() {
        new SThread(100).start(() => {
            this.setState({ ready: true })
        })
        if (this.scroll) {
            this.scroll.scrollTo({ x: (this.state.curDay.getDay() - 1) * 88 })
        }
        // console.log(this.state.curDay.getDay() * 73 )
    }
    renderDias(data, i) {
        let day = parseFloat(i) + 1
        let fecha = new SDate(this.state.curDay.toString()).setDay(day)
        let isSelect = fecha.equalDay(this.state.curDay)
        let color = isSelect ? STheme.color.white : STheme.color.text
        return <SView width={80} height={90} card style={{
            margin: 4,
            backgroundColor: isSelect ? STheme.color.primary : STheme.color.card
        }} center onPress={() => {
            this.setState({ curDay: fecha })
        }}>
            <SText font={"LondonTwo"} fontSize={24} color={color}>{day}</SText>
            <SHr />
            {/* <SText font={"Roboto"} fontSize={14} color={color}>{fecha.getDayOfWeek()}</SText> */}
            <SText font={"Roboto"} fontSize={14} color={color}>{fecha.getDayOfWeekJson().textSmall}</SText>
        </SView>
    }

    renderHoras(data, i) {
        if (data?.type == "crear") return <SView width={80} height={40} card style={{
            margin: 4,
            backgroundColor: STheme.color.primary
        }} center onPress={() => {
            SPopup.confirm({
                title: "¿Desea agregar un horario de entrega?",
                message: "Este horario será configurado con las comisiones por defecto de Tapeke.",
                onPress: () => {
                    SNavigation.navigate("/restaurante/crearhorario", { pk: this.pk, key_horario: data.key, fecha: this.state.curDay.toString("yyyy-MM-dd") })
                }
            })
        }}>
            <SView row center>
                <SView >
                    <SIcon width={10} height={10} name={"addicon"} />
                </SView>
                <SView width={4} /><SText fontSize={12} color={STheme.color.secondary}>Crear</SText>
            </SView>
        </SView>
        let hora = parseFloat(i) + 1
        // let fecha = new SDate(this.state.curDay).setDay(day)
        return <SView width={80} height={40} card style={{
            margin: 4
        }} center onPress={() => {
            SPopup.confirm({
                title: "¿Desea modificar el horario de entrega?",
                // message: "Esta modificación solo afectará el horario de atención de la fecha especificada. Para la siguiente semana, el horario acordado con Tapeke seguirá siendo el mismo. Si deseas realizar una modificación permanente en el horario de atención, por favor solicítalo a través de Tapeke.",
                // message: "Atencion, esta modificacion del horario de atencion afectara este y todos los "+this.state.curDay.toString("DAY")+" futuros.",
                message: "Todos los " + this.state.curDay.toString("DAY") + " se atenderá en los horarios registrados, si se modifica el horario afecta a la planificación futura.",
                onPress: () => {
                    SNavigation.navigate("/restaurante/modificarHorario", { pk: this.pk, key_horario: data.key, fecha: this.state.curDay.toString("yyyy-MM-dd") })
                }
            })
        }}>
            <SText font={"Roboto"} fontSize={12}>{data.hora_inicio} - {data.hora_fin}</SText>
        </SView>
    }

    renderListaHoras = () => {
        let data = Model.horario.Action.getAllBy({ key_restaurante: this.pk, dia: this.state.curDay.getDayOfWeek() });
        if (!data) return <SLoad />
        return <SList2
            // center
            horizontal
            initSpace={0}
            space={0}
            data={[{ type: "crear", hora_inicio: "0" }, ...Object.values(data)]}
            order={[{ key: "hora_inicio", order: "asc" }]}
            render={this.renderHoras.bind(this)}
        />
    }

    render() {
        if (!this.state.ready) return <SView flex center>
            <SLoad />
        </SView>
        return (<SPage
            hidden
            // footer={}
            center
            onRefresh={(re) => {
                Model.horario.Action.CLEAR();
            }}
        // header={}
        // header={<AccentBar />}
        >
            <SView col={"xs-11.5 md-8"} flex>
                <SHr />
                <SText fontSize={18} bold>{this.state.curDay.toString("MONTH, yyyy")}</SText>
                <SHr />
                <SView col={"xs-12"} height={100}>
                    <SScrollView2 ref={ref => this.scroll = ref} contentContainerStyle={{
                        width: null
                    }}>
                        <SList2
                            horizontal
                            center
                            space={0}
                            data={new Array(SDate.getDaysInMonth(this.state.curDay.getYear(), this.state.curDay.getMonth())).fill(0)}
                            render={this.renderDias.bind(this)}
                        />
                    </SScrollView2>
                </SView>
                <SHr />
                <SHr h={2} color={STheme.color.primary} />
                <SHr />
                <SHr />
                <SText fontSize={18} bold>{"Horarios"}</SText>
                <SHr />
                {this.renderListaHoras()}

            </SView>
        </SPage >
        );
    }
}
const initStates = (state) => {
    return { state }
};
export default connect(initStates)(root);