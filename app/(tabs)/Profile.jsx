import { Button, StyleSheet, Text, View, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db, fireDB } from '../../Configs/FirebaseConfig';
import UserAvatar from 'react-native-user-avatar';
import { Colors } from '../../constants/Colors';
import Animated, { FadeInDown, FadeOut, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Loading from '../../components/Loading';
import { useDispatch, useSelector } from 'react-redux';
import { TouchableOpacity } from 'react-native-gesture-handler';

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
    fetchUser()
  }, []);

  const handleGetStarted = async () => {
    router.push('verify/GetVerify');
};

const adminSection = async () => {
  router.push('verify/AdminPanel');
};


  const fetchUser = async () => {

    try {
      if (currentUser) {
        const userDocRef = fireDB.collection('users').doc(currentUser.uid);
        const documentSnapshot = await userDocRef.get();

        if (documentSnapshot.exists) {
          const userData = documentSnapshot.data();
          setUser(userData);
          console.log('User data from Firestore at profle page:', userData);
        } else {
          console.log('No such document!');
        }
      } else {
        console.log('No user is logged in.');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

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
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>          
              <Image style={{ width: 50, height: 50, marginLeft: 5 }} source={require('../../assets/images/profile-pic.png')} />
            </TouchableOpacity>
            <Text style={styles.fullName}>{currentUser.displayName}</Text>
            <Text style={styles.email}>{currentUser.email}</Text>


  <Button title="Logout" onPress={logout} />
  <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
                    <Text style={{ color: Colors.white, fontFamily: 'outfit-regular', fontSize: 15, textAlign: 'center' }}>Get Verified</Text>
                </TouchableOpacity>
{user && user.isAdmin && <TouchableOpacity style={styles.button} onPress={adminSection}>
                    <Text style={{ color: Colors.white, fontFamily: 'outfit-regular', fontSize: 15, textAlign: 'center' }}>Admin Panel</Text>
                </TouchableOpacity> }
                
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
  button: {
    width: '60%',
    marginTop: 20,
    padding: 15,
    backgroundColor: '#FF671F',
    borderRadius: 99,
},
});


export default Profile;
