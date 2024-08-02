import { StyleSheet, Text, View, TextInput,TouchableOpacity, ToastAndroid } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from 'expo-router'
import { Colors } from './../../../constants/Colors'
import { useRouter} from 'expo-router'
import { Ionicons } from '@expo/vector-icons';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../../../Configs/FirebaseConfig'

const SignIn = () => {

const onSignIn=()=>{
    if(!email&&!password){
        ToastAndroid.show('Enter Email & Password', ToastAndroid.BOTTOM)
return;
    }
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      router.replace('/home')
      console.log(user);
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
     
if (errorCode=='auth/invalid-credential'){
    ToastAndroid.show('Invalid Email or Password', ToastAndroid.LONG)
}

    });
}

const[email, setEmail]=useState();
const[password, setPassword]=useState();


    const router = useRouter();

    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({ headerShown: false })
    }, [])
    return (
        <View style={{ marginTop: 50, height: '100%', padding: 30,backgroundColor:Colors.white  }}>
             <Ionicons onPress={()=>router.back()} name="arrow-back-circle-outline" size={30} color="black" />
            <Text style={{ fontSize: 32, fontFamily: 'outfit-bold', paddingLeft: 20, textAlign: 'center', marginTop: 40, color:Colors.Primary }}>Login Here</Text>

            <Text style={{ fontSize: 18, fontFamily: 'outfit-medium', color: Colors.Gray, paddingLeft: 20, textAlign: 'center', marginTop: 20, }}>Welcome back you’ve
                been missed!</Text>
            {/* email */}
            <View style={{marginTop:40}}>

                <TextInput
                onChangeText={(value)=>setEmail(value)}
                 style={styles.Input} placeholder='email' />

            </View>

            {/* password */}

            <View>

                <TextInput
                  onChangeText={(value)=>setPassword(value)}
                secureTextEntry={true}
                 style={styles.Input}
                  placeholder='Password' />

            </View>


            {/* Sign-in button */}

<TouchableOpacity onPress={onSignIn} style={{padding:20, backgroundColor:Colors.Primary,borderRadius:15, marginTop:25}}>
    <Text style={{color:Colors.white, fontFamily:'outfit-medium', fontSize:18, textAlign:'center'}}>Sign In</Text>
</TouchableOpacity>


<TouchableOpacity  onPress={()=>router.push('auth/sign-up')}
 style={{padding:20,  marginTop:15}}>
    <Text style={{fontFamily:'outfit-medium', fontSize:18, textAlign:'center'}}>Create New Account</Text>
</TouchableOpacity>


        </View>
    )
}

export default SignIn

const styles = StyleSheet.create({
    Input: {
        padding: 15,
        borderWidth: 0.5,
        backgroundColor:Colors.Input,
        borderRadius: 15,
        fontFamily: 'outfit-regular',
        marginTop: 20,
    }
})