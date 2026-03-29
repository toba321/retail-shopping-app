import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
} from 'react-native';

interface DiscountInputProps {
  discountCode: string;
  onDiscountCodeChange: (code: string) => void;
  editable?: boolean;
  error?: string | null;
}

export const DiscountInput: React.FC<DiscountInputProps> = ({
  discountCode,
  onDiscountCodeChange,
  editable = true,
  error,
}) => {
  return (
    <View style={styles.discountContainer}>
      <Text style={styles.discountLabel}>Discount Code (optional):</Text>
      <TextInput
        style={[styles.discountInput, error ? styles.discountInputError : undefined]}
        value={discountCode}
        onChangeText={onDiscountCodeChange}
        placeholder="Enter discount code"
        placeholderTextColor="#999"
        autoCapitalize="characters"
        editable={editable}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  discountContainer: {
    marginBottom: 16,
  },
  discountLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  discountInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 6,
    padding: 10,
    fontSize: 16,
    color: '#000',
    backgroundColor: '#fff',
  },
  discountInputError: {
    borderColor: '#FF3B30',
  },
  errorText: {
    marginTop: 4,
    fontSize: 13,
    color: '#FF3B30',
  },
});