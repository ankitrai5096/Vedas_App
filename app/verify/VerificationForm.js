import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, ScrollView, Alert, Modal, ToastAndroid } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useRouter } from 'expo-router';

const CreatorForm = () => {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    socialMedia: '',
  });
  const [modalVisible, setModalVisible] = useState(false);

  const handleInputChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handlePreview = () => {
    if (!form.name || !form.email || !form.phone) {
      Alert.alert("Error", "All fields are required!");
      return;
    }
    setModalVisible(true);
  };

  const handleSubmit = async () => {
    try {
      await firestore().collection('verifyCreator').add(form);
      ToastAndroid.show("Your request has been submitted!", ToastAndroid.SHORT);
      setForm({ name: '', email: '', phone: '', bio: '', socialMedia: '' });
      setModalVisible(false);
      router.push('/')
    } catch (error) {
      console.error("Error submitting form: ", error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Apply as a Creator</Text>
      {Object.keys(form).map((field, index) => (
        <View key={index} style={styles.inputContainer}>
          <Text style={styles.label}>{field.charAt(0).toUpperCase() + field.slice(1)}</Text>
          <TextInput
            style={styles.input}
            placeholder={`Enter your ${field}`}
            value={form[field]}
            onChangeText={(text) => handleInputChange(field, text)}
          />
        </View>
      ))}
      <TouchableOpacity style={styles.button} onPress={handlePreview}>
        <Text style={styles.buttonText}>Preview</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeading}>Preview Your Details</Text>
            {Object.keys(form).map((field, index) => (
              <Text key={index} style={styles.modalText}><Text style={styles.bold}>{field.charAt(0).toUpperCase() + field.slice(1)}:</Text> {form[field]}</Text>
            ))}
            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default CreatorForm;

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: '#f4f4f4' },
  heading: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  inputContainer: { marginBottom: 15 },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 5 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, backgroundColor: '#fff' },
  button: { backgroundColor: '#FF671F', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  cancelButton: { backgroundColor: '#ccc' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: '#fff', padding: 20, borderRadius: 10, width: '80%', alignItems: 'center' },
  modalHeading: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  modalText: { fontSize: 16, marginBottom: 10 },
  bold: { fontWeight: 'bold' },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
});
