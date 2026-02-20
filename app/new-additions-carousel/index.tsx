import clsx from 'clsx';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { Dimensions, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PanGesture } from 'react-native-gesture-handler';
import Carousel from 'react-native-reanimated-carousel';
import { BASE_URL } from '~/core/api';
import useFoodMenuStore from '~/core/store';
const NewAdditionsCarousel = () => {
  const { newAdditions } = useFoodMenuStore();
  const { updateSelectedCategory } = useFoodMenuStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const { width } = Dimensions.get('window');
  const getAutoPlayInterval = (index: number) => {
    return 4000;
  };

  const mobileStyles = StyleSheet.create({
    image: {
      height: 450,
      borderRadius: 8,
      width: 480,
      objectFit: 'cover',
    },
    newAdditionHeadingTextContainer: {
      position: 'absolute',
      bottom: 0,
      zIndex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      alignSelf: 'center',
      justifyContent: 'center',
      height: 50
    },
    newAdditionNameTextContainer: {
      position: 'absolute',
      top: 0,
      zIndex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      padding: 20,
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      alignSelf: 'center',
      justifyContent: 'center',
      height: 70
    },
    carouselItem: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    outerView: {
      flex: 1,
      height: 450,
      right: 0,
    }
  });
  const webStyles = StyleSheet.create({
    outerView: {
      flex: 1,
      height: width <= 768 ? 450 : 650,
      width: width <= 768 ? width : 0.5 * width,
    },
    carouselItem: {
      height: width <= 768 ? 450 : 650,
      width: width <= 768 ? width : 0.5 * width,
      alignItems: 'center',
      justifyContent: 'center',
    },
    image: {
      height: width <= 768 ? 450 : 650,
      borderRadius: 8,
      width: width <= 768 ? width : 0.5 * width,
      objectFit: 'cover',
    },
    newAdditionHeadingTextContainer: {
      position: 'absolute',
      left: 0,
      bottom: 0,
      zIndex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      width: width <= 768 ? width : 0.5 * width,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      alignSelf: 'center',
      justifyContent: 'center',
      height: 50
    },
    newAdditionNameTextContainer: {
      position: 'absolute',
      top: 0,
      zIndex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      padding: 20,
      width: width <= 768 ? width : 0.5 * width,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      alignSelf: 'center',
      justifyContent: 'center',
      height: width <= 768 ? 50 : 70
    },
  });

  const navigateToCategoryDetails = async ({
    categoryId,
    subCategoryId,
    updateSelectedCategory,
  }: {
    categoryId: string;
    subCategoryId: string;
    updateSelectedCategory: (categoryId: string, subCategoryId: string) => Promise<void>;
  }) => {
    try {
      await updateSelectedCategory(categoryId, subCategoryId);
      router.navigate(`/categoryDetails/${categoryId}`);
    } catch (error) {
      console.error('Error navigating to subcategory:', error);
    }
  };
  const renderCarouselItem = ({
    item,
    updateSelectedCategory,
  }: {
    item: MenuItem;
    updateSelectedCategory: (categoryId: string, subCategoryId: string) => Promise<void>;
  }): React.ReactElement => {
    return (
      <View style={Platform.OS === 'web' ? webStyles.carouselItem : mobileStyles.carouselItem}
      >
        <TouchableOpacity
          onPress={() =>
            navigateToCategoryDetails({
              categoryId: item.categoryId,
              subCategoryId: item.subCategoryId,
              updateSelectedCategory,
            })
          }
        >
          <Image
            style={Platform.OS === 'web' ? webStyles.image : mobileStyles.image}
            source={{
              uri: `${BASE_URL}/api/files/${item.collectionName}/${item.id}/${item.image}`,
            }}
            placeholder="L6PZfSi_.AyE_3t7t7R**0o#DgR4"
            contentFit="cover"
            transition={300}
          />
          <View style={Platform.OS === 'web' ? webStyles.newAdditionNameTextContainer : mobileStyles.newAdditionNameTextContainer}>
            <Text className={
              clsx(
                "shrink  font-light text-white",
                width <= 768 ? 'text-xl' : 'text-3xl'
              )
            }
            >{item.name}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };
  if (!newAdditions || newAdditions.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      </View>
    );
  }
  return (
    <View style={Platform.OS === 'web' ? webStyles.outerView : mobileStyles.outerView}>
      <Carousel
        loop
        width={Platform.OS === 'web' ? width <= 768 ? width : 0.5 * width : width * 0.6}
        height={width <= 768 ? 450 : 650}
        autoPlay={true}
        data={newAdditions}
        autoPlayInterval={getAutoPlayInterval(currentIndex)}
        onSnapToItem={(index) => setCurrentIndex(index)}
        scrollAnimationDuration={1000}
        onConfigurePanGesture={(panGesture: PanGesture) => {
          // fix panGesture so that the carousel works correctly
          // within a ScrollView
          panGesture.config.touchAction = 'pan-y' // for web

          // for iOS and Android
          panGesture.activeOffsetX([-5, 5]);
          panGesture.failOffsetY([-5, 5]);
        }}
        renderItem={({ item }) => {
          return renderCarouselItem({
            item,
            updateSelectedCategory,
          })
        }
        }
      />
      <View style={Platform.OS === 'web' ? webStyles.newAdditionHeadingTextContainer : mobileStyles.newAdditionHeadingTextContainer}>
        <Text className={
          clsx("font-bold text-white",
            width <= 768 ? 'text-xl' : 'text-3xl'
          )
        }>New Additions</Text>
      </View>
    </View>
  );
};

export default NewAdditionsCarousel;