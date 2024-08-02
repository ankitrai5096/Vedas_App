// CreatePostScreen.js
import React, { useState } from 'react';
import { View, TextInput,TextArea, Button, StyleSheet, Text, FlatList, TouchableOpacity } from 'react-native';
import { getAuth } from 'firebase/auth';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './../../Configs/FirebaseConfig';
import { useRouter} from 'expo-router'
import {Colors} from './../../constants/Colors'

const CreatePostScreen = ({ navigation }) => {
    const router = useRouter();
  const [content, setContent] = useState('');
  const [pollOptions, setPollOptions] = useState([]);
  const [newOption, setNewOption] = useState('');

  const auth = getAuth();
  const currentUser = auth.currentUser;

  const addPollOption = () => {
    if (newOption.trim()) {
      setPollOptions([...pollOptions, newOption.trim()]);
      setNewOption('');
    }
  };

  const createPost = async () => {
    if (content.trim() || pollOptions.length > 0) {
      try {
        await addDoc(collection(db, 'posts'), {
          userId: currentUser.uid,
          content,
          pollOptions: pollOptions.length > 0 ? pollOptions : null,
          createdAt: serverTimestamp(),
          likes: [],
          comments: []
        });
        setContent('');
        setPollOptions([]);
        router.replace('/home')
      } catch (error) {
        console.error('Error creating post: ', error);
      }
    } else {
      alert('Please enter content or poll options.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="What's on your mind?"
        value={content}
        onChangeText={setContent}
        multiline
        style={styles.input}
      />
      <View style={styles.pollContainer}>
        <TextInput
          placeholder="Add a poll option"
          value={newOption}
          onChangeText={setNewOption}
          style={styles.poll}
        />
        <Button style={{}} title="Add Option" onPress={addPollOption} />
      </View>
      <FlatList
        data={pollOptions}
        renderItem={({ item, index }) => (
          <View style={styles.pollOption}>
            <Text>{item}</Text>
            <TouchableOpacity onPress={() => {
              setPollOptions(pollOptions.filter((_, i) => i !== index));
            }}>
              <Text style={styles.removeOption}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
      <Button style={styles.button} title="Create Post" onPress={createPost} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop:80,
    backgroundColor:Colors.Primary,
    flex: 1,
    padding: 16,
  
  },
  input: {
    backgroundColor:Colors.white,
    borderBottomWidth: 1,
    marginBottom: 12,
    padding: 8,
    height:100,
    placeholder:'top',
    borderRadius:10,
  },
  button: {
   borderRadius:50,
  },
  poll: {
    backgroundColor:Colors.white,
    borderBottomWidth: 1,
    marginBottom: 12,
    padding: 8,
    borderRadius:10,
    marginTop:10,
  },
  pollContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  pollOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  removeOption: {
    color: 'red',
    marginLeft: 12,
  },
});

export default CreatePostScreen;
