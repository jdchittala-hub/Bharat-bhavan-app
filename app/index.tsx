import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  RefreshControl,
  ScrollView,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackgroundWrapper } from '~/components/BackgroundWrapper';
import useFoodMenuStore from '~/core/store';
import Menu from './explore-menu';
import HomeCarousel from './home-carousel';
import NewAdditionsCarousel from './new-additions-carousel';
import NoticeCarousel from './notice-carousel';

const Home = () => {
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { width } = useWindowDimensions();
  const {
    notices,
    restaurantImages,
    fetchCategories,
    fetchCategorySchedule,
    fetchNotices,
    fetchRestaurantImages,
    fetchNewAdditions,
  } = useFoodMenuStore();

  const fetchAllData = async () => {
    try {
      await Promise.all([
        fetchCategories(),
        fetchCategorySchedule(),
        fetchNotices(),
        fetchRestaurantImages(),
        fetchNewAdditions(),
      ]);
    } catch (error) {
      console.error('error in fetchAllData');
    }
  };

  useEffect(
    () => {
      const loadInitialData = async () => {
        setIsInitialLoading(true);
        await fetchAllData();
        setIsInitialLoading(false);
      };
      loadInitialData();
    }, []
  );

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchAllData();
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const renderMobileLayout = () => {
    return (
      <BackgroundWrapper>
        <SafeAreaView>
          <ScrollView
            style={{ width, display: 'flex', flexDirection: 'column' }}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
            <View style={{ width, display: 'flex', flexDirection: 'column', height: 1050 }}>
              <HomeCarousel items={restaurantImages || []} />
              <NoticeCarousel items={notices.length > 0 ? notices : []} />
              <View style={{ display: 'flex', flexDirection: 'row', width }}>
                <NewAdditionsCarousel />
                <Menu />
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </BackgroundWrapper>
    );
  };

  const renderWebLayout = () => {
    return (
      <BackgroundWrapper>
        <ScrollView
          contentContainerStyle={Platform.OS === 'web' ? { flexGrow: 1, display: 'flex', alignItems: 'center' } : { flexGrow: 1, display: 'flex', alignItems: 'center' }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
          <View style={{ display: 'flex', flexDirection: 'column' }}>
            <HomeCarousel items={restaurantImages || []} />
            <NoticeCarousel items={notices.length > 0 ? notices : []} />
            <View style={{ flexDirection: width <= 768 ? 'column' : 'row' }}>
              <NewAdditionsCarousel />
              <Menu />
            </View>
          </View>
        </ScrollView>
      </BackgroundWrapper >
    );
  };

  if (isInitialLoading) {
    return (
      <BackgroundWrapper>
        <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#0000ff" />
        </SafeAreaView>
      </BackgroundWrapper>
    );
  }
  return <>{Platform.OS === 'web' ? renderWebLayout() : renderMobileLayout()}</>;
};

export default Home;
