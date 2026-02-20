import { View, Text, StyleSheet, TouchableOpacity, Platform, useWindowDimensions } from 'react-native';
import React from 'react';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import useFoodMenuStore from '~/core/store';
import clsx from 'clsx';
const Menu = () => {
  const { updateSelectedCategory } = useFoodMenuStore();
  const { width } = useWindowDimensions();
  const mobileStyles = StyleSheet.create({
    outerView: {
      width: 320,
      height: 450,
      display: 'flex',
      flexDirection: 'column'
    },
    textContainer: {
      position: 'absolute',
      bottom: 0,
      zIndex: 1,
      backgroundColor: '#CD7D1C',
      height: 50,
      padding: 10,
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      alignSelf: 'center',
      justifyContent: 'center',
    },
    image: {
      width: '100%',
      height: 225
    }
  });

  const webStyles = StyleSheet.create({
    outerView: {
      height: width <= 768 ? 450 : 650,
      width: width <= 768 ? width : 0.5 * width,
      display: 'flex',
      flexDirection: 'column'
    },
    textContainer: {
      position: 'absolute',
      bottom: 0,
      zIndex: 1,
      backgroundColor: '#CD7D1C',
      height: 50,
      padding: 10,
      width: width <= 768 ? width : 0.5 * width,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      alignSelf: 'center',
      justifyContent: 'center',
    },
    image: {
      width: width <= 768 ? width : 0.5 * width,
      height: width <= 768 ? 225 : 325
    }
  });

  return (
    <View
      style={Platform.OS === 'web' ? webStyles.outerView : mobileStyles.outerView}>
      <TouchableOpacity onPress={() => {
        // NOTE: navigate specifically to BharatBhavan Signature dishes category
        updateSelectedCategory('1n2z337idrs510s', null);
        router.navigate('/categoryDetails/1n2z337idrs510s');
      }
      }
        style={Platform.OS === 'web' ? { height: width <= 768 ? 225 : 325 } : { height: 225 }}
      >
        <Image
          source={require('assets/signature-dishes.jpeg')}
          style={Platform.OS === 'web' ? webStyles.image : mobileStyles.image}
          contentFit="cover"
          transition={500}
          cachePolicy="memory-disk"
        // placeholder="L6PZfSi_.AyE_3t7t7R**0o#DgR4"
        />
        <View style={Platform.OS === 'web' ? webStyles.textContainer : mobileStyles.textContainer}>
          <Text className={
            clsx(
              "shrink text-white",
              width <= 768 ? 'text-xl font-bold' : 'text-3xl font-normal'
            )
          }>Signature Dishes</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.navigate('/categories')} style={Platform.OS === 'web' ? { height: width <= 768 ? 225 : 325 } : { height: 225 }}>
        <Image
          source={require('assets/explore-menu-img.jpeg')}
          style={Platform.OS === 'web' ? webStyles.image : mobileStyles.image}
          contentFit="cover"
          transition={500}
          cachePolicy="memory-disk"
        // placeholder="L6PZfSi_.AyE_3t7t7R**0o#DgR4"
        />
        <View style={Platform.OS === 'web' ? webStyles.textContainer : mobileStyles.textContainer}>
          <Text className={
            clsx(
              "shrink text-white",
              width <= 768 ? 'text-xl font-bold' : 'text-3xl font-normal'
            )
          }>Explore Menu</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default Menu;
