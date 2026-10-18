import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import {
  ScreenContainer,
  AppText,
  EmptyState,
  CampaignImage,
} from '../../src/components';
import { colors } from '../../src/theme/colors';
import { spacing, borderRadius, shadows } from '../../src/theme/spacing';
import { useCampaigns } from '../../src/context/CampaignContext';
import {
  MIN_CONTRIBUTION,
  DEFAULT_CONTRIBUTION,
  CONTRIBUTION_TIERS,
  calculateAllocation,
  calculateProjectedReach,
  validateContributionAmount,
  AllocationBreakdown,
} from '../../src/config/contribution';
import { Contribution } from '../../src/types/campaign';

type ContributionStep = 'amount' | 'review' | 'checkout' | 'success' | 'failed';
type SimulationOutcome = 'success' | 'failure';
type PaymentMethodType = 'upi' | 'card' | 'netbanking';

export default function ContributionFlowScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getCampaignById, addContribution } = useCampaigns();

  const campaign = id ? getCampaignById(id) : undefined;

  // Step state
  const [currentStep, setCurrentStep] = useState<ContributionStep>('amount');

  // Amount state
  const [selectedTier, setSelectedTier] = useState<number>(DEFAULT_CONTRIBUTION);
  const [customAmountText, setCustomAmountText] = useState<string>('');
  const [amountError, setAmountError] = useState<string | null>(null);

  // Simulated gateway state
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('upi');
  const [simulationOutcome, setSimulationOutcome] = useState<SimulationOutcome>('success');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingStageText, setProcessingStageText] = useState<string>('Initiating simulated gateway...');

  // Result state
  const [confirmedContribution, setConfirmedContribution] = useState<Contribution | null>(null);

  if (!campaign) {
    return (
      <ScreenContainer>
        <EmptyState
          title="Campaign Not Found"
          description="The campaign you are attempting to amplify is currently unavailable."
          actionTitle="Back to Discover"
          onAction={() => router.back()}
        />
      </ScreenContainer>
    );
  }

  // Active amount calculation
  const rawAmount = customAmountText.trim()
    ? parseInt(customAmountText.replace(/[^0-9]/g, ''), 10) || 0
    : selectedTier;

  const allocation: AllocationBreakdown = calculateAllocation(rawAmount);
  const projectedReach = calculateProjectedReach(rawAmount, campaign.metrics?.cpmRateEstimate || 88);

  const handleSelectTier = (amount: number) => {
    setSelectedTier(amount);
    setCustomAmountText('');
    setAmountError(null);
  };

  const handleCustomAmountChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    setCustomAmountText(cleaned);
    if (!cleaned) {
      setAmountError(null);
      return;
    }
    const val = parseInt(cleaned, 10);
    const validation = validateContributionAmount(val);
    if (!validation.isValid) {
      setAmountError(validation.error || 'Invalid amount');
    } else {
      setAmountError(null);
    }
  };

  const handleProceedToReview = () => {
    const validation = validateContributionAmount(rawAmount);
    if (!validation.isValid) {
      setAmountError(validation.error || 'Please enter a valid amount');
      return;
    }
    setAmountError(null);
    setCurrentStep('review');
  };

  const handleProceedToCheckout = () => {
    setCurrentStep('checkout');
  };

  const handleAuthorizeDemoPayment = async () => {
    setIsProcessing(true);
    setProcessingStageText('Contacting simulated bank issuer...');

    setTimeout(() => {
      setProcessingStageText('Verifying RBI sandbox escrow compliance...');
    }, 600);

    setTimeout(async () => {
      try {
        if (simulationOutcome === 'failure') {
          // Record simulated failed attempt for diagnostic ledger
          await addContribution(campaign.id, rawAmount, {
            status: 'failed',
            paymentMethod: paymentMethod === 'upi' ? 'Demo UPI' : paymentMethod === 'card' ? 'Demo Card' : 'Demo Net Banking',
            allocation,
          });
          setIsProcessing(false);
          setCurrentStep('failed');
        } else {
          // Record successful contribution
          const receipt = await addContribution(campaign.id, rawAmount, {
            status: 'confirmed',
            paymentMethod: paymentMethod === 'upi' ? 'Demo UPI (Instant)' : paymentMethod === 'card' ? 'Visa Sandbox (•••• 4242)' : 'State Bank of India (Simulated)',
            allocation,
          });
          setConfirmedContribution(receipt);
          setIsProcessing(false);
          setCurrentStep('success');
        }
      } catch {
        setIsProcessing(false);
        setCurrentStep('failed');
      }
    }, 1400);
  };

  const handleHeaderBack = () => {
    if (currentStep === 'review') {
      setCurrentStep('amount');
    } else if (currentStep === 'checkout') {
      setCurrentStep('review');
    } else if (currentStep === 'failed') {
      setCurrentStep('checkout');
    } else {
      router.back();
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <TouchableOpacity
          onPress={handleHeaderBack}
          style={styles.backBtn}
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerTitleBox}>
          <AppText variant="labelMicro" color={colors.textSecondary} style={styles.headerDispatchTag}>
            AMPLIFY DISPATCH
          </AppText>
          <AppText variant="headlineSm" color={colors.textPrimary} style={styles.headerTitle} numberOfLines={1}>
            {currentStep === 'amount' && 'Select Amplification Tier'}
            {currentStep === 'review' && 'Broadcast Allocation'}
            {currentStep === 'checkout' && 'Simulated Gateway'}
            {currentStep === 'success' && 'Amplification Confirmed'}
            {currentStep === 'failed' && 'Transaction Status'}
          </AppText>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => router.back()}
        style={styles.closeBtn}
        accessibilityLabel="Close flow"
      >
        <Ionicons name="close" size={22} color={colors.textSecondary} />
      </TouchableOpacity>
    </View>
  );

  return (
    <ScreenContainer header={renderHeader()} withBottomTabPadding={false}>
      {/* =========================================================================
          STEP 1: SELECT AMOUNT (contribution_select_amount)
         ========================================================================= */}
      {currentStep === 'amount' && (
        <View style={styles.flowContainer}>
          {/* Step Progress Tracker */}
          <View style={styles.stepProgressRow}>
            <View style={styles.stepBadgeGroup}>
              <View style={styles.stepNumberBadge}>
                <AppText variant="labelMicro" color={colors.onPrimary}>1</AppText>
              </View>
              <AppText variant="labelMd" color={colors.textSecondary}>
                Step 1 of 3: Select Amount
              </AppText>
            </View>
            <View style={styles.stepPillTrack}>
              <View style={[styles.stepPill, styles.stepPillActive]} />
              <View style={[styles.stepPill, styles.stepPillInactive]} />
              <View style={[styles.stepPill, styles.stepPillInactive]} />
            </View>
          </View>

          {/* Target Campaign Context Card */}
          <View style={[styles.campaignBriefCard, shadows.layer1]}>
            <CampaignImage
              uri={campaign.coverImage || campaign.imageUrl}
              containerStyle={styles.campaignThumbnailBox}
              fallbackIcon="campaign"
            />
            <View style={styles.campaignBriefContent}>
              <View style={styles.briefTagRow}>
                <View style={styles.briefTag}>
                  <AppText variant="labelMicro" color={colors.primaryInk} style={styles.briefTagText}>
                    Verified Civic Action
                  </AppText>
                </View>
              </View>
              <AppText variant="headlineSm" color={colors.textPrimary} numberOfLines={1}>
                {campaign.title}
              </AppText>
              <AppText variant="bodySm" color={colors.textSecondary} numberOfLines={1}>
                by {campaign.creatorName || campaign.creator?.name}
              </AppText>
              <View style={styles.briefFundingRow}>
                <AppText variant="labelMicro" color={colors.primaryInk} style={styles.briefFundedText}>
                  {Math.round(((campaign.raisedAmount ?? campaign.metrics.fundedAmount) / campaign.targetAmount) * 100)}% Funded
                </AppText>
                <AppText variant="labelMicro" color={colors.textSecondary}>
                  ₹{(campaign.raisedAmount ?? campaign.metrics.fundedAmount).toLocaleString('en-IN')} / ₹{campaign.targetAmount.toLocaleString('en-IN')}
                </AppText>
              </View>
            </View>
          </View>

          {/* Educational Disclosure Banner */}
          <View style={styles.disclosureBanner}>
            <View style={styles.disclosureIconCircle}>
              <MaterialIcons name="campaign" size={18} color={colors.primaryInk} />
            </View>
            <View style={styles.disclosureTextContent}>
              <AppText variant="labelMicro" color={colors.primaryInk} style={styles.disclosureTitle}>
                ADVERTISING DISTRIBUTION POOL
              </AppText>
              <AppText variant="bodySm" color={colors.textSecondary} style={styles.disclosureBody}>
                Your contribution purchases verified digital ad reach and civic press distribution to expand this message. Amplifund does not provide charitable donations to individuals.
              </AppText>
            </View>
          </View>

          {/* Preset Selection Grid */}
          <View style={styles.sectionBlock}>
            <View style={styles.sectionTitleRow}>
              <AppText variant="labelMd" color={colors.textSecondary} style={styles.sectionSubTitle}>
                CHOOSE AMPLIFICATION TIER
              </AppText>
              <View style={styles.cpmTag}>
                <MaterialIcons name="tune" size={13} color={colors.primaryInk} />
                <AppText variant="labelMicro" color={colors.primaryInk}>
                  Scaled by verified CPM
                </AppText>
              </View>
            </View>

            <View style={styles.tiersGrid}>
              {CONTRIBUTION_TIERS.map((tier) => {
                const isSelected = selectedTier === tier.amount && !customAmountText;
                return (
                  <TouchableOpacity
                    key={tier.amount}
                    style={[
                      styles.tierCard,
                      shadows.layer1,
                      isSelected && styles.tierCardSelected,
                    ]}
                    onPress={() => handleSelectTier(tier.amount)}
                    activeOpacity={0.8}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                  >
                    <View style={styles.tierHeaderRow}>
                      <View style={styles.tierAmountRow}>
                        <AppText variant="headlineMd" color={colors.textPrimary} style={styles.tierAmountText}>
                          ₹{tier.amount}
                        </AppText>
                        {tier.isPopular && (
                          <View style={styles.popularBadge}>
                            <AppText variant="labelMicro" color={colors.primaryInk} style={styles.popularText}>
                              Popular
                            </AppText>
                          </View>
                        )}
                      </View>
                      <View style={[styles.checkCircle, isSelected && styles.checkCircleSelected]}>
                        {isSelected && <MaterialIcons name="check" size={12} color={colors.onPrimary} />}
                      </View>
                    </View>

                    <View style={styles.tierFooter}>
                      <AppText variant="labelMicro" color={colors.textSecondary}>EST. REACH</AppText>
                      <AppText variant="bodySm" color={colors.textPrimary} numberOfLines={2} style={styles.tierReachText}>
                        {tier.reachLabel}
                      </AppText>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Custom Contribution Input */}
          <View style={[styles.customInputCard, shadows.layer1]}>
            <AppText variant="labelMicro" color={colors.textSecondary} style={styles.customInputLabel}>
              CUSTOM IMPACT ALLOCATION
            </AppText>
            <View style={styles.inputWrapper}>
              <AppText variant="headlineSm" color={colors.textSecondary} style={styles.currencyPrefix}>
                ₹
              </AppText>
              <TextInput
                style={styles.customInputField}
                keyboardType="numeric"
                placeholder={`Or enter custom amount (Min. ₹${MIN_CONTRIBUTION})`}
                placeholderTextColor={colors.outline}
                value={customAmountText}
                onChangeText={handleCustomAmountChange}
              />
              {customAmountText.length > 0 && (
                <TouchableOpacity
                  onPress={() => handleCustomAmountChange('')}
                  style={styles.clearInputBtn}
                >
                  <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
                </TouchableOpacity>
              )}
            </View>
            {amountError && (
              <View style={styles.errorRow}>
                <MaterialIcons name="info" size={14} color={colors.error} />
                <AppText variant="bodySm" color={colors.error}>
                  {amountError}
                </AppText>
              </View>
            )}
          </View>

          {/* Dynamic Audience Simulator Card */}
          <View style={styles.simulatorCard}>
            <View style={styles.simulatorHeader}>
              <View style={styles.liveIndicatorRow}>
                <View style={styles.pulsingDot} />
                <AppText variant="labelMicro" color={colors.textSecondary}>
                  LIVE DELIVERY PROJECTION
                </AppText>
              </View>
              <AppText variant="headlineSm" color={colors.primaryInk} style={styles.simAmountHighlight}>
                ₹{rawAmount.toLocaleString('en-IN')}
              </AppText>
            </View>

            <View style={styles.simMetricsBox}>
              <View style={styles.simMetricItem}>
                <MaterialIcons name="groups" size={16} color={colors.primaryInk} />
                <View style={styles.simMetricTextGroup}>
                  <AppText variant="labelMicro" color={colors.textSecondary}>EST. ADVERTISING REACH</AppText>
                  <AppText variant="headlineSm" color={colors.textPrimary}>
                    {projectedReach.formattedReach} citizens
                  </AppText>
                </View>
              </View>
            </View>
          </View>

          {/* Continue Button */}
          <TouchableOpacity
            style={[
              styles.primaryActionBtn,
              (rawAmount < MIN_CONTRIBUTION || Boolean(amountError)) && styles.actionBtnDisabled,
            ]}
            onPress={handleProceedToReview}
            disabled={rawAmount < MIN_CONTRIBUTION || Boolean(amountError)}
            activeOpacity={0.85}
          >
            <AppText variant="headlineSm" color={colors.onPrimary} style={styles.actionBtnText}>
              Review Allocation Breakdown
            </AppText>
            <Ionicons name="arrow-forward" size={18} color={colors.onPrimary} />
          </TouchableOpacity>
        </View>
      )}

      {/* =========================================================================
          STEP 2: REVIEW ALLOCATION (contribution_review_allocation)
         ========================================================================= */}
      {currentStep === 'review' && (
        <View style={styles.flowContainer}>
          {/* Step Progress Tracker */}
          <View style={styles.stepProgressRow}>
            <View style={styles.stepBadgeGroup}>
              <View style={styles.stepNumberBadge}>
                <AppText variant="labelMicro" color={colors.onPrimary}>2</AppText>
              </View>
              <AppText variant="labelMd" color={colors.primaryInk} style={styles.stepLabelBold}>
                Step 2 of 3: Allocation Review
              </AppText>
            </View>
            <View style={styles.stepPillTrack}>
              <View style={[styles.stepPill, styles.stepPillActive]} />
              <View style={[styles.stepPill, styles.stepPillActive]} />
              <View style={[styles.stepPill, styles.stepPillInactive]} />
            </View>
          </View>

          {/* Campaign Reference Brief */}
          <View style={[styles.reviewBriefCard, shadows.layer1]}>
            <View style={styles.reviewBriefHeader}>
              <View style={styles.reviewCategoryPill}>
                <AppText variant="labelMicro" color={colors.onSurfaceVariant} style={styles.categoryPillText}>
                  {campaign.categoryLabel}
                </AppText>
              </View>
              <View style={styles.verifiedDossierTag}>
                <MaterialIcons name="verified" size={15} color={colors.primaryInk} />
                <AppText variant="labelMicro" color={colors.primaryInk} style={styles.verifiedDossierText}>
                  Verified Dossier
                </AppText>
              </View>
            </View>

            <View style={styles.reviewBriefBody}>
              <CampaignImage
                uri={campaign.coverImage || campaign.imageUrl}
                containerStyle={styles.reviewThumb}
                fallbackIcon="campaign"
              />
              <View style={styles.reviewBriefDetails}>
                <AppText variant="headlineMd" color={colors.textPrimary} numberOfLines={2} style={styles.reviewTitle}>
                  {campaign.title}
                </AppText>
                <AppText variant="bodySm" color={colors.textSecondary}>
                  Lead Steward: <AppText variant="bodySm" color={colors.textPrimary} style={styles.stewardBold}>{campaign.creatorName || campaign.creator?.name}</AppText>
                </AppText>
              </View>
            </View>
          </View>

          {/* Itemized Distribution Allocation Card */}
          <View style={[styles.itemizedCard, shadows.layer1]}>
            <View style={styles.itemizedHeader}>
              <View>
                <AppText variant="headlineSm" color={colors.textPrimary}>
                  Itemized Distribution Allocation
                </AppText>
                <AppText variant="bodySm" color={colors.textSecondary}>
                  Audited civic broadcast schedule
                </AppText>
              </View>
              <View style={styles.itemizedIconCircle}>
                <MaterialIcons name="receipt-long" size={18} color={colors.primaryInk} />
              </View>
            </View>

            <View style={styles.grossRow}>
              <View>
                <AppText variant="bodyMd" color={colors.textPrimary} style={styles.grossTitle}>
                  Gross Media Contribution
                </AppText>
                <AppText variant="labelMicro" color={colors.textSecondary}>
                  COMMITTED POOL TRANCHE
                </AppText>
              </View>
              <AppText variant="headlineSm" color={colors.textPrimary} style={styles.grossAmount}>
                ₹{allocation.grossAmount.toFixed(2)}
              </AppText>
            </View>

            {/* Sub-item breakdowns */}
            <View style={styles.breakdownSubBox}>
              <View style={styles.breakdownItem}>
                <View style={styles.breakdownItemLeft}>
                  <View style={[styles.dotIndicator, { backgroundColor: colors.primaryInk }]} />
                  <View style={styles.breakdownTextGroup}>
                    <AppText variant="bodySm" color={colors.textPrimary} style={styles.breakdownItemTitle}>
                      Targeted Ad Inventory (88%)
                    </AppText>
                    <AppText variant="bodySm" color={colors.textSecondary} style={styles.breakdownItemDesc}>
                      Direct Meta & local news digital feed syndication
                    </AppText>
                  </View>
                </View>
                <AppText variant="bodySm" color={colors.textPrimary} style={styles.breakdownValue}>
                  ₹{allocation.adSpend.toFixed(2)}
                </AppText>
              </View>

              <View style={styles.breakdownItem}>
                <View style={styles.breakdownItemLeft}>
                  <View style={[styles.dotIndicator, { backgroundColor: colors.tertiary }]} />
                  <View style={styles.breakdownTextGroup}>
                    <AppText variant="bodySm" color={colors.textPrimary} style={styles.breakdownItemTitle}>
                      Independent Evidence Verification (8%)
                    </AppText>
                    <AppText variant="bodySm" color={colors.textSecondary} style={styles.breakdownItemDesc}>
                      Academic peer-review & regional fact-checking desk
                    </AppText>
                  </View>
                </View>
                <AppText variant="bodySm" color={colors.textPrimary} style={styles.breakdownValue}>
                  ₹{allocation.verificationFee.toFixed(2)}
                </AppText>
              </View>

              <View style={styles.breakdownItem}>
                <View style={styles.breakdownItemLeft}>
                  <View style={[styles.dotIndicator, { backgroundColor: colors.outline }]} />
                  <View style={styles.breakdownTextGroup}>
                    <AppText variant="bodySm" color={colors.textPrimary} style={styles.breakdownItemTitle}>
                      Secure Escrow & Gateway Fee (4%)
                    </AppText>
                    <AppText variant="bodySm" color={colors.textSecondary} style={styles.breakdownItemDesc}>
                      Encrypted UPI settlement and custodial compliance
                    </AppText>
                  </View>
                </View>
                <AppText variant="bodySm" color={colors.textPrimary} style={styles.breakdownValue}>
                  ₹{allocation.gatewayFee.toFixed(2)}
                </AppText>
              </View>
            </View>

            {/* Total Payable Box */}
            <View style={styles.totalPayableBox}>
              <View style={styles.totalPayableLeft}>
                <AppText variant="labelMicro" color={colors.textSecondary}>TOTAL PAYABLE AMOUNT</AppText>
                <AppText variant="bodySm" color={colors.textSecondary}>Includes all statutory ledger costs</AppText>
              </View>
              <AppText variant="headlineLg" color={colors.primaryInk} style={styles.totalPayableAmount} numberOfLines={1} adjustsFontSizeToFit>
                ₹{allocation.totalPayable.toLocaleString('en-IN')}
              </AppText>
            </View>
          </View>

          {/* Estimated Distribution Impact Summary */}
          <View style={[styles.impactCard, shadows.layer1]}>
            <View style={styles.impactHeader}>
              <MaterialIcons name="equalizer" size={18} color={colors.primaryInk} />
              <AppText variant="headlineSm" color={colors.textPrimary}>
                Estimated Distribution Impact
              </AppText>
            </View>

            <View style={styles.impactGrid}>
              <View style={styles.impactCol}>
                <AppText variant="labelMicro" color={colors.textSecondary}>PROJECTED REACH</AppText>
                <AppText variant="headlineMd" color={colors.primaryInk}>
                  {projectedReach.formattedReach}
                </AppText>
                <AppText variant="bodySm" color={colors.textSecondary}>verified impressions</AppText>
              </View>

              <View style={styles.impactCol}>
                <AppText variant="labelMicro" color={colors.textSecondary}>GEO-TARGET</AppText>
                <AppText variant="bodySm" color={colors.textPrimary} style={styles.geoBold} numberOfLines={1}>
                  {campaign.targetRegion || 'Wards 14–28'}
                </AppText>
                <AppText variant="bodySm" color={colors.textSecondary}>High Priority Corridors</AppText>
              </View>
            </View>
          </View>

          {/* Action Row */}
          <View style={styles.buttonStack}>
            <TouchableOpacity
              style={styles.primaryActionBtn}
              onPress={handleProceedToCheckout}
              activeOpacity={0.85}
            >
              <MaterialIcons name="lock" size={18} color={colors.onPrimary} />
              <AppText variant="headlineSm" color={colors.onPrimary} style={styles.actionBtnText}>
                Proceed to Demo Checkout
              </AppText>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryActionBtn}
              onPress={() => setCurrentStep('amount')}
              activeOpacity={0.85}
            >
              <AppText variant="headlineSm" color={colors.primaryInk}>
                Modify Contribution Amount
              </AppText>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* =========================================================================
          STEP 3: SIMULATED CHECKOUT (contribution_simulated_gateway)
         ========================================================================= */}
      {currentStep === 'checkout' && (
        <View style={styles.flowContainer}>
          {/* Step Progress Tracker */}
          <View style={styles.stepProgressRow}>
            <View style={styles.stepBadgeGroup}>
              <View style={styles.stepNumberBadge}>
                <AppText variant="labelMicro" color={colors.onPrimary}>3</AppText>
              </View>
              <AppText variant="labelMd" color={colors.primaryInk} style={styles.stepLabelBold}>
                Step 3 of 3: Simulated Payment
              </AppText>
            </View>
            <View style={styles.stepPillTrack}>
              <View style={[styles.stepPill, styles.stepPillActive]} />
              <View style={[styles.stepPill, styles.stepPillActive]} />
              <View style={[styles.stepPill, styles.stepPillActive]} />
            </View>
          </View>

          {/* Amber Sandbox Notice Banner */}
          <View style={styles.sandboxBanner}>
            <MaterialIcons name="terminal" size={20} color={colors.tertiary} style={styles.sandboxIcon} />
            <View style={styles.sandboxContent}>
              <AppText variant="labelMicro" color={colors.tertiary} style={styles.sandboxTag}>
                SANDBOX ENVIRONMENT • SIMULATED CHECKOUT
              </AppText>
              <AppText variant="bodySm" color={colors.textPrimary} style={styles.sandboxDesc}>
                No real money, cards, or bank accounts will be charged. This demonstrates the transaction authorization flow for the Amplifund hackathon prototype.
              </AppText>
            </View>
          </View>

          {/* Interactive Simulation Preset Switcher */}
          <View style={[styles.presetSwitcherCard, shadows.layer1]}>
            <View style={styles.presetSwitcherHeader}>
              <View style={styles.presetLabelGroup}>
                <MaterialIcons name="tune" size={14} color={colors.primaryInk} />
                <AppText variant="labelMicro" color={colors.textSecondary}>
                  SIMULATION OUTCOME PRESET
                </AppText>
              </View>
              <View style={[styles.outcomeStatusPill, simulationOutcome === 'success' ? styles.pillSuccess : styles.pillFailure]}>
                <AppText variant="labelMicro" color={simulationOutcome === 'success' ? colors.primaryInk : colors.error}>
                  {simulationOutcome === 'success' ? 'Simulate Approval' : 'Simulate Failure'}
                </AppText>
              </View>
            </View>

            <View style={styles.presetButtonsRow}>
              <TouchableOpacity
                style={[styles.presetChoiceBtn, simulationOutcome === 'success' && styles.presetChoiceBtnActive]}
                onPress={() => setSimulationOutcome('success')}
              >
                <View style={[styles.choiceDot, simulationOutcome === 'success' && styles.choiceDotSuccess]} />
                <AppText variant="labelMd" color={simulationOutcome === 'success' ? colors.primaryInk : colors.textSecondary}>
                  Success Simulation
                </AppText>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.presetChoiceBtn, simulationOutcome === 'failure' && styles.presetChoiceBtnActive]}
                onPress={() => setSimulationOutcome('failure')}
              >
                <View style={[styles.choiceDot, simulationOutcome === 'failure' && styles.choiceDotFailure]} />
                <AppText variant="labelMd" color={simulationOutcome === 'failure' ? colors.error : colors.textSecondary}>
                  Decline Simulation
                </AppText>
              </TouchableOpacity>
            </View>
          </View>

          {/* Payment Overview Card */}
          <View style={[styles.overviewCard, shadows.layer1]}>
            <View style={styles.overviewTop}>
              <View style={styles.payeeGroup}>
                <View style={styles.payeeIconBox}>
                  <MaterialIcons name="account-balance" size={20} color={colors.primaryInk} />
                </View>
                <View style={styles.payeeTextBox}>
                  <AppText variant="labelMicro" color={colors.textSecondary}>PAYEE & CUSTODY</AppText>
                  <AppText variant="headlineSm" color={colors.textPrimary} numberOfLines={1}>
                    Amplify Escrow Custody
                  </AppText>
                  <AppText variant="bodySm" color={colors.textSecondary} numberOfLines={1}>
                    {campaign.title}
                  </AppText>
                </View>
              </View>

              <View style={styles.overviewAmountBox}>
                <AppText variant="labelMicro" color={colors.textSecondary}>AMOUNT</AppText>
                <AppText variant="headlineLg" color={colors.primaryInk} style={styles.overviewAmountText} numberOfLines={1} adjustsFontSizeToFit>
                  ₹{rawAmount.toLocaleString('en-IN')}
                </AppText>
              </View>
            </View>

            <View style={styles.escrowGuaranteeRow}>
              <MaterialIcons name="verified" size={15} color={colors.primaryInk} />
              <AppText variant="bodySm" color={colors.primaryInk} style={styles.escrowGuaranteeText}>
                Secured by Statutory Escrow (RBI Sandbox Guidelines)
              </AppText>
            </View>
          </View>

          {/* Payment Method Selector (Demo Instruments) */}
          <View style={styles.methodSection}>
            <AppText variant="labelMd" color={colors.textSecondary} style={styles.methodSectionTitle}>
              SELECT DEMO PAYMENT INSTRUMENT
            </AppText>

            <View style={styles.methodList}>
              {/* Option 1: Demo UPI */}
              <TouchableOpacity
                style={[styles.methodCard, paymentMethod === 'upi' && styles.methodCardActive]}
                onPress={() => setPaymentMethod('upi')}
                activeOpacity={0.8}
              >
                <View style={styles.methodLeft}>
                  <View style={[styles.radioCircle, paymentMethod === 'upi' && styles.radioCircleActive]}>
                    {paymentMethod === 'upi' && <View style={styles.radioInner} />}
                  </View>
                  <View style={styles.methodBadgeUpi}>
                    <AppText variant="labelMicro" color={colors.primaryInk} style={styles.upiBadgeText}>UPI</AppText>
                  </View>
                  <View>
                    <AppText variant="headlineSm" color={colors.textPrimary} style={styles.methodTitle}>
                      Demo UPI / Instant VPA
                    </AppText>
                    <AppText variant="bodySm" color={colors.textSecondary} style={styles.vpaSubtitle}>
                      civic.backer@okaxis
                    </AppText>
                  </View>
                </View>
                <View style={styles.instantTag}>
                  <AppText variant="labelMicro" color={colors.primaryInk}>Instant</AppText>
                </View>
              </TouchableOpacity>

              {/* Option 2: Mock Card */}
              <TouchableOpacity
                style={[styles.methodCard, paymentMethod === 'card' && styles.methodCardActive]}
                onPress={() => setPaymentMethod('card')}
                activeOpacity={0.8}
              >
                <View style={styles.methodLeft}>
                  <View style={[styles.radioCircle, paymentMethod === 'card' && styles.radioCircleActive]}>
                    {paymentMethod === 'card' && <View style={styles.radioInner} />}
                  </View>
                  <View style={styles.methodIconBox}>
                    <MaterialIcons name="credit-card" size={20} color={colors.textSecondary} />
                  </View>
                  <View>
                    <AppText variant="headlineSm" color={colors.textPrimary} style={styles.methodTitle}>
                      Demo Card (Sandbox)
                    </AppText>
                    <AppText variant="bodySm" color={colors.textSecondary} style={styles.vpaSubtitle}>
                      Visa Sandbox ending in •••• 4242
                    </AppText>
                  </View>
                </View>
                <AppText variant="labelMicro" color={colors.textSecondary}>Mock CVV</AppText>
              </TouchableOpacity>

              {/* Option 3: Net Banking */}
              <TouchableOpacity
                style={[styles.methodCard, paymentMethod === 'netbanking' && styles.methodCardActive]}
                onPress={() => setPaymentMethod('netbanking')}
                activeOpacity={0.8}
              >
                <View style={styles.methodLeft}>
                  <View style={[styles.radioCircle, paymentMethod === 'netbanking' && styles.radioCircleActive]}>
                    {paymentMethod === 'netbanking' && <View style={styles.radioInner} />}
                  </View>
                  <View style={styles.methodIconBox}>
                    <MaterialIcons name="domain" size={20} color={colors.textSecondary} />
                  </View>
                  <View>
                    <AppText variant="headlineSm" color={colors.textPrimary} style={styles.methodTitle}>
                      Demo Net Banking
                    </AppText>
                    <AppText variant="bodySm" color={colors.textSecondary} style={styles.vpaSubtitle}>
                      State Bank of India (Simulated Gateway)
                    </AppText>
                  </View>
                </View>
                <AppText variant="labelMicro" color={colors.textSecondary}>Mock IFSC</AppText>
              </TouchableOpacity>
            </View>
          </View>

          {/* Authorize Action Button */}
          <TouchableOpacity
            style={[styles.primaryActionBtn, isProcessing && styles.actionBtnDisabled]}
            onPress={handleAuthorizeDemoPayment}
            disabled={isProcessing}
            activeOpacity={0.85}
          >
            {isProcessing ? (
              <View style={styles.processingBtnContent}>
                <ActivityIndicator color={colors.onPrimary} size="small" />
                <AppText variant="headlineSm" color={colors.onPrimary} style={styles.actionBtnText}>
                  {processingStageText}
                </AppText>
              </View>
            ) : (
              <>
                <MaterialIcons name="verified-user" size={18} color={colors.onPrimary} />
                <AppText variant="headlineSm" color={colors.onPrimary} style={styles.actionBtnText} numberOfLines={1} adjustsFontSizeToFit>
                  Authorize Demo Payment • ₹{rawAmount.toLocaleString('en-IN')}
                </AppText>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* =========================================================================
          STEP 4A: SUCCESS CONFIRMATION
         ========================================================================= */}
      {currentStep === 'success' && (
        <View style={styles.flowContainer}>
          <View style={[styles.successResultCard, shadows.layer2]}>
            <View style={styles.successIconOuterCircle}>
              <MaterialIcons name="check-circle" size={48} color={colors.amplified} />
            </View>

            <View style={styles.successBadgeTag}>
              <AppText variant="labelMicro" color={colors.amplified} style={styles.successBadgeText}>
                BROADCAST ALLOCATION CONFIRMED
              </AppText>
            </View>

            <AppText variant="headlineLg" color={colors.textPrimary} style={styles.successTitle}>
              You Joined the Distribution Pool!
            </AppText>

            <AppText variant="bodyMd" color={colors.textSecondary} style={styles.successLead}>
              Your commitment of <AppText variant="bodyMd" color={colors.primaryInk} style={styles.stewardBold}>₹{rawAmount.toLocaleString('en-IN')}</AppText> has been scheduled for hyper-local ad syndication.
            </AppText>

            {/* Itemized Audit Receipt */}
            <View style={styles.receiptContainer}>
              <View style={styles.receiptRow}>
                <AppText variant="labelMicro" color={colors.textSecondary}>TRANSACTION RECEIPT</AppText>
                <AppText variant="labelMd" color={colors.primaryInk} style={styles.receiptMono}>
                  {confirmedContribution?.receiptId || 'REC-654890'}
                </AppText>
              </View>

              <View style={styles.receiptRow}>
                <AppText variant="labelMicro" color={colors.textSecondary}>TARGET CAMPAIGN</AppText>
                <AppText variant="bodySm" color={colors.textPrimary} numberOfLines={1} style={styles.receiptCampaignTitle}>
                  {campaign.title}
                </AppText>
              </View>

              <View style={styles.receiptRow}>
                <AppText variant="labelMicro" color={colors.textSecondary}>ESTIMATED AUDIENCE IMPACT</AppText>
                <AppText variant="labelMd" color={colors.primaryInk} style={styles.stewardBold}>
                  {projectedReach.formattedReach} Citizens Reached
                </AppText>
              </View>

              <View style={styles.receiptRow}>
                <AppText variant="labelMicro" color={colors.textSecondary}>CLEARING INSTRUMENT</AppText>
                <AppText variant="bodySm" color={colors.textPrimary}>
                  {confirmedContribution?.paymentMethod || 'Demo UPI Sandbox'}
                </AppText>
              </View>

              <View style={styles.receiptRow}>
                <AppText variant="labelMicro" color={colors.textSecondary}>TIMESTAMP</AppText>
                <AppText variant="bodySm" color={colors.textSecondary}>
                  {new Date().toLocaleTimeString()} • {new Date().toLocaleDateString()}
                </AppText>
              </View>
            </View>

            {/* Actions */}
            <View style={styles.buttonStack}>
              <TouchableOpacity
                style={styles.primaryActionBtn}
                onPress={() => router.replace(`/campaign/${campaign.id}`)}
                activeOpacity={0.85}
              >
                <AppText variant="headlineSm" color={colors.onPrimary} style={styles.actionBtnText}>
                  Return to Campaign Dossier
                </AppText>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryActionBtn}
                onPress={() => router.replace('/explore')}
                activeOpacity={0.85}
              >
                <AppText variant="headlineSm" color={colors.primaryInk}>
                  Explore Other Broadcasts
                </AppText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* =========================================================================
          STEP 4B: SIMULATED FAILURE (contribution_authorization_failed)
         ========================================================================= */}
      {currentStep === 'failed' && (
        <View style={styles.flowContainer}>
          <View style={[styles.failureCard, shadows.layer2]}>
            <View style={styles.failureIconOuterCircle}>
              <MaterialIcons name="priority-high" size={36} color={colors.error} />
            </View>

            <View style={styles.failureBadgeTag}>
              <AppText variant="labelMicro" color={colors.error} style={styles.failureBadgeText}>
                SETTLEMENT INTERRUPTED
              </AppText>
            </View>

            <AppText variant="headlineLg" color={colors.textPrimary} style={styles.failureTitle}>
              Authorization Could Not Be Completed
            </AppText>

            <AppText variant="bodySm" color={colors.textSecondary} style={styles.failureSubtitle}>
              The simulated banking gateway was unable to secure escrow clearing for this test contribution.
            </AppText>

            {/* Diagnostic Details Box */}
            <View style={styles.diagnosticBox}>
              <View style={styles.diagnosticHeader}>
                <View style={styles.diagTitleLeft}>
                  <MaterialIcons name="info" size={15} color={colors.error} />
                  <AppText variant="labelMicro" color={colors.error}>DIAGNOSTIC LEDGER</AppText>
                </View>
                <View style={styles.errorCodeTag}>
                  <AppText variant="labelMicro" color={colors.textSecondary} style={styles.receiptMono}>
                    ERR_504
                  </AppText>
                </View>
              </View>

              <View style={styles.diagRow}>
                <AppText variant="bodySm" color={colors.textSecondary}>Error Code:</AppText>
                <AppText variant="bodySm" color={colors.textPrimary} style={styles.receiptMono}>
                  ERR_GATEWAY_TIMEOUT (504)
                </AppText>
              </View>

              <View style={styles.diagReasonBox}>
                <AppText variant="labelMicro" color={colors.textSecondary}>REPORTED REASON:</AppText>
                <AppText variant="bodySm" color={colors.textPrimary}>
                  Simulated bank server response timed out during 3D secure verification. Zero charges were deducted.
                </AppText>
              </View>

              <View style={styles.diagRow}>
                <AppText variant="bodySm" color={colors.textSecondary}>Attempted Amount:</AppText>
                <AppText variant="headlineSm" color={colors.textPrimary}>₹{rawAmount.toFixed(2)}</AppText>
              </View>
            </View>

            {/* Invariant Guarantee Notice */}
            <View style={styles.guaranteeNotice}>
              <MaterialIcons name="verified-user" size={18} color={colors.primaryInk} />
              <View style={styles.guaranteeContent}>
                <AppText variant="headlineSm" color={colors.textPrimary} style={styles.guaranteeHeading}>
                  Escrow Invariant Guarantee
                </AppText>
                <AppText variant="bodySm" color={colors.textSecondary} style={styles.guaranteeBody}>
                  Zero funds were deducted from your account. Your selected tier (₹{rawAmount}) has been saved so you don&apos;t have to re-enter your details.
                </AppText>
              </View>
            </View>

            {/* Recovery Buttons */}
            <View style={styles.buttonStack}>
              <TouchableOpacity
                style={styles.primaryActionBtn}
                onPress={() => {
                  setSimulationOutcome('success');
                  setCurrentStep('checkout');
                }}
                activeOpacity={0.85}
              >
                <MaterialIcons name="refresh" size={18} color={colors.onPrimary} />
                <AppText variant="headlineSm" color={colors.onPrimary} style={styles.actionBtnText}>
                  Retry with Mock Approval
                </AppText>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryActionBtn}
                onPress={() => setCurrentStep('amount')}
                activeOpacity={0.85}
              >
                <MaterialIcons name="swap-horiz" size={18} color={colors.primaryInk} />
                <AppText variant="headlineSm" color={colors.primaryInk}>
                  Change Amount / Tier
                </AppText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
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
    gap: spacing.xs + 2,
    flex: 1,
  },
  backBtn: {
    padding: 4,
  },
  headerTitleBox: {
    flex: 1,
  },
  headerDispatchTag: {
    letterSpacing: 0.8,
  },
  headerTitle: {
    fontWeight: '700',
    fontSize: 16,
  },
  closeBtn: {
    padding: 4,
  },
  flowContainer: {
    paddingVertical: spacing.xs,
    paddingBottom: spacing.xl,
  },
  stepProgressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    marginTop: spacing.xs,
  },
  stepBadgeGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  stepNumberBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primaryInk,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepLabelBold: {
    fontWeight: '700',
  },
  stepPillTrack: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  stepPill: {
    height: 6,
    borderRadius: 3,
  },
  stepPillActive: {
    width: 20,
    backgroundColor: colors.primaryInk,
  },
  stepPillInactive: {
    width: 8,
    backgroundColor: colors.secondaryContainerSoft,
  },
  campaignBriefCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.card,
    borderWidth: 1,
    borderColor: colors.containmentBorder,
    padding: spacing.sm + 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  campaignThumbnailBox: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  campaignBriefContent: {
    flex: 1,
    minWidth: 0,
  },
  briefTagRow: {
    marginBottom: 2,
  },
  briefTag: {
    backgroundColor: colors.primaryFixed,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: borderRadius.sm,
    alignSelf: 'flex-start',
  },
  briefTagText: {
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  briefFundingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  briefFundedText: {
    fontWeight: '700',
  },
  disclosureBanner: {
    backgroundColor: colors.secondaryContainerSoft,
    borderRadius: borderRadius.md,
    padding: spacing.sm + 2,
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  disclosureIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surfaceContainerLowest,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  disclosureTextContent: {
    flex: 1,
  },
  disclosureTitle: {
    fontWeight: '700',
    letterSpacing: 0.6,
    marginBottom: 2,
  },
  disclosureBody: {
    lineHeight: 18,
  },
  sectionBlock: {
    marginBottom: spacing.md,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sectionSubTitle: {
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  cpmTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tiersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tierCard: {
    width: '48.5%',
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.card,
    borderWidth: 1,
    borderColor: colors.containmentBorder,
    padding: spacing.sm + 2,
    minHeight: 105,
    justifyContent: 'space-between',
  },
  tierCardSelected: {
    borderColor: colors.primaryInk,
    borderWidth: 2,
    backgroundColor: colors.surfaceContainerLow,
  },
  tierHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  tierAmountRow: {
    gap: 2,
  },
  tierAmountText: {
    fontWeight: '700',
    lineHeight: 24,
  },
  popularBadge: {
    backgroundColor: colors.primaryFixed,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
  },
  popularText: {
    fontWeight: '700',
  },
  checkCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: colors.outline,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkCircleSelected: {
    backgroundColor: colors.primaryInk,
    borderColor: colors.primaryInk,
  },
  tierFooter: {
    marginTop: 6,
  },
  tierReachText: {
    fontWeight: '600',
    lineHeight: 16,
  },
  customInputCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.card,
    borderWidth: 1,
    borderColor: colors.containmentBorder,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  customInputLabel: {
    fontWeight: '700',
    letterSpacing: 0.6,
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.sm + 2,
    height: 48,
    borderWidth: 1,
    borderColor: colors.containmentBorder,
  },
  currencyPrefix: {
    fontWeight: '700',
    marginRight: 6,
  },
  customInputField: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  clearInputBtn: {
    padding: 4,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  simulatorCard: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: borderRadius.card,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  simulatorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs + 2,
  },
  liveIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pulsingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primaryInk,
  },
  simAmountHighlight: {
    fontWeight: '700',
  },
  simMetricsBox: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.md,
    padding: spacing.sm + 2,
  },
  simMetricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  simMetricTextGroup: {
    flex: 1,
  },
  primaryActionBtn: {
    backgroundColor: colors.primaryContainer,
    borderRadius: borderRadius.button,
    borderWidth: 1,
    borderColor: '#1E4E39',
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: spacing.md,
  },
  actionBtnDisabled: {
    opacity: 0.5,
  },
  actionBtnText: {
    color: colors.onPrimary,
    fontWeight: '700',
    fontSize: 15,
  },
  secondaryActionBtn: {
    backgroundColor: colors.secondaryContainerSoft,
    borderRadius: borderRadius.button,
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: spacing.md,
  },
  buttonStack: {
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  // Step 2 Review Styles
  reviewBriefCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.card,
    borderWidth: 1,
    borderColor: colors.containmentBorder,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  reviewBriefHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  reviewCategoryPill: {
    backgroundColor: colors.secondaryContainerSoft,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  categoryPillText: {
    fontWeight: '700',
  },
  verifiedDossierTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  verifiedDossierText: {
    fontWeight: '700',
  },
  reviewBriefBody: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
  },
  reviewThumb: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  reviewBriefDetails: {
    flex: 1,
  },
  reviewTitle: {
    lineHeight: 22,
    marginBottom: 2,
  },
  stewardBold: {
    fontWeight: '600',
  },
  itemizedCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.card,
    borderWidth: 1,
    borderColor: colors.containmentBorder,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  itemizedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceContainer,
    paddingBottom: spacing.sm,
    marginBottom: spacing.sm,
  },
  itemizedIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surfaceContainerLow,
    justifyContent: 'center',
    alignItems: 'center',
  },
  grossRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  grossTitle: {
    fontWeight: '600',
  },
  grossAmount: {
    fontWeight: '700',
  },
  breakdownSubBox: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  breakdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  breakdownItemLeft: {
    flexDirection: 'row',
    gap: 8,
    flex: 1,
    marginRight: 8,
  },
  dotIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 5,
  },
  breakdownTextGroup: {
    flex: 1,
  },
  breakdownItemTitle: {
    fontWeight: '600',
  },
  breakdownItemDesc: {
    lineHeight: 16,
    marginTop: 1,
  },
  breakdownValue: {
    fontWeight: '600',
  },
  totalPayableBox: {
    backgroundColor: colors.surfaceContainerHigh,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
  },
  totalPayableLeft: {
    flex: 1,
    minWidth: 0,
  },
  totalPayableAmount: {
    fontWeight: '800',
    fontSize: 24,
    lineHeight: 30,
    flexShrink: 0,
  },
  impactCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.card,
    borderWidth: 1,
    borderColor: colors.containmentBorder,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  impactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: spacing.sm,
  },
  impactGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  impactCol: {
    flex: 1,
    backgroundColor: colors.surfaceContainerLow,
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    gap: 2,
  },
  geoBold: {
    fontWeight: '600',
  },
  // Step 3 Checkout Styles
  sandboxBanner: {
    backgroundColor: colors.tertiaryFixed,
    borderRadius: borderRadius.card,
    padding: spacing.md,
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  sandboxIcon: {
    marginTop: 2,
  },
  sandboxContent: {
    flex: 1,
  },
  sandboxTag: {
    fontWeight: '800',
    letterSpacing: 0.6,
    marginBottom: 2,
  },
  sandboxDesc: {
    lineHeight: 18,
    fontWeight: '500',
  },
  presetSwitcherCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.card,
    borderWidth: 1,
    borderColor: colors.containmentBorder,
    padding: spacing.sm + 2,
    marginBottom: spacing.md,
  },
  presetSwitcherHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs + 2,
  },
  presetLabelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  outcomeStatusPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  pillSuccess: {
    backgroundColor: colors.primaryFixed,
  },
  pillFailure: {
    backgroundColor: colors.errorContainer,
  },
  presetButtonsRow: {
    flexDirection: 'row',
    gap: spacing.xs + 2,
  },
  presetChoiceBtn: {
    flex: 1,
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: borderRadius.sm,
    paddingVertical: 8,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  presetChoiceBtnActive: {
    backgroundColor: colors.surfaceContainerHighest,
  },
  choiceDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  choiceDotSuccess: {
    backgroundColor: colors.primaryInk,
  },
  choiceDotFailure: {
    backgroundColor: colors.error,
  },
  overviewCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.card,
    borderWidth: 1,
    borderColor: colors.containmentBorder,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  overviewTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  payeeGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 4,
    flex: 1,
    minWidth: 0,
  },
  payeeIconBox: {
    width: 38,
    height: 38,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceContainerLow,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  payeeTextBox: {
    flex: 1,
    minWidth: 0,
  },
  overviewAmountBox: {
    alignItems: 'flex-end',
    flexShrink: 0,
    maxWidth: 120,
  },
  overviewAmountText: {
    fontWeight: '800',
    fontSize: 22,
    lineHeight: 28,
  },
  escrowGuaranteeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceContainer,
    paddingTop: spacing.xs + 2,
  },
  escrowGuaranteeText: {
    fontWeight: '600',
    fontSize: 12,
  },
  methodSection: {
    marginBottom: spacing.lg,
  },
  methodSectionTitle: {
    fontWeight: '700',
    letterSpacing: 0.6,
    marginBottom: spacing.xs + 2,
  },
  methodList: {
    gap: spacing.xs + 2,
  },
  methodCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.containmentBorder,
    padding: spacing.sm + 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  methodCardActive: {
    borderColor: colors.primaryInk,
    backgroundColor: colors.surfaceContainerLow,
  },
  methodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: colors.outline,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioCircleActive: {
    borderColor: colors.primaryInk,
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primaryInk,
  },
  methodBadgeUpi: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.primaryFixed,
    justifyContent: 'center',
    alignItems: 'center',
  },
  upiBadgeText: {
    fontWeight: '800',
  },
  methodIconBox: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.surfaceContainerHigh,
    justifyContent: 'center',
    alignItems: 'center',
  },
  methodTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  vpaSubtitle: {
    fontSize: 12,
  },
  instantTag: {
    backgroundColor: colors.primaryFixed,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  processingBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  // Step 4A Success Styles
  successResultCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.card,
    borderWidth: 1,
    borderColor: colors.containmentBorder,
    padding: spacing.lg,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  successIconOuterCircle: {
    marginBottom: spacing.sm,
  },
  successBadgeTag: {
    backgroundColor: colors.secondaryContainerSoft,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
    marginBottom: spacing.xs,
  },
  successBadgeText: {
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  successTitle: {
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  successLead: {
    textAlign: 'center',
    marginBottom: spacing.md,
    lineHeight: 22,
  },
  receiptContainer: {
    width: '100%',
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  receiptMono: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontWeight: '700',
  },
  receiptCampaignTitle: {
    flex: 1,
    textAlign: 'right',
    marginLeft: spacing.sm,
  },
  // Step 4B Failure Styles
  failureCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.card,
    borderWidth: 1,
    borderColor: colors.containmentBorder,
    padding: spacing.lg,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  failureIconOuterCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.errorContainer,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  failureBadgeTag: {
    backgroundColor: colors.errorContainer,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
    marginBottom: spacing.xs,
  },
  failureBadgeText: {
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  failureTitle: {
    textAlign: 'center',
    marginBottom: spacing.xs,
    lineHeight: 30,
  },
  failureSubtitle: {
    textAlign: 'center',
    marginBottom: spacing.md,
    lineHeight: 20,
  },
  diagnosticBox: {
    width: '100%',
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    gap: spacing.xs + 2,
    marginBottom: spacing.md,
  },
  diagnosticHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  diagTitleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  errorCodeTag: {
    backgroundColor: colors.surfaceContainerHighest,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: borderRadius.sm,
  },
  diagRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  diagReasonBox: {
    backgroundColor: colors.surfaceContainerLowest,
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
    gap: 2,
  },
  guaranteeNotice: {
    width: '100%',
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: borderRadius.md,
    padding: spacing.sm + 2,
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  guaranteeContent: {
    flex: 1,
  },
  guaranteeHeading: {
    fontSize: 14,
    marginBottom: 2,
  },
  guaranteeBody: {
    lineHeight: 18,
  },
});
