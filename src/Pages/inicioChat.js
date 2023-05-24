import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SDate, SHr, SList, SLoad, SPage, SText, STheme, SView, STextProps, SIcon, SForm } from 'servisofts-component';
import Container from '../Components/Container';
import PButtom from '../Components/PButtom';
import Model from '../Model';

class inicioChat extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    contenido() {
        let propsText: STextProps = {
            font: 'Roboto', fontSize: 15, color: STheme.color.darkGray, justify: true,
        }
        return <>
            <SView col={'xs-8'} center backgroundColor={STheme.color.white+"95"} 
            style={{
                borderRadius:8
            }}
            >
                <SHr height={15} />
                <SText font='Roboto-Bold' center fontSize={25} color={STheme.color.darkGray}>¿Cómo podemos ayudarte?</SText>
                <SHr height={30} />
                <SText font='Roboto-Bold' center fontSize={18} color={STheme.color.darkGray}>Describe tu consulta o problema</SText>
                <SHr height={20} />
            </SView>
        </>
    }

    renderBack() {
        if (!this.state.layout) return null;
        var h = this.state.layout.width / 1.05
        return <SView col={"xs-12"} width={h} style={{
            position: "absolute",
            top: 0,
            left: 10,
            zIndex: -1,
            // opacity:"70%"
        }}>
            <SIcon name={"Soporte"} />
        </SView>
    }

    form() {

        return <SView col={"xs-12"} center>
            <SForm
                // ref={(form) => { this.form = form; }}
                col={"xs-11 sm-9 md-7 lg-5 xl-4"}
                inputProps={{
                	// customStyle: "Calistenia"
                	col: "xs-12",
                	separation: 16
                }}
                inputs={{
                    titulo: { placeholder: "Título" },
                    descripcion: {  placeholder: "Descripción", height:100, type:"textArea"  },
                    
                }}
                // onSubmitName={"APLICAR"}
                onSubmit={(values) => {
                   
                }}
            />
        </SView>
    }

    render() {

        return (
            <SPage title={'Soporte Chat'} center disableScroll>
                <SHr height={35} />
                <SView col={"xs-12"} flex center onLayout={(evt) => {
                    this.setState({ layout: evt.nativeEvent.layout })
                }}>
                    {this.renderBack()}
                    <Container>
                        <SHr height={45} />
                        {this.contenido()}
                        <SHr height={25} />
                        {this.form()}
                        <SHr height={45} />
                        <PButtom
							props={{
								type: "outline"
							}}
							onPress={() => { this.form.submit() }}
						>{("Iniciar chat")}</PButtom>
                         <SHr height={45} />
                    </Container>
                </SView>

            </SPage>
        );
    }
}
const initStates = (state) => {
    return { state }
};
export default connect(initStates)(inicioChat);