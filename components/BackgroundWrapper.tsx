import React, { useEffect } from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import useFoodMenuStore from '~/core/store';
import { BASE_URL } from '~/core/api';

interface BackgroundWrapperProps {
  children: React.ReactNode;
}

export const BackgroundWrapper: React.FC<BackgroundWrapperProps> = ({ children }) => {
  const { backgroundWrapperImages, fetchBackgroundWrapperImages } = useFoodMenuStore();

  useEffect(() => {
    if (backgroundWrapperImages.length === 0) {
      fetchBackgroundWrapperImages();
    }
  }, []);

  let imageSource: string = require('../assets/bharat-bhavan-bg.jpeg'); // Default static image
  if (backgroundWrapperImages.length > 0) {
    const firstImage = backgroundWrapperImages[0];
    if (firstImage && firstImage.image) {
      imageSource = `${BASE_URL}/api/files/${firstImage.collectionName}/${firstImage.id}/${firstImage.image}`;
    }
  }

  return (
    <View style={{ backgroundColor: '#f8f8f8', flex: 1 }}>
      <ImageBackground source={backgroundWrapperImages.length > 0 ? { uri: imageSource } : imageSource} style={styles.background}>
        <View style={styles.overlay}>{children}</View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
});