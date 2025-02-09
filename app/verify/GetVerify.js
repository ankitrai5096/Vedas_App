import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { useRef } from 'react'; 
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { Video } from 'expo-av';
import { StatusBar } from 'expo-status-bar';
import { useIsFocused } from '@react-navigation/native'; 
import { useSelector } from 'react-redux';

const Post = () => {
    const currentUser = useSelector((state) => state.auth.user);
    const router = useRouter();
    const videoRef = useRef(null);
    const isFocused = useIsFocused();

    const handleGetStarted = async () => {
        if (videoRef.current) {
            await videoRef.current.stopAsync();
        }
        router.push('/verify/VerificationForm'); 
    };

    React.useEffect(() => {
        const manageVideoPlayback = async () => {
            if (videoRef.current) {
                if (isFocused) {
                    await videoRef.current.playAsync();
                } else {
                    await videoRef.current.pauseAsync(); 
                }
            }
        };
        manageVideoPlayback();
    

        return () => {
            if (videoRef.current) {
                videoRef.current.stopAsync(); 
            }
        };
    }, [isFocused]);


  

    return (
        <View style={{ backgroundColor: Colors.white }}>

<StatusBar translucent backgroundColor="transparent" barStyle="light-content" />


            <Video
                ref={videoRef} 
                source={require('../../assets/images/mahadev-intro-2.mp4')}
                resizeMode="cover"
                isLooping
                shouldPlay={isFocused} 
                style={{
                    width: '100%',
                    height: 700,
                    paddingTop:50,
                    
                }}
            />

            <View style={styles.container}>
                <View style={{ width: '100%', alignItems: 'center', marginTop: 0 }}>
                    <Text style={{ fontSize: 25, fontFamily: 'outfit-medium', textAlign: 'center', width: '100%', }}>
                        Want to be a creator?
                    </Text>

                    <Text style={{ fontSize: 14, fontFamily: 'outfit-regular', textAlign: 'center', width: '90%', color: Colors.Gray, marginTop: 10 }}>
                        “Join our vibrant Spiritual Community and embark on a journey of growth, connection, and enlightenment! 🌟 Here, you’ll find a safe and welcoming space to explore your inner self.”
                    </Text>
                </View>

                <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
                    <Text style={{ color: Colors.white, fontFamily: 'outfit-regular', fontSize: 15, textAlign: 'center' }}>Get Verified</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default Post;

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor: Colors.white,
        marginTop: -200,
        padding: 30,
        height: '100%',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        opacity:1,
    },
    button: {
        width: '60%',
        marginTop: 20,
        padding: 15,
        backgroundColor: '#FF671F',
        borderRadius: 99,
    },
});
