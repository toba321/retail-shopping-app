import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { CartItem } from '../../types';
import { TotalContainer } from '../common/OrderTotal';

interface OrderReviewProps {
  items: CartItem[];
  total: number;
  discountCode?: string;
}

export const OrderReview: React.FC<OrderReviewProps> = ({
  items,
  total,
  discountCode,
}) => {
  return (
    <View style={styles.orderReview}>
      <Text style={styles.sectionTitle}>Order Review</Text>

      {discountCode && (
        <View style={styles.discountCodeContainer}>
          <Text style={styles.discountCodeLabel}>Discount Code:</Text>
          <Text style={styles.discountCodeValue}>{discountCode}</Text>
        </View>
      )}

      {items.map((item) => (
        <View key={item.productId} style={styles.reviewItem}>
          <Text style={styles.reviewItemName}>{item.name}</Text>
          <Text style={styles.reviewItemDetail}>
            {item.quantity} × £{item.price.toFixed(2)} = £
            {(item.price * item.quantity).toFixed(2)}
          </Text>
        </View>
      ))}

      <View style={styles.divider} />

      <TotalContainer total={total} />
    </View>
  );
};

const styles = StyleSheet.create({
  orderReview: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
  },
  discountCodeContainer: {
    backgroundColor: '#f0f8ff',
    padding: 8,
    borderRadius: 4,
    marginBottom: 12,
  },
  discountCodeLabel: {
    fontSize: 12,
    color: '#666',
  },
  discountCodeValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  reviewItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  reviewItemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  reviewItemDetail: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 12,
  },
});