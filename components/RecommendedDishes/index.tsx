import { Image } from 'expo-image';
import React, { useState } from 'react';
import { Pressable, Text, useWindowDimensions, View } from 'react-native';
import { BASE_URL } from '~/core/api';
import RecommendedDishDetailsModal from '../RecommendedDishDetailsModal';
import { getLocalDay } from '~/core/utils';
import { BlurView } from 'expo-blur';
import clsx from 'clsx';

const RecommendedDishCard = ({
  item,
}: {
  item: MenuItem;
}) => {
  const { width: screenWidth } = useWindowDimensions();
  const [isRecommendedDishDetailModalVisible, setIsRecommendedDishDetailModalVisible] = useState(false);
  const [recommendedDishId, setRecommendedDishId] = useState(item.id);
  const onRecommendedDishPress = () => {
    setIsRecommendedDishDetailModalVisible(true);
    setRecommendedDishId(item.id);
  };

  const todayDay = getLocalDay();
  const isFoodItemAvailable = (item?.availableDays?.availableDays?.includes(todayDay) || !item.availableDays) && item.available;
  return (
    <>
      {
        isRecommendedDishDetailModalVisible
        &&
        <RecommendedDishDetailsModal
          recommendedDishId={recommendedDishId}
          isVisible={isRecommendedDishDetailModalVisible}
          setIsVisible={setIsRecommendedDishDetailModalVisible}
          setRecommendedDishId={setRecommendedDishId}
        />
      }

      <Pressable
        key={item.id}
        className="flex flex-col items-center justify-center"
        onPress={() => {
          if (!isFoodItemAvailable) return;
          onRecommendedDishPress()
        }}>
        <Image
          source={{
            uri: `${BASE_URL}/api/files/food_item/${item.id}/${item.image[0]}`,
          }}
          style={{ width: 250, height: 250, borderRadius: 8, top: 0 }}
          contentFit="cover"
        />
        {
          isFoodItemAvailable ?
            <Text className={
              clsx(
                "my-1 w-[250] rounded-lg bg-gray-200 p-2 text-center",
                screenWidth <= 768 ? "text-lg" : "text-2xl"
              )
            }>
              {item.name}
            </Text>
            :
            <BlurView
              intensity={100}
              tint="dark"
              className=" py-4 absolute top-0 left-0 right-0 bottom-1 rounded-lg">
              <View className="flex flex-1 flex-col justify-between">
                <Text className={
                  clsx(
                    "text-center font-semibold text-white",
                    screenWidth <= 768 ? "text-lg" : "text-xl"
                  )
                }>
                  {item.coming_soon_text ? item.coming_soon_text : 'Coming Soon'}
                </Text>
                <Text className={
                  clsx(
                    "mt-2 text-center font-semibold text-white",
                    screenWidth <= 768 ? "text-lg" : "text-xl"
                  )
                }>
                  {item?.name}
                </Text>
              </View>
            </BlurView>
        }
      </Pressable>
    </>
  );
};
export default RecommendedDishCard;
