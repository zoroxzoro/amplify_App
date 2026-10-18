import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import {
  ScreenContainer,
  AppText,
  IconButton,
  CampaignCard,
  SectionHeader,
  StatusBadge,
  CategoryChip,
} from '../../src/components';
import { colors } from '../../src/theme/colors';
import { spacing, borderRadius, shadows } from '../../src/theme/spacing';
import { useCampaigns } from '../../src/context/CampaignContext';

const HOME_CATEGORIES = [
  { id: 'all', label: 'All Topics' },
  { id: 'environment', label: 'Environment' },
  { id: 'healthcare', label: 'Public Health' },
  { id: 'science', label: 'Science & Tech' },
  { id: 'education', label: 'Education' },
  { id: 'civic', label: 'Civic Policy' },
];

const SIMULATOR_AMOUNTS = [250, 500, 1000, 2500, 5000];

export default function HomeScreen() {
  const router = useRouter();
  const { campaigns, calculateEstimatedReach } = useCampaigns();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [simulatorAmount, setSimulatorAmount] = useState<number>(500);
  const [showSimulator, setShowSimulator] = useState<boolean>(false);

  // Spotlight campaign (first featured or urgent)
  const spotlightCampaign =
    campaigns.find((c) => c.isSpotlight) ||
    campaigns.find((c) => c.isFeatured) ||
    campaigns[0];

  // Curated broadcasts list (filtered if category selected, otherwise top non-spotlight)
  const curatedCampaigns = campaigns
    .filter((c) => c.id !== spotlightCampaign?.id)
    .filter((c) => selectedCategory === 'all' || c.category === selectedCategory);

  // Nearly funded / ending soon campaigns
  const endingSoonCampaigns = campaigns.filter(
    (c) => (c.metrics?.daysLeft && c.metrics.daysLeft <= 3) || (c.raisedAmount / c.targetAmount >= 0.85)
  );

  const reachEstimate = calculateEstimatedReach(simulatorAmount);

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      router.push({
        pathname: '/explore',
        params: { q: searchQuery.trim() },
      });
    } else {
      router.push('/explore');
    }
  };

  // Top header bar matching Stitch home_feed
  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <View style={styles.logoBadge}>
          <MaterialIcons name="campaign" size={22} color={colors.onPrimary} />
        </View>
        <View style={styles.brandTitleContainer}>
          <AppText variant="headlineSm" color={colors.primaryInk} style={styles.brandName}>
            AMPLIFUND
          </AppText>
          <AppText variant="labelMicro" color={colors.textSecondary} style={styles.brandTag}>
            Civic Distribution Protocol
          </AppText>
        </View>
      </View>

      <View style={styles.headerRight}>
        <IconButton
          icon={<Ionicons name="notifications-outline" size={20} color={colors.textPrimary} />}
          onPress={() => router.push('/activity')}
          accessibilityLabel="Notifications"
          badgeDot
        />
        <TouchableOpacity
          onPress={() => router.push('/profile')}
          style={styles.avatarButton}
          accessibilityLabel="View profile"
        >
          <View style={styles.avatarCircle}>
            <MaterialIcons name="person" size={20} color={colors.primaryInk} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScreenContainer header={renderHeader()}>
      {/* Prominent Search Field (Navigates to Explore with Query) */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, shadows.layer1]}>
          <Ionicons name="search" size={20} color={colors.outline} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search messages, creators, topics..."
            placeholderTextColor={colors.outline}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearchSubmit}
            returnKeyType="search"
          />
          <TouchableOpacity
            style={styles.searchSubmitBtn}
            onPress={handleSearchSubmit}
            accessibilityLabel="Search explore"
          >
            <Ionicons name="arrow-forward" size={18} color={colors.primaryInk} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Editorial Hero Container */}
      <View style={[styles.heroCard, shadows.layer1]}>
        <View style={styles.heroDecorativeBlur} />

        <View style={styles.heroBadgeRow}>
          <StatusBadge
            label="CIVIC & IDEA AMPLIFICATION"
            variant="default"
            icon={<MaterialIcons name="campaign" size={14} color={colors.primaryInk} />}
          />
        </View>

        <AppText variant="displayLg" color={colors.textPrimary} style={styles.heroTitle}>
          Give good ideas a bigger audience.
        </AppText>

        <AppText variant="bodyMd" color={colors.textSecondary} style={styles.heroSummary}>
          Community-funded message distribution. Contributions pay directly for targeted ad reach to expand important stories beyond personal echo chambers — not direct donations to individuals or charities.
        </AppText>

        {/* Live Reach Demo Calculator Pill */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setShowSimulator(!showSimulator)}
          style={styles.simulatorPreview}
        >
          <View style={styles.simulatorIconBox}>
            <MaterialIcons name="query-stats" size={18} color={colors.primaryInk} />
          </View>
          <View style={styles.simulatorTextContainer}>
            <AppText variant="labelMd" color={colors.textPrimary} style={styles.simulatorHeadline}>
              Demo: ₹{simulatorAmount.toLocaleString('en-IN')} ≈ {reachEstimate.min.toLocaleString('en-IN')} – {reachEstimate.max.toLocaleString('en-IN')} reach
            </AppText>
            <AppText variant="labelMicro" color={colors.textSecondary}>
              Verified impressions estimate
            </AppText>
          </View>
          <View style={styles.simulateTogglePill}>
            <AppText variant="labelMicro" color={colors.primaryInk} style={styles.simulateToggleText}>
              {showSimulator ? 'Close' : 'Simulate'}
            </AppText>
            <MaterialIcons name="tune" size={14} color={colors.primaryInk} />
          </View>
        </TouchableOpacity>

        {/* Expandable Interactive Reach Simulator */}
        {showSimulator && (
          <View style={styles.simulatorExpanded}>
            <AppText variant="labelMicro" color={colors.textSecondary} style={styles.simulatorLabel}>
              SELECT SIMULATED PLEDGE AMOUNT:
            </AppText>
            <View style={styles.amountPillsRow}>
              {SIMULATOR_AMOUNTS.map((amt) => (
                <TouchableOpacity
                  key={amt}
                  onPress={() => setSimulatorAmount(amt)}
                  style={[
                    styles.amountPill,
                    simulatorAmount === amt && styles.amountPillActive,
                  ]}
                >
                  <AppText
                    variant="labelMicro"
                    color={simulatorAmount === amt ? colors.onPrimary : colors.textPrimary}
                    style={styles.amountPillText}
                  >
                    ₹{amt}
                  </AppText>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.simulatorResultBox}>
              <AppText variant="labelMicro" color={colors.textSecondary}>
                UNLOCKS TARGETED FEED VISIBILITY
              </AppText>
              <AppText variant="headlineSm" color={colors.primaryInk} style={styles.simulatorResultText}>
                ~{Math.round((reachEstimate.min + reachEstimate.max) / 2).toLocaleString('en-IN')} Citizens reached
              </AppText>
            </View>
          </View>
        )}

        {/* Quick Action CTAs */}
        <View style={styles.ctaRow}>
          <TouchableOpacity
            style={[styles.primaryCta, shadows.layer1]}
            onPress={() => router.push('/explore')}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Explore Campaigns"
          >
            <AppText variant="headlineSm" color={colors.onPrimary} style={styles.primaryCtaText}>
              Explore Campaigns
            </AppText>
            <Ionicons name="arrow-forward" size={18} color={colors.onPrimary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryCta}
            onPress={() => router.push('/create')}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Start a Campaign"
          >
            <Ionicons name="add-circle-outline" size={18} color={colors.primaryInk} />
            <AppText variant="headlineSm" color={colors.primaryInk} style={styles.secondaryCtaText}>
              Start a Campaign
            </AppText>
          </TouchableOpacity>
        </View>
      </View>

      {/* How Distribution Works (Concise 3-Stage Protocol Banner) */}
      <View style={[styles.howItWorksCard, shadows.layer1]}>
        <View style={styles.howItWorksHeader}>
          <View style={styles.howItWorksTitleRow}>
            <View style={styles.greenDot} />
            <AppText variant="headlineSm" color={colors.textPrimary}>
              How Distribution Works
            </AppText>
          </View>
          <AppText variant="labelMicro" color={colors.textSecondary} style={styles.protocolBadge}>
            PUBLIC PROTOCOL
          </AppText>
        </View>

        <View style={styles.stagesGrid}>
          <View style={styles.stageItem}>
            <AppText variant="labelMicro" color={colors.primaryInk} style={styles.stageNumber}>
              01 CREATE
            </AppText>
            <AppText variant="bodySm" color={colors.textPrimary} style={styles.stageText}>
              Draft message & ad units
            </AppText>
            <MaterialIcons name="edit-document" size={18} color={colors.primaryInk} style={styles.stageIcon} />
          </View>

          <View style={styles.stageItem}>
            <AppText variant="labelMicro" color={colors.primaryInk} style={styles.stageNumber}>
              02 REVIEW
            </AppText>
            <AppText variant="bodySm" color={colors.textPrimary} style={styles.stageText}>
              Fact-check & geo-targeting
            </AppText>
            <MaterialIcons name="verified-user" size={18} color={colors.primaryInk} style={styles.stageIcon} />
          </View>

          <View style={styles.stageItem}>
            <AppText variant="labelMicro" color={colors.primaryInk} style={styles.stageNumber}>
              03 AMPLIFY
            </AppText>
            <AppText variant="bodySm" color={colors.textPrimary} style={styles.stageText}>
              Syndicate targeted media
            </AppText>
            <MaterialIcons name="cell-tower" size={18} color={colors.primaryInk} style={styles.stageIcon} />
          </View>
        </View>
      </View>

      {/* Spotlight Broadcast Campaign Section */}
      {spotlightCampaign && (
        <View style={styles.sectionWrapper}>
          <SectionHeader
            title="Spotlight Broadcast"
            badge={
              <View style={styles.urgencyBadge}>
                <AppText variant="labelMicro" color={colors.tertiary} style={styles.urgencyBadgeText}>
                  High Urgency
                </AppText>
              </View>
            }
            icon={<MaterialIcons name="star" size={20} color={colors.primaryInk} />}
          />

          <CampaignCard
            campaign={spotlightCampaign}
            variant="spotlight"
            onPress={() => router.push(`/campaign/${spotlightCampaign.id}`)}
            onAmplifyPress={() => router.push(`/campaign/${spotlightCampaign.id}`)}
          />
        </View>
      )}

      {/* Horizontally Scrollable Category Chips */}
      <View style={styles.categoriesContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {HOME_CATEGORIES.map((cat) => (
            <CategoryChip
              key={cat.id}
              label={cat.label}
              selected={selectedCategory === cat.id}
              onPress={() => setSelectedCategory(cat.id)}
            />
          ))}
        </ScrollView>
      </View>

      {/* Curated Broadcasts Feed */}
      <View style={styles.sectionWrapper}>
        <SectionHeader
          title="Curated Broadcasts"
          subtitle="Independently fact-checked proposals"
          actionText="View all"
          onAction={() => router.push('/explore')}
        />

        {curatedCampaigns.slice(0, 3).map((c) => (
          <CampaignCard
            key={c.id}
            campaign={c}
            variant="discovery"
            onPress={() => router.push(`/campaign/${c.id}`)}
            onAmplifyPress={() => router.push(`/campaign/${c.id}`)}
          />
        ))}
      </View>

      {/* Nearly Funded / Ending Soon Section */}
      {endingSoonCampaigns.length > 0 && (
        <View style={styles.sectionWrapper}>
          <SectionHeader
            title="Nearly Funded"
            subtitle="Close to reaching full public media broadcast"
            icon={<MaterialIcons name="timelapse" size={18} color={colors.primaryInk} />}
          />

          {endingSoonCampaigns.slice(0, 2).map((c) => (
            <CampaignCard
              key={`ending_${c.id}`}
              campaign={c}
              variant="discovery"
              onPress={() => router.push(`/campaign/${c.id}`)}
              onAmplifyPress={() => router.push(`/campaign/${c.id}`)}
            />
          ))}
        </View>
      )}

      {/* Explore More CTA Footer Banner */}
      <TouchableOpacity
        style={[styles.exploreMoreBanner, shadows.layer1]}
        activeOpacity={0.88}
        onPress={() => router.push('/explore')}
      >
        <View style={styles.exploreBannerContent}>
          <AppText variant="headlineSm" color={colors.primaryInk}>
            Discover All Broadcast Campaigns
          </AppText>
          <AppText variant="bodySm" color={colors.textSecondary}>
            Filter by environmental, civic, healthcare, and educational initiatives
          </AppText>
        </View>
        <View style={styles.exploreBannerIconBox}>
          <Ionicons name="arrow-forward" size={20} color={colors.onPrimary} />
        </View>
      </TouchableOpacity>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 56,
    paddingHorizontal: spacing.marginMobile,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceContainerLowest,
    borderBottomWidth: 1,
    borderBottomColor: colors.containmentBorder,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  logoBadge: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primaryContainer,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandTitleContainer: {
    justifyContent: 'center',
  },
  brandName: {
    fontWeight: '800',
    letterSpacing: 1.2,
    lineHeight: 18,
  },
  brandTag: {
    letterSpacing: 0.8,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  avatarButton: {
    padding: 2,
  },
  avatarCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.secondaryContainerSoft,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.containmentBorder,
    paddingHorizontal: spacing.sm + 2,
    height: 48,
  },
  searchIcon: {
    marginRight: spacing.xs,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 14,
    color: colors.textPrimary,
    fontFamily: 'PlusJakartaSans_400Regular',
  },
  searchSubmitBtn: {
    width: 34,
    height: 34,
    borderRadius: borderRadius.md,
    backgroundColor: colors.secondaryContainerSoft,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.card,
    borderWidth: 1,
    borderColor: colors.containmentBorder,
    padding: spacing.md,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
    position: 'relative',
    overflow: 'hidden',
  },
  heroDecorativeBlur: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: colors.primaryFixed,
    opacity: 0.25,
  },
  heroBadgeRow: {
    marginBottom: spacing.xs,
  },
  heroTitle: {
    marginBottom: spacing.xs,
    lineHeight: 34,
  },
  heroSummary: {
    marginBottom: spacing.md,
    lineHeight: 22,
  },
  simulatorPreview: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.containmentBorder,
  },
  simulatorIconBox: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.surfaceContainerLowest,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  simulatorTextContainer: {
    flex: 1,
  },
  simulatorHeadline: {
    fontWeight: '700',
  },
  simulateTogglePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerHighest,
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    borderRadius: borderRadius.full,
    gap: 3,
  },
  simulateToggleText: {
    fontWeight: '700',
  },
  simulatorExpanded: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.containmentBorder,
    padding: spacing.sm + 2,
    marginBottom: spacing.sm,
  },
  simulatorLabel: {
    marginBottom: spacing.xs,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  amountPillsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  amountPill: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: colors.containmentBorder,
  },
  amountPillActive: {
    backgroundColor: colors.primaryContainer,
    borderColor: colors.primaryInk,
  },
  amountPillText: {
    fontWeight: '700',
  },
  simulatorResultBox: {
    backgroundColor: colors.surfaceContainerLow,
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
    gap: 2,
  },
  simulatorResultText: {
    fontWeight: '700',
  },
  ctaRow: {
    flexDirection: 'column',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  primaryCta: {
    width: '100%',
    minHeight: 48,
    borderRadius: borderRadius.button,
    backgroundColor: colors.primaryContainer,
    borderWidth: 1,
    borderColor: '#1E4E39',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  primaryCtaText: {
    color: colors.onPrimary,
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center',
  },
  secondaryCta: {
    width: '100%',
    minHeight: 48,
    borderRadius: borderRadius.button,
    backgroundColor: colors.secondaryContainerSoft,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  secondaryCtaText: {
    color: colors.primaryInk,
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center',
  },
  howItWorksCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.card,
    borderWidth: 1,
    borderColor: colors.containmentBorder,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  howItWorksHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  howItWorksTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  greenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primaryInk,
  },
  protocolBadge: {
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  stagesGrid: {
    flexDirection: 'row',
    gap: 6,
  },
  stageItem: {
    flex: 1,
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: borderRadius.sm,
    padding: spacing.xs + 2,
    justifyContent: 'space-between',
    minHeight: 90,
  },
  stageNumber: {
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  stageText: {
    fontSize: 11.5,
    lineHeight: 15,
  },
  stageIcon: {
    alignSelf: 'flex-end',
  },
  urgencyBadge: {
    backgroundColor: colors.tertiaryFixed,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  urgencyBadgeText: {
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  categoriesContainer: {
    marginHorizontal: -spacing.marginMobile,
    marginBottom: spacing.xs,
  },
  categoryScroll: {
    paddingHorizontal: spacing.marginMobile,
    paddingVertical: 2,
  },
  sectionWrapper: {
    marginBottom: spacing.sm,
  },
  exploreMoreBanner: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.card,
    borderWidth: 1,
    borderColor: colors.containmentBorder,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: spacing.md,
  },
  exploreBannerContent: {
    flex: 1,
    marginRight: spacing.sm,
    gap: 3,
  },
  exploreBannerIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryContainer,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
