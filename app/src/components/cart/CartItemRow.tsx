import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { CartItem } from '../../types';

interface CartItemRowProps {
  item: CartItem;
  onRemove: (productId: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
}

export const CartItemRow: React.FC<CartItemRowProps> = ({
  item,
  onRemove,
  onUpdateQuantity,
}) => {
  return (
    <View style={styles.cartItemContainer}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>£{item.price.toFixed(2)}</Text>
      </View>

      <View style={styles.itemQuantity}>
        <TouchableOpacity
          onPress={() =>
            onUpdateQuantity(item.productId, Math.max(0, item.quantity - 1))
          }
        >
          <Text style={styles.quantityButton}>−</Text>
        </TouchableOpacity>
        <Text style={styles.quantityValue}>{item.quantity}</Text>
        <TouchableOpacity
          onPress={() => onUpdateQuantity(item.productId, item.quantity + 1)}
        >
          <Text style={styles.quantityButton}>+</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.itemTotal}>
        £{(item.price * item.quantity).toFixed(2)}
      </Text>

      <TouchableOpacity
        onPress={() => onRemove(item.productId)}
        style={styles.removeButton}
      >
        <Text style={styles.removeButtonText}>Remove</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  cartItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    color: '#666',
  },
  itemQuantity: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  quantityButton: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  quantityValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    minWidth: 30,
    textAlign: 'center',
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    minWidth: 60,
    textAlign: 'right',
    marginRight: 12,
  },
  removeButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});