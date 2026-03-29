import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from 'react-native';

interface QuantityControlsProps {
  quantity: string;
  onQuantityChange: (quantity: string) => void;
  min?: number;
  max?: number;
}

export const QuantityControls: React.FC<QuantityControlsProps> = ({
  quantity,
  onQuantityChange,
  min = 0,
}) => {
  const currentQty = parseInt(quantity, 10) || 0;

  const handleIncrement = () => {
    const newQty = currentQty + 1;
    onQuantityChange(newQty.toString());
  };

  const handleDecrement = () => {
    const newQty = Math.max(min, currentQty - 1);
    onQuantityChange(newQty.toString());
  };

  const handleTextChange = (text: string) => {
    // Allow empty input for clearing, but ensure it's numeric when not empty
    if (text === '') {
      onQuantityChange('');
    } else {
      const numericText = text.replace(/[^0-9]/g, '');
      onQuantityChange(numericText);
    }
  };

  return (
    <View style={styles.quantityControls}>
      <TouchableOpacity
        style={[styles.quantityButton]}
        onPress={handleDecrement}
      >
        <Text style={[styles.quantityButtonText]}>−</Text>
      </TouchableOpacity>

      <TextInput
        style={[styles.quantityInput]}
        value={quantity}
        onChangeText={handleTextChange}
        keyboardType="number-pad"
        selectTextOnFocus
        placeholder="0"
      />

      <TouchableOpacity
        style={[styles.quantityButton]}
        onPress={handleIncrement}
      >
        <Text style={[styles.quantityButtonText]}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  quantityButtonText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  quantityInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 10,
    width: 60,
    fontSize: 16,
    textAlign: 'center',
  }
});