import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, Button, Image } from 'react-native';
import { collection, query, orderBy, onSnapshot, updateDoc, doc, arrayUnion, getDoc } from 'firebase/firestore';
import { db } from './../../Configs/FirebaseConfig';
import { getAuth } from 'firebase/auth';
import { Colors } from './../../constants/Colors';

const PostFeedScreen = () => {
  const [posts, setPosts] = useState([]);
  const [comment, setComment] = useState('');

  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    const postsQuery = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(postsQuery, (snapshot) => {
      const postsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(postsData);
    });

    return () => unsubscribe();
  }, []);

  const handleLike = async (postId) => {
    try {
      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, {
        likes: arrayUnion(currentUser.uid),
      });
    } catch (error) {
      console.error('Error liking post: ', error);
    }
  };

  const handleComment = async (postId) => {
    if (comment.trim()) {
      try {
        const postRef = doc(db, 'posts', postId);
        await updateDoc(postRef, {
          comments: arrayUnion({ userId: currentUser.uid, text: comment.trim(), createdAt: new Date() }),
        });
        setComment('');
      } catch (error) {
        console.error('Error commenting on post: ', error);
      }
    }
  };

  const handleVote = async (postId, optionIndex) => {
    try {
      const postRef = doc(db, 'posts', postId);
      const postDoc = await getDoc(postRef);
      const postData = postDoc.data();

      // Check if the user has already voted
      const hasVoted = postData.pollOptions.some((option) =>
        option.votes.includes(currentUser.uid)
      );

      if (!hasVoted) {
        const updatedPollOptions = postData.pollOptions.map((option, index) => {
          if (index === optionIndex) {
            return { ...option, votes: [...option.votes, currentUser.uid] };
          }
          return option;
        });

        await updateDoc(postRef, { pollOptions: updatedPollOptions });
      } else {
        alert("You've already voted.");
      }
    } catch (error) {
      console.error('Error voting in poll: ', error);
    }
  };

  const renderPost = ({ item }) => {
    return (
      <View style={styles.postContainer}>
        <View style={styles.userInfo}>
          <Image source={{ uri: item.userProfileImage }} style={styles.profileImage} />
          <View>
            <Text style={styles.userName}>{item.userName}</Text>
            <Text style={styles.userFlat}>{item.userFlat}</Text>
          </View>
        </View>
        <Text style={styles.content}>{item.content}</Text>
        {item.pollOptions && (
          <View style={styles.pollContainer}>
            {item.pollOptions.map((option, index) => (
              <TouchableOpacity key={index} onPress={() => handleVote(item.id, index)}>
                <Text style={styles.pollOption}>{option.text}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        <View style={styles.interactionContainer}>
          <TouchableOpacity onPress={() => handleLike(item.id)}>
            <Text style={styles.likeText}>Like</Text>
          </TouchableOpacity>
          <TextInput
            placeholder="Add a comment"
            value={comment}
            onChangeText={setComment}
            style={styles.commentInput}
          />
          <Button title="Post" onPress={() => handleComment(item.id)} />
        </View>
      </View>
    );
  };

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.id}
      renderItem={renderPost}
    />
  );
};

const styles = StyleSheet.create({
  postContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: Colors.Primary,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  userName: {
    fontWeight: 'bold',
  },
  userFlat: {
    fontSize: 12,
    color: '#888',
  },
  content: {
    fontSize: 16,
    marginBottom: 8,
  },
  pollContainer: {
    marginBottom: 8,
  },
  pollOption: {
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    marginVertical: 4,
  },
  interactionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeText: {
    marginRight: 16,
    color: '#1E90FF',
  },
  commentInput: {
    flex: 1,
    borderBottomWidth: 1,
    marginBottom: 8,
    marginHorizontal: 8,
    padding: 4,
  },
});

export default PostFeedScreen;
