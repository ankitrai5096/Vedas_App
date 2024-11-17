import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Animated, { FadeInDown, FadeOut } from 'react-native-reanimated';
import AntDesign from '@expo/vector-icons/AntDesign';
export default function Categories({categoriesData, categories, activeCategory, handleChangeCategory, handlePlayIconPress }) {
  return (
    <Animated.View entering={FadeInDown.duration(800).springify()} exiting={FadeOut}>
      <ScrollView 
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {categoriesData.map((cat, index) => {
          // const isActive = cat.strCategory === activeCategory; 
          return (
            <TouchableOpacity 
              onPress={() => handleChangeCategory(cat.strCategory)} 
              key={index} 
              style={styles.touchableOpacity}
            >
              <View style={styles.imageContainer}>
                <Image 
                  source={{ uri: cat.strCategoryThumb }}
                  style={styles.image} 
                />
                 <TouchableOpacity 
                  style={styles.playIcon} 
                  onPress={() => handlePlayIconPress(cat.strCategory)}
                >
                  <AntDesign name="play" size={22} color="black" />
                </TouchableOpacity>

                <Text>{cat.strCategory}</Text>
              
              </View>
            
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingHorizontal: 10,
  },
  touchableOpacity: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent:'center',
    marginHorizontal: 4,
  },
  imageContainer: {
    borderRadius: 50,
    padding: 6,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 50,
  },
  playIcon: {
    position: 'absolute',
    top: 40,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 12,
    padding: 2,
  },
});
