import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import YoutubeIframe from 'react-native-youtube-iframe';
import Icon from 'react-native-vector-icons/Ionicons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const Arti = ({ videoId, toggleModal }) => {
  console.log("Video URL in the Aarti section:", videoId);
  const [playing, setPlaying] = useState(true);

  return (
    <TouchableWithoutFeedback onPress={toggleModal}>
      <View style={styles.container}>
        {/* Prevent touch events from propagating to TouchableWithoutFeedback */}
        <View
          style={styles.videoContainer}
          onStartShouldSetResponder={() => true} // Stops touch propagation
        >
          <YoutubeIframe
            height={hp(30)}
            width={wp(90)}
            play={playing}
            videoId={videoId}
            onError={(error) => console.log('YouTube Error:', error)}
          />
        </View>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => setPlaying(!playing)}
        >
          <Icon name={playing ? 'pause' : 'play'} size={wp(8)} color="white" />
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  videoContainer: {
    borderRadius: 15,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: "white",
    width: wp(90),
    height: hp(24.5),
  },
  iconButton: {
    marginTop: hp(2),
    padding: hp(1.5),
    backgroundColor: "black",
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Arti;
