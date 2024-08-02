import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './../../Configs/FirebaseConfig';
import { Colors } from './../../constants/Colors'

const home = () => {
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


      <View style={{ alignItems: 'center', backgroundColor: Colors.Primary, flexDirection: 'row', justifyContent: 'left', }}>
        <Image style={{ width: 70, height: 70, borderRadius: 35, marginLeft: 30, marginTop: 60, }}
          source={require('./../../assets/images/profile-1.jpeg')}

        />

        <View style={{ padding: 30, marginTop: 10, borderRadius: 15, gap: 2, marginTop: 60, }}>
          <Text style={styles.title}>{userData.fullName}</Text>
          <Text style={styles.text}>Flat No: {userData.flat}</Text>
        </View>

      </View>

      <View style={{width:'100%', height:200, backgroundColor:Colors.Gray, opacity:0.2, marginTop:20, padding:40}}>
        <Text>Hello</Text>
      </View>

      <View style={{width:'100%', height:200, backgroundColor:Colors.Gray, opacity:0.2, marginTop:20, padding:40}}>
        <Text>Hello</Text>
      </View>

      <View style={{width:'100%', height:200, backgroundColor:Colors.Gray, opacity:0.2, marginTop:20, padding:40}}>
        <Text>Hello</Text>
      </View>


    </View>
  );
};

export default home;

const styles = StyleSheet.create({
  container: {


  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

  },
  title: {
    color: Colors.white,
    fontFamily: 'outfit-bold',
    fontSize: 18,
  },

  text: {
    color: Colors.white,
    fontFamily: 'outfit-regular',
    fontSize: 16,
    opacity: 0.8,

  },
});
