import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Alert, ToastAndroid } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const AdminPanel = () => {
  const [requests, setRequests] = useState([]);


  // Fetch Admin Status & Requests
  useEffect(() => {

    const fetchRequests = firestore()
    .collection('verifyCreator') // ✅ Directly fetching from the collection
    .onSnapshot(snapshot => {
      if (!snapshot.empty) {
        setRequests(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } else {
        setRequests([]); // Ensure empty list doesn't break the UI
      }
    }, error => {
      console.error("Firestore Error:", error);
    });

    return () => fetchRequests();
  }, []);

  // Verify User
  const handleVerify = async (id, data) => {
    try {
      const verifyRef = firestore().collection('verifyCreator').doc(id);
      const verifyDoc = await verifyRef.get();
  
      if (!verifyDoc.exists) {
        ToastAndroid.show("Error", "User verification request not found.", ToastAndroid.SHORT);
        return;
      }
  
      // Move data to VerifiedCreator collection
      await firestore().collection('VerifiedCreator').doc(id).set(data);
  
      // Delete user from verifyCreator collection after successful move
      await verifyRef.delete();
  
      ToastAndroid.show("Success", "User Verified ", ToastAndroid.SHORT);
    } catch (error) {
      console.error("Verification Error:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  // Decline User
  const handleDecline = async (id, userId) => {
    try {
      const verifyRef = firestore().collection('verifyCreator').doc(id);
      await verifyRef.delete();
      ToastAndroid.show("User verificaiton declined", ToastAndroid.SHORT);
    } catch (error) {
      console.error("Decline Error:", error);
    }
  };


  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Admin Panel - Creator Requests</Text>

      <FlatList
  data={requests}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardText}>Name: {item.name}</Text>
      <Text style={styles.cardText}>Email: {item.email}</Text>
      <Text style={styles.cardText}>Phone: {item.phone}</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.verifyButton} onPress={() => handleVerify(item.id, item)}>
          <Text style={styles.buttonText}>Verify</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.declineButton} onPress={() => handleDecline(item.id, item.userId)}>
          <Text style={styles.buttonText}>Decline</Text>
        </TouchableOpacity>
      </View>
    </View>
  )}
  ListEmptyComponent={() => (
    <Text style={styles.noRequests}>No pending requests</Text>
  )}
/>
    </View>
  );
};

export default AdminPanel;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  heading: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  warning: { textAlign: 'center', fontSize: 18, color: 'red', marginTop: 50 },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 15, elevation: 2 },
  cardText: { fontSize: 16, marginBottom: 5 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  verifyButton: { backgroundColor: '#28a745', padding: 10, borderRadius: 5 },
  declineButton: { backgroundColor: '#dc3545', padding: 10, borderRadius: 5 },
  buttonText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  noRequests: {
    textAlign: 'center',
    fontSize: 16,
    color: 'gray',
    marginTop: 20,
  }
});