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


      <Tabs.Screen name="Books"
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="people" size={24} color={color} /> 
        }} />

<Tabs.Screen name="Post"
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="add" size={34} color="black" />
        }} />

      <Tabs.Screen name="Members"
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