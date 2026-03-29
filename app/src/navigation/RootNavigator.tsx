import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, StyleSheet } from 'react-native';

import { ProductsScreen } from '../screens/ProductsScreen';
import { ProductDetailScreen } from '../screens/ProductDetailScreen';
import { CartScreen } from '../screens/CartScreen';
import { CheckoutScreen } from '../screens/CheckoutScreen';
import { RootStackParamList, RootTabParamList } from '../types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();

const ProductsStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
      }}
    >
      <Stack.Screen
        name="ProductsList"
        options={{title: "Products"}}
        component={ProductsScreen}
      />
      <Stack.Screen
        name="ProductDetail"
        options={{
          title: "Product details"
        }}
        component={ProductDetailScreen}
      />
    </Stack.Navigator>
  );
};

const CartStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
      }}
    >
      <Stack.Screen
        name="CartList"
        options={{
          title: "Shopping Cart"
        }}
        component={CartScreen}
      />
      <Stack.Screen
        name="Checkout"
        options={{
          title: "Checkout"
        }}
        component={CheckoutScreen}
      />
    </Stack.Navigator>
  );
};

const TabIcon = ({ name, focused }: { name: string; focused: boolean }) => {
  const color = focused ? '#007AFF' : '#999';
  const size = focused ? 28 : 24;

  return (
    <Text style={[styles.tabIcon, { color, fontSize: size }]}>
      {name === 'Products' && '🛍️'}
      {name === 'Cart' && '🛒'}
    </Text>
  );
};

export const RootNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarShowLabel: true,
          tabBarStyle: styles.tabBar,
          tabBarLabelStyle: styles.tabBarLabel,
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: '#999',
          tabBarIcon: ({ focused }) => (
            <TabIcon name={route.name} focused={focused} />
          ),
        })}
      >
        <Tab.Screen
          name="Products"
          component={ProductsStackNavigator}
          options={{
            title: 'Shop',
          }}
        />
        <Tab.Screen
          name="Cart"
          component={CartStackNavigator}
          options={{
            title: 'Cart',
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  tabBarLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  tabIcon: {
    marginBottom: 4,
  },
});
