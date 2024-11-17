import { StyleSheet, Text, View, TextInput, TouchableOpacity, ToastAndroid, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation } from 'expo-router';
import { Colors } from './../../../constants/Colors';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from './../../../Configs/FirebaseConfig';
import { doc, setDoc } from 'firebase/firestore'; // Firestore methods
import { ScrollView, GestureHandlerRootView } from 'react-native-gesture-handler';

const SignUp = () => {
    const router = useRouter();
    const navigation = useNavigation();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [flat, setFlat] = useState('');

    useEffect(() => {
        navigation.setOptions({ headerShown: false });
    }, []);

    const onCreateAccount = async () => {
        if (!email || !password || !fullName) {
            ToastAndroid.show('Please enter all the details', ToastAndroid.SHORT);
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await setDoc(doc(db, 'users', user.uid), {
                fullName,
                email,
            });

            ToastAndroid.show('Account created successfully', ToastAndroid.SHORT);
            router.replace('/home');
        } catch (error) {
            const errorMessage = error.message;
            ToastAndroid.show(`Error: ${errorMessage}`, ToastAndroid.SHORT);
        }
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>

<View style={styles.iconContainer}>
                    <Ionicons onPress={() => router.back()} name="arrow-back-circle-outline" size={30} color="black" />
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

                        <TouchableOpacity onPress={() => router.push('auth/sign-in')} style={styles.signInLink}>
                            <Text style={styles.signInText}>Sign In</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </GestureHandlerRootView>
    );
};

export default SignUp;

const styles = StyleSheet.create({
    iconContainer: {
        position: 'absolute',
        top: 60, 
        left: 20,
        zIndex: 1, 
    },
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
        padding: 20,
        marginTop: 10,
        alignItems: 'center',
    },
    signInText: {
        fontFamily: 'outfit-medium',
        fontSize: 18,
    },
});
