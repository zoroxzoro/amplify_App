import React, { useState } from 'react';
import {
  View,
  Image,
  StyleSheet,
  ViewStyle,
  ImageStyle,
  StyleProp,
  ImageResizeMode,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { AppText } from './AppText';

export interface CampaignImageProps {
  uri?: string;
  style?: StyleProp<ImageStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  resizeMode?: ImageResizeMode;
  aspectRatio?: number;
  fallbackIcon?: keyof typeof MaterialIcons.glyphMap;
  fallbackText?: string;
  children?: React.ReactNode;
}

export const CampaignImage: React.FC<CampaignImageProps> = ({
  uri,
  style,
  containerStyle,
  resizeMode = 'cover',
  aspectRatio,
  fallbackIcon = 'campaign',
  fallbackText = 'Amplifund Civic Media',
  children,
}) => {
  const [hasError, setHasError] = useState(false);

  const showFallback = !uri || hasError;

  return (
    <View
      style={[
        styles.container,
        aspectRatio ? { aspectRatio } : undefined,
        containerStyle,
      ]}
    >
      {showFallback ? (
        <View style={styles.fallbackContainer}>
          <View style={styles.iconCircle}>
            <MaterialIcons name={fallbackIcon} size={28} color={colors.primaryInk} />
          </View>
          <AppText variant="labelMicro" color={colors.onSurfaceVariant} style={styles.fallbackText}>
            {fallbackText}
          </AppText>
        </View>
      ) : (
        <Image
          source={{ uri }}
          style={[styles.image, style]}
          resizeMode={resizeMode}
          onError={() => setHasError(true)}
        />
      )}

      {/* Children overlay (badges, pills, gradients) */}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    position: 'relative',
    backgroundColor: colors.surfaceContainerHigh,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  fallbackContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.surfaceContainer,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.secondaryContainerSoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  fallbackText: {
    textTransform: 'uppercase',
    letterSpacing: 1,
    opacity: 0.8,
  },
});
