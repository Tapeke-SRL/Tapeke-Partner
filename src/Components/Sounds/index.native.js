import React, { Component } from 'react'
import { SoundsType } from './type'
import Sound from 'react-native-sound';

export default class Sounds extends Component<SoundsType> {
    static play(obj: SoundsPlayPropsType) {
        var soundPlayer = new Sound('sound_a.mp3', Sound.MAIN_BUNDLE, (error) => {
            if (error) {
                console.log('failed to load the sound', error);
                return;
            }
            console.log('duration in seconds: ' + soundPlayer.getDuration() + 'number of channels: ' + soundPlayer.getNumberOfChannels());
            soundPlayer.play((success) => {
                if (success) {
                    console.log('successfully finished playing');
                } else {
                    console.log('playback failed due to audio decoding errors');
                }
            });
        });
    }
    render() {
        return null;
    }
}