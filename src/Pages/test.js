import { Text, View } from 'react-native'
import React, { Component } from 'react'
import { SButtom, SDate, SInput, SPage, SText, SView } from 'servisofts-component'
import Model from '../Model'
import { connect } from 'react-redux';


import notifee, { EventType, AndroidStyle } from '@notifee/react-native';


const BuildNotification = async (notification) => {
    console.log('Message receivedddd. ', notification);

    let notify = {
        title: notification?.data?.title,
        body: notification?.data?.body,
        data: notification?.data,
        ios: {
            attachments: [

            ]
        },
        android: {

            channelId: "default_channel_id",
            smallIcon: 'icon_notification_partner', // optional, defaults to 'ic_launcher'.
            color: '#ffffff',
            // largeIcon: notification?.data?.image,

            pressAction: {
                id: 'default'
            }
        },
    }
    if (notification?.data?.image) {
        notify.android.largeIcon = notification?.data?.image;
        notify.ios.attachments.push({ url: notification?.data?.image });
    }
    await notifee.displayNotification(notify);
}

class test extends Component {


    hanldrePress = () => {
        BuildNotification({
            data: {
                title: "test",
                body: "algo de descripcion",
            }
        })
    }
    render() {
        return (
            <SPage>
                <SButtom type='danger' onPress={this.hanldrePress}>SEND</SButtom>
            </SPage>
        )
    }
}

const initStates = (state) => {
    return { state }
};
export default connect(initStates)(test);