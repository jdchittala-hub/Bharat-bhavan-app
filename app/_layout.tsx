import React from 'react';
import '../global.css';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Stack } from 'expo-router';
import AppHeader from '~/components/AppHeader';
import { StatusBar } from 'expo-status-bar';

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppHeader />
      <Stack screenOptions={{ headerShown: false }} />
      <StatusBar style="light" hidden />
    </GestureHandlerRootView>
  );
}
