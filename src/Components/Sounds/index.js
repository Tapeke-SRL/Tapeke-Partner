import React, { Component } from 'react'
import { SoundsType, SoundsPlayPropsType } from './type'
import { SThread } from 'servisofts-component';
export default class Sounds extends Component<SoundsType> {
    static play(obj: SoundsPlayPropsType) {
        // let btn = document.createElement("button")
        // btn.addEventListener('click', () => {
        const audio = new Audio('sound_a.mp3');
        audio.play();
        // })
        // new SThread(1000, "Asdasd", true).start(() => {
        // btn.click();
        // })

    }
    render() {
        // return 
    }
}