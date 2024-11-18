import { Button, StyleSheet, Text, View, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../Configs/FirebaseConfig';
import UserAvatar from 'react-native-user-avatar';
import { Colors } from '../../constants/Colors';
import Animated, { FadeInDown, FadeOut, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { useFocusEffect } from '@react-navigation/native';

const Profile = () => {
  const [user, setUser] = useState(null);

  const router = useRouter();

  const translateY = useSharedValue(50); 
  const opacity = useSharedValue(0.5); 

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userDocRef = doc(db, 'users', currentUser.uid);
        const querySnapshot = await getDoc(userDocRef);

        if (querySnapshot.exists()) {
          const userData = querySnapshot.data();
          setUser(userData);
        } else {
          console.log('No such document!');
        }
      } else {
        console.log('No user is logged in.');
      }
    } catch (error) {
      console.error('Error fetching user data: ', error);
    }
  };



  useFocusEffect(
    React.useCallback(() => {
      translateY.value = 50; 
      opacity.value = 0.5;
      translateY.value = withSpring(0, { damping: 12, stiffness: 100 }); 
      opacity.value = withTiming(1, { duration: 500 });
    }, [])
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));
  const goToBookDetails = () => {
    router.push('/BooksDetails');
  };

  if (!user) {
    return <Text>Loading...</Text>;
  }

  return (
    <Animated.View style={[styles.container,]}>
      <Animated.View style={[styles.profileHeader, animatedStyle]}>
        <UserAvatar style={styles.avatar} size={100} name={user.fullName} bgColors={[ "#5C6B73", "#A3A39D", "#4E4A47", "#D2B49F", "#6A4E23" ]} />
        <Text style={styles.fullName}>{user.fullName}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </Animated.View>

      <Animated.View style={[styles.infoContainer, animatedStyle]}>
        <Text style={styles.infoText}>Sign-in Provider: {user.signInProvider}</Text>
        <Text style={styles.infoText}>Account Created: {new Date(user.createdAt).toLocaleDateString()}</Text>
      </Animated.View>

      {/* <Button title="Go to Book Details" onPress={goToBookDetails} color="#fff" /> */}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor:'rgba(255, 103, 31, 0.1)',
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
    backgroundColor: 'rgba(255, 103, 31, 0.6)',
    paddingVertical: 40,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    width: '100%',
    maxWidth: 350,
    textAlign: 'center',
  },
  avatar: {
    marginBottom: 15,
  },
  fullName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  email: {
    fontSize: 18,
    color: '#f1f1f1',
    marginBottom: 10,
  },
  infoContainer: {
    marginVertical: 20,
    backgroundColor: 'rgba(255, 103, 31, 0.6)',
    padding: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    width: '100%',
    maxWidth: 350,
  },
  infoText: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 10,
  },
});

export default Profile;
