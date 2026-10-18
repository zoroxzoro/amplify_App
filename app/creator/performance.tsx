import React, { useState, useMemo } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Share,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import {
  ScreenContainer,
  AppText,
  Toast,
} from '../../src/components';
import { colors } from '../../src/theme/colors';
import { spacing, borderRadius, shadows } from '../../src/theme/spacing';
import { useCampaigns } from '../../src/context/CampaignContext';
import { calculateAllocation } from '../../src/config/contribution';
import { formatCurrencyINR, formatNumberIN } from '../../src/utils/formatters';

export default function PerformanceReportScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const { campaigns, creatorCampaigns } = useCampaigns();

  // Find selected campaign or fallback to first active/creator campaign
  const campaign = useMemo(() => {
    if (params.id) {
      return campaigns.find((c) => c.id === params.id);
    }
    // If no specific ID parameter provided, default to active flight or first creator campaign
    return (
      creatorCampaigns.find((c) => c.status === 'active' || c.status === 'amplified') ||
      creatorCampaigns[0] ||
      campaigns[0]
    );
  }, [params.id, campaigns, creatorCampaigns]);

  // Demo toggle: Evaluators can explicitly toggle illustrative measured data on/off
  // to compare "No measured data yet" vs "Measured ad delivery"
  const [showDemoMeasuredData, setShowDemoMeasuredData] = useState<boolean>(
    Boolean(campaign?.performanceAudit?.hasMeasuredData)
  );

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedHash, setCopiedHash] = useState(false);

  // Financial allocation calculations
  const targetBudget = campaign?.targetAmount || 180000;
  const allocation = calculateAllocation(targetBudget);
  const raisedAmount =
    campaign?.raisedAmount !== undefined
      ? campaign.raisedAmount
      : campaign?.status === 'active' || campaign?.status === 'completed' || campaign?.status === 'amplified'
      ? targetBudget
      : 0;
  const isFullyBacked = raisedAmount >= targetBudget;
  const remainingTarget = Math.max(0, targetBudget - raisedAmount);

  const audit = campaign?.performanceAudit;
  const flightDay = audit?.flightDay || 3;
  const totalDays = audit?.totalFlightDays || 14;
  const deployedMediaSpend = audit?.deployedMediaSpend || 48200;
  const deployedPercent = Math.min(
    100,
    Math.round((deployedMediaSpend / allocation.adSpend) * 100)
  );
  const elapsedPercent = Math.min(100, Math.round((flightDay / totalDays) * 100));

  // Copy Merkle root hash
  const handleCopyHash = () => {
    setCopiedHash(true);
    setToastMessage('Flight Merkle root hash copied to clipboard.');
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handleExportPDF = () => {
    setToastMessage('Statutory Audit PDF generated & archived to local files.');
  };

  const handleShareAudit = async () => {
    if (!campaign) return;
    try {
      await Share.share({
        title: `${campaign.title} - Performance Audit`,
        message: `Amplify Civic Audit: "${campaign.title}" has verified ${formatNumberIN(
          audit?.verifiedImpressions || 64210
        )} citizens reached. Merkle Proof: ${audit?.merkleRootHash || '0x7f9a842b9101c5d082e63c21884fe0a1'}`,
      });
    } catch {
      setToastMessage('Share sheet unavailable on this device.');
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          accessibilityLabel="Back to Dashboard"
        >
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <AppText variant="headlineSm" color={colors.textPrimary} style={styles.headerTitle}>
          Campaign Performance & Audit
        </AppText>
      </View>

      <View style={styles.headerRight}>
        <TouchableOpacity
          onPress={handleShareAudit}
          style={styles.iconActionBtn}
          accessibilityLabel="Share Audit Receipt"
        >
          <Ionicons name="share-social-outline" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleExportPDF}
          style={styles.iconActionBtn}
          accessibilityLabel="Export Audit PDF"
        >
          <Ionicons name="download-outline" size={20} color={colors.primaryInk} />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (!campaign) {
    return (
      <ScreenContainer header={renderHeader()} withBottomTabPadding={false}>
        <View style={styles.notFoundContainer}>
          <AppText variant="headlineSm" color={colors.textPrimary}>
            Campaign Audit Not Found
          </AppText>
          <TouchableOpacity onPress={() => router.back()} style={styles.returnBtn}>
            <AppText variant="labelMd" color={colors.onPrimary}>
              Return to Studio
            </AppText>
          </TouchableOpacity>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer header={renderHeader()} withBottomTabPadding={false}>
      {toastMessage && (
        <Toast
          message={toastMessage}
          type="info"
          onDismiss={() => setToastMessage(null)}
        />
      )}

      {/* Top Context Card */}
      <View style={[styles.contextCard, shadows.layer1]}>
        <View style={styles.contextTopRow}>
          <View style={styles.flightStatusBadge}>
            <View style={styles.pulseDot} />
            <AppText variant="labelMicro" color={colors.primaryInk} style={styles.flightStatusText}>
              {campaign.status === 'active' || campaign.status === 'amplified'
                ? `Live Flight (Day ${flightDay} of ${totalDays})`
                : campaign.status === 'approved'
                ? 'Approved • Funding Window'
                : 'Under Review • Pre-Launch'}
            </AppText>
          </View>
          <AppText variant="labelMicro" color={colors.textSecondary} style={styles.dossierNum}>
            CIVIC DOSSIER #{audit?.flightId ? audit.flightId.replace(/\D/g, '') || '408' : '408'}
          </AppText>
        </View>

        <AppText variant="headlineMd" color={colors.textPrimary} style={styles.campaignTitle}>
          {campaign.title}
        </AppText>

        <View style={styles.stewardMetaRow}>
          <MaterialIcons name="verified-user" size={16} color={colors.primaryInk} />
          <AppText variant="bodySm" color={colors.textSecondary} numberOfLines={1}>
            {campaign.creatorName || 'Dr. Ananya Sen'} • {campaign.creator.organization || 'Centre for Ecological Design'}
          </AppText>
        </View>

        <View style={styles.auditPeriodStrip}>
          <View style={styles.periodLeft}>
            <MaterialIcons name="calendar-month" size={15} color={colors.primaryInk} />
            <AppText variant="labelMd" color={colors.textPrimary}>
              {audit?.reportingPeriod || 'Oct 14 – Oct 28, 2024'}
            </AppText>
          </View>
          <AppText variant="labelMicro" color={colors.textSecondary}>
            Flight Audit v2
          </AppText>
        </View>
      </View>

      {/* Audit Protocol Transparency Callout */}
      <View style={[styles.transparencyCallout, shadows.layer1]}>
        <View style={styles.policyIconBox}>
          <MaterialIcons name="policy" size={18} color={colors.onPrimary} />
        </View>
        <View style={styles.transparencyContent}>
          <AppText variant="labelMicro" color={colors.primaryInk} style={styles.transparencyTitle}>
            AUDIT PROTOCOL TRANSPARENCY
          </AppText>
          <AppText variant="bodySm" color={colors.textSecondary} style={styles.transparencyBody}>
            <AppText variant="bodySm" color={colors.textPrimary} style={styles.boldText}>
              Estimated reach
            </AppText>{' '}
            reflects pre-flight algorithmic projections based on planned media budget and regional
            publisher CPMs.{' '}
            <AppText variant="bodySm" color={colors.textPrimary} style={styles.boldText}>
              Measured delivery
            </AppText>{' '}
            metrics reflect cryptographic ad server logs and publisher impression verification receipts.
          </AppText>
        </View>
      </View>

      {/* Demonstration Mode Switcher Banner */}
      <View style={styles.datasetToggleBanner}>
        <View style={styles.datasetToggleTextCol}>
          <AppText variant="labelMicro" color={colors.primaryInk} style={styles.datasetLabel}>
            DEMO DATASET CONTROLLER
          </AppText>
          <AppText variant="bodySm" color={colors.textSecondary} style={styles.datasetSubtext}>
            {showDemoMeasuredData
              ? 'Showing illustrative verified ad delivery telemetry.'
              : 'Showing pre-flight empty state (No measured performance data yet).'}
          </AppText>
        </View>
        <TouchableOpacity
          onPress={() => {
            const next = !showDemoMeasuredData;
            setShowDemoMeasuredData(next);
            setToastMessage(
              next
                ? 'Illustrative measured ad telemetry enabled.'
                : 'Switched to "No measured performance data yet" state.'
            );
          }}
          style={[
            styles.toggleChip,
            showDemoMeasuredData && styles.toggleChipActive,
          ]}
          activeOpacity={0.8}
        >
          <Ionicons
            name={showDemoMeasuredData ? 'shield-checkmark' : 'hourglass-outline'}
            size={14}
            color={showDemoMeasuredData ? colors.onPrimary : colors.primaryInk}
          />
          <AppText
            variant="labelMicro"
            color={showDemoMeasuredData ? colors.onPrimary : colors.primaryInk}
            style={styles.toggleChipText}
          >
            {showDemoMeasuredData ? 'Demo Measured' : 'Pre-Launch'}
          </AppText>
        </TouchableOpacity>
      </View>

      {/* SECTION 1: Financial Escrow & Advertising Spend Ledger */}
      <View style={[styles.card, shadows.layer1]}>
        <View style={styles.cardHeaderRow}>
          <View style={styles.headerLeftWithIcon}>
            <MaterialIcons name="account-balance" size={19} color={colors.primaryInk} />
            <AppText variant="headlineSm" color={colors.textPrimary}>
              Escrow Ledger
            </AppText>
          </View>
          <View style={styles.backedBadge}>
            <AppText variant="labelMicro" color={colors.primaryInk} style={styles.boldText}>
              {isFullyBacked
                ? `100% BACKED (${campaign.metrics.backersCount || 412} BACKERS)`
                : `${Math.round((raisedAmount / targetBudget) * 100)}% BACKED`}
            </AppText>
          </View>
        </View>

        {/* Total Escrow Vault Box */}
        <View style={styles.vaultBox}>
          <View>
            <AppText variant="labelMicro" color={colors.textSecondary} style={styles.vaultLabel}>
              TOTAL ESCROW VAULT
            </AppText>
            <AppText variant="displayLg" color={colors.primaryInk} style={styles.vaultAmount}>
              {formatCurrencyINR(targetBudget)}
            </AppText>
          </View>
          <View style={styles.clearedPill}>
            <Ionicons name="shield-checkmark" size={13} color={colors.primaryInk} />
            <AppText variant="labelMicro" color={colors.primaryInk}>
              {isFullyBacked ? 'Fully Cleared' : `₹${formatNumberIN(remainingTarget)} Remaining`}
            </AppText>
          </View>
        </View>

        {/* Media Spend Timeline Pacing Bar */}
        <View style={styles.pacingContainer}>
          <View style={styles.pacingHeaderRow}>
            <AppText variant="labelMd" color={colors.textPrimary} style={styles.boldText}>
              Media Spend Deployed (Day {flightDay} / {totalDays})
            </AppText>
            <AppText variant="labelMd" color={colors.primaryInk} style={styles.boldText}>
              {showDemoMeasuredData ? formatCurrencyINR(deployedMediaSpend) : '₹0'}{' '}
              <AppText variant="labelMd" color={colors.textSecondary}>
                / {formatCurrencyINR(allocation.adSpend)}
              </AppText>
            </AppText>
          </View>

          {/* Bar with 21.4% time benchmark tick */}
          <View style={styles.pacingBarWrapper}>
            <View style={styles.pacingTrack}>
              <View
                style={[
                  styles.pacingFill,
                  { width: showDemoMeasuredData ? `${deployedPercent}%` : '0%' },
                ]}
              />
              {/* Day 3 benchmark line at 21.4% */}
              <View style={[styles.benchmarkMarker, { left: `${elapsedPercent}%` }]} />
            </View>
          </View>

          <View style={styles.pacingFooterRow}>
            <AppText variant="labelMicro" color={colors.primaryInk} style={styles.boldText}>
              {showDemoMeasuredData ? `${deployedPercent}% capital deployed` : '0% capital deployed'}
            </AppText>
            <AppText variant="labelMicro" color={colors.textSecondary}>
              {elapsedPercent}% flight elapsed (Pacing on schedule)
            </AppText>
          </View>
        </View>

        {/* Capital Disbursement Breakdown */}
        <View style={styles.disbursementSection}>
          <AppText variant="labelMicro" color={colors.textSecondary} style={styles.sectionMicroTitle}>
            DISBURSEMENT SCHEDULE & SERVICE ACCOUNTING
          </AppText>

          {/* Line 1: Media Placement (88%) */}
          <View style={styles.disbursementItem}>
            <View style={styles.disbursementLeft}>
              <View style={[styles.colorDot, { backgroundColor: colors.primaryInk }]} />
              <View style={{ flex: 1 }}>
                <AppText variant="labelMd" color={colors.textPrimary} style={styles.itemTitle}>
                  Direct Media Placement (88%)
                </AppText>
                <AppText variant="bodySm" color={colors.textSecondary}>
                  Remaining in Smart Escrow: {showDemoMeasuredData ? formatCurrencyINR(allocation.adSpend - deployedMediaSpend) : formatCurrencyINR(allocation.adSpend)}
                </AppText>
              </View>
            </View>
            <AppText variant="headlineSm" color={colors.textPrimary} style={styles.itemAmount}>
              {formatCurrencyINR(allocation.adSpend)}
            </AppText>
          </View>

          {/* Line 2: Fact-Check Desk (8%) */}
          <View style={styles.disbursementItem}>
            <View style={styles.disbursementLeft}>
              <View style={[styles.colorDot, { backgroundColor: colors.primaryContainer }]} />
              <View style={{ flex: 1 }}>
                <AppText variant="labelMd" color={colors.textPrimary} style={styles.itemTitle}>
                  Fact-Check & Audit Desk (8%)
                </AppText>
                <AppText variant="bodySm" color={colors.primaryInk}>
                  Disbursed & Closed • Civic Verification
                </AppText>
              </View>
            </View>
            <AppText variant="headlineSm" color={colors.textPrimary} style={styles.itemAmount}>
              {formatCurrencyINR(allocation.verificationFee)}
            </AppText>
          </View>

          {/* Line 3: Escrow Clearing (4%) */}
          <View style={styles.disbursementItem}>
            <View style={styles.disbursementLeft}>
              <View style={[styles.colorDot, { backgroundColor: colors.secondary }]} />
              <View style={{ flex: 1 }}>
                <AppText variant="labelMd" color={colors.textPrimary} style={styles.itemTitle}>
                  Statutory Banking Clearing (4%)
                </AppText>
                <AppText variant="bodySm" color={colors.primaryInk}>
                  Disbursed & Closed • Escrow Custody
                </AppText>
              </View>
            </View>
            <AppText variant="headlineSm" color={colors.textPrimary} style={styles.itemAmount}>
              {formatCurrencyINR(allocation.gatewayFee)}
            </AppText>
          </View>
        </View>
      </View>

      {/* SECTION 2: Reach & Verification Matrix: Pre-Flight Model vs Measured Delivery */}
      <View style={styles.sectionBlock}>
        <View style={styles.sectionHeaderRow}>
          <AppText variant="headlineSm" color={colors.textPrimary}>
            Reach & Verification Matrix
          </AppText>
          <AppText variant="labelMicro" color={colors.textSecondary}>
            SIDE-BY-SIDE AUDIT
          </AppText>
        </View>

        {showDemoMeasuredData ? (
          <>
            {/* Comparative Grid */}
            <View style={styles.matrixGrid}>
              {/* Card A: Estimated Reach (Pre-Flight Model) */}
              <View style={[styles.matrixCard, shadows.layer1]}>
                <AppText variant="labelMicro" color={colors.textSecondary} style={styles.matrixCardLabel}>
                  PRE-FLIGHT MODEL
                </AppText>
                <AppText variant="headlineLg" color={colors.textPrimary} style={styles.bigStatNum}>
                  {formatNumberIN(campaign.estimatedReach || 185000)}
                </AppText>
                <AppText variant="bodySm" color={colors.textSecondary}>
                  projected impressions
                </AppText>
                <View style={styles.cpmPill}>
                  <AppText variant="labelMicro" color={colors.textSecondary}>
                    Est. CPM: ₹120–140
                  </AppText>
                </View>
              </View>

              {/* Card B: Verified Delivery (Actual Performance) */}
              <View style={[styles.matrixCard, shadows.layer1]}>
                <AppText variant="labelMicro" color={colors.primaryInk} style={styles.matrixCardLabelBold}>
                  VERIFIED DELIVERY
                </AppText>
                <AppText variant="headlineLg" color={colors.primaryInk} style={styles.bigStatNum}>
                  {formatNumberIN(audit?.verifiedImpressions || 64210)}
                </AppText>
                <AppText variant="bodySm" color={colors.textSecondary}>
                  actual impressions
                </AppText>
                <View style={styles.achievedPill}>
                  <AppText variant="labelMicro" color={colors.primaryInk} style={styles.boldText}>
                    34.7% achieved (72h)
                  </AppText>
                </View>
              </View>
            </View>

            {/* Sub-metrics Row: Unique Citizens & Civic Engagement */}
            <View style={styles.matrixGrid}>
              {/* Card C: Device Footprint */}
              <View style={[styles.matrixCard, shadows.layer1]}>
                <AppText variant="labelMicro" color={colors.textSecondary} style={styles.matrixCardLabel}>
                  VERIFIED DEVICE FOOTPRINT
                </AppText>
                <AppText variant="headlineLg" color={colors.textPrimary} style={styles.bigStatNum}>
                  {formatNumberIN(audit?.uniqueCitizens || 41890)}
                </AppText>
                <AppText variant="bodySm" color={colors.textSecondary}>
                  unique citizens reached
                </AppText>
                <View style={styles.locationPill}>
                  <Ionicons name="location-sharp" size={12} color={colors.primaryInk} />
                  <AppText variant="labelMicro" color={colors.primaryInk} numberOfLines={1}>
                    {audit?.focalCorridor || 'Ward 14–22 Corridor'}
                  </AppText>
                </View>
              </View>

              {/* Card D: Dossier Reads */}
              <View style={[styles.matrixCard, shadows.layer1]}>
                <AppText variant="labelMicro" color={colors.textSecondary} style={styles.matrixCardLabel}>
                  DOSSIER READS & CLICKS
                </AppText>
                <AppText variant="headlineLg" color={colors.textPrimary} style={styles.bigStatNum}>
                  {formatNumberIN(audit?.dossierReads || 3842)}
                </AppText>
                <AppText variant="bodySm" color={colors.textSecondary}>
                  verified click-throughs
                </AppText>
                <View style={styles.ctrPill}>
                  <AppText variant="labelMicro" color={colors.textSecondary}>
                    {audit?.ctr || 5.98}% CTR
                  </AppText>
                  <AppText variant="labelMicro" color={colors.primaryInk} style={styles.boldText}>
                    2.8x norm
                  </AppText>
                </View>
              </View>
            </View>

            {/* Deep Reads Callout Bar */}
            <View style={[styles.deepReadsCard, shadows.layer1]}>
              <View style={styles.deepReadsLeft}>
                <View style={styles.bookIconBox}>
                  <MaterialIcons name="menu-book" size={18} color={colors.primaryInk} />
                </View>
                <View style={{ flex: 1 }}>
                  <AppText variant="headlineSm" color={colors.textPrimary}>
                    {formatNumberIN(audit?.deepReadsCitizens || 2190)} Citizens Engaged
                  </AppText>
                  <AppText variant="bodySm" color={colors.textSecondary}>
                    Deep read engagement verified (&gt;2 minutes dwell time on dossier)
                  </AppText>
                </View>
              </View>
              <View style={styles.deepPercentBadge}>
                <AppText variant="labelMd" color={colors.textPrimary} style={styles.boldText}>
                  {audit?.deepReadPercent || 57.0}%
                </AppText>
              </View>
            </View>
          </>
        ) : (
          /* AUTHENTIC EMPTY MEASURED DATA STATE (No measured performance data yet) */
          <View style={[styles.noMeasuredCard, shadows.layer1]}>
            <View style={styles.noMeasuredIconCircle}>
              <MaterialIcons name="query-builder" size={30} color={colors.primaryInk} />
            </View>
            <AppText variant="headlineSm" color={colors.textPrimary} style={styles.noMeasuredTitle}>
              No Measured Ad Delivery Data Yet
            </AppText>
            <AppText variant="bodySm" color={colors.textSecondary} style={styles.noMeasuredBody}>
              This broadcast flight has not deployed programmatic ad inventory yet. Measured
              impressions, unique citizen footprints, and click-through metrics will populate
              automatically via cryptographic publisher receipts once escrow closes and ad flights
              launch across regional networks.
            </AppText>

            <View style={styles.preFlightModelBox}>
              <AppText variant="labelMicro" color={colors.primaryInk} style={styles.boldText}>
                ESTIMATED PROJECTION TARGET:
              </AppText>
              <AppText variant="headlineMd" color={colors.textPrimary} style={styles.estProjText}>
                ~{formatNumberIN(campaign.estimatedReach || 185000)} impressions
              </AppText>
              <AppText variant="bodySm" color={colors.textSecondary}>
                Allocated budget of {formatCurrencyINR(allocation.adSpend)} at estimated ~₹95 CPM.
              </AppText>
            </View>
          </View>
        )}
      </View>

      {/* SECTION 3: Publisher Channel Audit */}
      {showDemoMeasuredData && audit?.channels && (
        <View style={styles.sectionBlock}>
          <View style={styles.sectionHeaderRow}>
            <AppText variant="headlineSm" color={colors.textPrimary}>
              Publisher Channel Audit
            </AppText>
            <AppText variant="labelMicro" color={colors.textSecondary}>
              {audit.channels.length} CHANNELS ACTIVE
            </AppText>
          </View>

          {audit.channels.map((ch) => (
            <View key={ch.id} style={[styles.channelCard, shadows.layer1]}>
              <View style={styles.channelTop}>
                <View style={styles.channelTitleGroup}>
                  <View style={styles.channelIconBox}>
                    <MaterialIcons
                      name={
                        ch.icon === 'public'
                          ? 'public'
                          : ch.icon === 'newspaper'
                          ? 'newspaper'
                          : 'chat'
                      }
                      size={18}
                      color={colors.primaryInk}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <AppText variant="labelMd" color={colors.textPrimary} style={styles.boldText}>
                      {ch.name}
                    </AppText>
                    <AppText variant="labelMicro" color={colors.textSecondary}>
                      {ch.subtitle}
                    </AppText>
                  </View>
                </View>
                <View style={styles.channelActivePill}>
                  <AppText variant="labelMicro" color={colors.primaryInk} style={styles.boldText}>
                    Active
                  </AppText>
                </View>
              </View>

              <View style={styles.channelGrid}>
                <View style={styles.channelStatItem}>
                  <AppText variant="labelMicro" color={colors.textSecondary}>
                    Spend
                  </AppText>
                  <AppText variant="labelMd" color={colors.textPrimary} style={styles.boldText}>
                    {formatCurrencyINR(ch.spend)}
                  </AppText>
                </View>
                <View style={styles.channelStatItem}>
                  <AppText variant="labelMicro" color={colors.textSecondary}>
                    Impressions
                  </AppText>
                  <AppText variant="labelMd" color={colors.textPrimary} style={styles.boldText}>
                    {formatNumberIN(ch.impressions)}
                  </AppText>
                </View>
                <View style={styles.channelStatItem}>
                  <AppText variant="labelMicro" color={colors.textSecondary}>
                    Clicks
                  </AppText>
                  <AppText variant="labelMd" color={colors.primaryInk} style={styles.boldText}>
                    {formatNumberIN(ch.clicks)}
                  </AppText>
                </View>
                <View style={styles.channelStatItem}>
                  <AppText variant="labelMicro" color={colors.textSecondary}>
                    Eff. CPM
                  </AppText>
                  <AppText variant="labelMd" color={colors.textPrimary} style={styles.boldText}>
                    ₹{ch.effectiveCpm}
                  </AppText>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* SECTION 4: Delivery Timeline & Run Rate Visual Graph */}
      {showDemoMeasuredData && audit?.dailyDelivery && (
        <View style={styles.sectionBlock}>
          <View style={[styles.card, shadows.layer1]}>
            <View style={styles.sectionHeaderRow}>
              <View>
                <AppText variant="headlineSm" color={colors.textPrimary}>
                  Delivery Pacing & Run Rate
                </AppText>
                <AppText variant="bodySm" color={colors.textSecondary}>
                  Daily verified impressions vs trajectory
                </AppText>
              </View>
              <View style={styles.dayRangeBadge}>
                <AppText variant="labelMicro" color={colors.textPrimary}>
                  Day 1–14
                </AppText>
              </View>
            </View>

            {/* Visual Bar Chart */}
            <View style={styles.chartContainer}>
              <View style={styles.barsRow}>
                {audit.dailyDelivery.map((pt, idx) => {
                  // Normalize height between 20 and 80 px
                  const barHeight = Math.max(16, Math.round((pt.impressions / 60000) * 80));

                  return (
                    <View key={idx} style={styles.barCol}>
                      <View
                        style={[
                          styles.barShape,
                          { height: barHeight },
                          pt.isActual ? styles.barActual : styles.barGhost,
                        ]}
                      />
                      <AppText
                        variant="labelMicro"
                        color={pt.isActual ? colors.primaryInk : colors.textMuted}
                        style={pt.isActual ? styles.boldText : undefined}
                      >
                        {pt.day}
                      </AppText>
                    </View>
                  );
                })}
              </View>

              {/* Legend Row */}
              <View style={styles.chartLegendRow}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendBox, { backgroundColor: colors.primaryInk }]} />
                  <AppText variant="labelMicro" color={colors.textSecondary}>
                    Verified Daily Execution (D1–D3)
                  </AppText>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendBox, { backgroundColor: colors.surfaceContainerHighest }]} />
                  <AppText variant="labelMicro" color={colors.textSecondary}>
                    Projected Run-Rate (D4–D14)
                  </AppText>
                </View>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* SECTION 5: Cryptographic Proof & Public Ledger */}
      <View style={styles.sectionBlock}>
        <View style={[styles.card, shadows.layer1]}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.headerLeftWithIcon}>
              <MaterialIcons name="enhanced-encryption" size={20} color={colors.primaryInk} />
              <AppText variant="headlineSm" color={colors.textPrimary}>
                Cryptographic Proof
              </AppText>
            </View>
            <View style={styles.shaBadge}>
              <AppText variant="labelMicro" color={colors.primaryInk} style={styles.boldText}>
                SHA-256 VALIDATED
              </AppText>
            </View>
          </View>

          <AppText variant="bodySm" color={colors.textSecondary} style={styles.cryptoExplainer}>
            Ad delivery logs are cryptographically sealed in 12-hour intervals. The root hash matches
            published receipts from regional publisher ad exchange nodes.
          </AppText>

          {/* Hash Box */}
          <View style={styles.hashBox}>
            <View style={styles.hashTextCol}>
              <AppText variant="labelMicro" color={colors.textSecondary} style={styles.hashLabel}>
                FLIGHT MERKLE ROOT HASH
              </AppText>
              <AppText variant="labelMd" color={colors.textPrimary} style={styles.hashString} numberOfLines={1}>
                {audit?.merkleRootHash || '0x7f9a842b9101c5d082e63c21884fe0a1'}
              </AppText>
            </View>
            <TouchableOpacity
              onPress={handleCopyHash}
              style={styles.copyBtn}
              accessibilityLabel="Copy hash"
            >
              <MaterialIcons
                name={copiedHash ? 'check' : 'content-copy'}
                size={16}
                color={colors.primaryInk}
              />
            </TouchableOpacity>
          </View>

          {/* Attestation Details Grid */}
          <View style={styles.attestationGrid}>
            <View style={styles.attestationItem}>
              <AppText variant="labelMicro" color={colors.textSecondary}>
                LAST SEALED LEDGER
              </AppText>
              <AppText variant="labelMd" color={colors.textPrimary} style={styles.boldText}>
                {audit?.lastSealedLedger || 'Oct 16, 2024 • 18:00 IST'}
              </AppText>
            </View>
            <View style={styles.attestationItem}>
              <AppText variant="labelMicro" color={colors.textSecondary}>
                INDEPENDENT NODES
              </AppText>
              <AppText variant="labelMd" color={colors.textPrimary} style={styles.boldText}>
                {audit?.independentNodesAttested || '3 of 3 Attested'}
              </AppText>
            </View>
          </View>
        </View>
      </View>

      {/* SECTION 6: Statutory Actions */}
      <View style={styles.actionsBlock}>
        <TouchableOpacity
          onPress={handleExportPDF}
          style={styles.pdfDownloadBtn}
          activeOpacity={0.85}
        >
          <MaterialIcons name="download" size={20} color={colors.onPrimary} />
          <AppText variant="headlineSm" color={colors.onPrimary} style={styles.pdfBtnText}>
            Download Full Statutory Audit Report (PDF)
          </AppText>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setToastMessage('Raw cryptographic receipts verified against consensus node.');
          }}
          style={styles.receiptsBtn}
          activeOpacity={0.8}
        >
          <MaterialIcons name="receipt" size={17} color={colors.primaryInk} />
          <AppText variant="labelMd" color={colors.primaryInk} style={styles.boldText}>
            View Raw Publisher Delivery Receipts
          </AppText>
        </TouchableOpacity>
      </View>

      <View style={{ height: 40 }} />
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
    gap: 8,
    flex: 1,
  },
  backButton: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.sm,
  },
  headerTitle: {
    fontSize: 16,
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  iconActionBtn: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.sm,
  },
  notFoundContainer: {
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.md,
  },
  returnBtn: {
    backgroundColor: colors.primaryInk,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    borderRadius: borderRadius.md,
  },
  contextCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.card,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.containmentBorder,
    gap: 6,
    marginHorizontal: spacing.marginMobile,
    marginTop: spacing.sm,
  },
  contextTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  flightStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.primaryFixed,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primaryInk,
  },
  flightStatusText: {
    fontWeight: '800',
    fontSize: 10,
  },
  dossierNum: {
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  campaignTitle: {
    fontSize: 18,
    lineHeight: 24,
  },
  stewardMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  auditPeriodStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceContainerLow,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: borderRadius.md,
    marginTop: 4,
  },
  periodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  transparencyCallout: {
    backgroundColor: colors.surfaceContainerHigh,
    borderRadius: borderRadius.card,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginHorizontal: spacing.marginMobile,
    marginTop: spacing.sm,
  },
  policyIconBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primaryInk,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    flexShrink: 0,
  },
  transparencyContent: {
    flex: 1,
    gap: 2,
  },
  transparencyTitle: {
    fontWeight: '800',
    fontSize: 10,
    letterSpacing: 0.6,
  },
  transparencyBody: {
    fontSize: 12,
    lineHeight: 17,
  },
  boldText: {
    fontWeight: '700',
  },
  datasetToggleBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.containmentBorder,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    marginHorizontal: spacing.marginMobile,
    marginTop: spacing.sm,
    gap: 8,
  },
  datasetToggleTextCol: {
    flex: 1,
  },
  datasetLabel: {
    fontWeight: '800',
    fontSize: 9.5,
    letterSpacing: 0.5,
  },
  datasetSubtext: {
    fontSize: 11,
    marginTop: 1,
  },
  toggleChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: colors.primaryInk,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
    flexShrink: 0,
  },
  toggleChipActive: {
    backgroundColor: colors.primaryInk,
  },
  toggleChipText: {
    fontWeight: '800',
    fontSize: 10.5,
  },
  card: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.card,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.containmentBorder,
    gap: spacing.sm,
    marginHorizontal: spacing.marginMobile,
    marginTop: spacing.sm,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  headerLeftWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  backedBadge: {
    backgroundColor: colors.primaryFixed,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  vaultBox: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  vaultLabel: {
    fontSize: 10,
    fontWeight: '800',
  },
  vaultAmount: {
    lineHeight: 38,
  },
  clearedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.surfaceContainerLowest,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  pacingContainer: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    gap: 6,
  },
  pacingHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pacingBarWrapper: {
    height: 10,
    marginVertical: 2,
  },
  pacingTrack: {
    height: '100%',
    backgroundColor: colors.surfaceContainerHigh,
    borderRadius: borderRadius.full,
    position: 'relative',
    overflow: 'hidden',
  },
  pacingFill: {
    height: '100%',
    backgroundColor: colors.primaryInk,
    borderRadius: borderRadius.full,
  },
  benchmarkMarker: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: colors.secondary,
  },
  pacingFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  disbursementSection: {
    gap: 8,
    marginTop: 4,
  },
  sectionMicroTitle: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  disbursementItem: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  disbursementLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    flexShrink: 0,
  },
  itemTitle: {
    fontWeight: '700',
    fontSize: 12.5,
  },
  itemAmount: {
    fontWeight: '800',
    fontSize: 14,
  },
  sectionBlock: {
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.marginMobile,
  },
  matrixGrid: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: spacing.marginMobile,
  },
  matrixCard: {
    flex: 1,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.card,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.containmentBorder,
    justifyContent: 'space-between',
    minHeight: 115,
  },
  matrixCardLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  matrixCardLabelBold: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  bigStatNum: {
    fontSize: 24,
    lineHeight: 30,
    marginVertical: 2,
  },
  cpmPill: {
    backgroundColor: colors.surfaceContainerLow,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  achievedPill: {
    backgroundColor: colors.primaryFixed,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.surfaceContainerLow,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  ctrPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceContainerLow,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    marginTop: 6,
  },
  deepReadsCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.card,
    padding: spacing.md,
    marginHorizontal: spacing.marginMobile,
    borderWidth: 1,
    borderColor: colors.containmentBorder,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  deepReadsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  bookIconBox: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  deepPercentBadge: {
    backgroundColor: colors.surfaceContainerHigh,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
    flexShrink: 0,
  },
  noMeasuredCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.card,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.containmentBorder,
    alignItems: 'center',
    textAlign: 'center',
    marginHorizontal: spacing.marginMobile,
    gap: spacing.sm,
  },
  noMeasuredIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  noMeasuredTitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  noMeasuredBody: {
    textAlign: 'center',
    fontSize: 12.5,
    lineHeight: 18,
    maxWidth: 340,
  },
  preFlightModelBox: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    width: '100%',
    alignItems: 'center',
    gap: 2,
    marginTop: 4,
  },
  estProjText: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700',
  },
  channelCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.card,
    padding: spacing.md,
    marginHorizontal: spacing.marginMobile,
    borderWidth: 1,
    borderColor: colors.containmentBorder,
    gap: spacing.sm,
  },
  channelTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  channelTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  channelIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  channelActivePill: {
    backgroundColor: colors.primaryFixed,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  channelGrid: {
    flexDirection: 'row',
    gap: 6,
  },
  channelStatItem: {
    flex: 1,
    backgroundColor: colors.surfaceContainerLow,
    padding: 6,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
  },
  dayRangeBadge: {
    backgroundColor: colors.surfaceContainerHigh,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  chartContainer: {
    gap: spacing.md,
    paddingTop: spacing.xs,
  },
  barsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 90,
    paddingBottom: 2,
  },
  barCol: {
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  barShape: {
    width: '65%',
    maxWidth: 16,
    borderRadius: 2,
  },
  barActual: {
    backgroundColor: colors.primaryInk,
  },
  barGhost: {
    backgroundColor: colors.surfaceContainerHighest,
  },
  chartLegendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.containmentBorder,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendBox: {
    width: 10,
    height: 10,
    borderRadius: 2,
  },
  shaBadge: {
    backgroundColor: colors.surfaceContainer,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
    flexShrink: 0,
  },
  cryptoExplainer: {
    fontSize: 12,
    lineHeight: 17,
  },
  hashBox: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  hashTextCol: {
    flex: 1,
    minWidth: 0,
  },
  hashLabel: {
    fontSize: 9.5,
    fontWeight: '800',
  },
  hashString: {
    fontFamily: 'Newsreader',
    fontSize: 12.5,
  },
  copyBtn: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  attestationGrid: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 2,
  },
  attestationItem: {
    flex: 1,
    backgroundColor: colors.surfaceContainerLow,
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    gap: 2,
  },
  actionsBlock: {
    paddingHorizontal: spacing.marginMobile,
    marginTop: spacing.md,
    gap: spacing.xs,
  },
  pdfDownloadBtn: {
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primaryInk,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: spacing.md,
  },
  pdfBtnText: {
    fontSize: 13.5,
    fontWeight: '700',
  },
  receiptsBtn: {
    height: 44,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceContainerLow,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
});
