import React from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { AppText } from '../AppText';
import { colors } from '../../theme/colors';
import { spacing, borderRadius, shadows } from '../../theme/spacing';

export interface ProfileInfoModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon?: keyof typeof MaterialIcons.glyphMap;
  children: React.ReactNode;
}

export const ProfileInfoModal: React.FC<ProfileInfoModalProps> = ({
  visible,
  onClose,
  title,
  subtitle,
  icon,
  children,
}) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.sheet, shadows.layer3]}>
          {/* Top handle bar */}
          <View style={styles.handle} />

          {/* Header */}
          <View style={styles.header}>
            {icon && (
              <View style={styles.iconWrap}>
                <MaterialIcons name={icon} size={22} color={colors.primaryInk} />
              </View>
            )}
            <View style={styles.headerText}>
              <AppText variant="headlineSm" color={colors.textPrimary}>
                {title}
              </AppText>
              {subtitle && (
                <AppText variant="bodySm" color={colors.textSecondary}>
                  {subtitle}
                </AppText>
              )}
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeBtn}
              accessibilityLabel="Close modal"
            >
              <Ionicons name="close" size={22} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Body */}
          <ScrollView
            style={styles.scrollBody}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>

          {/* Dismiss button */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={onClose}
            style={styles.actionBtn}
          >
            <AppText variant="labelMd" color={colors.onPrimary} style={styles.actionBtnText}>
              Done
            </AppText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.surfaceContainerLowest,
    borderTopLeftRadius: borderRadius.xl * 1.5,
    borderTopRightRadius: borderRadius.xl * 1.5,
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    maxHeight: '82%',
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.outlineVariant,
    alignSelf: 'center',
    marginBottom: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceContainerLow,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
  },
  closeBtn: {
    padding: 6,
  },
  scrollBody: {
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  scrollContent: {
    paddingBottom: spacing.sm,
    gap: spacing.md,
  },
  actionBtn: {
    backgroundColor: colors.primaryContainer,
    paddingVertical: 13,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnText: {
    fontWeight: '700',
  },
});
