// App.js
import 'react-native-gesture-handler';
import React from 'react';
import { View, StyleSheet, Platform, StatusBar } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from './src/constants/theme';
import { fontSize, responsiveValue } from './src/utils/responsive';
import HomeScreen from './src/screens/HomeScreen/HomeScreen';
import SearchScreen from './src/screens/SearchScreen/SearchScreen';
import CategoryScreen from './src/screens/CategoryScreen/CategoryScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Search') {
            iconName = focused ? 'search' : 'search-outline';
          }
          return <Ionicons name={iconName} size={responsiveValue(22, 24, 26)} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.outline,
          height: responsiveValue(60, 65, 70),
          paddingBottom: responsiveValue(5, 8, 10),
          paddingTop: responsiveValue(5, 8, 10),
        },
        tabBarLabelStyle: {
          fontSize: fontSize.xs,
          fontWeight: '500',
        },
        headerStyle: {
          backgroundColor: theme.colors.primary,
          height: responsiveValue(56, 60, 64),
        },
        headerTintColor: theme.colors.onPrimary,
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: fontSize.lg,
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Ana Sayfa',
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          title: 'Arama',
          headerStyle: {
            backgroundColor: theme.colors.surface,
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
          headerTintColor: theme.colors.onSurface,
        }}
      />
    </Tab.Navigator>
  );
}

// App.js içinde

function MainStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.primary,
          height: responsiveValue(56, 60, 64),
          elevation: 4,
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 3,
        },
        headerTintColor: theme.colors.onPrimary,
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: fontSize.lg,
        },
        headerBackTitleVisible: false,
        headerTitleAlign: 'center',
        // headerMode'u screen olarak ayarlayın
        headerMode: 'screen',
        // Geri butonunu özelleştirin
        headerBackImage: () => (
          <Ionicons
            name="chevron-back"
            size={24}
            color={theme.colors.onPrimary}
            style={{ marginLeft: 8 }}
          />
        ),
      }}
    >
      <Stack.Screen
        name="Main"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Category"
        component={CategoryScreen}
        options={({ route }) => ({
          title: route.params?.category?.name || 'Kategori',
          headerStyle: {
            backgroundColor: route.params?.category?.color || theme.colors.primary,
            height: responsiveValue(56, 60, 64),
            elevation: 4,
            shadowColor: '#000000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 3,
          },
          // Geri butonunu görünür yapın
          headerLeft: (props) => (
            <Ionicons
              name="chevron-back"
              size={28}
              color={theme.colors.onPrimary}
              style={{ marginLeft: 16 }}
              onPress={() => props.onPress()}
            />
          ),
        })}
      />
    </Stack.Navigator>
  );
}

// Ana App bileşeninde StatusBar ekleyin
export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle="light-content"
        backgroundColor={theme.colors.primary}
        translucent={false}
      />
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <MainStack />
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
}