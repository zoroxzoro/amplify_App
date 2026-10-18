import React, { useState, useMemo } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { AppText } from '../../src/components/AppText';
import { ActivityCard, ActivityEmptyState } from '../../src/components/Activity';
import { colors } from '../../src/theme/colors';
import { spacing, borderRadius, shadows } from '../../src/theme/spacing';
import { useCampaigns } from '../../src/context/CampaignContext';
import { ActivityCategory, ActivityItemData } from '../../src/types/activity';

const CATEGORIES: { key: ActivityCategory; label: string }[] = [
  { key: 'all', label: 'All Activity' },
  { key: 'broadcasts', label: 'Broadcasts & Ads' },
  { key: 'escrow', label: 'Escrow & Backing' },
  { key: 'editorial', label: 'Editorial & Review' },
  { key: 'milestones', label: 'Milestones' },
];

export default function ActivityScreen() {
  const router = useRouter();
  const { activities, markActivityAsRead, markAllActivitiesAsRead } = useCampaigns();
  const [selectedCategory, setSelectedCategory] = useState<ActivityCategory>('all');
  const [archiveModalVisible, setArchiveModalVisible] = useState(false);

  // Unread count
  const unreadCount = useMemo(() => {
    return activities.filter((a) => a.isUnread).length;
  }, [activities]);

  // Filtered activities
  const filteredActivities = useMemo(() => {
    if (selectedCategory === 'all') return activities;
    return activities.filter((a) => a.category === selectedCategory);
  }, [activities, selectedCategory]);

  // Group by dateGroup
  const grouped = useMemo(() => {
    const today = filteredActivities.filter((a) => a.dateGroup === 'today');
    const yesterday = filteredActivities.filter((a) => a.dateGroup === 'yesterday');
    const earlier = filteredActivities.filter((a) => a.dateGroup === 'earlier');
    return { today, yesterday, earlier };
  }, [filteredActivities]);

  const handleCardPress = (activity: ActivityItemData) => {
    markActivityAsRead(activity.id);

    if (activity.actionType === 'telemetry' && activity.campaignId) {
      router.push(`/creator/performance?id=${activity.campaignId}` as any);
    } else if (activity.actionType === 'campaign' && activity.campaignId) {
      router.push(`/campaign/${activity.campaignId}` as any);
    } else if (activity.actionType === 'creator_dashboard') {
      router.push('/creator/dashboard');
    } else if (activity.actionType === 'receipt') {
      router.push('/(tabs)/profile');
    } else if (activity.campaignId) {
      router.push(`/campaign/${activity.campaignId}` as any);
    }
  };

  const todayDateStr = useMemo(() => {
    return new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.titleRow}>
              <AppText variant="headlineMd" color={colors.textPrimary} style={styles.headerTitle}>
                Activity Log
              </AppText>
              {unreadCount > 0 && (
                <View style={styles.unreadBadge}>
                  <AppText variant="labelMicro" color={colors.onPrimary} style={styles.unreadBadgeText}>
                    {unreadCount} Unread
                  </AppText>
                </View>
              )}
            </View>

            <View style={styles.headerActions}>
              {unreadCount > 0 && (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={markAllActivitiesAsRead}
                  style={styles.markReadBtn}
                >
                  <MaterialIcons name="done-all" size={16} color={colors.primaryInk} />
                  <AppText variant="labelMd" color={colors.primaryInk} style={styles.markReadText}>
                    Mark all read
                  </AppText>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setArchiveModalVisible(true)}
                style={styles.iconBtn}
                accessibilityLabel="Telemetry filter options"
              >
                <MaterialIcons name="tune" size={18} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>

          <AppText variant="bodySm" color={colors.textSecondary} style={styles.headerSubtitle}>
            Live broadcast telemetry, escrow settlement logs, and editorial consensus audit trails.
          </AppText>

          {/* Horizontal Category Filter Chips */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipRow}
          >
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.key;
              const count =
                cat.key === 'all'
                  ? activities.length
                  : activities.filter((a) => a.category === cat.key).length;

              return (
                <TouchableOpacity
                  key={cat.key}
                  activeOpacity={0.8}
                  onPress={() => setSelectedCategory(cat.key)}
                  style={[
                    styles.chip,
                    isSelected ? styles.chipSelected : styles.chipUnselected,
                  ]}
                >
                  <AppText
                    variant="labelMd"
                    color={isSelected ? colors.onPrimary : colors.textSecondary}
                    style={styles.chipText}
                  >
                    {cat.label} {cat.key === 'all' ? `(${count})` : ''}
                  </AppText>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Content Streams */}
        {filteredActivities.length === 0 ? (
          <ActivityEmptyState
            category={selectedCategory}
            onExplore={() => router.push('/(tabs)/explore')}
            onCreate={() => router.push('/(tabs)/create')}
          />
        ) : (
          <View style={styles.streamContainer}>
            {/* Today Section */}
            {grouped.today.length > 0 && (
              <View style={styles.sectionGroup}>
                <View style={styles.sectionHeaderRow}>
                  <View style={styles.sectionTitleLeft}>
                    <AppText variant="headlineSm" color={colors.textPrimary}>
                      Today
                    </AppText>
                    <AppText variant="bodySm" color={colors.textSecondary} style={styles.dateSubtext}>
                      — {todayDateStr}
                    </AppText>
                  </View>
                  <View style={styles.liveFeedTag}>
                    <View style={styles.pulseDot} />
                    <AppText variant="labelMicro" color={colors.primaryInk} style={styles.liveFeedText}>
                      LIVE FEED
                    </AppText>
                  </View>
                </View>

                {grouped.today.map((activity) => (
                  <ActivityCard
                    key={activity.id}
                    activity={activity}
                    onPress={() => handleCardPress(activity)}
                  />
                ))}
              </View>
            )}

            {/* Yesterday Section */}
            {grouped.yesterday.length > 0 && (
              <View style={styles.sectionGroup}>
                <View style={styles.sectionHeaderRow}>
                  <View style={styles.sectionTitleLeft}>
                    <AppText variant="headlineSm" color={colors.textPrimary}>
                      Yesterday
                    </AppText>
                  </View>
                </View>

                {grouped.yesterday.map((activity) => (
                  <ActivityCard
                    key={activity.id}
                    activity={activity}
                    onPress={() => handleCardPress(activity)}
                  />
                ))}
              </View>
            )}

            {/* Earlier This Week Section */}
            {grouped.earlier.length > 0 && (
              <View style={styles.sectionGroup}>
                <View style={styles.sectionHeaderRow}>
                  <View style={styles.sectionTitleLeft}>
                    <AppText variant="headlineSm" color={colors.textPrimary}>
                      Earlier This Week
                    </AppText>
                  </View>
                </View>

                {grouped.earlier.map((activity) => (
                  <ActivityCard
                    key={activity.id}
                    activity={activity}
                    onPress={() => handleCardPress(activity)}
                  />
                ))}
              </View>
            )}

            {/* Archived & Filtered Activity Banner */}
            <View style={[styles.delightCard, shadows.layer1]}>
              <View style={styles.delightIconBox}>
                <MaterialIcons name="history-edu" size={22} color={colors.primaryInk} />
              </View>
              <View style={styles.delightContent}>
                <AppText variant="headlineSm" color={colors.textPrimary}>
                  Archived & Filtered Activity
                </AppText>
                <AppText variant="bodySm" color={colors.textSecondary} style={styles.delightBody}>
                  Looking for past campaign ledgers? All historical escrow records and cryptographic publisher receipts are permanently archived in your Backer Ledger.
                </AppText>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setArchiveModalVisible(true)}
                  style={styles.delightAction}
                >
                  <AppText variant="labelMd" color={colors.primaryInk} style={styles.delightActionText}>
                    Explore Immutable Archive
                  </AppText>
                  <MaterialIcons name="open-in-new" size={14} color={colors.primaryInk} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Immutable Archive & Filter Modal */}
      <Modal
        visible={archiveModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setArchiveModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheet, shadows.layer3]}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <View style={styles.modalIconWrap}>
                <MaterialIcons name="history-edu" size={24} color={colors.primaryInk} />
              </View>
              <View style={{ flex: 1 }}>
                <AppText variant="headlineSm" color={colors.textPrimary}>
                  Immutable Audit Archive
                </AppText>
                <AppText variant="bodySm" color={colors.textSecondary}>
                  Cryptographically sealed settlement batches
                </AppText>
              </View>
              <TouchableOpacity onPress={() => setArchiveModalVisible(false)}>
                <Ionicons name="close" size={22} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.auditBatchCard}>
                <AppText variant="labelMicro" color={colors.primaryInk} style={{ fontWeight: '700' }}>
                  BATCH #2024-Q3-BLR
                </AppText>
                <AppText variant="bodyMd" color={colors.textPrimary} style={{ marginVertical: 4 }}>
                  Urban Environment & Civic Syndicates
                </AppText>
                <AppText variant="bodySm" color={colors.textSecondary}>
                  Contains 42 confirmed payouts, 3 publisher attestations, and 12 statutory audit proofs.
                </AppText>
              </View>

              <View style={styles.auditBatchCard}>
                <AppText variant="labelMicro" color={colors.primaryInk} style={{ fontWeight: '700' }}>
                  BATCH #2024-Q2-DEL
                </AppText>
                <AppText variant="bodyMd" color={colors.textPrimary} style={{ marginVertical: 4 }}>
                  Clean Air & Water Quality Sensors
                </AppText>
                <AppText variant="bodySm" color={colors.textSecondary}>
                  Sealed with SHA-256 Merkle root. Zero discrepancies recorded by independent nodes.
                </AppText>
              </View>
            </ScrollView>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => setArchiveModalVisible(false)}
              style={styles.modalCloseBtn}
            >
              <AppText variant="labelMd" color={colors.onPrimary} style={{ fontWeight: '700' }}>
                Close Archive
              </AppText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: spacing.bottomBarHeight + spacing.xl,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  headerTitle: {
    fontWeight: '700',
  },
  unreadBadge: {
    backgroundColor: colors.primaryContainer,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  unreadBadgeText: {
    fontWeight: '700',
    fontSize: 10,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  markReadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.surfaceContainer,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: borderRadius.sm,
  },
  markReadText: {
    fontWeight: '600',
  },
  iconBtn: {
    width: 34,
    height: 34,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerSubtitle: {
    marginBottom: spacing.md,
    lineHeight: 18,
  },
  chipRow: {
    gap: spacing.xs + 2,
    paddingVertical: 4,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 7,
    borderRadius: borderRadius.full,
  },
  chipSelected: {
    backgroundColor: colors.primaryContainer,
  },
  chipUnselected: {
    backgroundColor: colors.surfaceContainer,
  },
  chipText: {
    fontWeight: '600',
  },
  streamContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xs,
    gap: spacing.lg,
  },
  sectionGroup: {
    gap: spacing.xs,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  sectionTitleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  dateSubtext: {
    fontWeight: '400',
  },
  liveFeedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primaryInk,
  },
  liveFeedText: {
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  delightCard: {
    flexDirection: 'row',
    gap: spacing.md,
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  delightIconBox: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceContainerHighest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  delightContent: {
    flex: 1,
  },
  delightBody: {
    marginTop: 4,
    lineHeight: 19,
  },
  delightAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: spacing.sm,
  },
  delightActionText: {
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: colors.surfaceContainerLowest,
    borderTopLeftRadius: borderRadius.xl * 1.5,
    borderTopRightRadius: borderRadius.xl * 1.5,
    padding: spacing.lg,
    maxHeight: '75%',
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.outlineVariant,
    alignSelf: 'center',
    marginBottom: spacing.md,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  modalIconWrap: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBody: {
    marginBottom: spacing.md,
  },
  auditBatchCard: {
    backgroundColor: colors.surfaceContainerLow,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
  },
  modalCloseBtn: {
    backgroundColor: colors.primaryContainer,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
});
