import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';

interface TotalContainerProps {
  total: number;
  label?: string;
  style?: ViewStyle;
  labelStyle?: TextStyle;
  amountStyle?: TextStyle;
}

export const TotalContainer: React.FC<TotalContainerProps> = ({
  total,
  label = 'Total:',
  style,
  labelStyle,
  amountStyle,
}) => {
  return (
    <View style={[styles.totalContainer, style]}>
      <Text style={[styles.totalLabel, labelStyle]}>{label}</Text>
      <Text style={[styles.totalAmount, amountStyle]}>£{total.toFixed(2)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
  },
});