import React, { useRef, useState } from 'react';
import { View, StyleSheet, Dimensions, TouchableWithoutFeedback, Text, TouchableOpacity, ToastAndroid, Platform, Image } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { Video } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import UserAvatar from 'react-native-user-avatar';
import { useSelector } from 'react-redux';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';

const { height, width } = Dimensions.get('window');
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const videoData = [
  { id: 1, url: 'https://www.w3schools.com/html/mov_bbb.mp4' },
  { id: 2, url: 'https://www.w3schools.com/html/movie.mp4' },
  { id: 3, url: 'https://www.w3schools.com/html/mov_bbb.mp4' },
];

const Feed = () => {
  const currentUser = useSelector((state) => state.auth.user);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showPlayPauseIcon, setShowPlayPauseIcon] = useState(false);
  const videoRefs = useRef([]);

  const showToast = (message) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      alert(message);
    }
  };

  // Request Permissions (for media and storage)
  const requestPermissions = async () => {
    const { status: mediaStatus } = await MediaLibrary.requestPermissionsAsync();
    const { status: storageStatus } = await MediaLibrary.requestPermissionsAsync();

    if (mediaStatus !== 'granted' || storageStatus !== 'granted') {
      alert('Permission to access media library is required!');
    }
  };

  const downloadVideo = async (url) => {
    const fileUri = FileSystem.documentDirectory + `video-${Date.now()}.mp4`;
    showToast('Downloading video...');
    try {
      const { uri } = await FileSystem.downloadAsync(url, fileUri);
      showToast('Video downloaded successfully!');
      return uri;
    } catch (error) {
      console.error('Error downloading video:', error);
      showToast('Failed to download video.');
      return null;
    }
  };

  const saveToGallery = async (fileUri) => {
    try {
      const asset = await MediaLibrary.createAssetAsync(fileUri);
      await MediaLibrary.createAlbumAsync('MyApp Videos', asset, false);
      showToast('Video saved to gallery!');
    } catch (error) {
      console.error('Error saving video to gallery:', error);
      if (error.message.includes('WRITE_EXTERNAL_STORAGE')) {
        showToast('Storage permissions are needed. Video may not be saved properly.');
      } else {
        showToast('Error saving video to gallery.');
      }
    }
  };

  const handleSave = async (url) => {
    const localUri = await downloadVideo(url);
    if (localUri) {
      await saveToGallery(localUri);
    }
  };

  const handleShare = async (url) => {
    const localUri = await downloadVideo(url);
    if (localUri && Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(localUri);
    } else {
      showToast('Sharing not available.');
    }
  };

  const togglePlayPause = async (index) => {
    const video = videoRefs.current[index];
    if (video) {
      const status = await video.getStatusAsync();
      setIsPlaying(!status.isPlaying);
      setShowPlayPauseIcon(true);

      if (status.isPlaying) {
        await video.pauseAsync();
      } else {
        await video.playAsync();
      }

      setTimeout(() => setShowPlayPauseIcon(false), 1000);
    }
  };

  const renderItem = ({ item, index }) => (
    <TouchableWithoutFeedback onPress={() => togglePlayPause(index)}>
      <View style={styles.videoContainer}>
        <Video
          ref={(ref) => (videoRefs.current[index] = ref)}
          source={{ uri: item.url }}
          style={styles.video}
          resizeMode="cover"
          isLooping
          shouldPlay={index === currentIndex}
          isMuted={false}
        />
        {showPlayPauseIcon && currentIndex === index && (
          <Ionicons
            name={isPlaying ? 'pause' : 'play'}
            size={70}
            color="white"
            style={styles.playPauseIcon}
          />
        )}
        <View style={styles.secondContainer}>
  <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
              <Image style={{ width: 30, height: 30, marginHorizontal: 8 }} source={require('../../assets/images/profile-pic.png')} />
            </TouchableOpacity>
          <View>
            <Text style={styles.fullName}>{currentUser.displayName}</Text>
            <Text style={styles.Disc}>Hello there how is it going...</Text>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => handleSave(item.url)}>
            <MaterialIcons name="bookmark-border" size={35} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handleShare(item.url)}>
            <FontAwesome name="share" size={30} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );

  return (
    <FlatList
      data={videoData}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      pagingEnabled
      showsVerticalScrollIndicator={false}
      snapToInterval={height} // Ensures each video occupies full screen space
      snapToAlignment="start" // Aligns the video to the start of the container
      onMomentumScrollEnd={(event) => {
        const index = Math.round(event.nativeEvent.contentOffset.y / height);
        setCurrentIndex(index);
      }}
      contentContainerStyle={styles.contentContainer} // Ensures proper layout
    />
  );
};

const styles = StyleSheet.create({
  videoContainer: {
    height: hp(100),
    width,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  video: {
    height: hp(100),
    width,
    position: 'relative', 
  },
  playPauseIcon: {
    position: 'absolute',
    alignSelf: 'center',
    top: '50%',
    marginTop: -35,
    zIndex: 100,
  },
  Disc: {
    color: 'white',
    fontSize: 10,
  },
  secondContainer: {
    position: 'absolute',
    top: hp(8),
    left: 15,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
  },
  avatar: {
    marginRight: 10,
  },
  fullName: {
    color: 'white',
    fontWeight: 'bold',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: hp(10),
    right: wp(5),
    alignItems: 'center',
  },
  button: {
    marginVertical: 10,
  },
  contentContainer: {
    paddingTop: 0,
  },
});

export default Feed;
