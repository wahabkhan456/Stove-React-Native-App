import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, TextInput, ActivityIndicator, Alert, Switch, AsyncStorage } from 'react-native';
import { checkAccessKey, signOut } from '../../config/firebase';
import { logout, loginUserData } from "../../store/actions/login";
import { useDispatch, useSelector } from "react-redux";
import Video from "react-native-video";
import styles from "./styles";

const videoBG = 'https://firebasestorage.googleapis.com/v0/b/stove-e851c.appspot.com/o/login-bg.mp4?alt=media&token=37b165fd-83f2-49ca-b779-5e1225755702';

const Pin = ({ navigation }) => {
    const dispatch = useDispatch();
    const [accessKey, setAccessKey] = useState("");
    const [loader, setLoader] = useState(false);
    const [isEnabled, setIsEnabled] = useState(false);
   
    const validateAccessKey = async () => {
        if (!accessKey) {
            return Alert.alert('Error', 'Please write access key');
        }
        setLoader(true);
        let obj = await checkAccessKey(accessKey);
        setLoader(false);
        if (obj === null || obj.link === null) {
            return Alert.alert('Error', 'Access key is invalid');
        }
        navigation.push('Stream', { rtmpLink: obj.link, streamId: obj.streamId });
    }

    // const signUserOut = async () => {
    //     setLoader(true);
    //     await signOut();
    //     dispatch(logout());
    //     setLoader(false);
    //     navigation.replace("Login");
    // }

    const toggleSwitch = async (status) => {
        await AsyncStorage.setItem('switch', status.toString());
        setIsEnabled(status);        
    }

    useEffect(() => {
        (async _ => {
            let toggleSwitch = await AsyncStorage.getItem('switch');            
            setIsEnabled(toggleSwitch === "true" ? true : false);
        })()
        dispatch(loginUserData({
            name: "Stover",
            email: "stover@stovecook.com"
        }));
    }, [])

    return (
        <View style={styles.MainContainer}>
            <Video
                source={{ uri: videoBG }}
                style={styles.BackgroundVideo}
                muted={true}
                repeat={true}
                resizeMode="cover"
                rate={1.0}
                ignoreSilentSwitch="obey"
            />
            <View style={styles.SwitchContainer}>
            <Switch
                trackColor={{ false: "#f37c76", true: "#ffffff" }}
                thumbColor={isEnabled ? "#f37c76" : "#ffffff"}
                ios_backgroundColor="#f37c76"
                onValueChange={toggleSwitch}
                value={isEnabled}                
            />
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 17 }}>{isEnabled ? "Production" : "Development"}</Text>
            </View>
            <TextInput style={styles.AccessPinInput} autoCorrect={false} onChangeText={text => setAccessKey(text)} value={accessKey} />
            {!loader ? <>
                <TouchableOpacity activeOpacity={0.5} style={styles.StreamButton} onPress={validateAccessKey}>
                    <Text style={styles.ButtonText}>Start Streaming</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity activeOpacity={0.5} style={styles.LoginButton} onPress={signUserOut}>
                        <Text style={styles.ButtonText}>Logout</Text>
                    </TouchableOpacity> */}
            </> : <ActivityIndicator size={50} color="red" style={{ marginTop: 30 }} />}
        </View>
    );
};

export default Pin;