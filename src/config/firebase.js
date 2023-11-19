import firebase from "@react-native-firebase/app";
import "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import { firebaseCredentials } from "../constants/credentials";
import { GoogleSignin, statusCodes } from 'react-native-google-signin';
import { NODE_ENV } from "../../env.json";
import { AsyncStorage } from "react-native";

if (firebase.apps.length <= 2) {
    ["Development", "Production"].map(ele => {
        if (firebase.apps.find(e => e.name === ele) === undefined) {
            firebase.initializeApp(ele === "Development" ? {
                apiKey: "AIzaSyBDQSegEijUV31n10WDZb9HlPcw-d4fs90",
                authDomain: "stove-dev.firebaseapp.com",
                databaseURL: "https://stove-dev.firebaseio.com",
                projectId: "stove-dev",
                storageBucket: "stove-dev.appspot.com",
                messagingSenderId: "936694143166",
                appId: "1:936694143166:web:3cd2b386aea55e527ea6ef"
            } : {
                    apiKey: "AIzaSyDmKF5P-3ML-OoLuk3GWyuq3yK2K4vSlms",
                    authDomain: "stove-e851c.firebaseapp.com",
                    databaseURL: "https://stove-e851c.firebaseio.com",
                    projectId: "stove-e851c",
                    storageBucket: "stove-e851c.appspot.com",
                    messagingSenderId: "924025028242",
                    appId: "1:924025028242:web:e366658e4a687d3421704b",
                    measurementId: "G-2MJLHRF421"
                }, {
                name: ele
            });
        }
    })
}

export const firebaseGoogleLogin = async () => {
    let switchKey = await AsyncStorage.getItem('switch');
    try {
        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();
        const credential = auth.GoogleAuthProvider.credential(userInfo.idToken, userInfo.accessToken)
        await auth().signInWithCredential(credential);
        let userAllowed = await firebase.app((switchKey === "true" ? true : false) ? "Production" : "Development").firestore().collection('userAllowed').doc('users').get();
        if (userAllowed.data().users.find(email => userInfo.user.email === email)) {
            return {
                name: userInfo.user.name,
                email: userInfo.user.email
            }
        }
        else {
            await signOut();
            return null
        }
    } catch (error) {
        console.log(error);
        if (error.code === statusCodes.SIGN_IN_CANCELLED) {
            console.log("user cancelled the login flow");
        }
        else if (error.code === statusCodes.IN_PROGRESS) {
            console.log("operation (f.e. sign in) is in progress already");
        }
        else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
            console.log("play services not available or outdated");
        }
        else {
            console.log("some other error happened");
        }
    }
}

export const getCurrentUserInfo = async () => {
    return GoogleSignin.signInSilently();
};

export const checkAccessKey = async (accessKey) => {
    let switchKey = await AsyncStorage.getItem('switch');
    let reqEvent = await firebase.app((switchKey === "true" ? true : false) ? "Production" : "Development").firestore().collection("events").where("accessPin", "==", accessKey).get();
    if (reqEvent.empty) {
        return null;
    }
    let link;
    let streamId;
    reqEvent.forEach(res => {
        link = res.data().rtmpLink;
        streamId = res.data().videoUrl.split('/').find(e => !isNaN(e) && e)
    });
    return { link, streamId };
}

export const signOut = async () => {
    try {
        await GoogleSignin.revokeAccess();
        await GoogleSignin.signOut();
        await auth().signOut();
    } catch (error) {
        console.error(error);
    }
};