import { AntDesign } from '@expo/vector-icons';
import clsx from 'clsx';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { Modal, Platform, Pressable, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BASE_URL } from '~/core/api';
import useFoodMenuStore from '~/core/store';
import { getLocalDay } from '~/core/utils';

const RecommendedDishDetailsModal = ({
    recommendedDishId,
    isVisible,
    setIsVisible,
    setRecommendedDishId,
}: {
    recommendedDishId: string;
    isVisible: boolean;
    setIsVisible: any;
    setRecommendedDishId: any;
}) => {
    const { width: screenWidth } = useWindowDimensions();
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const { currentRecommendedFoodItems } = useFoodMenuStore();
    const initialIndex = currentRecommendedFoodItems.findIndex(
        (item) => item.id === recommendedDishId
    );
    const [currentMenuItemIndex, setCurrentMenuItemIndex] = useState(initialIndex);
    const [modalFoodItems, setModalFoodItems] = useState(currentRecommendedFoodItems);
    const todayDay = getLocalDay();

    useEffect(() => {
        const initialIndex = currentRecommendedFoodItems.findIndex(
            (item) => item.id === recommendedDishId
        );
        setCurrentMenuItemIndex(initialIndex);
        setModalFoodItems(currentRecommendedFoodItems);
    }, [currentRecommendedFoodItems, recommendedDishId]);

    const handlePrevious = () => {
        if (currentMenuItemIndex > 0) {
            setCurrentMenuItemIndex(currentMenuItemIndex - 1);
            setRecommendedDishId(currentRecommendedFoodItems[currentMenuItemIndex - 1].id);
        }
    };

    const handleNext = () => {
        if (currentMenuItemIndex < currentRecommendedFoodItems.length - 1) {
            setCurrentMenuItemIndex(currentMenuItemIndex + 1);
            setRecommendedDishId(currentRecommendedFoodItems[currentMenuItemIndex + 1].id);
        }
    };


    return (
        <SafeAreaView style={Platform.OS === 'web' ? webStyles.safeAreaView : mobileStyles.safeAreaView}>
            <Modal
                visible={isVisible}
                className=""
                backdropColor={'rgba(0,0,0,0.8)'}
                style={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                <View style={Platform.OS === 'web' ? webStyles.safeAreaView : mobileStyles.safeAreaView}>
                    <Image
                        source={{
                            uri: `${BASE_URL}/api/files/food_item/${modalFoodItems[currentMenuItemIndex]?.id}/${modalFoodItems[currentMenuItemIndex]?.image[0]}`,
                        }}
                        style={{
                            width: '100%',
                            height: '500',
                            borderRadius: 8,
                            flexGrow: 1,
                        }}
                        contentFit="cover"
                    />
                    {modalFoodItems[currentMenuItemIndex]?.availableDays?.availableDays?.includes(todayDay) ||
                        (!modalFoodItems[currentMenuItemIndex]?.availableDays &&
                            modalFoodItems[currentMenuItemIndex]?.available) ? (
                        <View className="flex flex-col gap-4">
                            <View className="mt-4 flex w-full flex-row justify-between px-4">
                                <Text className={
                                    clsx(
                                        "align-left mt-2 font-bold text-white",
                                        screenWidth <= 768 ? "text-xl" : "text-4xl",
                                    )
                                }>
                                    {modalFoodItems[currentMenuItemIndex]?.name}
                                </Text>
                                <Text className={
                                    clsx(
                                        "mt-2 font-bold text-white",
                                        screenWidth <= 768 ? "text-xl" : "text-4xl",
                                    )
                                }>
                                    ${modalFoodItems[currentMenuItemIndex]?.price}
                                </Text>
                            </View>
                            {
                                <View>
                                    {modalFoodItems[currentMenuItemIndex].image.length > 1 &&
                                        modalFoodItems[currentMenuItemIndex].image.map((image, index) => {
                                            return (
                                                <TouchableOpacity
                                                    key={index}
                                                    onPress={() => {
                                                        setSelectedImageIndex(index);
                                                    }}>
                                                    <Image
                                                        source={{
                                                            uri: `${BASE_URL}/api/files/food_item/${modalFoodItems[currentMenuItemIndex]?.id}/${image}`,
                                                        }}
                                                        style={{
                                                            width: 100,
                                                            height: 100,
                                                            borderRadius: 8,
                                                            borderWidth: selectedImageIndex === index ? 4 : 0,
                                                            borderColor: selectedImageIndex === index ? 'orange' : 'transparent',
                                                        }}
                                                        contentFit="cover"
                                                    />
                                                </TouchableOpacity>
                                            );
                                        })}
                                </View>
                            }
                        </View>
                    ) : (
                        <BlurView
                            intensity={100}
                            tint="dark"
                            className="absolute bottom-0 left-0 right-0 top-0 py-4">
                            <View className="flex flex-1 flex-col justify-between py-12">
                                <Text className={
                                    clsx(
                                        "text-center font-semibold text-white",
                                        screenWidth <= 768 ? "text-2xl" : "text-4xl"
                                    )
                                }>
                                    {modalFoodItems[currentMenuItemIndex]?.coming_soon_text
                                        ? modalFoodItems[currentMenuItemIndex]?.coming_soon_text
                                        : 'Coming Soon'}
                                </Text>
                                <Text className={
                                    clsx("mt-2 text-center font-semibold text-white",
                                        screenWidth <= 768 ? "text-2xl" : "text-4xl"
                                    )
                                }>
                                    {modalFoodItems[currentMenuItemIndex]?.name}
                                </Text>
                            </View>
                        </BlurView>
                    )}
                </View>
                <View className={`absolute left-0 top-1/2 z-10 -translate-y-1/2`}>
                    {currentMenuItemIndex > 0 && (
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
                <View className="absolute right-0 top-1/2 z-10 -translate-y-1/2">
                    {currentMenuItemIndex < modalFoodItems.length - 1 && (
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
                    onPress={() => {
                        setIsVisible(false);
                        setRecommendedDishId(recommendedDishId);
                    }}
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
                            "right-4 flex items-center justify-center rounded-full",
                            screenWidth <= 768 ? "bottom-24" : "bottom-20"
                        )
                    }>
                    <Image
                        source={require('../../assets/back-arrow-white.png')}
                        style={Platform.OS === 'web' ? webStyles.backButtonIcon : mobileStyles.backButtonIcon}
                    />
                </Pressable>
            </Modal>
        </SafeAreaView>
    );
};

const webStyles = StyleSheet.create({
    safeAreaView: {
        flex: 1,
        padding: 24,
        backgroundColor: 'rgba(0,0,0,0.7)'
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        margin: 40,
        marginVertical: 140,
        padding: 30,
    },
    backButtonIcon: {
        width: 24,
        height: 24
    }
});

const mobileStyles = StyleSheet.create({
    safeAreaView: {
        flex: 1,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        margin: 40,
        marginVertical: 140,
        padding: 30,
    },
    backButtonIcon: {
        width: 24,
        height: 24
    }
});

export default RecommendedDishDetailsModal;
