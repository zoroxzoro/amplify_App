import React, { useState, useMemo } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import {
  ScreenContainer,
  AppText,
  CategoryChip,
  CampaignCard,
  EmptyState,
} from '../../src/components';
import { colors } from '../../src/theme/colors';
import { spacing, borderRadius, shadows } from '../../src/theme/spacing';
import { useCampaigns } from '../../src/context/CampaignContext';

const EXPLORE_CATEGORIES = [
  { id: 'all', label: 'All Topics', icon: 'auto-awesome' },
  { id: 'environment', label: 'Environment', icon: 'forest' },
  { id: 'healthcare', label: 'Public Health', icon: 'health-and-safety' },
  { id: 'science', label: 'Science & Tech', icon: 'biotech' },
  { id: 'education', label: 'Education', icon: 'school' },
  { id: 'civic', label: 'Civic Policy', icon: 'policy' },
  { id: 'culture', label: 'Arts & Culture', icon: 'palette' },
];

type SortOption = 'recommended' | 'funded' | 'ending' | 'reach';
type StatusFilter = 'all' | 'active' | 'audited' | 'nearly_funded';

const SORT_LABELS: Record<SortOption, string> = {
  recommended: 'Recommended',
  funded: 'Most Funded',
  ending: 'Ending Soon',
  reach: 'Target Reach',
};

