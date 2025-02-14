import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Colors } from '../constants/Colors';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Ionicons from '@expo/vector-icons/Ionicons';
export default function CategoryTags({
  categoriesData,
  categories,
  activeCategory,
  handleChangeCategory,
  handlePlayIconPress,
}) {
  const isLoading = !categoriesData || categoriesData.length === 0;
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
    <View style={styles.container}>
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
        <View style={styles.tagsContainer}>
          {categoriesData.map((cat, index) => (
            <TouchableOpacity
              onPress={() => handleChangeCategory(cat.strCategory)}
              key={index}
              style={[
                styles.touchableOpacity,
                activeCategory === cat.strCategory && styles.activeTag,
              ]}
            >
              <Text style={[styles.Tags, activeCategory === cat.strCategory && styles.activeTag]}>{cat.strCategory}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap', 
    justifyContent: 'center',  
  },
  touchableOpacity: {
    marginRight: 4, 
    marginBottom: 5,  
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: Colors.backgroundWhite,
  },
  Tags: {
    fontSize: 14,
    color: '#000', 
    textAlign: 'center',
    opacity:0.4,
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
  activeTag: {
    backgroundColor: Colors.Primary,
    color:'white',
    opacity:1,
    fontWeight:'bold'
  },
});
