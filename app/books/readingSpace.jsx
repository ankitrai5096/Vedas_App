import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Dimensions, Share } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Colors } from '../../constants/Colors';
import AntDesign from '@expo/vector-icons/AntDesign';

const ReadingSpace = () => {
  const item = useLocalSearchParams();
  const bookContent = typeof item.bookContent === 'string' ? item.bookContent : ''; 
  console.log("Book content in ReadingSpace:", bookContent);

  const [currentPage, setCurrentPage] = useState(0);
  const wordsPerPage = 150; 
  const words = bookContent.split(' ').filter(Boolean); 
  const totalPages = Math.ceil(words.length / wordsPerPage);

  // Get content for the current page
  const getPageContent = () => {
    const startIndex = currentPage * wordsPerPage;
    const endIndex = startIndex + wordsPerPage;
    return words.slice(startIndex, endIndex).join(' ') || 'No content available';
  };

  // Share the current page content
  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: getPageContent(),
      });
      if (result.action === Share.sharedAction) {
        console.log('Content shared successfully');
      } else if (result.action === Share.dismissedAction) {
        console.log('Share dismissed');
      }
    } catch (error) {
      console.error('Error sharing content:', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text style={styles.content}>{getPageContent()}</Text>
      </ScrollView>

      <View style={styles.navigationContainer}>
        <TouchableOpacity
          style={[styles.button, currentPage === 0 && styles.disabledButton]}
          onPress={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
          disabled={currentPage === 0}
        >
        <AntDesign name="leftcircle" size={44} color=" rgba(255, 103, 31, 0.9)" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, currentPage >= totalPages - 1 && styles.disabledButton]}
          onPress={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))}
          disabled={currentPage >= totalPages - 1}
        >
         <AntDesign name="rightcircle" size={44} color=" rgba(255, 103, 31, 0.9)" />
        </TouchableOpacity>

        {/* <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Text style={styles.buttonText}>Share</Text>
        </TouchableOpacity> */}
      </View>
    </View>
  );
};

export default ReadingSpace;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  scrollView: {
    flexGrow: 1,
    marginTop:80,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'justify',
    color: '#333',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 10,
  },
  button: {
    borderRadius: 30,
    backgroundColor: 'white',
  },
  disabledButton: {
    backgroundColor:'white',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  shareButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    backgroundColor:Colors.Primary,
  },
});
