import React, { useState, useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ToastAndroid, Image } from 'react-native';
import { useNavigation } from 'expo-router';
import { Colors } from './../../../constants/Colors';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { GoogleAuthProvider, signInWithCredential, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, db } from '../../../Configs/FirebaseConfig';
import { StatusBar } from 'expo-status-bar';
import GoogleIcon from '../../../assets/images/icons8-google-logo-240.png'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, setDoc } from 'firebase/firestore';
import Loading from '../../../components/Loading';
import * as AuthSession from "expo-auth-session";



//621706144606-bd9vk977v90n22u5mjm4mgitbf0sfpnk.apps.googleusercontent.com

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const [isSigningIn, setIsSigningIn] = useState(false);

  const router = useRouter();
  const navigation = useNavigation();




  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: "621706144606-bd9vk977v90n22u5mjm4mgitbf0sfpnk.apps.googleusercontent.com",
    webClientId : "621706144606-00pd9h5kidsnhhe5p5q7ii7fdf10vfaq.apps.googleusercontent.com",
   
    
  });

  console.log('Google Response:', response);

  // console.log("redirecturi: it's here", redirectUri)

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
  
      signInWithCredential(auth, credential)
        .then((userCredential) => {
          // Navigate to the home screen
          router.replace('/home');
        })
        .catch((error) => {
          console.error('Google sign-in error: ', error.message);
        });
    }
  }, [response]);

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




  // const SignInScreen = () => {
  //   const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
  //     clientId: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com', // Your client ID
  //   });


  if (isSigningIn) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Loading size="large" color="#0000ff" />
      </View>
    );
  }
  
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>

      <StatusBar translucent backgroundColor="#FF854A" barStyle="light-content" />
      <View style={{ marginTop: 30, height: '100%', padding: 30, backgroundColor: Colors.white }}>
        {/* <Ionicons onPress={() => router.back()} name="arrow-back-circle-outline" size={30} color="black" /> */}
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


        <Text style={styles.orText}> --------- or ----------</Text>

        <TouchableOpacity  onPress={() => promptAsync()} >
          <View style={styles.GoogleConatiner}>
            <Image style={styles.GoogleConatinerImage} source={GoogleIcon} />
            <Text style={styles.GoogleConatinerText}> Sign In With Google</Text>
          </View>
        </TouchableOpacity>


        <TouchableOpacity onPress={() => router.push('auth/sign-up')} style={{ padding: 20, marginTop: hp(18) }}>
          <Text style={{ fontFamily: 'outfit-medium', fontSize: 15, textAlign: 'center' }}>Didn't have an account? <Text style={{ color: 'blue' }}>Sign Up</Text></Text>
        </TouchableOpacity>


        {/* <TouchableOpacity> <Text> Sign In With Google</Text> </TouchableOpacity> */}
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
    display: "flex",
    justifyContent: 'center',
    alignItems: 'center'
  },

  GoogleConatiner: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'black',
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'black',
  },
  GoogleConatinerImage: {
    width: 30,
    height: 30,
  },
  GoogleConatinerText: {
    fontSize: 16,
    fontFamily: 'outfit-regular',
    color: 'white'
  },
  orText: {
    color: '#4B5563',
    textAlign: 'center',
    marginVertical: hp(2)
  },
});

export default SignIn;
