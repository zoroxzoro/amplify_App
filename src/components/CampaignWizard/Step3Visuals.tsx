import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { AppText } from '../AppText';
import { colors } from '../../theme/colors';
import { spacing, borderRadius, shadows } from '../../theme/spacing';
import { CampaignDraft } from '../../types/campaign';
import { CURATED_DEMO_IMAGES } from '../../config/campaignCreation';

export interface Step3VisualsProps {
  draft: CampaignDraft;
  errors: Record<string, string>;
  onUpdate: (fields: Partial<CampaignDraft>) => void;
}

const CTA_OPTIONS = [
  'Read Civic Dossier',
  'Back Public Broadcast',
  'Inspect Audit Record',
  'View Telemetry Data',
];

export const Step3Visuals: React.FC<Step3VisualsProps> = ({
  draft,
  errors,
  onUpdate,
}) => {
  const [showDemoCoverModal, setShowDemoCoverModal] = useState(false);
  const [showDemoFeedModal, setShowDemoFeedModal] = useState(false);

  // Device image selection via expo-image-picker
  const handlePickDeviceImage = async (type: 'cover' | 'feed') => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          'Permission Required',
          'Access to your device photo library is required to select campaign visual assets. You can also pick from the curated demo options below.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: type === 'cover' ? [16, 9] : [1, 1],
        quality: 0.85,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedUri = result.assets[0].uri;
        if (type === 'cover') {
          onUpdate({ coverImageUri: selectedUri });
        } else {
          onUpdate({ feedCreativeUri: selectedUri });
        }
      }
    } catch {
      Alert.alert(
        'Media Picker Unavailable',
        'Device image selection is currently unavailable in this environment. Please choose one of the curated demo visuals below.'
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Prominent Notice Banner */}
      <View style={[styles.noticeBanner, shadows.layer1]}>
        <View style={styles.noticeIconBox}>
          <MaterialIcons name="verified-user" size={20} color={colors.primaryInk} />
        </View>
        <View style={styles.noticeContent}>
          <AppText variant="headlineSm" color={colors.textPrimary} style={styles.noticeTitle}>
            Ad Placement Independence
          </AppText>
          <AppText variant="bodySm" color={colors.textSecondary} style={styles.noticeBody}>
            Story visuals and programmatic feed ad creatives are reviewed by Amplify stewards before delivery across regional news networks and Meta feeds.
          </AppText>
        </View>
      </View>

      {/* Section 1: Story Header Visual (16:9 Landscape) */}
      <View style={[styles.card, shadows.layer1, errors.coverImageUri ? styles.cardError : null]}>
        <View style={styles.cardHeaderRow}>
          <AppText variant="headlineSm" color={colors.textPrimary} style={styles.cardHeaderTitle}>
            Story Header Visual (16:9) <AppText variant="headlineSm" color={colors.restricted}>*</AppText>
          </AppText>
          <View style={styles.approvedBadge}>
            <Ionicons name="checkmark-circle" size={13} color={colors.onPrimaryFixedVariant} />
            <AppText variant="labelMicro" color={colors.onPrimaryFixedVariant}>
              HIGH RES READY
            </AppText>
          </View>
        </View>

        <AppText variant="bodySm" color={colors.textSecondary} style={styles.fieldSubtext}>
          Primary documentary photo featured at the top of the campaign dossier and desktop portals.
        </AppText>

        {/* 16:9 Preview Box */}
        <View style={styles.previewBox169}>
          {draft.coverImageUri ? (
            <>
              <Image
                source={{ uri: draft.coverImageUri }}
                style={styles.image169}
                resizeMode="cover"
              />
              <View style={styles.overlayPill}>
                <View style={styles.overlayDot} />
                <AppText variant="labelMicro" color={colors.inverseOnSurface}>
                  Primary Editorial Header
                </AppText>
              </View>
            </>
          ) : (
            <View style={styles.emptyImagePlaceholder}>
              <MaterialIcons name="add-photo-alternate" size={36} color={colors.textMuted} />
              <AppText variant="bodySm" color={colors.textSecondary}>
                No visual selected
              </AppText>
            </View>
          )}
        </View>

        {/* Action Controls for Cover Visual */}
        <View style={styles.imageActionRow}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => handlePickDeviceImage('cover')}
            activeOpacity={0.8}
          >
            <Ionicons name="image-outline" size={16} color={colors.textPrimary} />
            <AppText variant="labelMd" color={colors.textPrimary} style={styles.actionBtnText}>
              Device Library
            </AppText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => setShowDemoCoverModal(!showDemoCoverModal)}
            activeOpacity={0.8}
          >
            <Ionicons name="sparkles-outline" size={16} color={colors.primaryInk} />
            <AppText variant="labelMd" color={colors.primaryInk} style={styles.actionBtnText}>
              Demo Visuals
            </AppText>
          </TouchableOpacity>

          {draft.coverImageUri ? (
            <TouchableOpacity
              style={styles.removeBtn}
              onPress={() => onUpdate({ coverImageUri: '' })}
              activeOpacity={0.8}
            >
              <Ionicons name="trash-outline" size={16} color={colors.restricted} />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Curated Demo Photos Selector Drawer */}
        {showDemoCoverModal && (
          <View style={styles.demoDrawer}>
            <AppText variant="labelMicro" color={colors.textSecondary} style={styles.demoDrawerTitle}>
              CURATED EDITORIAL REPOSITORY PRESETS:
            </AppText>
            <View style={styles.demoGrid}>
              {CURATED_DEMO_IMAGES.cover.map((item, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.demoItem}
                  onPress={() => {
                    onUpdate({ coverImageUri: item.uri });
                    setShowDemoCoverModal(false);
                  }}
                  activeOpacity={0.8}
                >
                  <Image source={{ uri: item.uri }} style={styles.demoThumb} />
                  <AppText variant="labelMicro" color={colors.textPrimary} numberOfLines={1}>
                    {item.label}
                  </AppText>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {errors.coverImageUri && (
          <AppText variant="bodySm" color={colors.restricted} style={styles.inlineError}>
            {errors.coverImageUri}
          </AppText>
        )}
      </View>

      {/* Section 2: Programmatic Feed Ad Creatives (1:1 & Vertical) */}
      <View style={[styles.card, shadows.layer1]}>
        <View style={styles.cardHeaderRow}>
          <AppText variant="headlineSm" color={colors.textPrimary} style={styles.cardHeaderTitle}>
            Feed Ad Placements (1:1 Square)
          </AppText>
          <View style={styles.syncedBadge}>
            <AppText variant="labelMicro" color={colors.primaryInk}>
              READY FOR SYNDICATION
            </AppText>
          </View>
        </View>

        <AppText variant="bodySm" color={colors.textSecondary} style={styles.fieldSubtext}>
          Dynamic banner ad card generated across Meta newsfeeds and civic partner apps.
        </AppText>

        {/* 1:1 Feed Preview & Inputs */}
        <View style={styles.feedAdLayout}>
          <View style={styles.squareThumbContainer}>
            {draft.feedCreativeUri ? (
              <Image
                source={{ uri: draft.feedCreativeUri }}
                style={styles.imageSquare}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.emptySquarePlaceholder}>
                <MaterialIcons name="image" size={28} color={colors.textMuted} />
              </View>
            )}
            <View style={styles.aspectTag}>
              <AppText variant="labelMicro" color={colors.inverseOnSurface}>
                1:1 Card
              </AppText>
            </View>
          </View>

          <View style={styles.feedActionBtns}>
            <TouchableOpacity
              style={styles.feedMiniBtn}
              onPress={() => handlePickDeviceImage('feed')}
              activeOpacity={0.8}
            >
              <Ionicons name="folder-outline" size={14} color={colors.textPrimary} />
              <AppText variant="labelMicro" color={colors.textPrimary}>Device</AppText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.feedMiniBtn, styles.feedMiniBtnAccent]}
              onPress={() => setShowDemoFeedModal(!showDemoFeedModal)}
              activeOpacity={0.8}
            >
              <Ionicons name="color-wand-outline" size={14} color={colors.primaryInk} />
              <AppText variant="labelMicro" color={colors.primaryInk}>Preset</AppText>
            </TouchableOpacity>
          </View>
        </View>

        {showDemoFeedModal && (
          <View style={styles.demoDrawer}>
            <View style={styles.demoGrid}>
              {CURATED_DEMO_IMAGES.feed.map((item, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.demoItem}
                  onPress={() => {
                    onUpdate({ feedCreativeUri: item.uri });
                    setShowDemoFeedModal(false);
                  }}
                  activeOpacity={0.8}
                >
                  <Image source={{ uri: item.uri }} style={styles.demoThumbSquare} />
                  <AppText variant="labelMicro" color={colors.textPrimary} numberOfLines={1}>
                    {item.label}
                  </AppText>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Ad Headline Input */}
        <View style={styles.adSubfield}>
          <View style={styles.cardHeaderRow}>
            <AppText variant="labelMd" color={colors.textPrimary} style={styles.fieldLabelBold}>
              Ad Headline <AppText variant="labelMd" color={colors.restricted}>*</AppText>
            </AppText>
            <AppText variant="labelMicro" color={colors.textSecondary}>
              {draft.adHeadline.length}/70 chars
            </AppText>
          </View>
          <TextInput
            style={styles.textInput}
            maxLength={70}
            placeholder="Does your child’s classroom meet clean air standards?"
            placeholderTextColor={colors.textMuted}
            value={draft.adHeadline}
            onChangeText={(text) => onUpdate({ adHeadline: text })}
          />
          {errors.adHeadline && (
            <AppText variant="bodySm" color={colors.restricted} style={styles.inlineError}>
              {errors.adHeadline}
            </AppText>
          )}
        </View>

        {/* Ad Deck Copy Input */}
        <View style={styles.adSubfield}>
          <View style={styles.cardHeaderRow}>
            <AppText variant="labelMd" color={colors.textPrimary} style={styles.fieldLabelBold}>
              Ad Deck Copy <AppText variant="labelMd" color={colors.restricted}>*</AppText>
            </AppText>
            <AppText variant="labelMicro" color={colors.textSecondary}>
              {draft.adCopy.length}/140 chars
            </AppText>
          </View>
          <TextInput
            style={[styles.textInput, styles.adCopyInput]}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            maxLength={140}
            placeholder="Real-time sensor audits show 78% of local classrooms lack ventilation. Back the public air report today."
            placeholderTextColor={colors.textMuted}
            value={draft.adCopy}
            onChangeText={(text) => onUpdate({ adCopy: text })}
          />
          {errors.adCopy && (
            <AppText variant="bodySm" color={colors.restricted} style={styles.inlineError}>
              {errors.adCopy}
            </AppText>
          )}
        </View>

        {/* Call to Action (CTA) Select */}
        <View style={styles.adSubfield}>
          <AppText variant="labelMd" color={colors.textPrimary} style={styles.fieldLabelBold}>
            Call to Action (CTA) Button
          </AppText>
          <View style={styles.ctaChipsWrap}>
            {CTA_OPTIONS.map((cta) => {
              const isSelected = draft.callToAction === cta;
              return (
                <TouchableOpacity
                  key={cta}
                  onPress={() => onUpdate({ callToAction: cta })}
                  style={[styles.ctaChip, isSelected && styles.ctaChipSelected]}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name={isSelected ? 'radio-button-on' : 'radio-button-off'}
                    size={14}
                    color={isSelected ? colors.primaryInk : colors.textMuted}
                  />
                  <AppText
                    variant="labelMd"
                    color={isSelected ? colors.primaryInk : colors.textPrimary}
                    style={isSelected ? styles.ctaTextSelected : undefined}
                  >
                    {cta}
                  </AppText>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Advisory for 9:16 vertical placement */}
        <View style={styles.verticalAdvisoryBox}>
          <Ionicons name="information-circle-outline" size={16} color={colors.textSecondary} />
          <AppText variant="bodySm" color={colors.textSecondary} style={styles.advisoryText}>
            Vertical 9:16 stories: System automatically formats letterboxed background with your 1:1 ad card for Instagram and WhatsApp story feeds.
          </AppText>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  noticeBanner: {
    backgroundColor: colors.surfaceContainerHigh,
    borderRadius: borderRadius.card,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  noticeIconBox: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  noticeContent: {
    flex: 1,
  },
  noticeTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  noticeBody: {
    fontSize: 12,
    lineHeight: 18,
  },
  card: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.card,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.containmentBorder,
    gap: spacing.xs,
  },
  cardError: {
    borderColor: colors.restricted,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 4,
  },
  cardHeaderTitle: {
    flex: 1,
    flexShrink: 1,
    marginRight: 6,
  },
  approvedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primaryFixed,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
    flexShrink: 0,
  },
  syncedBadge: {
    backgroundColor: colors.primaryFixed,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
    flexShrink: 0,
  },
  fieldSubtext: {
    fontSize: 12,
    marginBottom: 6,
  },
  previewBox169: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    backgroundColor: colors.surfaceContainerHigh,
    position: 'relative',
    marginBottom: spacing.xs,
  },
  image169: {
    width: '100%',
    height: '100%',
  },
  emptyImagePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  overlayPill: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(24, 29, 23, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  overlayDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primaryFixed,
  },
  imageActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.surfaceContainerHigh,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: borderRadius.sm,
  },
  actionBtnText: {
    fontWeight: '600',
  },
  removeBtn: {
    padding: 8,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.surfaceContainerHigh,
  },
  demoDrawer: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    marginTop: 6,
  },
  demoDrawerTitle: {
    fontSize: 10,
    fontWeight: '800',
    marginBottom: 6,
  },
  demoGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  demoItem: {
    flex: 1,
    gap: 4,
  },
  demoThumb: {
    width: '100%',
    height: 64,
    borderRadius: borderRadius.sm,
  },
  demoThumbSquare: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: borderRadius.sm,
  },
  feedAdLayout: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginVertical: 4,
  },
  squareThumbContainer: {
    width: 90,
    height: 90,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    backgroundColor: colors.surfaceContainerHigh,
    position: 'relative',
  },
  imageSquare: {
    width: '100%',
    height: '100%',
  },
  emptySquarePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aspectTag: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    backgroundColor: 'rgba(24, 29, 23, 0.8)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  feedActionBtns: {
    flex: 1,
    gap: 8,
  },
  feedMiniBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.surfaceContainerHigh,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: borderRadius.sm,
    alignSelf: 'flex-start',
  },
  feedMiniBtnAccent: {
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.primaryInk,
  },
  adSubfield: {
    marginTop: spacing.xs,
    gap: 4,
  },
  fieldLabelBold: {
    fontWeight: '700',
  },
  textInput: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    color: colors.textPrimary,
    fontSize: 14,
    fontFamily: 'Plus Jakarta Sans',
  },
  adCopyInput: {
    minHeight: 64,
    lineHeight: 20,
  },
  ctaChipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 2,
  },
  ctaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.surfaceContainerHigh,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: borderRadius.full,
  },
  ctaChipSelected: {
    backgroundColor: colors.primaryFixed,
  },
  ctaTextSelected: {
    fontWeight: '700',
  },
  verticalAdvisoryBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    marginTop: spacing.xs,
  },
  advisoryText: {
    flex: 1,
    fontSize: 11.5,
    lineHeight: 16,
  },
  inlineError: {
    fontSize: 12,
    marginTop: 2,
  },
});
