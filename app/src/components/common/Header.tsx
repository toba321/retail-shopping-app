import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';

interface HeaderProps {
  title: string;
  onBackPress?: () => void;
  backButtonText?: string;
  style?: ViewStyle;
  titleStyle?: TextStyle;
  backButtonStyle?: ViewStyle;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  onBackPress,
  backButtonText = '← Back',
  style,
  titleStyle,
  backButtonStyle,
}) => {
  return (
    <View style={[styles.header, style]}>
      {onBackPress && (
        <TouchableOpacity onPress={onBackPress} style={backButtonStyle}>
          <Text style={styles.backButton}>{backButtonText}</Text>
        </TouchableOpacity>
      )}
      <Text style={[styles.title, titleStyle]}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
    marginRight: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    flex: 1,
  },
});