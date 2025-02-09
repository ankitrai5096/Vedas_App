import { ActivityIndicator, StyleSheet, View } from 'react-native';
import React from 'react';

const Loading = ({ size = 'large', color = '#FF671F', style }) => {
  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

export default Loading;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
