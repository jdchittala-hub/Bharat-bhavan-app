// app/[...missing].tsx
import React from 'react';
import { View, Text } from 'react-native';

export default function CatchAllRoute() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Redirecting...</Text>
        </View>
    );
}