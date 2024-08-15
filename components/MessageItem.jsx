import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

const MessageItem = ({ message, currentUser }) => {
    console.log('Current User ID:', currentUser?.userId);
    console.log('Message User ID:', message?.userId);
  if (currentUser?.userId === message?.userId) {
    // Message from the current user
    return (
      <View style={styles.currentUserContainer}>
        <View style={styles.currentUserBubble}>
          <Text style={styles.messageText}>{message.text}</Text>
        </View>
      </View>
    );
  } else {
    // Message from another user
    return (
      <View style={styles.otherUserContainer}>
        <View style={styles.otherUserBubble}>
          <Text style={styles.messageText}>{message.text}</Text>
        </View>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  currentUserContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginVertical: 5,
    marginHorizontal: 10,
  },
  currentUserBubble: {
    maxWidth: '80%',
    padding: 10,
    borderRadius: 15,
    backgroundColor: '#DCF8C6', // Background color for current user's message
  },
  otherUserContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginVertical: 5,
    marginHorizontal: 10,
  },
  otherUserBubble: {
    maxWidth: '80%',
    padding: 10,
    borderRadius: 15,
    backgroundColor: '#FFFFFF', // Background color for other users' messages
  },
  messageText: {
    fontSize: 16,
    color: '#000',
  },
});

export default MessageItem;
