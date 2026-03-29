import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Button } from './Button';

interface EmptyStateProps {
  title: string;
  message?: string;
  actionText?: string;
  onActionPress?: () => void;
  style?: ViewStyle;
  titleStyle?: TextStyle;
  messageStyle?: TextStyle;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  message,
  actionText,
  onActionPress,
  style,
  titleStyle,
  messageStyle,
}) => {
  return (
    <View style={[styles.emptyContainer, style]}>
      <Text style={[styles.emptyTitle, titleStyle]}>{title}</Text>
      {message && (
        <Text style={[styles.emptyMessage, messageStyle]}>{message}</Text>
      )}
      {actionText && onActionPress && (
        <Button
          title={actionText}
          onPress={onActionPress}
          variant="secondary"
          style={styles.actionButton}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyMessage: {
    fontSize: 16,
    color: '#999',
    marginBottom: 24,
    textAlign: 'center',
  },
  actionButton: {
    minWidth: 200,
  },
});