import React from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useProducts } from '../hooks/useProducts';
import { ProductCard } from '../components/product/ProductCard';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { LoadingIndicator } from '../components/common/LoadingIndicator';
import { Product, ProductsScreenNavigationProp } from '../types';

interface ProductsScreenProps {
  navigation: ProductsScreenNavigationProp;
}

export const ProductsScreen: React.FC<ProductsScreenProps> = ({ navigation }) => {
  const { products, isLoading, error } = useProducts(navigation);

  const handleProductPress = (product: Product) => {
    navigation.navigate('ProductDetail', { productId: product.id });
  };

  return (
    <SafeAreaView style={styles.container}>

      {error && (
        <ErrorMessage message={error} />
      )}

      <LoadingIndicator visible={isLoading} message="Loading products..." />

      {!isLoading && (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onPress={() => handleProductPress(item)}
            />
          )}
          contentContainerStyle={styles.listContent}
          onEndReachedThreshold={0.1}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
});
