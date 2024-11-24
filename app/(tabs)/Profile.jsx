import { Button, StyleSheet, Text, View, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../Configs/FirebaseConfig';
import UserAvatar from 'react-native-user-avatar';
import { Colors } from '../../constants/Colors';
import Animated, { FadeInDown, FadeOut, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Loading from '../../components/Loading';
import { useDispatch, useSelector } from 'react-redux';

const Profile = () => {
  const currentUser = useSelector((state) => state.auth.user);
  const [user, setUser] = useState(null);
  const [isAnimationTriggered, setIsAnimationTriggered] = useState(false);
  console.log("current user in profile", currentUser)

  const router = useRouter();

  const translateY = useSharedValue(50); 
  const opacity = useSharedValue(0.5); 
  const navigation = useNavigation();

  useEffect(() => {
    triggerAnimation(); 
  }, []);



  const triggerAnimation = () => {
    setIsAnimationTriggered(true); 
    translateY.value = 50; 
    opacity.value = 0.5;
    translateY.value = withSpring(0, { damping: 12, stiffness: 100 }); 
    opacity.value = withTiming(1, { duration: 500 });
  };



  const logout = async () => {
    try {
      await auth().signOut(); 
      router.replace('/');
    } catch (error) {
      console.error('Error during logout:', error);
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

  if (!currentUser) {
    return <Loading size='large'/>;
  }

  return (
    <Animated.View style={styles.container}>
      {currentUser && (
        <>
          {/* Profile Header Animation */}
          <Animated.View style={[styles.profileHeader, animatedStyle]}>
            <UserAvatar
              style={styles.avatar}
              size={100}
              name={currentUser.displayName || "NA"}
              bgColors={['#5C6B73', '#A3A39D', '#4E4A47', '#D2B49F', '#6A4E23']}
            />
            <Text style={styles.fullName}>{currentUser.displayName}</Text>
            <Text style={styles.email}>{currentUser.email}</Text>


  <Button title="Logout" onPress={logout} />
          </Animated.View>
        </>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
    backgroundColor:Colors.Primary,
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
    backgroundColor: Colors.Primary,
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
