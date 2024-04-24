import { AppRegistry, LogBox } from "react-native";
import App from "./src/App";
import { name as appName } from "./package.json";

import messaging from '@react-native-firebase/messaging';
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
            smallIcon: 'icon_uno', // optional, defaults to 'ic_launcher'.
            color: '#ffffff',

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
const unsubscribe = messaging().onMessage(async remoteMessage => {
    await BuildNotification(remoteMessage);
});


messaging().setBackgroundMessageHandler(async remoteMessage => {
    await BuildNotification(remoteMessage);
});





LogBox.ignoreAllLogs(true);
LogBox.ignoreLogs(['AsyncStorage', 'Animated:', 'VirtualizedList:', 'VirtualizedLists', "Animated.event", "Warning: Each child in a list ","Invalid","Require cycle"])
console.disableYellowBox = true;
AppRegistry.registerComponent(appName, () => App);
