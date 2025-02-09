import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, Button, ScrollView, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants/Colors';

const VerificationForm = () => {
  const [form, setForm] = useState({
    name: '',
    age: '',
    religion: '',
    email: '',
    phone: '',
    address: '',
  });

  const handleInputChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = () => {
    console.log("Form Details:", form);
    // Add your form submission logic here
    alert('Form Submitted Successfully');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Verification Form</Text>

      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        value={form.name}
        onChangeText={(text) => handleInputChange('name', text)}
      />

      <Text style={styles.label}>Age</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your age"
        keyboardType="numeric"
        value={form.age}
        onChangeText={(text) => handleInputChange('age', text)}
      />

      <Text style={styles.label}>Religion</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your religion"
        value={form.religion}
        onChangeText={(text) => handleInputChange('religion', text)}
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        keyboardType="email-address"
        value={form.email}
        onChangeText={(text) => handleInputChange('email', text)}
      />

      <Text style={styles.label}>Phone</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your phone number"
        keyboardType="phone-pad"
        value={form.phone}
        onChangeText={(text) => handleInputChange('phone', text)}
      />

      <Text style={styles.label}>Address</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your address"
        value={form.address}
        onChangeText={(text) => handleInputChange('address', text)}
      />

      {/* <Button style={styles.button} title="Submit" onPress={handleSubmit} /> */}
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                    <Text style={{ color: Colors.white, fontFamily: 'outfit-regular', fontSize: 15, textAlign: 'center' }}>Submit</Text>
                </TouchableOpacity>
    </ScrollView>
  );
};

export default VerificationForm;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  
  },
  heading: {
    marginTop:50,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'left',
    color: '#333',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  button:{
    width: '100%',
    marginTop: 20,
    padding: 15,
    backgroundColor: '#FF671F',
    borderRadius: 5,
  }
});
