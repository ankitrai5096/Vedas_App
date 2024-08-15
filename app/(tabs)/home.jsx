import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, Button, Image } from 'react-native';
import { collection, query, orderBy, onSnapshot, updateDoc, doc, arrayUnion, getDoc } from 'firebase/firestore';
import { db } from './../../Configs/FirebaseConfig';
import { getAuth } from 'firebase/auth';
import { Colors } from './../../constants/Colors';
import { useNavigation } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const PostFeedScreen = () => {
  const [posts, setPosts] = useState([]);
  const [comment, setComment] = useState({});
  const [userVotes, setUserVotes] = useState({});
  const navigation = useNavigation();

  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: 'Home',
    });

    const postsQuery = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(postsQuery, (snapshot) => {
      const postsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log('Fetched posts data:', postsData); // Debugging line
      setPosts(postsData);
    });

    return () => unsubscribe();
  }, []);

  const generateAvatarUrl = (fullName) => {
    if (!fullName || typeof fullName !== 'string') {
      console.error('Invalid fullName provided:', fullName);
      return 'https://api.dicebear.com/6.x/initials/png?seed=Unknown'; // Fallback to default initials
    }

    const initials = fullName
      .trim()
      .split(/\s+/)
      .map(name => name.charAt(0).toUpperCase())
      .join('');

    const finalInitials = initials.length === 1 ? initials + initials : initials;
    console.log('Generated Initials:', finalInitials);
    const url = `https://api.dicebear.com/6.x/initials/png?seed=${finalInitials}`;
    console.log('Generated Avatar URL:', url);

    return url;
  };

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
    if (comment[postId]?.trim()) {
      try {
        const postRef = doc(db, 'posts', postId);
        await updateDoc(postRef, {
          comments: arrayUnion({ userId: currentUser.uid, text: comment[postId].trim(), createdAt: new Date() }),
        });
        setComment((prev) => ({ ...prev, [postId]: '' }));
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

      const hasVoted = postData.pollOptions.some((option) =>
        option.votes.includes(currentUser.uid)
      );

      if (!hasVoted) {
        const updatedPollOptions = postData.pollOptions.map((option, index) => {
          if (index === optionIndex) {
            return { ...option, votes: [...option.votes, currentUser.uid], voteCount: (option.voteCount || 0) + 1 };
          }
          return option;
        });

        await updateDoc(postRef, { pollOptions: updatedPollOptions });
        setUserVotes((prev) => ({ ...prev, [postId]: optionIndex }));
      } else {
        alert("You've already voted.");
      }
    } catch (error) {
      console.error('Error voting in poll: ', error);
    }
  };

  const renderPost = ({ item }) => {
    const votedOptionIndex = userVotes[item.id];
    const hasUserVoted = votedOptionIndex !== undefined;

    return (
      <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', }}>
        <View style={styles.postContainer}>
          <View style={styles.userInfo}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2, }}>
              <View>
                <Image
                  source={{ uri: item.userProfileImage || generateAvatarUrl(item.userFullName || 'Unknown User') }}
                  style={styles.profileImage}
                  onError={(error) => {
                    console.error('Failed to load image:', error.nativeEvent.error);
                  }}
                  defaultSource={{ uri: 'https://via.placeholder.com/40' }} // Fallback image
                />
              </View>
              <Text style={styles.userName}>{item.userFullName || 'Unknown User'}</Text>
            </View>
          </View>
          <Text style={styles.content}>{item.content || ''}</Text>

          {item.pollOptions && item.pollOptions.length > 0 && (
            <View style={styles.pollContainer}>
              {item.pollOptions.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => !hasUserVoted && handleVote(item.id, index)}
                  style={[
                    styles.pollOption,
                    votedOptionIndex === index && styles.votedPollOption
                  ]}
                  disabled={hasUserVoted} // Disable button if user has already voted
                >
                  <Text style={styles.pollOptionText}>
                    {option.text || ''} - {option.voteCount || 0} votes
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
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
    marginTop: 10,
    borderRadius: 10,
    width: '95%',
    justifyContent: 'center',
    alignContent: 'center',
  },
  userInfo: {
    marginTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,

  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: Colors.white,

  },
  userName: {
    fontWeight: 'bold',
    fontSize: 20,
    color: Colors.white,
  },
  content: {
    fontSize: 16,
    marginBottom: 8,
    fontFamily:'outfit-bold',
    color: Colors.white,
  },
  pollContainer: {
    marginBottom: 8,
  },
  pollOption: {
    padding: 8,
    borderRadius: 4,
    marginVertical: 4,
    backgroundColor: Colors.white,
  },
  votedPollOption: {
    backgroundColor:'#7CFC00',// Color for voted options
  },
  pollOptionText: {
    color: '#000000',
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
