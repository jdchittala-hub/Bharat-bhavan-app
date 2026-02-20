import { AntDesign, Ionicons } from '@expo/vector-icons';
import clsx from 'clsx';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { router, Stack, useNavigation } from 'expo-router';
import { useLocalSearchParams } from 'expo-router/build/hooks';
import * as React from 'react';
import { useEffect, useState } from 'react';

import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { ResponsiveGrid } from 'react-native-flexible-grid';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackgroundWrapper } from '~/components/BackgroundWrapper';
import { BASE_URL } from '~/core/api';
import useFoodMenuStore from '~/core/store';
import { getLocalDay, isCategoryAvailable, isSubCategoryAvailable } from '~/core/utils';

const todayDay = getLocalDay();

export default function Subcategory() {
  const navigation = useNavigation();
  const [refreshed, setRefreshed] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const {
    updateSelectedSubCategory,
    updateFoodItems,
    updateSelectedCategory,
    categories,
    subCategories,
    foodItems,
    selectedCategory,
    selectedSubCategory,
    currentSubCategoryIndex,
    setCurrentSubCategoryIndex,
    updateCurrentSubCategoryIndex,
    categorySchedule,
    subcategorySchedule,
    fetchCategories,
    fetchCategorySchedule,
    fetchSubcategorySchedule,
  } = useFoodMenuStore();
  const { id: categoryId } = useLocalSearchParams();
  const { width, height: screenHeight } = useWindowDimensions();
  const initialCategoryScheduleItem = categorySchedule?.find(
    (schedule) =>
      schedule.category_id === categoryId &&
      schedule.category_schedule_day?.includes?.(getLocalDay())
  );

  const initialSubcategoryScheduleItem = subcategorySchedule?.find(
    (schedule) =>
      schedule.sub_category_id === selectedSubCategory?.id &&
      schedule.sub_category_schedule_day?.includes?.(getLocalDay())
  );

  const [categoryUnavailableText, setCategoryUnavailableText] = useState(
    initialCategoryScheduleItem?.unavailable_text || 'Category Currently Unavailable'
  );
  const [subcategoryUnavailableText, setSubcategoryUnavailableText] = useState(
    initialSubcategoryScheduleItem?.unavailable_text || 'Subcategory Currently Unavailable'
  );
  const [isCurrentCategoryAvailable, setIsCurrentCategoryAvailable] = useState(false);
  const [isCurrentSubcategoryAvailable, setIsCurrentSubcategoryAvailable] = useState(false);

  useEffect(() => {
    if (refreshed) {
      updateSelectedCategory(selectedCategory?.id as string, selectedSubCategory?.id as string),
        setRefreshed(false);
    }
  }, [refreshed]);

  useEffect(() => {
    if (!selectedCategory || !categorySchedule) return;
    const isCurrentCategoryAvailable = isCategoryAvailable(
      selectedCategory as Category,
      categorySchedule
    );
    setIsCurrentCategoryAvailable(isCurrentCategoryAvailable);
    const categoryScheduleItem = categorySchedule.find(
      (schedule) =>
        schedule.category_id === selectedCategory?.id &&
        schedule.category_schedule_day?.includes?.(getLocalDay())
    );
    setCategoryUnavailableText(
      categoryScheduleItem?.unavailable_text || 'Category Currently Unavailable'
    );
  }, [selectedCategory, categorySchedule]);

  useEffect(() => {
    if (!selectedSubCategory || !subcategorySchedule) return;
    const isCurrentSubcategoryAvailable = isSubCategoryAvailable(
      selectedSubCategory as SubCategory,
      subcategorySchedule
    );
    setIsCurrentSubcategoryAvailable(isCurrentSubcategoryAvailable);

    const subcategoryScheduleItem = subcategorySchedule.find(
      (schedule) =>
        schedule.sub_category_id === selectedSubCategory?.id &&
        schedule.sub_category_schedule_day?.includes?.(getLocalDay())
    );
    setSubcategoryUnavailableText(
      subcategoryScheduleItem?.unavailable_text || 'Subcategory Currently Unavailable'
    );
  }, [selectedSubCategory, subcategorySchedule]);

  const fetchAllData = async () => {
    try {
      await Promise.all([fetchCategories(), fetchCategorySchedule(), fetchSubcategorySchedule()]);
    } catch (error) {
      console.error('Error fetching all data:', error);
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

  const onRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchAllData();
      setRefreshed(true);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handlePrevious = () => {
    if (currentSubCategoryIndex > 0 && subCategories && subCategories.length > 0) {
      updateCurrentSubCategoryIndex(currentSubCategoryIndex - 1);
      updateSelectedSubCategory(subCategories[currentSubCategoryIndex - 1]?.id);
    }
  };

  const handleNext = () => {
    if (
      currentSubCategoryIndex < (subCategories?.length || 0) - 1 &&
      subCategories &&
      subCategories.length > 0
    ) {
      updateCurrentSubCategoryIndex(currentSubCategoryIndex + 1);
      updateSelectedSubCategory(subCategories[currentSubCategoryIndex + 1]?.id);
    }
  };

  const renderCategoryItem = ({ item }: { item: Category }) => {
    if (!item) return null;

    const categoryAvailable =
      !item.unavailable && isCategoryAvailable(item, categorySchedule || []);
    return (
      <Pressable
        className={
          clsx(
            width <= 768 ? 'px-3 py-1' : "mx-2 px-6 py-3"
          )
        }
        onPress={() => {
          updateSelectedCategory(item.id, null);
          updateCurrentSubCategoryIndex(0);
        }}>
        <Text
          className={clsx({
            'font-semibold text-black': selectedCategory?.id === item?.id,
            'text-white': selectedCategory?.id !== item?.id && categoryAvailable,
            'text-gray-400': !categoryAvailable && selectedCategory?.id !== item?.id,
          },
            width <= 768 ? 'text-lg font-normal' : 'text-2xl'
          )}>
          {item.name}
        </Text>
      </Pressable>
    );
  };

  const renderSubCategoryItem = ({ item }: { item: SubCategory }) => {
    if (!item) return null;
    const subcategoryAvailable = isSubCategoryAvailable(item, subcategorySchedule || []);
    return (
      <Pressable
        className={clsx('mx-2 border-b-2', {
          'border-mint': selectedSubCategory?.id === item?.id,
          'border-transparent': selectedSubCategory?.id !== item?.id,
        },
          width <= 768 ? 'px-3 py-1' : 'px-6 py-3'
        )}
        onPress={() => {
          updateSelectedSubCategory(item.id);
          setCurrentSubCategoryIndex(item.id);
        }}>
        <Text
          className={clsx('font-medium capitalize', {
            'text-mint': selectedSubCategory?.id === item?.id,
            'text-black': selectedSubCategory?.id === item?.id,
            'text-gray-400': !isCurrentCategoryAvailable || !subcategoryAvailable,
          },
            width <= 768 ? 'text-lg font-normal' : 'text-2xl'
          )}
        >
          {item?.name}
        </Text>
      </Pressable>
    );
  };

  const renderMenuItem = ({ item }: { item: any }) => {
    if (!item) return null;

    const currentSubcategory = subCategories?.find((sub) => sub.id === selectedSubCategory?.id);
    const isCurrentSubcategoryAvailable =
      currentSubcategory && selectedSubCategory
        ? isSubCategoryAvailable(selectedSubCategory as SubCategory, subcategorySchedule || [])
        : true;

    return (
      <Pressable
        className="relative aspect-square overflow-hidden"
        onPress={() => {
          if (
            isCurrentCategoryAvailable &&
            isCurrentSubcategoryAvailable &&
            (item?.availableDays?.availableDays?.includes(todayDay) ||
              (!item.availableDays && item.available))
          ) {
            router.navigate(`/item-details/${item.id}`);
          }
        }}>
        {
          Platform.OS === 'web' ?
            <img
              src={`${BASE_URL}/api/files/${item?.collectionName}/${item?.id}/${item?.image?.[0]}`}
              style={{ height: 'full', position: 'absolute' }}
              loading='lazy'
            />
            :
            <Image
              source={{
                uri: `${BASE_URL}/api/files/${item?.collectionName}/${item?.id}/${item?.image?.[0]}`,
              }}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                position: 'absolute',
              }}
              contentFit="cover"
              placeholder="LEHV6nWB2yk8pyo0adR*.7kCMdnj"
              transition={700}
            />
        }

        {!isCurrentCategoryAvailable ? (
          <BlurView
            intensity={100}
            tint="dark"
            className="absolute bottom-0 left-0 right-0 top-0 py-4">
            <View className="flex flex-1 flex-col justify-between">
              <Text className="text-center text-xl font-semibold text-white">
                {categoryUnavailableText}
              </Text>
              <Text className={
                clsx(
                  "text-center text-xl font-semibold text-white",
                  Platform.OS === 'web' && width <= 768 ? 'mt-1' : 'mt-2'
                )
              }>
                {item?.name}
              </Text>
            </View>
          </BlurView>
        ) : !isCurrentSubcategoryAvailable ? (
          <BlurView
            intensity={100}
            tint="dark"
            className="absolute bottom-0 left-0 right-0 top-0 py-4">
            <View className="flex flex-1 flex-col justify-between">
              <Text className="text-center text-xl font-semibold text-white">
                {subcategoryUnavailableText}
              </Text>
              <Text className="mt-2 text-center text-xl font-semibold text-white">
                {item?.name}
              </Text>
            </View>
          </BlurView>
        ) : (item?.availableDays?.availableDays?.includes(todayDay) || !item.availableDays) &&
          item.available ? (
          <View className="relative mt-auto flex-row">
            <BlurView intensity={100} tint="dark" className={
              clsx(
                "absolute bottom-0 left-0 right-0",
                Platform.OS === 'web' && width <= 768 ? 'py-1' : 'py-4'
              )
            }>
              <Text className={
                clsx(
                  "text-center  text-white",
                  Platform.OS === 'web' && width <= 768 ? 'font-normal' : 'text-xl font-semibold'
                )
              }>{item?.name}</Text>
              <Text className={
                clsx(
                  "mt-2 text-center  text-white",
                  Platform.OS === 'web' && width <= 768 ? 'font-normal' : 'font-semibold'
                )
              }>${item?.price}</Text>
            </BlurView>
          </View>
        ) : (
          <BlurView
            intensity={100}
            tint="dark"
            className="absolute bottom-0 left-0 right-0 top-0 py-4">
            <View className="flex flex-1 flex-col justify-between">
              <Text className={
                clsx(
                  "text-center  text-white",
                  Platform.OS === 'web' && width <= 768 ? 'font-normal' : 'text-xl font-semibold'
                )
              }>
                {item.coming_soon_text ? item.coming_soon_text : 'Coming Soon'}
              </Text>
              <Text className={
                clsx(
                  "mt-2 text-center text-white",
                  Platform.OS === 'web' && width <= 768 ? 'font-normal' : 'text-xl font-semibold'
                )
              }>
                {item?.name}
              </Text>
            </View>
          </BlurView>
        )}
      </Pressable>
    );
  };

  if ((!categories || !subCategories) && !isRefreshing) {
    return (
      <SafeAreaView className="mt-1 flex-1" edges={{ top: 'off' }}>
        <Stack.Screen options={{ headerShown: false }} />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#0000ff" />
          <Text className="mt-4 text-gray-600">Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <BackgroundWrapper>
      <SafeAreaView className=" mt-1 flex-1" edges={{ top: 'off' }}>
        <Stack.Screen options={{ headerShown: false }} />
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}>
          <View className={
            clsx(
              "flex flex-row items-center justify-between bg-[#CD7D1B]",
              width <= 768 ? 'py-2' : 'py-10'
            )
          }>
            <View className={
              clsx(
                "flex items-center justify-center",
                width <= 768 ? 'pl-2 w-15' : 'pl-8 w-20'
              )
            }>
              <Pressable
                className="rounded-full border-4 border-white p-2"
                onPress={() => {
                  updateFoodItems([]);
                  router.replace('/');
                }}>
                <Ionicons name="home" size={20} color={'white'} />
              </Pressable>
            </View>
            {categories && categories.length > 0 && (
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={categories}
                renderItem={renderCategoryItem}
                keyExtractor={(item) => item?.id || ''}
                ItemSeparatorComponent={() => <View className={
                  clsx(
                    "my-auto bg-white",
                    Platform.OS === 'web' && width <= 768 ? 'h-6 w-[2px]' : 'h-8 w-1'
                  )
                } />}
              />
            )}
          </View>
          {!isCurrentCategoryAvailable && (
            <View className="bg-red-500/90 py-2">
              <Text className="text-center text-base font-semibold text-white">
                {categoryUnavailableText}
              </Text>
            </View>
          )}
          {isCurrentCategoryAvailable && !isCurrentSubcategoryAvailable && (
            <View className="bg-red-500/90 py-2">
              <Text className="text-center text-base font-semibold text-white">
                {subcategoryUnavailableText}
              </Text>
            </View>
          )}
          <View className={
            clsx(
              "flex items-center justify-center mx-4",
              width <= 768 ? "py-1 flex-row" : "py-4"
            )
          }>
            {subCategories && subCategories.length > 0 && (
              subCategories.length === 1 ? (
                <View className="flex items-center justify-center w-full">
                  {renderSubCategoryItem({ item: subCategories[0] })}
                </View>
              ) : (
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  data={subCategories}
                  renderItem={renderSubCategoryItem}
                  keyExtractor={(item) => item?.id || ''}
                />
              )
            )}
          </View>

          {Boolean(isRefreshing) ? (
            <View className="flex-1 items-center justify-center py-10">
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          ) : (
            foodItems &&
            foodItems.length > 0 && (
              <ResponsiveGrid
                maxItemsPerColumn={Platform.OS === 'web' && width <= 768 ? 2 : 3}
                keyExtractor={(item) => item?.id?.toString() || ''}
                data={foodItems}
                virtualizedBufferFactor={2}
                renderItem={renderMenuItem}
                itemContainerStyle={{ padding: 4 }}
                virtualization={true}
                showScrollIndicator={false}
                FooterComponent={() => {
                  return <View className=""></View>;
                }}
              />
            )
          )}
        </ScrollView>
        <Pressable
          onPress={() => navigation.goBack()}
          style={Platform.OS === 'web' ? {
            height: width <= 768 ? 48 : 72,
            width: width <= 768 ? 48 : 72,
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
              width <= 768 ? "bottom-24 right-4" : "bottom-20 right-4"
            )
          }>
          <Image
            source={require('../../assets/back-arrow-white.png')}
            style={Platform.OS === 'web' ? webStyles.backButtonIcon : mobileStyles.backButtonIcon}
          />
        </Pressable>
        {!Boolean(isRefreshing) && subCategories && subCategories.length > 1 && (
          <>
            <View
              style={{ top: screenHeight / 2 }}
              className="absolute left-2 z-10 -translate-y-1/2">
              {currentSubCategoryIndex > 0 && (
                <TouchableOpacity
                  onPress={handlePrevious}
                  className={
                    clsx(
                      "flex items-center justify-center rounded-full bg-black/70",
                      width <= 768 ? 'h-8 w-8' : 'h-16 w-16'
                    )
                  }>
                  <AntDesign name="left" size={width <= 768 ? 16 : 24} color="white" />
                </TouchableOpacity>
              )}
            </View>
            <View
              style={{ top: screenHeight / 2 }}
              className="absolute right-4 z-10 -translate-y-1/2">
              {currentSubCategoryIndex < (subCategories?.length || 0) - 1 && (
                <TouchableOpacity
                  onPress={handleNext}
                  className={
                    clsx(
                      "flex items-center justify-center rounded-full bg-black/70",
                      width <= 768 ? "h-8 w-8" : "h-16 w-16"
                    )
                  }>
                  <AntDesign name="right" size={width <= 768 ? 16 : 24} color="white" />
                </TouchableOpacity>
              )}
            </View>
          </>
        )}
      </SafeAreaView>
    </BackgroundWrapper>
  );
}
