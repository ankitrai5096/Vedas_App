import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  FlatList,
  Image,
} from 'react-native';

const Post = () => {
  const [caption, setCaption] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [tags, setTags] = useState([
    'Brahma',
    'Vishnu',
    'Shiva',
    'Lakshmi',
    'Saraswati',
    'Durga',
    'Kali',
    'Ganesh',
    'Kartikeya',
    'Indra',
    'Agni',
    'Yama',
    'Varuna',
    'Surya',
    'Chandra',
    'Vayu',
    'Kubera',
    'Rama',
    'Krishna',
    'Parvati',
  ]);
  const [searchText, setSearchText] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [isVerified, setIsVerified] = useState(false); 

  // Placeholder for video picker
  const pickVideo = () => {
    setSelectedVideo('placeholder-video');
    alert('Video picker clicked!');
  };

  // Placeholder for image picker
  const pickImage = () => {
    // You can integrate an actual image picker here
    setSelectedImage('https://via.placeholder.com/150'); // Example image
    alert('Image picker clicked!');
  };

  // Filter tags based on search input
  const filteredTags = tags.filter((tag) =>
    tag.toLowerCase().includes(searchText.toLowerCase())
  );

  // Add or remove tags from the selected list
  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Create a Post</Text>

      {/* Only for Verified Users: Category 2 */}
      {isVerified && (
        <View style={styles.verifiedPostContainer}>
          {/* Video Picker */}
          <TouchableOpacity style={styles.videoPicker} onPress={pickVideo}>
            {selectedVideo ? (
              <View style={styles.videoPreview}>
                <Text style={styles.videoText}>Video Selected</Text>
              </View>
            ) : (
              <Text style={styles.videoText}>Pick a Video</Text>
            )}
          </TouchableOpacity>

          {/* Caption Input */}
          <TextInput
            style={styles.input}
            placeholder="Write a caption..."
            multiline
            value={caption}
            onChangeText={setCaption}
          />

          {/* Optional Post Actions */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.actionText}>Add Tags</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionText}>Add Location</Text>
            </TouchableOpacity>
          </View>

          {/* Display Selected Tags */}
          <View style={styles.selectedTagsContainer}>
            {selectedTags.map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>

          {/* Submit Button */}
          <TouchableOpacity style={styles.postButton}>
            <Text style={styles.postButtonText}>Post</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Only for Non-Verified Users: Category 3 */}
      {!isVerified && (
        <View style={styles.nonVerifiedPostContainer}>
          {/* Image Picker */}
          <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
            {selectedImage ? (
              <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
            ) : (
              <Text style={styles.imageText}>Pick an Image</Text>
            )}
          </TouchableOpacity>

          {/* Caption Input */}
          <TextInput
            style={styles.input}
            placeholder="Write a description..."
            multiline
            value={caption}
            onChangeText={setCaption}
          />

          {/* Post Button */}
          <TouchableOpacity style={styles.postButton}>
            <Text style={styles.postButtonText}>Post</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Modal for Tag Selection */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Tags</Text>

            {/* Search Input */}
            <TextInput
              style={styles.searchInput}
              placeholder="Search tags..."
              value={searchText}
              onChangeText={setSearchText}
            />

            {/* Tags List */}
            <FlatList
              data={filteredTags}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.tagItem,
                    selectedTags.includes(item) && styles.tagItemSelected,
                  ]}
                  onPress={() => toggleTag(item)}
                >
                  <Text
                    style={[
                      styles.tagItemText,
                      selectedTags.includes(item) && styles.tagItemTextSelected,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />

            {/* Close Button */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Post;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 20,
  },
  heading: {
    marginTop: 50,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  simplePostContainer: {
    marginBottom: 20,
  },
  verifiedPostContainer: {
    marginBottom: 20,
  },
  nonVerifiedPostContainer: {
    marginBottom: 20,
  },
  imagePicker: {
    height: 200,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  imageText: {
    fontSize: 16,
    color: '#555',
  },
  videoPicker: {
    height: 200,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  videoPreview: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: '#ccc',
    borderRadius: 10,
  },
  videoText: {
    fontSize: 16,
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#fff',
    marginBottom: 20,
    height: 100,
    textAlignVertical: 'top',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 5,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionText: {
    fontSize: 14,
    color: '#333',
  },
  selectedTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  tag: {
    backgroundColor: 'rgba(34, 139, 34, 0.8)',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    margin: 5,
  },
  tagText: {
    color: '#fff',
    fontSize: 14,
  },
  postButton: {
    backgroundColor: '#FF671F',
    paddingVertical: 15,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    marginTop: 50,
    width: 320,
    height: 500,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 10,
    width: '100%',
    marginBottom: 10,
  },
  tagItem: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#e0e0e0',
    marginVertical: 5,
    width: 280,
    alignItems: 'center',
  },
  tagItemSelected: {
    backgroundColor: '#FF671F',
  },
  tagItemText: {
    fontSize: 16,
    color: '#333',
  },
  tagItemTextSelected: {
    color: '#fff',
  },
  closeButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 30,
    backgroundColor: '#FF671F',
    borderRadius: 10,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
