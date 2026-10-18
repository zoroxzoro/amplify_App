import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { Campaign } from '../types/campaign';
import { colors } from '../theme/colors';
import { borderRadius, spacing, shadows } from '../theme/spacing';
import { AppText } from './AppText';
import { FundingProgressBar } from './FundingProgressBar';
import { CampaignImage } from './CampaignImage';

export interface CampaignCardProps {
  campaign: Campaign;
  onPress?: () => void;
  variant?: 'spotlight' | 'feed' | 'discovery' | 'compact';
  isCompact?: boolean;
  showBookmark?: boolean;
  isBookmarked?: boolean;
  onBookmarkPress?: () => void;
  onAmplifyPress?: () => void;
  style?: ViewStyle;
  className?: string;
}

export const CampaignCard: React.FC<CampaignCardProps> = ({
  campaign,
  onPress,
  variant,
  isCompact = false,
  showBookmark = true,
  isBookmarked: externalBookmarked,
  onBookmarkPress,
  onAmplifyPress,
  style,
  className,
}) => {
  const [internalBookmarked, setInternalBookmarked] = useState(false);
  const isBookmarked = externalBookmarked !== undefined ? externalBookmarked : internalBookmarked;

  const handleBookmark = () => {
    if (onBookmarkPress) {
      onBookmarkPress();
    } else {
      setInternalBookmarked(!internalBookmarked);
    }
  };

  // Determine active visual variant
  const activeVariant = isCompact
    ? 'compact'
    : variant || (campaign.isSpotlight ? 'spotlight' : 'discovery');

  const fundedAmount = campaign.raisedAmount ?? campaign.metrics?.fundedAmount ?? 0;
  const targetAmount = campaign.targetAmount ?? campaign.metrics?.targetAmount ?? 1;
  const daysLeft = campaign.metrics?.daysLeft ?? 7;
  const estimatedReachNum = typeof campaign.estimatedReach === 'number'
    ? campaign.estimatedReach
    : campaign.metrics?.targetImpressions ?? 100000;
  const reachFormatted = estimatedReachNum >= 1000
    ? `${Math.round(estimatedReachNum / 1000)}k`
    : estimatedReachNum.toLocaleString('en-IN');
  const imageUrl = campaign.coverImage || campaign.imageUrl;
  const creatorDisplayName = campaign.creatorName || campaign.creator?.name || 'Verified Steward';

  // 1. Compact card (for side listings or minimal lists)
  if (activeVariant === 'compact') {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`Campaign: ${campaign.title}`}
        style={({ pressed }) => [
          styles.card,
          shadows.layer1,
          pressed && styles.cardPressed,
          style,
        ]}
      >
        <View style={styles.compactContent}>
          <View style={styles.compactHeaderRow}>
            <View style={styles.categoryPill}>
              <AppText variant="labelMicro" color={colors.primaryInk} style={styles.categoryPillText}>
                {campaign.categoryLabel}
              </AppText>
            </View>
            <AppText variant="labelMicro" color={colors.textSecondary}>
              {daysLeft}d left
            </AppText>
          </View>
          <AppText variant="headlineSm" color={colors.textPrimary} numberOfLines={2} style={styles.title}>
            {campaign.title}
          </AppText>
          <FundingProgressBar
            current={fundedAmount}
            target={targetAmount}
            height={6}
            style={styles.compactProgress}
          />
        </View>
      </Pressable>
    );
  }

  // 2. Spotlight / Hero card variant (matching Stitch home_feed spotlight)
  if (activeVariant === 'spotlight') {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`Spotlight broadcast: ${campaign.title}`}
        className={className}
        style={({ pressed }) => [
          styles.card,
          shadows.layer1,
          pressed && styles.cardPressed,
          style,
        ]}
      >
        {/* Cover image banner with overlays */}
        <View style={styles.spotlightImageContainer}>
          <CampaignImage
            uri={imageUrl}
            containerStyle={styles.imageWrapper}
            fallbackIcon="campaign"
            fallbackText={campaign.categoryLabel}
          >
            {/* Dark gradient vignette */}
            <View style={styles.gradientVignette} />

            {/* Category badge top left */}
            <View style={styles.overlayTopLeft}>
              <View style={styles.topicPillFrosted}>
                <AppText variant="labelMicro" color={colors.primaryInk} style={styles.topicPillText}>
                  {campaign.categoryLabel}
                </AppText>
              </View>
            </View>

            {/* Urgency tag top right if urgent */}
            {campaign.isUrgent && (
              <View style={styles.overlayTopRight}>
                <View style={styles.urgencyPill}>
                  <AppText variant="labelMicro" color={colors.tertiary} style={styles.urgencyPillText}>
                    HIGH URGENCY
                  </AppText>
                </View>
              </View>
            )}

            {/* Bottom steward info on image */}
            <View style={styles.overlayBottomRow}>
              <View style={styles.stewardRow}>
                <MaterialIcons name="person" size={15} color={colors.primaryFixed} />
                <AppText variant="labelMd" color={colors.surfaceContainerLowest} numberOfLines={1} style={styles.stewardText}>
                  By {creatorDisplayName}
                </AppText>
              </View>
              <View style={styles.auditedTag}>
                <AppText variant="labelMicro" color={colors.onPrimary} style={styles.auditedText}>
                  Audited
                </AppText>
              </View>
            </View>
          </CampaignImage>
        </View>

        {/* Narrative & Metrics */}
        <View style={styles.content}>
          <AppText variant="headlineMd" color={colors.textPrimary} style={styles.headline}>
            {campaign.title}
          </AppText>

          <AppText variant="bodySm" color={colors.textSecondary} numberOfLines={2} style={styles.summary}>
            {campaign.shortDescription || campaign.summary}
          </AppText>

          {/* Progress Container */}
          <View style={styles.progressContainer}>
            <FundingProgressBar
              current={fundedAmount}
              target={targetAmount}
            />

            <View style={styles.metaFooterRow}>
              <View style={styles.metaItem}>
                <MaterialIcons name="hub" size={14} color={colors.primaryInk} />
                <AppText variant="labelMicro" color={colors.textPrimary} style={styles.metaBold}>
                  Est. Reach: {reachFormatted} citizens
                </AppText>
              </View>
              <View style={styles.metaItem}>
                <MaterialIcons name="timer" size={14} color={colors.textSecondary} />
                <AppText variant="labelMicro" color={colors.textSecondary}>
                  {daysLeft} days remaining
                </AppText>
              </View>
            </View>
          </View>

          {/* Micro disclaimer and Amplify action */}
          <View style={styles.spotlightFooter}>
            <View style={styles.disclaimerRow}>
              <MaterialIcons name="info-outline" size={13} color={colors.primaryInk} />
              <AppText variant="labelMicro" color={colors.textSecondary} style={styles.disclaimerText}>
                Contributions fund verified newsfeed distribution.
              </AppText>
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={onAmplifyPress || onPress}
              style={styles.amplifyBtn}
              accessibilityRole="button"
              accessibilityLabel="Amplify Now"
            >
              <AppText variant="labelMd" color={colors.onPrimary} style={styles.amplifyBtnText}>
                Amplify Now
              </AppText>
              <MaterialIcons name="bolt" size={16} color={colors.onPrimary} />
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>
    );
  }

  // 3. Discovery Card variant (matching Stitch explore_discover / curated feed)
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Campaign: ${campaign.title}`}
      className={className}
      style={({ pressed }) => [
        styles.card,
        shadows.layer1,
        pressed && styles.cardPressed,
        style,
      ]}
    >
      {/* Cover image if available */}
      {imageUrl && (
        <View style={styles.discoveryImageContainer}>
          <CampaignImage
            uri={imageUrl}
            containerStyle={styles.imageWrapper}
            fallbackIcon="campaign"
            fallbackText={campaign.categoryLabel}
          >
            {/* Top row badges */}
            <View style={styles.overlayTopRow}>
              <View style={styles.topicPillFrosted}>
                <AppText variant="labelMicro" color={colors.primaryInk} style={styles.topicPillText}>
                  {campaign.categoryLabel}
                </AppText>
              </View>

              {campaign.creator?.kycVerified && (
                <View style={styles.verifiedIconPill}>
                  <MaterialIcons name="verified" size={14} color={colors.primaryInk} />
                </View>
              )}
            </View>

            {/* Bottom countdown pill */}
            <View style={styles.discoveryCountdown}>
              <MaterialIcons name="schedule" size={12} color={colors.tertiaryFixed} />
              <AppText variant="labelMicro" color={colors.inverseOnSurface} style={styles.countdownText}>
                {daysLeft} days remaining
              </AppText>
            </View>
          </CampaignImage>
        </View>
      )}

      {/* Content */}
      <View style={styles.content}>
        {/* Verification badge strip */}
        <View style={styles.verificationStrip}>
          <View style={styles.verificationLeft}>
            <MaterialIcons name="task-alt" size={14} color={colors.primaryInk} />
            <AppText variant="labelMicro" color={colors.primaryInk} style={styles.verificationText}>
              Verified Evidence Attached
            </AppText>
          </View>

          {showBookmark && (
            <TouchableOpacity
              onPress={handleBookmark}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityRole="button"
              accessibilityLabel={isBookmarked ? 'Remove bookmark' : 'Bookmark campaign'}
              style={styles.bookmarkButton}
            >
              <Ionicons
                name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
                size={18}
                color={isBookmarked ? colors.primaryInk : colors.textSecondary}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* Title */}
        <AppText variant="headlineMd" color={colors.textPrimary} style={styles.headline} numberOfLines={2}>
          {campaign.title}
        </AppText>

        {/* Excerpt */}
        <AppText variant="bodySm" color={colors.textSecondary} numberOfLines={2} style={styles.summary}>
          {campaign.shortDescription || campaign.summary}
        </AppText>

        {/* Financial & Reach Gauge */}
        <View style={styles.progressContainer}>
          <FundingProgressBar
            current={fundedAmount}
            target={targetAmount}
          />

          <View style={styles.metaFooterRow}>
            <View style={styles.metaItem}>
              <MaterialIcons name="campaign" size={14} color={colors.primaryInk} />
              <AppText variant="labelMicro" color={colors.textSecondary}>
                Est. Reach: <AppText variant="labelMicro" color={colors.textPrimary} style={styles.metaBold}>{reachFormatted} citizens</AppText>
              </AppText>
            </View>
            <View style={styles.metaItem}>
              <MaterialIcons name="groups" size={14} color={colors.textSecondary} />
              <AppText variant="labelMicro" color={colors.textSecondary}>
                {campaign.metrics?.backersCount ?? 400} backers
              </AppText>
            </View>
          </View>
        </View>

        {/* Action Button Row */}
        <View style={styles.discoveryActionRow}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={onAmplifyPress || onPress}
            style={styles.discoveryAmplifyBtn}
            accessibilityRole="button"
            accessibilityLabel="Amplify Message"
          >
            <AppText variant="labelMd" color={colors.onPrimary} style={styles.discoveryAmplifyText}>
              Amplify Message
            </AppText>
            <MaterialIcons name="north-east" size={16} color={colors.onPrimary} />
          </TouchableOpacity>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.card,
    borderWidth: 1,
    borderColor: colors.containmentBorder,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  cardPressed: {
    transform: [{ scale: 0.99 }],
    opacity: 0.96,
  },
  spotlightImageContainer: {
    width: '100%',
    height: 190,
    backgroundColor: colors.surfaceContainerHigh,
    position: 'relative',
  },
  discoveryImageContainer: {
    width: '100%',
    height: 175,
    backgroundColor: colors.surfaceContainerHigh,
    position: 'relative',
  },
  imageWrapper: {
    width: '100%',
    height: '100%',
  },
  gradientVignette: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(24, 29, 23, 0.35)',
  },
  overlayTopLeft: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
  },
  overlayTopRight: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
  },
  overlayTopRow: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    right: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  topicPillFrosted: {
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    paddingVertical: 3,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.full,
  },
  topicPillText: {
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  verifiedIconPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    padding: 3,
    borderRadius: borderRadius.full,
  },
  urgencyPill: {
    backgroundColor: colors.tertiaryFixed,
    paddingVertical: 3,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.full,
  },
  urgencyPillText: {
    fontWeight: '700',
  },
  overlayBottomRow: {
    position: 'absolute',
    bottom: spacing.sm,
    left: spacing.sm,
    right: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stewardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: spacing.sm,
    gap: 4,
  },
  stewardText: {
    fontWeight: '600',
  },
  auditedTag: {
    backgroundColor: 'rgba(5, 67, 45, 0.88)',
    paddingVertical: 2,
    paddingHorizontal: 7,
    borderRadius: borderRadius.sm,
  },
  auditedText: {
    fontSize: 10,
    fontWeight: '600',
  },
  discoveryCountdown: {
    position: 'absolute',
    bottom: spacing.sm,
    right: spacing.sm,
    backgroundColor: 'rgba(45, 50, 43, 0.85)',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: borderRadius.full,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  countdownText: {
    fontSize: 10.5,
  },
  content: {
    padding: spacing.md,
  },
  verificationStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  verificationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  verificationText: {
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  bookmarkButton: {
    padding: 2,
  },
  headline: {
    marginBottom: spacing.xs,
    lineHeight: 25,
  },
  summary: {
    marginBottom: spacing.md,
    lineHeight: 20,
  },
  progressContainer: {
    backgroundColor: colors.surfaceContainerLow,
    padding: spacing.sm + 2,
    borderRadius: borderRadius.md,
  },
  metaFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs + 2,
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceContainer,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaBold: {
    fontWeight: '700',
  },
  spotlightFooter: {
    marginTop: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
  },
  disclaimerRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  disclaimerText: {
    fontSize: 10,
    lineHeight: 13,
  },
  amplifyBtn: {
    backgroundColor: colors.primaryContainer,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: borderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minHeight: 40,
  },
  amplifyBtnText: {
    fontWeight: '600',
  },
  discoveryActionRow: {
    marginTop: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  discoveryAmplifyBtn: {
    flex: 1,
    backgroundColor: colors.primaryContainer,
    paddingVertical: 11,
    paddingHorizontal: 16,
    borderRadius: borderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    minHeight: 44,
  },
  discoveryAmplifyText: {
    fontWeight: '600',
  },
  // Compact styles
  compactContent: {
    padding: spacing.sm + 2,
  },
  compactHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  categoryPill: {
    backgroundColor: colors.secondaryContainerSoft,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: borderRadius.full,
  },
  categoryPillText: {
    fontWeight: '700',
  },
  title: {
    marginBottom: spacing.xs,
  },
  compactProgress: {
    marginTop: spacing.xs,
  },
});