export default function ExploreScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ q?: string }>();
  const { campaigns } = useCampaigns();

  const [searchQuery, setSearchQuery] = useState(params.q || '');
  const [prevParamQ, setPrevParamQ] = useState(params.q);
  const [selectedCat, setSelectedCat] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>('all');
  const [activeSort, setActiveSort] = useState<SortOption>('recommended');
  const [showSortMenu, setShowSortMenu] = useState(false);

  // Sync route param when arriving with a changed search query
  if (params.q !== prevParamQ) {
    setPrevParamQ(params.q);
    setSearchQuery(params.q || '');
  }

  // Combined Search, Category, and Status Filtering
  const filteredAndSortedCampaigns = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const filtered = campaigns.filter((c) => {
      // 1. Category check
      const matchesCategory =
        selectedCat === 'all' ||
        c.category === selectedCat ||
        c.categoryLabel.toLowerCase().includes(selectedCat.toLowerCase());

      // 2. Search check (case-insensitive across title, summary, creator, region)
      const matchesSearch =
        query === '' ||
        c.title.toLowerCase().includes(query) ||
        (c.shortDescription && c.shortDescription.toLowerCase().includes(query)) ||
        (c.summary && c.summary.toLowerCase().includes(query)) ||
        (c.creatorName && c.creatorName.toLowerCase().includes(query)) ||
        (c.creator?.name && c.creator.name.toLowerCase().includes(query)) ||
        (c.targetRegion && c.targetRegion.toLowerCase().includes(query));

      // 3. Status filter check
      let matchesStatus = true;
      if (selectedStatus === 'active') {
        matchesStatus = c.status === 'amplified';
      } else if (selectedStatus === 'audited') {
        matchesStatus = Boolean(c.creator?.kycVerified);
      } else if (selectedStatus === 'nearly_funded') {
        const percent = (c.raisedAmount / c.targetAmount) * 100;
        matchesStatus = percent >= 80;
      }

      return matchesCategory && matchesSearch && matchesStatus;
    });

    // Sort order
    return [...filtered].sort((a, b) => {
      if (activeSort === 'funded') {
        const percentA = (a.raisedAmount / a.targetAmount) * 100;
        const percentB = (b.raisedAmount / b.targetAmount) * 100;
        return percentB - percentA;
      }
      if (activeSort === 'ending') {
        return (a.metrics?.daysLeft ?? 99) - (b.metrics?.daysLeft ?? 99);
      }
      if (activeSort === 'reach') {
        const reachA = typeof a.estimatedReach === 'number' ? a.estimatedReach : a.metrics?.targetImpressions ?? 0;
        const reachB = typeof b.estimatedReach === 'number' ? b.estimatedReach : b.metrics?.targetImpressions ?? 0;
        return reachB - reachA;
      }
      // 'recommended' default: spotlights first, then priority
      if (a.isSpotlight && !b.isSpotlight) return -1;
      if (!a.isSpotlight && b.isSpotlight) return 1;
      return 0;
    });
  }, [campaigns, searchQuery, selectedCat, selectedStatus, activeSort]);

  const hasActiveFilters =
    searchQuery.trim() !== '' || selectedCat !== 'all' || selectedStatus !== 'all' || activeSort !== 'recommended';

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedCat('all');
    setSelectedStatus('all');
    setActiveSort('recommended');
  };

  // Header matching Stitch explore_discover
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
            Explore & Discover
          </AppText>
        </View>
      </View>

      <View style={styles.headerRight}>
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
      {/* Title & Editorial Description */}
      <View style={styles.titleSection}>
        <AppText variant="headlineLg" color={colors.textPrimary}>
          Discover Broadcasts
        </AppText>
        <AppText variant="bodySm" color={colors.textSecondary} style={styles.subtitle}>
          Explore community-amplified stories funded for targeted public distribution.
        </AppText>
      </View>

      {/* Search Input & Filter Button */}
      <View style={styles.searchBarRow}>
        <View style={[styles.searchBox, shadows.layer1]}>
          <Ionicons name="search" size={18} color={colors.outline} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search messages, creators, topics..."
            placeholderTextColor={colors.outline}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="done"
            autoCapitalize="none"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              style={styles.clearSearchBtn}
              accessibilityLabel="Clear search"
            >
              <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter / Sort Drawer Trigger */}
        <TouchableOpacity
          onPress={() => setShowSortMenu(!showSortMenu)}
          style={[styles.filterToggleBtn, shadows.layer1, showSortMenu && styles.filterToggleActive]}
          accessibilityRole="button"
          accessibilityLabel="Sort and filter options"
        >
          <MaterialIcons name="tune" size={18} color={showSortMenu ? colors.onPrimary : colors.primaryInk} />
          {hasActiveFilters && (
            <View style={styles.filterDot}>
              <AppText variant="labelMicro" color={colors.surfaceContainerLowest} style={styles.filterDotText}>
                •
              </AppText>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Horizontally Scrollable Category Chips */}
      <View style={styles.categoryScrollWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {EXPLORE_CATEGORIES.map((cat) => (
            <CategoryChip
              key={cat.id}
              label={cat.label}
              selected={selectedCat === cat.id}
              onPress={() => setSelectedCat(cat.id)}
            />
          ))}
        </ScrollView>
      </View>

      {/* Secondary Sort & Quick Status Ribbon */}
      <View style={styles.secondaryControlsRow}>
        {/* Sort Trigger */}
        <TouchableOpacity
          onPress={() => setShowSortMenu(!showSortMenu)}
          style={[styles.sortButton, shadows.layer1]}
          accessibilityRole="button"
          accessibilityLabel={`Sort by ${SORT_LABELS[activeSort]}`}
        >
          <AppText variant="labelMicro" color={colors.textSecondary} style={styles.sortPrefix}>
            SORT:
          </AppText>
          <AppText variant="labelMd" color={colors.primaryInk} style={styles.sortCurrentLabel}>
            {SORT_LABELS[activeSort]}
          </AppText>
          <MaterialIcons name="expand-more" size={16} color={colors.outline} />
        </TouchableOpacity>

        {/* Quick Status Filter Pills */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.statusChipsRow}>
          <TouchableOpacity
            onPress={() => setSelectedStatus(selectedStatus === 'active' ? 'all' : 'active')}
            style={[styles.statusChip, selectedStatus === 'active' && styles.statusChipActive]}
          >
            <View style={[styles.statusPulseDot, selectedStatus === 'active' && styles.statusPulseDotActive]} />
            <AppText
              variant="labelMicro"
              color={selectedStatus === 'active' ? colors.onPrimaryFixed : colors.textSecondary}
              style={styles.statusChipText}
            >
              Active Syndication
            </AppText>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setSelectedStatus(selectedStatus === 'audited' ? 'all' : 'audited')}
            style={[styles.statusChip, selectedStatus === 'audited' && styles.statusChipActive]}
          >
            <AppText
              variant="labelMicro"
              color={selectedStatus === 'audited' ? colors.onPrimaryFixed : colors.textSecondary}
              style={styles.statusChipText}
            >
              Fact-Checked
            </AppText>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setSelectedStatus(selectedStatus === 'nearly_funded' ? 'all' : 'nearly_funded')}
            style={[styles.statusChip, selectedStatus === 'nearly_funded' && styles.statusChipActive]}
          >
            <AppText
              variant="labelMicro"
              color={selectedStatus === 'nearly_funded' ? colors.onPrimaryFixed : colors.textSecondary}
              style={styles.statusChipText}
            >
              Nearly Funded
            </AppText>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Collapsible Sort Options Menu */}
      {showSortMenu && (
        <View style={[styles.sortMenuCard, shadows.layer1]}>
          <AppText variant="labelMicro" color={colors.textSecondary} style={styles.sortMenuHeader}>
            CHOOSE SORT ORDER:
          </AppText>
          <View style={styles.sortOptionsGrid}>
            {(['recommended', 'funded', 'ending', 'reach'] as SortOption[]).map((opt) => (
              <TouchableOpacity
                key={opt}
                onPress={() => {
                  setActiveSort(opt);
                  setShowSortMenu(false);
                }}
                style={[
                  styles.sortOptionItem,
                  activeSort === opt && styles.sortOptionItemActive,
                ]}
              >
                <AppText
                  variant="labelMd"
                  color={activeSort === opt ? colors.primaryInk : colors.textPrimary}
                  style={activeSort === opt ? styles.sortOptionTextActive : styles.sortOptionText}
                >
                  {SORT_LABELS[opt]}
                </AppText>
                {activeSort === opt && (
                  <MaterialIcons name="check" size={16} color={colors.primaryInk} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Active Filter Summary Strip */}
      <View style={styles.summaryStrip}>
        <View style={styles.summaryLeft}>
          <MaterialIcons name="filter-alt" size={16} color={colors.primaryInk} />
          <AppText variant="bodySm" color={colors.textSecondary} numberOfLines={1}>
            Showing{' '}
            <AppText variant="bodySm" color={colors.textPrimary} style={styles.summaryCountBold}>
              {filteredAndSortedCampaigns.length} verified initiatives
            </AppText>
          </AppText>
        </View>

        {hasActiveFilters && (
          <TouchableOpacity
            onPress={resetAllFilters}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityRole="button"
            accessibilityLabel="Clear all filters"
          >
            <AppText variant="labelMicro" color={colors.primaryInk} style={styles.clearAllText}>
              CLEAR ALL
            </AppText>
          </TouchableOpacity>
        )}
      </View>

      {/* Campaign Results List */}
      {filteredAndSortedCampaigns.length > 0 ? (
        <View style={styles.campaignsList}>
          {filteredAndSortedCampaigns.map((campaign) => (
            <CampaignCard
              key={campaign.id}
              campaign={campaign}
              variant="discovery"
              onPress={() => router.push(`/campaign/${campaign.id}`)}
              onAmplifyPress={() => router.push(`/campaign/${campaign.id}`)}
            />
          ))}
        </View>
      ) : (
        <EmptyState
          title="No campaigns found"
          description={
            searchQuery.trim()
              ? `No campaigns match "${searchQuery}". Try a different keyword or reset active filters.`
              : 'No verified campaigns found in this category. Reset filters to view all active distributions.'
          }
          icon={<MaterialIcons name="search-off" size={32} color={colors.primaryInk} />}
          actionTitle="Reset Filters"
          onAction={resetAllFilters}
        />
      )}
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
  titleSection: {
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  subtitle: {
    marginTop: spacing.xs,
  },
  searchBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
    marginBottom: spacing.sm,
  },
  searchBox: {
    flex: 1,
    height: 46,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.containmentBorder,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm + 2,
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
  clearSearchBtn: {
    padding: 4,
  },
  filterToggleBtn: {
    width: 46,
    height: 46,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.containmentBorder,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  filterToggleActive: {
    backgroundColor: colors.primaryContainer,
    borderColor: colors.primaryInk,
  },
  filterDot: {
    position: 'absolute',
    top: 6,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterDotText: {
    fontSize: 0,
  },
  categoryScrollWrapper: {
    marginHorizontal: -spacing.marginMobile,
    marginBottom: spacing.xs,
  },
  categoryScroll: {
    paddingHorizontal: spacing.marginMobile,
    paddingVertical: 2,
  },
  secondaryControlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
    marginBottom: spacing.xs + 2,
  },
  sortButton: {
    height: 34,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.containmentBorder,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    gap: 4,
  },
  sortPrefix: {
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  sortCurrentLabel: {
    fontWeight: '700',
  },
  statusChipsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingRight: spacing.sm,
  },
  statusChip: {
    height: 34,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.containmentBorder,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    gap: 5,
  },
  statusChipActive: {
    backgroundColor: colors.primaryFixed,
    borderColor: colors.primaryInk,
  },
  statusPulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.outline,
  },
  statusPulseDotActive: {
    backgroundColor: colors.primaryInk,
  },
  statusChipText: {
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  sortMenuCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.containmentBorder,
    padding: spacing.sm,
    marginBottom: spacing.xs + 2,
  },
  sortMenuHeader: {
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: spacing.xs,
  },
  sortOptionsGrid: {
    gap: 4,
  },
  sortOptionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.surfaceContainerLow,
  },
  sortOptionItemActive: {
    backgroundColor: colors.secondaryContainerSoft,
  },
  sortOptionText: {
    fontWeight: '500',
  },
  sortOptionTextActive: {
    fontWeight: '700',
  },
  summaryStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLow,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    marginTop: 2,
  },
  summaryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  summaryCountBold: {
    fontWeight: '700',
  },
  clearAllText: {
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  campaignsList: {
    marginBottom: spacing.md,
  },
});
