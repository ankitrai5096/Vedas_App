import { StyleSheet, Text, View, TextInput, TouchableOpacity, ToastAndroid, KeyboardAvoidingView, Platform, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation } from 'expo-router';
import { Colors } from './../../../constants/Colors';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth, fireDB } from './../../../Configs/FirebaseConfig';
import { ScrollView, GestureHandlerRootView } from 'react-native-gesture-handler';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import GoogleIcon from '../../../assets/images/icons8-google-logo-240.png'
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loading from '../../../components/Loading';
import * as AuthSession from "expo-auth-session";

const SignUp = () => {
    const router = useRouter();
    const navigation = useNavigation();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [flat, setFlat] = useState('');



    const [request, response, promptAsync] = Google.useAuthRequest({
        clientId: "621706144606-bd9vk977v90n22u5mjm4mgitbf0sfpnk.apps.googleusercontent.com",
        webClientId : "621706144606-00pd9h5kidsnhhe5p5q7ii7fdf10vfaq.apps.googleusercontent.com",  
      });
    
    
    
    
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
    

    useEffect(() => {
        navigation.setOptions({ headerShown: false });
    }, []);
    const onCreateAccount = async () => {
        // Validate inputs
        if (!email?.trim() || !password?.trim() || !fullName?.trim()) {
            ToastAndroid.show('Please enter all the details', ToastAndroid.SHORT);
            return;
        }
    
        try {
            // Create user with email and password
            const userCredential = await auth().createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;
    
            if (!user?.uid) {
                throw new Error("User ID is missing. Registration failed.");
            }
    

             // Update displayName in Firebase Authentication
        await user.updateProfile({
            displayName: fullName || "NA",
        });

            // Save user details to Firestore
            await fireDB.collection('users').doc(user.uid).set({
                uid: user.uid,
                displayName: fullName || "N/A",
                email: user.email,
                signInProvider: "Email/Password",
                // createdAt: fireDB.FieldValue.serverTimestamp(),
            });
    
            ToastAndroid.show('Account created successfully', ToastAndroid.SHORT);
    
            // Navigate to the home screen
            router.replace('/home');
        } catch (error) {
            console.error('Error during account creation:', error);
            ToastAndroid.show(`Error: ${error.message}`, ToastAndroid.LONG);
        }
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>

<View style={styles.iconContainer}>
                </View>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                
                <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
                    <View style={styles.container}>
                        <Text style={styles.title}>Create Account</Text>
                        <Text style={styles.subtitle}>Welcome back, you’ve been missed!</Text>

                        <TextInput
                            style={styles.Input}
                            onChangeText={(value) => setFullName(value)}
                            placeholder='Full Name'
                        />

                        <TextInput
                            style={styles.Input}
                            onChangeText={(value) => setEmail(value)}
                            placeholder='Email'
                        />

                        <TextInput
                            style={styles.Input}
                            onChangeText={(value) => setPassword(value)}
                            secureTextEntry={true}
                            placeholder='Password'
                        />

                        <TouchableOpacity onPress={onCreateAccount} style={styles.button}>
                            <Text style={styles.buttonText}>Create Account</Text>
                        </TouchableOpacity>

                        <Text style={styles.orText}> --------- or ----------</Text>

                        <TouchableOpacity  onPress={() => promptAsync()} >
                          <View style={styles.GoogleConatiner}>
                              <Image style={styles.GoogleConatinerImage} source={GoogleIcon} />
                             <Text style={styles.GoogleConatinerText}> Sign In With Google</Text>
                          </View>
                      </TouchableOpacity>

                        <TouchableOpacity onPress={() => router.push('auth/sign-in')} style={styles.signInLink}>
                        <Text style={{ fontFamily: 'outfit-medium', fontSize: 15, textAlign: 'center' }}>Already have an account? <Text style={{color:'blue'}}>Sign In</Text></Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </GestureHandlerRootView>
    );
};

export default SignUp;

const styles = StyleSheet.create({

    container: {
        flex: 1,
        padding: 30,
        backgroundColor: Colors.white,
        justifyContent: 'center',
    },
    title: {
        fontSize: 25,
        fontFamily: 'outfit-bold',
        textAlign: 'center',
        marginTop: 100, 
        color: Colors.Primary,
    },
    subtitle: {
        fontSize: 16,
        fontFamily: 'outfit-medium',
        color: Colors.Gray,
        textAlign: 'center',
        marginTop: 10,
    },
    Input: {
        padding: 15,
        borderWidth: 0.5,
        backgroundColor: Colors.Input,
        borderRadius: 10,
        fontFamily: 'outfit-regular',
        marginTop: 20,
    },
    button: {
        padding: 20,
        backgroundColor: Colors.Primary,
        borderRadius: 10,
        marginTop: 25,
        alignItems: 'center',
    },
    buttonText: {
        color: Colors.white,
        fontFamily: 'outfit-medium',
        fontSize: 18,
    },
    signInLink: {
        marginTop: hp(16),
        alignItems: 'center',
    },
    signInText: {
        fontFamily: 'outfit-medium',
        fontSize: 18,
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
