import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from 'expo-router';

const ChatHeader = ({ user, router }) => {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
    });
  }, [navigation]);

  return (
    <Stack.Screen
      options={{
        title: '',
        headerShadowVisible: false,
        headerLeft: () => (
          <View style={styles.headerLeftContainer}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="chevron-back-circle" size={28} color="black" />
            </TouchableOpacity>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user?.fullName}</Text>
            </View>
          </View>
        ),
        headerRight: () => (
            <View style={styles.headerRightContainer}>
              <TouchableOpacity onPress={() => router.back()}>
                <Ionicons name="call" size={28} color="black" />
              </TouchableOpacity>
            </View>
          ),
      }}
    />
  );
};

export default ChatHeader;

const styles = StyleSheet.create({
  headerLeftContainer: {

    marginTop:15,
    marginBottom:20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRightContainer: {
    marginRight:10,
    marginTop:15,
    marginBottom:20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  userInfo: {
    marginLeft: 10,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
  },
});
