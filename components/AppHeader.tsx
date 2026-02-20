import { Image } from 'expo-image';
import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, View, useWindowDimensions } from 'react-native';

const AppHeader = () => {
  const { width } = useWindowDimensions();
  const [imageWidth, setImageWidth] = useState(0);

  // Ensure we have a valid width, fallback to a reasonable default
  const effectiveWidth = width > 0 ? width : 1200;
  const calculatedWidth = effectiveWidth * 0.9;

  useEffect(() => {
    setImageWidth(calculatedWidth);
  }, [calculatedWidth]);

  const mobileStyles = StyleSheet.create({
    viewStyle: {
      height: 160,
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#CD7D1C',
      alignItems: 'center',
      justifyContent: 'center',
    },
    imageStyle: {
      width: calculatedWidth,
      height: 160,
      backgroundColor: '#CD7D1C',
    },
  });

  const webStyles = StyleSheet.create({
    viewStyle: {
      height: 100,
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#CD7D1C',
      alignItems: 'center',
      justifyContent: 'center',
    },
    imageStyle: {
      width: imageWidth || calculatedWidth,
      height: 100,
      backgroundColor: '#CD7D1C',
    },
  });

  return (
    <View style={Platform.OS === 'web' ? webStyles.viewStyle : mobileStyles.viewStyle}>
      <Image
        source={require('.././assets/header-title.png')}
        style={Platform.OS === 'web' ? webStyles.imageStyle : mobileStyles.imageStyle}
        contentFit="contain"
        // placeholder="L6PZfSi_.AyE_3t7t7R**0o#DgR4"
        transition={300}
        cachePolicy="memory-disk"
        onLoad={() => {
          // Ensure image is visible after load
          if (Platform.OS === 'web') {
            setImageWidth(calculatedWidth);
          }
        }}
      />
    </View>
  );
};

export default AppHeader;
