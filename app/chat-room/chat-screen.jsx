import { StyleSheet, Text, View, TouchableOpacity,Alert } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import ChatHeader from '../../components/ChatHeader';
import MessageList from '../../components/MessageList';
import { TextInput } from 'react-native-gesture-handler';
import Feather from '@expo/vector-icons/Feather';
import { db } from '../../Configs/FirebaseConfig';
import { getRoomId } from '../../utils/common';
import { doc, setDoc, collection, Timestamp, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../../context/authContext';

const ChatScreen = () => {
  const router = useRouter();
  const item = useLocalSearchParams();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const textRef = useRef('');
  const inputRef = useRef(null);

  useEffect(() => {
    console.log("Authenticated User ID:", user.userId);
    console.log("Item Params:", item.id);

    createRoomIfNotExist();

    let roomId = getRoomId(user.userId, item.id);
    const docRef = doc(collection(db, 'rooms'), roomId);
    const messagesRef = collection(docRef, 'messages');
    const q = query(messagesRef, orderBy('createdAt','asc' ));

    let unsub = onSnapshot(q, (snapshot)=>{
      let allMessages = snapshot.docs.map(doc=>{
        return doc.data();
      });
      setMessages([...allMessages]);

    });
  }, []);

  const createRoomIfNotExist = async () => {
    try {
      // Validate userId inputs

      const roomId = getRoomId(user.userId, item.id);

      // Validate roomId
      if (!roomId) {
        console.error("Invalid roomId:", roomId);
        return;
      }

      const roomRef = doc(collection(db, 'rooms'), roomId);

      await setDoc(roomRef, {
        roomId,
        createdAt: Timestamp.fromDate(new Date()),
      });
      console.log("Room created with ID:", roomId);
    } catch (error) {
      console.error("Error creating room: ", error);
    }
  };


console.log('messages', messages);

  const handleSendMessage = async () => {
    let message = textRef.current.trim();
    if (!message) return;
  
    try {
      let roomId = getRoomId(user.userId, item.id);
      const docRef = doc(collection(db, 'rooms'), roomId);
      const messagesRef = collection(docRef, 'messages');
      textRef.current="";
      if(inputRef)inputRef?.current?.clear();
  
      const newDoc = await addDoc(messagesRef, {
        userId: user?.userId || 'Unknown User',  // Fallback to 'Unknown User' if userId is undefined
        text: message || '',                     // Fallback to empty string if message is undefined
        sender: user?.fullName || 'Anonymous',   // Fallback to 'Anonymous' if fullName is undefined
        createdAt: Timestamp.fromDate(new Date()),
      });
  
      console.log('new message id', newDoc.id);
    } catch (err) {
      // Properly using Alert to display the error
      Alert.alert('Error', err.message);
    }
  };



  return (
    <View style={styles.container}>
      <ChatHeader user={item} router={router} />

      <View style={styles.messagesContainer}>
        <MessageList messages={messages} currentUser={user} />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
        ref={inputRef}
          onChangeText={value => textRef.current = value}
          style={styles.textInput} placeholder="Type here..." />
        <TouchableOpacity onPress={handleSendMessage}>
          <Feather name="send" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1, // Makes sure the container takes up the full screen
  },
  messagesContainer: {
    flex: 1, // Takes up the remaining space above the input
    paddingHorizontal: 10,
  },
  inputContainer: {
    marginTop: -10,
    borderTopColor: '#ccc',
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  textInput: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    width: '90%',
    padding: 10,
  },
});
