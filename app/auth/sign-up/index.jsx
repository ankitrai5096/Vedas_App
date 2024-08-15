import { StyleSheet, Text, View, TextInput, TouchableOpacity, ToastAndroid } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation } from 'expo-router';
import { Colors } from './../../../constants/Colors';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from './../../../Configs/FirebaseConfig';
import { doc, setDoc } from 'firebase/firestore'; // Import Firestore methods
import { ScrollView,GestureHandlerRootView } from 'react-native-gesture-handler';


const SignUp = () => {
    const router = useRouter();
    const navigation = useNavigation();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [flat, setFlat] = useState('');

    useEffect(() => {
        navigation.setOptions({ headerShown: false });
    }, []);

    const onCreateAccount = async () => {
        if (!email || !password || !fullName || !flat) {
            ToastAndroid.show('Please enter all the details', ToastAndroid.SHORT);
            return;
        }

        try {
            // Create user with email and password
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Store additional user data in Firestore
            await setDoc(doc(db, 'users', user.uid), {
                fullName,
                phoneNumber,
                flat,
                email,
            });

            console.log('User created and data saved successfully:', user);
            ToastAndroid.show('Account created successfully', ToastAndroid.SHORT);

            // Navigate to the home screen or another screen
            router.replace('/home');
        } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log('Error creating account:', errorMessage, errorCode);
            ToastAndroid.show(`Error: ${errorMessage}`, ToastAndroid.SHORT);
        }
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={{ marginTop: 50, height: '100%', padding: 30, backgroundColor: Colors.white }}>
            
            <Ionicons onPress={() => router.back()} name="arrow-back-circle-outline" size={30} color="black" />
            <Text style={{ fontSize: 32, fontFamily: 'outfit-bold', paddingLeft: 20, textAlign: 'center', marginTop: 40, color: Colors.Primary }}>
                Create Account
            </Text>

            <Text style={{ fontSize: 18, fontFamily: 'outfit-medium', color: Colors.Gray, paddingLeft: 20, textAlign: 'center', marginTop: 20 }}>
                Welcome back, you’ve been missed!
            </Text>

            <ScrollView>

                
            </ScrollView>

            <View style={{ marginTop: 40 }}>
                <TextInput
                    style={styles.Input}
                    onChangeText={(value) => setFullName(value)}
                    placeholder='Full Name'
                />
            </View>

            <View>
                <TextInput
                    style={styles.Input}
                    onChangeText={(value) => setEmail(value)}
                    placeholder='Email'
                />
            </View>

            <View>
                <TextInput
                    style={styles.Input}
                    onChangeText={(value) => setPhoneNumber(value)}
                    placeholder='Phone Number'
                />
            </View>

            <View>
                <TextInput
                    style={styles.Input}
                    onChangeText={(value) => setFlat(value)}
                    placeholder='Flat No.'
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

            <TouchableOpacity onPress={onCreateAccount} style={{ padding: 20, backgroundColor: Colors.Primary, borderRadius: 15, marginTop: 25 }}>
                <Text style={{ color: Colors.white, fontFamily: 'outfit-medium', fontSize: 18, textAlign: 'center' }}>
                    Create Account
                </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('auth/sign-in')} style={{ padding: 20, marginTop: 15 }}>
                <Text style={{ fontFamily: 'outfit-medium', fontSize: 18, textAlign: 'center' }}>
                    Sign In
                </Text>
            </TouchableOpacity>
        </View>
         </GestureHandlerRootView>
    );
};

export default SignUp;

const styles = StyleSheet.create({
    Input: {
        padding: 15,
        borderWidth: 0.5,
        backgroundColor: Colors.Input,
        borderRadius: 15,
        fontFamily: 'outfit-regular',
        marginTop: 20,
    },
});
