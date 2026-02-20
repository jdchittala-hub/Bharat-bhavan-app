import { Dimensions, Platform, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { useState, useEffect } from 'react';
import * as Font from 'expo-font';
import { PanGesture } from 'react-native-gesture-handler';

interface NoticeCarouselProps {
  items: Array<{
    id: string;
    content: string;
    isActive?: boolean;
    timer?: number;
    collectionId?: string;
    collectionName?: string;
    created?: string;
    updated?: string;
  }>;
}

const NoticeCarousel: React.FC<NoticeCarouselProps> = ({ items }) => {
  const { width, height } = useWindowDimensions();
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        Delius: require('../../assets/fonts/Delius-Regular.ttf'),
      });
      setFontsLoaded(true);
    }

    loadFonts();
  }, []);

  const mobileStyles = StyleSheet.create({
    container: {
      marginVertical: 0,
      height: 80,
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
    },
    carouselItem: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 18,
      backgroundColor: '#FFFDE7',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.3,
      shadowRadius: 4.65,
      elevation: 7,
      borderWidth: 1,
      borderColor: '#FFD700',
      padding: 4,
      height: 70,
      marginHorizontal: 10,
    },
    textContainer: {
      padding: 8,
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      borderRadius: 12,
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
      flex: 1,
    },
    description: {
      fontSize: 18,
      color: '#4A4A4A',
      textAlign: 'center',
      fontWeight: '700',
      letterSpacing: 0.5,
      lineHeight: 22,
      fontStyle: 'italic',
      textShadowColor: 'rgba(0, 0, 0, 0.1)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 1,
      fontFamily: 'Delius',
    },
  });

  const webStyles = StyleSheet.create({
    container: {
      marginVertical: width <= 768 ? 10 : 20,
      height: 80,
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
    },
    carouselItem: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 18,
      backgroundColor: '#FFFDE7',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.3,
      shadowRadius: 4.65,
      elevation: 7,
      borderWidth: 1,
      borderColor: '#FFD700',
      padding: 4,
      height: 70,
      marginHorizontal: width <= 768 ? 30 : 10,
    },
    textContainer: {
      padding: 8,
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      borderRadius: 12,
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
      flex: 1,
    },
    description: {
      fontSize: 18,
      color: '#4A4A4A',
      textAlign: 'center',
      fontWeight: '700',
      letterSpacing: 0.5,
      lineHeight: 22,
      fontStyle: 'italic',
      textShadowColor: 'rgba(0, 0, 0, 0.1)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 1,
      fontFamily: 'Delius',
    },
  });

  if (!fontsLoaded) {
    return (
      <View>
      </View>
    );
  }

  const activeItems = items.filter((item) => item.isActive !== false);
  const renderCarouselItem = ({ item }: { item: NoticeCarouselProps['items'][0] }) => {
    return (
      <View style={Platform.OS === 'web' ? webStyles.carouselItem : mobileStyles.carouselItem}>
        <View style={Platform.OS === 'web' ? webStyles.textContainer : mobileStyles.textContainer}>
          <Text style={Platform.OS === 'web' ? webStyles.description : mobileStyles.description} numberOfLines={2} adjustsFontSizeToFit>
            {item.content}
          </Text>
        </View>
      </View>
    );
  };

  if (!activeItems || activeItems.length === 0) {
    return null;
  }

  const getAutoPlayInterval = (index: number) => {
    const currentItem = activeItems[index];
    return (currentItem?.timer || 5) * 1000;
  };

  return (
    <View style={Platform.OS === 'web' ? webStyles.container : mobileStyles.container}>
      <Carousel
        loop
        width={Platform.OS === 'web' ? width : width}
        height={80}
        autoPlay={true}
        data={activeItems}
        autoPlayInterval={getAutoPlayInterval(currentIndex)}
        onSnapToItem={(index) => setCurrentIndex(index)}
        scrollAnimationDuration={1500}
        renderItem={renderCarouselItem}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.9,
          parallaxScrollingOffset: 50,
        }}
        onConfigurePanGesture={(panGesture: PanGesture) => {
          // fix panGesture so that the carousel works correctly
          // within a ScrollView
          panGesture.config.touchAction = 'pan-y' // for web

          // for iOS and Android
          panGesture.activeOffsetX([-5, 5]);
          panGesture.failOffsetY([-5, 5]);
        }}
      />
    </View >
  );
};



export default NoticeCarousel;
