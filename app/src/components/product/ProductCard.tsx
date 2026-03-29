import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Product } from '../../types';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onPress }) => {
  const isOutOfStock = product.stock === 0;

  return (
    <TouchableOpacity
      style={[styles.card, isOutOfStock && styles.cardDisabled]}
      onPress={onPress}
    >
      <Text style={styles.productName}>{product.name}</Text>
      <Text style={styles.price}>£{product.price.toFixed(2)}</Text>
      <Text
        style={[
          styles.stock,
          isOutOfStock ? styles.outOfStock : styles.inStock,
        ]}
      >
        {isOutOfStock ? 'Out of Stock' : `Stock: ${product.stock}`}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  cardDisabled: {
    opacity: 0.6,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 8,
  },
  stock: {
    fontSize: 14,
    fontWeight: '500',
  },
  inStock: {
    color: '#34C759',
  },
  outOfStock: {
    color: '#FF3B30',
  },
});
