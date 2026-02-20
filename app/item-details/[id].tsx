import { AntDesign } from '@expo/vector-icons';
import clsx from 'clsx';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { Stack, useFocusEffect, useLocalSearchParams, useNavigation } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Platform, Pressable, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackgroundWrapper } from '~/components/BackgroundWrapper';
import RecommendedDishCard from '~/components/RecommendedDishes';
import YoutubeVideoPlayer from '~/components/VideoPlayer';
import { BASE_URL, fetchFoodItemById } from '~/core/api';
import useFoodMenuStore from '~/core/store';
import { getLocalDay, getYoutubeThumbnail, isVideoLink } from '~/core/utils';

export default function ItemDetails() {
  const { width: screenWidth } = useWindowDimensions();
  const navigation = useNavigation();
  const { id: foodId } = useLocalSearchParams();
  const { foodItems, setCurrentRecommendedFoodItems, currentRecommendedFoodItems } =
    useFoodMenuStore();
  const initialIndex = foodItems.findIndex((item) => item.id === foodId);
  const [selectedFoodItemImageIndex, setSelectedFoodItemImageIndex] = useState(0);
  const [currentFoodItemIndex, setCurrentFoodItemIndex] = useState(initialIndex);
  const [currentFoodItemImages, setCurrentFoodItemImages] = useState<string[]>([]);
  const todayDay = getLocalDay();
  useEffect(() => {
    const initialIndex = foodItems.findIndex((item) => item.id === foodId);
    setCurrentFoodItemIndex(initialIndex);
  }, [foodItems]);

  useFocusEffect(
    useCallback(() => {
      const currentFoodItemImages = [...(foodItems[currentFoodItemIndex]?.image || [])];
      if (foodItems[currentFoodItemIndex]?.making_video_link !== '') {
        currentFoodItemImages.unshift(foodItems[currentFoodItemIndex]?.making_video_link);
      }
      setCurrentFoodItemImages(currentFoodItemImages);
      setSelectedFoodItemImageIndex(0);

      const fetchRecommendedFoodItems = async () => {
        const recommendedFoodItems = await Promise.all(
          foodItems[currentFoodItemIndex]?.recommended_dishes.map((id) => fetchFoodItemById(id))
        );
        const filteredFoodItems = recommendedFoodItems.filter(
          (item: MenuItem | null) => item !== null
        ) as MenuItem[];
        setCurrentRecommendedFoodItems(filteredFoodItems);
      };

      fetchRecommendedFoodItems();
    }, [currentFoodItemIndex])
  );

  const handlePrevious = () => {
    if (currentFoodItemIndex > 0) {
      setCurrentFoodItemIndex(currentFoodItemIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentFoodItemIndex < foodItems.length - 1) {
      setCurrentFoodItemIndex(currentFoodItemIndex + 1);
    }
  };

  const mobileStyles = {
    backButtonIcon: {
      width: 36,
      height: 36
    }
  }

  const webStyles = {
    backButtonIcon: {
      width: 24,
      height: 24
    }
  }

  if (!currentFoodItemImages) return null;

  return (
    <BackgroundWrapper>
      <SafeAreaView className="relative mt-1 flex-1" edges={{ top: 'off' }}>
        <Stack.Screen
          options={{ title: 'ItemDetails', headerShown: false, animation: 'slide_from_bottom' }}
        />
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View className="flex flex-1 flex-col space-y-4 overflow-hidden">
            {currentFoodItemImages.length > 0 &&
              currentFoodItemImages[selectedFoodItemImageIndex] &&
              isVideoLink(currentFoodItemImages[selectedFoodItemImageIndex])
              ? (() => {
                const videoId = currentFoodItemImages[selectedFoodItemImageIndex].split('v=')[1];
                return <YoutubeVideoPlayer videoId={videoId} />;
              })()
              : (() => {
                const imageUrl = `${BASE_URL}/api/files/food_item/${foodItems[currentFoodItemIndex]?.id}/${currentFoodItemImages[selectedFoodItemImageIndex]}`;
                return (
                  <>
                    {
                      Platform.OS === "web"
                        ?
                        <img
                          src={`${BASE_URL}/api/files/food_item/${foodItems[currentFoodItemIndex]?.id}/${currentFoodItemImages[selectedFoodItemImageIndex]}`}
                          style={{ height: 'full' }}
                          loading='lazy'
                        />
                        :
                        <Image
                          source={{ uri: imageUrl }}
                          style={{
                            maxHeight: '80%',
                            height: 600,
                            width: '100%',
                            flexGrow: 1,
                          }}
                          contentFit="cover"
                          placeholder="LEHV6nWB2yk8pyo0adR*.7kCMdnj"
                          transition={700}
                        />
                    }
                  </>
                );
              })()}
            {foodItems[currentFoodItemIndex]?.availableDays?.availableDays?.includes(todayDay) ||
              (!foodItems[currentFoodItemIndex]?.availableDays &&
                foodItems[currentFoodItemIndex]?.available) ? (
              <View className="my-4 flex flex-col gap-4 px-2">
                <View className="flex flex-row items-center justify-between">
                  <Text className={
                    clsx(
                      screenWidth <= 768 ? 'text-xl font-bold' : "text-3xl font-bold"
                    )
                  }>
                    {foodItems[currentFoodItemIndex]?.name}
                  </Text>
                  <Text className={
                    clsx(
                      "font-bold ",
                      screenWidth <= 768 ? 'text-xl' : 'text-3xl'
                    )
                  }>
                    {' '}
                    ${foodItems[currentFoodItemIndex]?.price}
                  </Text>
                </View>
                {currentFoodItemImages.length > 1 && (
                  <>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      style={{ marginVertical: 4 }}
                      contentContainerStyle={{ gap: 12 }}
                      className="bg-gray-200">
                      {currentFoodItemImages.map((image, index) => (
                        <TouchableOpacity
                          onPress={() => setSelectedFoodItemImageIndex(index)}
                          key={index}>
                          <Image
                            key={index}
                            source={{
                              uri: isVideoLink(image)
                                ? getYoutubeThumbnail(image, 'high') || ''
                                : `${BASE_URL}/api/files/food_item/${foodItems[currentFoodItemIndex]?.id}/${image}`,
                            }}
                            style={{
                              width: 100,
                              height: 100,
                              borderRadius: 8,
                              borderWidth: selectedFoodItemImageIndex === index ? 4 : 0,
                              borderColor:
                                selectedFoodItemImageIndex === index ? 'orange' : 'transparent',
                            }}
                            contentFit="cover"
                          />
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </>
                )}
                <View className={
                  clsx(
                    "flex flex-col",
                    screenWidth <= 768 ? 'gap-2' : 'gap-4'
                  )
                }>
                  {foodItems[currentFoodItemIndex].description && (
                    <View className={
                      clsx(
                        screenWidth <= 768 ? 'mb-4' : 'mb-10'
                      )
                    }>
                      <Text className={
                        clsx(
                          screenWidth <= 768 ? 'text-sm' : 'text-xl'
                        )
                      }>
                        {foodItems[currentFoodItemIndex]?.description}
                      </Text>
                    </View>
                  )}
                  {foodItems[currentFoodItemIndex]?.allergens.length > 0 && (
                    <View className="flex flex-row bg-gray-200 items-center">
                      <Text className={
                        clsx(
                          screenWidth <= 768 ? "text-lg font-bold" : "text-2xl font-bold"
                        )
                      }>Allergens : </Text>
                      <Text className={clsx(
                        screenWidth <= 768 ? "text-sm" : "text-2xl"
                      )}>
                        {foodItems[currentFoodItemIndex]?.allergens.join(', ')}
                      </Text>
                    </View>
                  )}
                  {foodItems[currentFoodItemIndex]?.ingredients && (
                    <View className="flex flex-col bg-gray-200">
                      <Text className={
                        clsx(
                          screenWidth <= 768 ? "text-lg font-bold" : "text-2xl font-bold"
                        )
                      }>Ingredients : </Text>
                      <Text className={
                        clsx(
                          screenWidth <= 768 ? "text-wrap pl-8 text-sm" : "text-wrap pl-8 text-xl tracking-wider"
                        )
                      }>
                        {foodItems[currentFoodItemIndex]?.ingredients}
                      </Text>
                    </View>
                  )}
                  {foodItems[currentFoodItemIndex]?.prep_time && (
                    <View className="flex flex-row items-center bg-gray-200">
                      <Text className={
                        clsx(
                          " font-bold",
                          screenWidth <= 768 ? "text-lg" : "text-2xl"
                        )
                      }>Prep Time : </Text>
                      <Text className={
                        clsx(
                          screenWidth <= 768 ? "text-sm" : "text-2xl"
                        )
                      }>{foodItems[currentFoodItemIndex]?.prep_time}</Text>
                    </View>
                  )}
                </View>
                {foodItems[currentFoodItemIndex].recommended_dishes.length > 0 && (
                  <View>
                    <Text className={
                      clsx(
                        " font-bold",
                        screenWidth <= 768 ? "text-lg" : "text-2xl"
                      )
                    }>Recommended Dishes :</Text>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={{ gap: 24 }}
                    >
                      {currentRecommendedFoodItems.map((item) => {
                        return <RecommendedDishCard key={item.id} item={item} />;
                      })}
                    </ScrollView>
                  </View>
                )}
              </View>
            ) : (
              <BlurView
                intensity={100}
                tint="dark"
                className="absolute bottom-0 left-0 right-0 top-0 py-4">
                <View className="flex flex-1 flex-col justify-between py-12">
                  <Text className="text-center text-4xl font-semibold text-white">
                    {foodItems[currentFoodItemIndex]?.coming_soon_text
                      ? foodItems[currentFoodItemIndex]?.coming_soon_text
                      : 'Coming Soon'}
                  </Text>
                  <Text className="mt-2 text-center text-4xl font-semibold text-white">
                    {foodItems[currentFoodItemIndex]?.name}
                  </Text>
                </View>
              </BlurView>
            )}
          </View>
        </ScrollView>
        <View className={`absolute left-0 top-1/2 z-10 mt-4 -translate-y-1/2`}>
          {currentFoodItemIndex > 0 && (
            <TouchableOpacity
              onPress={handlePrevious}
              className={
                clsx(
                  "flex items-center justify-center rounded-full bg-black/70",
                  screenWidth <= 768 ? 'h-8 w-8' : 'h-16 w-16'
                )
              }>
              <AntDesign name="left" size={screenWidth <= 768 ? 16 : 24} color="white" />
            </TouchableOpacity>
          )}
        </View>
        <View className="absolute right-0 top-1/2 z-10 mt-4 -translate-y-1/2">
          {currentFoodItemIndex < foodItems.length - 1 && (
            <TouchableOpacity
              onPress={handleNext}
              className={
                clsx(
                  "flex items-center justify-center rounded-full bg-black/70",
                  screenWidth <= 768 ? "h-8 w-8" : "h-16 w-16"
                )
              }>
              <AntDesign name="right" size={screenWidth <= 768 ? 16 : 24} color="white" />
            </TouchableOpacity>
          )}
        </View>
        <Pressable
          onPress={() => navigation.goBack()}
          style={Platform.OS === 'web' ? {
            height: screenWidth <= 768 ? 48 : 72,
            width: screenWidth <= 768 ? 48 : 72,
            backgroundColor: 'rgba(205, 125, 28, 1)',
            position: 'absolute',
          } : {
            height: 72,
            width: 72,
            backgroundColor: 'rgba(205, 125, 28, 1)',
            position: 'absolute',
          }}
          className={
            clsx(
              "flex items-center justify-center rounded-full",
              screenWidth <= 768 ? "bottom-24 right-4" : "bottom-20 right-4"
            )
          }>
          <Image
            source={require('../../assets/back-arrow-white.png')}
            style={Platform.OS === 'web' ? webStyles.backButtonIcon : mobileStyles.backButtonIcon}
          />
        </Pressable>
      </SafeAreaView>
    </BackgroundWrapper>
  );
}
