import React from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useProductDetail } from '../hooks/useProductDetail';
import { QuantityControls } from '../components/product/QuantityControls';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { Button } from '../components/common/Button';
import {
  ProductDetailScreenRouteProp,
  ProductDetailScreenNavigationProp,
} from '../types';

interface ProductDetailScreenProps {
  route: ProductDetailScreenRouteProp;
  navigation: ProductDetailScreenNavigationProp;
}

export const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({
  route,
  navigation,
}) => {
  const { productId } = route.params;

  const {
    product,
    quantity,
    isLoading,
    error,
    isUpdatingCart,
    cartItem,
    setError,
    handleAddToCart,
    setQuantity,
  } = useProductDetail(productId);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.error}>Product not found</Text>
      </SafeAreaView>
    );
  }

  const currentQty = parseInt(quantity, 10) || 0;

  return (
    <SafeAreaView style={styles.container}>

      {error && (
        <ErrorMessage message={error} onDismiss={() => setError(null)} />
      )}

      <View style={styles.content}>
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.price}>£{product.price.toFixed(2)}</Text>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>In stock:</Text>
          <Text style={styles.infoValue}>{product.stock}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>In your cart:</Text>
          <Text style={styles.infoValue}>{cartItem ? cartItem.quantity : 0}</Text>
        </View>

        <QuantityControls
          quantity={quantity}
          onQuantityChange={setQuantity}
        />

        <Button
          title={
            isUpdatingCart
              ? 'Updating...'
              : cartItem
              ? 'Update Cart'
              : 'Add to Cart'
          }
          onPress={handleAddToCart}
          variant="primary"
          loading={isUpdatingCart}
          disabled={currentQty <= 0}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  productName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 15,
    color: '#666',
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    color: '#FF3B30',
    fontSize: 16,
    padding: 16,
  },
});
