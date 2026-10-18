import React from 'react';
import { View, StyleSheet, Modal } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { AppText } from '../AppText';
import { PrimaryButton } from '../PrimaryButton';
import { SecondaryButton } from '../SecondaryButton';
import { colors } from '../../theme/colors';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import { Campaign } from '../../types/campaign';

export interface WizardSuccessModalProps {
  visible: boolean;
  campaign: Campaign | null;
  onViewCampaign: () => void;
  onViewDashboard?: () => void;
  onReturnHome: () => void;
}

export const WizardSuccessModal: React.FC<WizardSuccessModalProps> = ({
  visible,
  campaign,
  onViewCampaign,
  onViewDashboard,
  onReturnHome,
}) => {
  if (!campaign) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={[styles.modalCard, shadows.layer2]}>
          {/* Header Icon */}
          <View style={styles.iconCircle}>
            <Ionicons name="checkmark" size={32} color={colors.onPrimary} />
          </View>

          {/* Title & Status */}
          <AppText variant="headlineLg" color={colors.textPrimary} style={styles.modalTitle}>
            Dossier Submitted for Review
          </AppText>

          <View style={styles.statusPill}>
            <View style={styles.pulseDot} />
            <AppText variant="labelMicro" color={colors.primaryInk} style={styles.statusPillText}>
              STATUS: PENDING EDITORIAL AUDIT
            </AppText>
          </View>

          {/* Dossier Meta Summary */}
          <View style={styles.dossierMetaBox}>
            <View style={styles.metaRow}>
              <AppText variant="labelMicro" color={colors.textSecondary}>
                UNIQUE DOSSIER ID
              </AppText>
              <AppText variant="labelMd" color={colors.textPrimary} style={styles.idText}>
                {campaign.id}
              </AppText>
            </View>

            <View style={styles.divider} />

            <View style={styles.metaRow}>
              <AppText variant="labelMicro" color={colors.textSecondary}>
                TARGET AD BUDGET
              </AppText>
              <AppText variant="labelMd" color={colors.textPrimary} style={styles.metaValue}>
                ₹{campaign.targetAmount.toLocaleString('en-IN')}
              </AppText>
            </View>

            <View style={styles.divider} />

            <View style={styles.metaRow}>
              <AppText variant="labelMicro" color={colors.textSecondary}>
                PROJECTED REACH
              </AppText>
              <AppText variant="labelMd" color={colors.primaryInk} style={styles.metaValue}>
                ~{campaign.estimatedReach.toLocaleString('en-IN')} citizens
              </AppText>
            </View>
          </View>

          {/* Explanatory Protocol Note */}
          <View style={styles.protocolNoteBox}>
            <MaterialIcons name="security" size={16} color={colors.primaryInk} />
            <AppText variant="bodySm" color={colors.textSecondary} style={styles.protocolNoteText}>
              Your initiative is now stored in the app’s local ledger under verification. Our civic desk confirms cited empirical sources and ad format compliance before opening the 14-day community flight.
            </AppText>
          </View>

          {/* Action CTAs */}
          <View style={styles.buttonStack}>
            <PrimaryButton
              title="View Submitted Campaign Dossier"
              onPress={onViewCampaign}
            />

            {onViewDashboard && (
              <SecondaryButton
                title="Track in Creator Studio"
                onPress={onViewDashboard}
              />
            )}

            <SecondaryButton
              title="Return to Home Feed"
              onPress={onReturnHome}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(24, 29, 23, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.marginMobile,
  },
  modalCard: {
    width: '100%',
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.card,
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primaryInk,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  modalTitle: {
    textAlign: 'center',
    fontSize: 22,
    lineHeight: 28,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.primaryFixed,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: borderRadius.full,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primaryInk,
  },
  statusPillText: {
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  dossierMetaBox: {
    width: '100%',
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginVertical: 4,
    gap: 8,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  idText: {
    fontFamily: 'monospace',
    fontWeight: '700',
  },
  metaValue: {
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: colors.surfaceContainerHigh,
  },
  protocolNoteBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: colors.surfaceContainer,
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  protocolNoteText: {
    flex: 1,
    fontSize: 11.5,
    lineHeight: 16,
  },
  buttonStack: {
    width: '100%',
    gap: 10,
    marginTop: 6,
  },
});
