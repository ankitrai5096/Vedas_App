import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Colors } from '../constants/Colors';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function Categories({
  categoriesData,
  categories,
  activeCategory,
  handleChangeCategory,
  handlePlayIconPress,
}) {
  const isLoading = !categoriesData || categoriesData.length === 0;

//console.log(categoriesData)
  const shimmerAnim = new Animated.Value(0);

  React.useEffect(() => {
    Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 1200, 
        useNativeDriver: true,
      })
    ).start();
  }, []);


  const shimmerTranslateX = shimmerAnim.interpolate({
    inputRange: [0.4, 1],
    outputRange: [-300, 200], 
  });

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContainer}
    >
      {isLoading ? (
        Array.from({ length: 5 }).map((_, index) => (
          <View key={index} style={styles.touchableOpacity}>
            <View style={styles.imageContainer}>

              <Animated.View
                style={[
                  styles.image,
                  {
                    overflow: 'hidden',
                    position: 'relative', 
                  },
                ]}
              >
                <Animated.View
                  style={[
                    styles.shimmer,
                    {
                      transform: [{ translateX: shimmerTranslateX }],
                    },
                  ]}
                />
              </Animated.View>
            </View>

            <Animated.View
              style={[
                styles.skeletonText,
                {
                  transform: [{ translateX: shimmerTranslateX }],
                },
              ]}
            />
          </View>
        ))
      ) : (
        categoriesData.map((cat, index) => (
          <TouchableOpacity
            onPress={() => handlePlayIconPress(cat.strCategory)}
            key={index}
            style={styles.touchableOpacity}
          >
            <View style={styles.imageContainer}>
              <Animated.Image
                source={{ uri: cat.strCategoryThumb }}
                style={styles.image}
              />
            </View>
            <TouchableOpacity
              style={styles.playIcon}
              onPress={() => handlePlayIconPress(cat.strCategory)}
            >
            <Ionicons name="play-circle" size={24} color="white" />
            </TouchableOpacity>
            <Text>{cat.strCategory}</Text>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingHorizontal: 10,
    padding: 5,
  },
  touchableOpacity: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  imageContainer: {
    borderRadius: 50,
    padding: 6,
    width: 80,
    height: 80,
    // backgroundColor: '#f0f0f0', 
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  playIcon: {
    position: 'absolute',
    top: 45,
    right: 0,
   backgroundColor: 'rgba(255, 103, 31, 0.7)',
    borderRadius: wp(50),
    padding: 0,
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#E0E0E0', 
    opacity: 0.5,
    zIndex: 1, 
  },
  skeletonText: {
    marginTop: 8,
    width: 80,
    height: 10,
    borderRadius: 4,
    backgroundColor: '#E0E0E0', 
  },
});

