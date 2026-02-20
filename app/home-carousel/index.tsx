import clsx from 'clsx';
import { Image } from 'expo-image';
import { Dimensions, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PanGesture } from 'react-native-gesture-handler';
import Carousel from 'react-native-reanimated-carousel';
import { BASE_URL } from '~/core/api';


const HomeCarousel = ({ items }: { items: RestaurantImage[] }) => {
  const { width, height } = Dimensions.get('window');
  const getAutoPlayInterval = () => {
    return 5000;
  };

  const mobileStyles = StyleSheet.create({
    outerView: {
      height: 520,
    },
    image: {
      height: 520,
      borderRadius: 8,
      width: 800,
      objectFit: 'cover',
    },
    textContainer: {
      position: 'absolute',
      bottom: 5,
      zIndex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      padding: 20,
      width: '100%',
      borderRadius: 8,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      alignSelf: 'center',
      justifyContent: 'center',
    },
    carouselItem: {
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

  const webStyles = StyleSheet.create({
    outerView: {
      height: width <= 768 ? height - 200 : height - 100,
    },
    image: {
      height: width <= 768 ? height - 200 : height - 100,
      borderRadius: 8,
      width: width,
      objectFit: 'contain',
    },
    textContainer: {
      position: 'absolute',
      bottom: 5,
      zIndex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      padding: 20,
      width: '100%',
      borderRadius: 8,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      alignSelf: 'center',
      justifyContent: 'center',
    },
    carouselItem: {
      height: width <= 768 ? height - 200 : height - 100
    },
  });


  const renderCarouselItem = ({
    item,
    itemId,
    collectionName,
  }: {
    item: string;
    itemId: string;
    collectionName: string;
  }): React.ReactElement => {
    return (
      <View style={Platform.OS === 'web' ? webStyles.carouselItem : mobileStyles.carouselItem}>
        <TouchableOpacity
        >
          <Image
            style={Platform.OS === 'web' ? webStyles.image : mobileStyles.image}
            source={{
              uri: `${BASE_URL}/api/files/${collectionName}/${itemId}/${item}`,
            }}
            placeholder="L6PZfSi_.AyE_3t7t7R**0o#DgR4"
            contentFit="cover"
            transition={300}
          />
        </TouchableOpacity>
      </View>
    );
  };
  if (!items || items.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      </View>
    );
  }
  return (
    <View style={Platform.OS === 'web' ? webStyles.outerView : mobileStyles.outerView}>
      <Carousel
        loop
        width={width}
        height={width <= 768 ? height - 200 : height - 100}
        autoPlay={true}
        data={items[0].images}
        autoPlayInterval={getAutoPlayInterval()}
        scrollAnimationDuration={1000}
        renderItem={({ item }) =>
          renderCarouselItem({
            item,
            itemId: items[0].id,
            collectionName: items[0].collectionName,
          })
        }
        onConfigurePanGesture={(panGesture: PanGesture) => {
          // fix panGesture so that the carousel works correctly
          // within a ScrollView
          panGesture.config.touchAction = 'pan-y' // for web

          // for iOS and Android
          panGesture.activeOffsetX([-5, 5]);
          panGesture.failOffsetY([-5, 5]);
        }} />
    </View>
  );
};


export default HomeCarousel;
