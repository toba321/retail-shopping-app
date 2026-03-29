import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  ProductsList: Record<string, never>;
  ProductDetail: { productId: string };
  CartList: Record<string, never>;
  Checkout: Record<string, never>;
};

export type RootTabParamList = {
  Products: Record<string, never>;
  Cart: Record<string, never>;
};

export type ProductsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ProductsList'>;

export type ProductDetailScreenRouteProp = RouteProp<RootStackParamList, 'ProductDetail'>;
export type ProductDetailScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ProductDetail'>;

export type CartScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CartList'>;

export type CheckoutScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Checkout'>;
