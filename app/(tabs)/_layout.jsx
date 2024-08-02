import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import Ionicons from '@expo/vector-icons/Ionicons';
import {Colors} from './../../constants/Colors'

const tabLayout = () => {
  return (
    <Tabs  screenOptions={{ headerShown: false, tabBarActiveTintColor:Colors.Primary }}>
      <Tabs.Screen name="home"
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />
        }} />


      <Tabs.Screen name="Notification"
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="people" size={24} color={color} /> 
        }} />

<Tabs.Screen name="createChat"
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="person-circle" size={24} color={color} />
        }} />

      <Tabs.Screen name="Chat"
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="chatbubble" size={24} color={color} /> 
        }} />


<Tabs.Screen name="Profile"
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="person-circle" size={24} color={color} />
        }} />





    </Tabs>
  )
}

export default tabLayout

const styles = StyleSheet.create({})