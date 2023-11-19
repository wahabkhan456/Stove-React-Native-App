import { StyleSheet } from 'react-native';
import { screenWidth, screenHeight } from '../../constants/screen';

export default StyleSheet.create({
    MainContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    BackgroundVideo: {
        height: screenHeight,
        position: "absolute",
        top: 0,
        left: 0,
        alignItems: "stretch",
        bottom: 0,
        right: 0
    },
    SwitchContainer: {
        position: 'absolute', 
        top: 0, 
        right: 0, 
        flexDirection: 'row', 
        alignItems: 'center', 
        padding: 10 
    },
    AccessPinInput: {
        height: 40,
        width: screenWidth / 1.5,
        borderRadius: 30,
        backgroundColor: 'white',
        padding: 10,
        fontSize: 18,
        fontWeight: 'bold',
        color: 'red'
    },
    StreamButton: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'red',
        height: 35,
        width: screenWidth / 2,
        borderRadius: 30,
        marginTop: 30,
        marginBottom: 10
    },
    LoginButton: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'indigo',
        height: 35,
        width: screenWidth / 2,
        borderRadius: 30
    },
    ButtonText: {
        color: 'white',
        fontSize: 15,
        fontWeight: 'bold',
        textTransform: 'uppercase'
    }
});