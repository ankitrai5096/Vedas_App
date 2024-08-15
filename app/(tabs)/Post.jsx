import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Text, FlatList, TouchableOpacity } from 'react-native';
import { getAuth } from 'firebase/auth';
import { collection, query, orderBy, onSnapshot, updateDoc, doc, arrayUnion, getDoc,addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../Configs/FirebaseConfig';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';

const CreatePostScreen = () => {
  const router = useRouter();
  const [content, setContent] = useState('');
  const [pollOptions, setPollOptions] = useState([]);
  const [newOption, setNewOption] = useState('');
  const [userVotes, setUserVotes] = useState(new Set()); // Track user votes
  const [fullName, setFullName] = useState('');

  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          setFullName(userDoc.data().fullName);
        } else {
          console.error('No such user document!');
        }
      } catch (error) {
        console.error('Error fetching user details: ', error);
      }
    };

    fetchUserDetails();
  }, [currentUser.uid]);


  const addPollOption = () => {
    if (newOption.trim()) {
      setPollOptions([...pollOptions, { text: newOption.trim(), votes: [] }]);
      setNewOption('');
    }
  };

  const createPost = async () => {
    if (content.trim() || pollOptions.length > 0) {
      try {
        await addDoc(collection(db, 'posts'), {
          userId: currentUser.uid,
          userFullName: fullName, // Include the full name here
         
          content,
          pollOptions: pollOptions.length > 0 ? pollOptions : null,
          createdAt: serverTimestamp(),
          likes: [],
          comments: []
        });
        setContent('');
        setPollOptions([]);
        setUserVotes(new Set()); // Reset votes after creating post
        router.replace('/home');
      } catch (error) {
        console.error('Error creating post: ', error);
      }
    } else {
      alert('Please enter content or poll options.');
    }
  };

  const handleVote = (optionIndex) => {
    setUserVotes(new Set(userVotes).add(optionIndex));
  };

  return (
    <View style={styles.container}>
      <TextInput
       multiline={true}
        placeholder="What's on your mind?"
        value={content}
        onChangeText={setContent}
        underlineColorAndroid={'transparent'}
    
        style={styles.input}
      />
      <View style={styles.pollContainer}>
        <TextInput
          placeholder="Add a poll option"
          value={newOption}
          onChangeText={setNewOption}
          style={styles.poll}
        />
      
        <Ionicons style={{padding:10}} onPress={addPollOption} name="add-circle-sharp" size={34} color="white" />
      </View>
      <FlatList
        data={pollOptions}
        renderItem={({ item, index }) => (
          <View style={styles.pollOption}>
            <TouchableOpacity
              onPress={() => handleVote(index)}
            >
              <Text>{item.text}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              setPollOptions(pollOptions.filter((_, i) => i !== index));
            }}>
              <Text style={styles.removeOption}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
      <Button title="Create Post" onPress={createPost} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 80,
    backgroundColor: Colors.Primary,
    flex: 1,
    padding: 16,
  },
  input: {
    backgroundColor: Colors.white,
    borderBottomWidth: 2,
    marginBottom: 12,
    padding: 8,
    height: 100,
    borderRadius: 10,
  
  },
  button: {
    borderRadius: 50,
  },
  poll: {
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    marginBottom: 12,
    padding: 8,
    borderRadius: 10,
    marginTop: 10,
  },
  pollContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  
    

  },
  pollOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
    
  },
  pollOptionButton: {
    padding: 8,
    borderRadius: 4,
    backgroundColor: Colors.Gray,
  },
  votedOption: {
    backgroundColor: Colors.Green, // Change color when voted
  },
  removeOption: {
    color: 'red',
    marginLeft: 12,
  },
});

export default CreatePostScreen;
