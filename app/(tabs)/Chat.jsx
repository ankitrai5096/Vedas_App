import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image, FlatList, TouchableOpacity } from 'react-native';
import { getAuth, useAuth } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../Configs/FirebaseConfig';
import { Colors } from '../../constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';

const Profile = () => {
  const [usersData, setUsersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const router = useRouter();
  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchUsersData = async () => {
      try {
        // Fetch all users' documents from Firestore
        const usersCollection = collection(db, 'users');
        const userDocsSnapshot = await getDocs(usersCollection);

        if (!userDocsSnapshot.empty) {
          // Extract user data from each document
          const users = userDocsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((doc) => doc.uid !== currentUser?.uid);
          setUsersData(users);
        } else {
          console.log('No users found!');
        }
      } catch (error) {
        console.error('Error fetching users data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsersData();
  }, []);
 


  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.Primary} />
      </View>
    );
  }




  return (
    <View style={styles.container}>
      <FlatList style={{ marginTop: 50, }}
        data={usersData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (

          <TouchableOpacity
       
            onPress={() => router.push({pathname:'/chat-room/chat-screen', params: item})}
          >
            <View style={styles.userContainer}>

              <View style={{ flexDirection: 'row', gap: 10 }}>
                <Image
                  style={styles.profileImage}
                  source={require('./../../assets/images/profile-1.jpeg')}
                />
                <View style={styles.userInfo}>
                  <Text style={styles.text}>{item.fullName}</Text>
                  <Text style={styles.texts}>Flat No: {item.flat}</Text>
                </View>

              </View>




              <Ionicons name="notifications-circle-sharp" size={28} color="black" />
            </View>
       
            </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Primary,
    padding: 10,


  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

  },
  userContainer: {

    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: 400,
    padding: 10,
    marginTop: 10,
    borderRadius: 15,
    gap: 20,
    backgroundColor: Colors.white,
    opacity: 0.95,
    width: '98%',
  },

  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  userInfo: {

  },
  text: {
   
    fontWeight: 'bold',
    borderRadius: 15,
    fontSize: 18,
    fontFamily: 'outfit-regular',
    color: Colors.black,
  },
  texts: {
   
    opacity:0.7,
    borderRadius: 15,
    fontSize: 18,
    fontFamily: 'outfit-regular',
    color: Colors.black,
  },
});
