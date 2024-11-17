import { Button, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useNavigation, useRouter } from 'expo-router';

const Profile = () => {

  const navigation = useNavigation();
  const router = useRouter();


  const goToBookDetails = () => {
    router.push('/BooksDetails'); 
  };
  return (
    <View>
      <Text>Profile</Text>
      <Button title="Go to Screen" onPress={goToBookDetails} />
    </View>
  )
}

export default Profile

const styles = StyleSheet.create({})