import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { Colors } from '@/constants/Colors'
import { useRouter} from 'expo-router'






const Login = () => {
    const  router = useRouter();
    return (
        <View style={{marginTop:80,backgroundColor:Colors.white }}>
            <Image source={require('./../assets/images/welcome-image.png')}
                style={{
                    width: '100%',
                    height: 400,
                }} />

            <View style={styles.container}>

                <View style={{ width: '100%', alignItems: 'center', marginTop:60 }}>
                    <Text style={{fontSize: 36, fontFamily: 'outfit-medium', textAlign: 'center', width:'80%' }}>
                        Join Our Community
                    </Text>

                    <Text style={{ fontSize: 16, fontFamily: 'outfit-regular', textAlign: 'center',width:'90%', color:Colors.Gray }}>
                        A one stop solution for all community problems and many more...
                    </Text>
                </View>

                <TouchableOpacity style={styles.button}
                onPress={()=>router.push('auth/sign-in')}>
                    <Text style={{color:Colors.white, fontFamily:'outfit-regular', fontSize:17, textAlign:'center'}}>Get Started</Text>
                </TouchableOpacity>

            </View>
        </View>
    )
}

export default Login

const styles = StyleSheet.create({
    container: {
        alignItems:'center',
        backgroundColor: Colors.white,
        marginTop: -40,
        padding:30,
        height: '100%',
        borderTopLeftRadius:30,
        borderTopRightRadius:30,
    },
    button:{
       
        width:'60%',
        marginTop:50,
        padding:20,
        backgroundColor:Colors.Primary,
        borderRadius:99
        
    }
})