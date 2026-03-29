import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  const getButtonStyle = () => {
    let styleArray: ViewStyle[] = [styles.button];

    if (variant === 'primary') {
      styleArray.push(styles.primaryButton);
      if (disabled || loading) styleArray.push(styles.primaryButtonDisabled);
    } else if (variant === 'secondary') {
      styleArray.push(styles.secondaryButton);
      if (disabled || loading) styleArray.push(styles.secondaryButtonDisabled);
    } else if (variant === 'outline') {
      styleArray.push(styles.outlineButton);
      if (disabled || loading) styleArray.push(styles.outlineButtonDisabled);
    }

    if (style) styleArray.push(style);
    return styleArray;
  };

  const getTextStyle = () => {
    let styleArray: TextStyle[] = [];

    if (variant === 'primary') {
      styleArray.push(styles.primaryButtonText);
    } else if (variant === 'secondary') {
      styleArray.push(styles.secondaryButtonText);
    } else if (variant === 'outline') {
      styleArray.push(styles.outlineButtonText);
    }

    if (textStyle) styleArray.push(textStyle);
    return styleArray;
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator size="small" color={variant === 'primary' ? '#fff' : '#007AFF'} />
      ) : (
        <Text style={getTextStyle()}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: '#007AFF',
  },
  primaryButtonDisabled: {
    backgroundColor: '#ccc',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#f0f0f0',
  },
  secondaryButtonDisabled: {
    backgroundColor: '#e0e0e0',
  },
  secondaryButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  outlineButtonDisabled: {
    borderColor: '#ccc',
  },
  outlineButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
});