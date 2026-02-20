import { useNavigation } from '@react-navigation/native';
import { MasonryFlashList } from '@shopify/flash-list';
import clsx from 'clsx';
import { Image } from 'expo-image';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  RefreshControl,
  SafeAreaView,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { BackgroundWrapper } from '~/components/BackgroundWrapper';
import { BASE_URL } from '~/core/api';
import useFoodMenuStore from '~/core/store';
import { getLocalDay, isCategoryAvailable } from '~/core/utils';

const Categories = () => {
  const navigation = useNavigation();
  const { width: screenWidth } = useWindowDimensions();
  const ITEM_WIDTH = Platform.OS === 'web' && screenWidth <= 768 ? screenWidth / 2 : screenWidth / 3;
  const { categories, categorySchedule, fetchCategories, updateSelectedCategory, fetchCategorySchedule } =
    useFoodMenuStore();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const numColumns = Platform.OS === 'web' && screenWidth <= 768 ? 2 : 3;

  const onRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([fetchCategories(), fetchCategorySchedule()]);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const keyExtractor = useCallback((item: Category) => item.id.toString(), []);

  // Memoize the image URL function to prevent recreation on each render
  const getImageUrl = useCallback((item: Category) => {
    return item?.image
      ? `${BASE_URL}/api/files/${item?.collectionName}/${item?.id}/${item?.image}?thumb=300x300`
      : null;
  }, []);

  const navigateToCategoryDetails = (item: Category) => {
    updateSelectedCategory(item.id, null);
    router.navigate(`/categoryDetails/${item.id}`);
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

  const renderMenuItem = ({ item }: { item: Category }) => {
    if (!categorySchedule || categorySchedule.length === 0) {
      return (
        <Pressable
          className={clsx('relative mx-1 mt-2')}
          style={{
            height: 256,
            width: ITEM_WIDTH,
            backgroundColor: '#f0f0f0',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text className="text-lg text-gray-500">Loading...</Text>
        </Pressable>
      );
    }

    const imageUrl = getImageUrl(item);
    const isItemAvailable = isCategoryAvailable(item, categorySchedule);

    const schedule = categorySchedule.find(
      (schedule) =>
        schedule.category_id === item.id && schedule.category_schedule_day.includes(getLocalDay())
    );
    const categoryUnavailableText = schedule?.unavailable_text || 'Currently Unavailable';

    return (
      <Pressable
        className={clsx('relative mx-1 mt-2')}
        onPress={() => isItemAvailable && navigateToCategoryDetails(item)}
        disabled={!isItemAvailable}
        key={item.id}>
        <View
          style={{
            height: 256,
            width: ITEM_WIDTH,
            backgroundColor: 'transparent',
            overflow: 'hidden',
          }}>
          <Image
            source={{ uri: imageUrl }}
            style={{
              width: '100%',
              height: 256,
              backgroundColor: '#f0f0f0',
            }}
            contentFit="cover"
            placeholder="L6PZfSi_.AyE_3t7t7R**0o#DgR4"
            transition={300}
            cachePolicy="memory-disk"
            placeholderContentFit="cover"
          />

          {!isItemAvailable && (
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
                {categoryUnavailableText}
              </Text>
            </View>
          )}

          <View
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: 'rgba(0,0,0,0.6)',
              padding: 10,
            }}>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 20,
                fontWeight: 'bold',
                color: 'white',
              }}>
              {item.name}
            </Text>
          </View>
        </View>
      </Pressable>
    );
  };

  if (isRefreshing) {
    return (
      <BackgroundWrapper>
        <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#0000ff" />
        </SafeAreaView>
      </BackgroundWrapper>
    );
  }

  return (
    <BackgroundWrapper>
      <SafeAreaView style={{ flex: 1, width: screenWidth }} className="relative">
        <View style={{ flex: 1, width: screenWidth }}>
          <MasonryFlashList
            key={`${numColumns}-${Math.floor(screenWidth)}`}
            style={{ flex: 1 }}
            data={categories}
            renderItem={renderMenuItem}
            keyExtractor={keyExtractor}
            numColumns={numColumns}
            estimatedItemSize={256}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={() => <View style={{ paddingBottom: 100 }}></View>}
            extraData={{ screenWidth, numColumns }}
            overrideItemLayout={(layout, item) => {
              layout.size = 256;
            }}
            refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
          />
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
};

export default Categories;
