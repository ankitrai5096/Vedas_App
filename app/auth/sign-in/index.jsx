import React, { useState, useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ToastAndroid } from 'react-native';
import { useNavigation } from 'expo-router';
import { Colors } from './../../../constants/Colors';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../../../Configs/FirebaseConfig';
import { StatusBar } from 'expo-status-bar';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const router = useRouter();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, []);

  const onSignIn = () => {
    if (!email && !password) {
      ToastAndroid.show('Enter Email & Password', ToastAndroid.BOTTOM);
      return;
    }
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        router.replace('/home');
        console.log(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        if (errorCode === 'auth/invalid-credential') {
          ToastAndroid.show('Invalid Email or Password', ToastAndroid.LONG);
        }
      });
  };

  

  return (
    <GestureHandlerRootView style={{ flex: 1}}>

<StatusBar translucent backgroundColor="#FF854A" barStyle="light-content" />
      <View style={{marginTop:30,  height: '100%', padding: 30, backgroundColor: Colors.white }}>
        <Ionicons onPress={() => router.back()} name="arrow-back-circle-outline" size={30} color="black" />
        <Text style={{ fontSize: 25, fontFamily: 'outfit-bold', paddingLeft: 20, textAlign: 'center', marginTop: 100, color: Colors.Primary }}>Login Here</Text>

        <Text style={{ fontSize: 14, fontFamily: 'outfit-medium', color: Colors.Gray, paddingLeft: 20, textAlign: 'center', marginTop: 10 }}>Welcome back you’ve been missed!</Text>

        <View style={{ marginTop: 20 }}>
          <TextInput
            onChangeText={(value) => setEmail(value)}
            style={styles.Input}
            placeholder='Email'
          />
        </View>

        <View>
          <TextInput
            onChangeText={(value) => setPassword(value)}
            secureTextEntry={true}
            style={styles.Input}
            placeholder='Password'
          />
        </View>

        <TouchableOpacity onPress={onSignIn} style={{ padding: 20, backgroundColor: '#FF671F', borderRadius: 10, marginTop: 25 }}>
          <Text style={{ color: Colors.white, fontFamily: 'outfit-medium', fontSize: 15, textAlign: 'center' }}>Sign In</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('auth/sign-up')} style={{ padding: 20, marginTop: 10 }}>
          <Text style={{ fontFamily: 'outfit-medium', fontSize: 15, textAlign: 'center' }}>Create New Account</Text>
        </TouchableOpacity>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  Input: {
    padding: 15,
    borderWidth: 0.5,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    fontFamily: 'outfit-regular',
    marginTop: 20,
    display:"flex",
    justifyContent:'center',
    alignItems:'center'
  },
});

export default SignIn;
