import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './../../Configs/FirebaseConfig';
import { Colors } from './../../constants/Colors'

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get current user
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
          // Get user's Firestore document
          const userDoc = await getDoc(doc(db, 'users', user.uid));

          if (userDoc.exists()) {
            setUserData(userDoc.data());
          } else {
            console.log('No such document!');
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.Primary} />
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No user data found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>


      <View style={{ alignItems: 'center', marginTop: 180 }}>
        <Image style={{ width: 180, height: 180, borderRadius: 85, borderWidth: 2, borderColor: Colors.white }}
          source={require('./../../assets/images/profile-1.jpeg')}

        />
        <View style={{ alignItems: 'center', padding: 30, marginTop: 10, borderRadius: 15, gap:12 }}>

          <Text style={styles.text}>{userData.fullName}</Text>

          <Text style={styles.text}>{userData.email}</Text>

          <Text style={styles.text}>{userData.phoneNumber}</Text>

          <Text style={styles.text}>Flat No: {userData.flat}</Text>
        </View>

      </View>

    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    padding: 10, backgroundColor: Colors.Primary,

  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    marginTop: 120,
    textAlign: 'center',
    fontFamily: 'outfit-bold',
    color: Colors.white,
    marginBottom: 20,
  },
 
  text: {
    padding:15,
    borderRadius:15,
    opacity:0.95,
    width:280,
    fontSize: 18,
    fontFamily: 'outfit-medium',
    color: Colors.black,
    backgroundColor:Colors.white

  },
});
