import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppText, Toast } from '../../src/components';
import { colors } from '../../src/theme/colors';
import { spacing, borderRadius, shadows } from '../../src/theme/spacing';
import { Campaign, CampaignDraft } from '../../src/types/campaign';
import { useCampaigns } from '../../src/context/CampaignContext';
import {
  DEFAULT_CAMPAIGN_DRAFT,
  validateStep1Basics,
  validateStep2Story,
  validateStep3Visuals,
  validateStep4Reach,
  validateAllSteps,
} from '../../src/config/campaignCreation';
import {
  WizardHeader,
  Step1Basics,
  Step2Story,
  Step3Visuals,
  Step4Reach,
  Step5Review,
  WizardSuccessModal,
} from '../../src/components/CampaignWizard';

const DRAFT_STORAGE_KEY = '@amplifund_wizard_draft';

const STEP_METADATA: Record<
  number,
  { name: string; subtitle: string; nextLabel: string }
> = {
  1: {
    name: 'Campaign Foundation',
    subtitle: 'Establish the legal entity, verified topic anchor, and initial headline for public broadcast distribution.',
    nextLabel: 'Continue to Story (Step 02)',
  },
  2: {
    name: 'Editorial Dossier Composer',
    subtitle: 'Structure your long-form briefing like an investigative publication with verifiable empirical sources.',
    nextLabel: 'Continue to Visuals (Step 03)',
  },
  3: {
    name: 'Campaign & Ad Creatives',
    subtitle: 'Visually separate your editorial story visuals from advertising creatives tailored for programmatic feeds.',
    nextLabel: 'Continue to Reach (Step 04)',
  },
  4: {
    name: 'Target Audience & Distribution',
    subtitle: 'Define the geographic footprint and syndication channels for your message amplification.',
    nextLabel: 'Continue to Review (Step 05)',
  },
  5: {
    name: 'Review & Finalize Submission',
    subtitle: 'Verify campaign dossier, establish your explicit funding goal, and confirm statutory syndication protocols.',
    nextLabel: 'Submit Campaign for Review',
  },
};

export default function CreateScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);
  const { createCampaign } = useCampaigns();

  const [step, setStep] = useState<number>(1);
  const [draft, setDraft] = useState<CampaignDraft>(DEFAULT_CAMPAIGN_DRAFT);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedCampaign, setSubmittedCampaign] = useState<Campaign | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Load saved draft from AsyncStorage on mount
  useEffect(() => {
    AsyncStorage.getItem(DRAFT_STORAGE_KEY)
      .then((data) => {
        if (data) {
          try {
            const savedDraft: CampaignDraft = JSON.parse(data);
            setDraft((prev) => ({ ...prev, ...savedDraft }));
          } catch {
            // fallback
          }
        }
      })
      .catch(() => {});
  }, []);

  const handleUpdateDraft = (fields: Partial<CampaignDraft>) => {
    setDraft((prev) => {
      const updated = { ...prev, ...fields };
      // Save draft asynchronously without blocking UI
      AsyncStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(updated)).catch(() => {});
      return updated;
    });

    // Clear inline errors for updated fields
    const updatedKeys = Object.keys(fields);
    setErrors((prev) => {
      const nextErrors = { ...prev };
      updatedKeys.forEach((key) => {
        delete nextErrors[key];
      });
      return nextErrors;
    });
  };

  const handleManualSaveDraft = async () => {
    try {
      await AsyncStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
      setToastMessage('Draft progress synchronized to offline ledger.');
    } catch {
      setToastMessage('Unable to save draft locally.');
    }
  };

  const scrollToTop = () => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  // Step Navigation Handlers
  const handleNext = () => {
    let validationResult = { isValid: true, errors: {} as Record<string, string> };

    if (step === 1) {
      validationResult = validateStep1Basics(draft);
    } else if (step === 2) {
      validationResult = validateStep2Story(draft);
    } else if (step === 3) {
      validationResult = validateStep3Visuals(draft);
    } else if (step === 4) {
      validationResult = validateStep4Reach(draft);
    }

    if (!validationResult.isValid) {
      setErrors(validationResult.errors);
      setToastMessage('Please complete all required fields on this step.');
      scrollToTop();
      return;
    }

    setErrors({});
    if (step < 5) {
      setStep((prev) => prev + 1);
      scrollToTop();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
      setErrors({});
      scrollToTop();
    } else {
      router.back();
    }
  };

  const handleJumpToStep = (targetStep: number) => {
    setStep(targetStep);
    setErrors({});
    scrollToTop();
  };

  // Final Submission Handler
  const handleSubmitCampaign = async () => {
    if (isSubmitting) return;

    // Validate all 5 steps
    const validation = validateAllSteps(draft);
    if (!validation.isValid) {
      setErrors(validation.errors);
      if (validation.firstInvalidStep && validation.firstInvalidStep !== step) {
        setStep(validation.firstInvalidStep);
      }
      setToastMessage('Please review and resolve highlighted requirements before submitting.');
      scrollToTop();
      return;
    }

    setIsSubmitting(true);
    try {
      const created = await createCampaign(draft);
      setSubmittedCampaign(created);
      setShowSuccessModal(true);

      // Clean up saved draft on successful submission
      await AsyncStorage.removeItem(DRAFT_STORAGE_KEY);
    } catch {
      setToastMessage('An error occurred during submission. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentMeta = STEP_METADATA[step] || STEP_METADATA[1];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.container, { paddingTop: insets.top }]}
    >
      {/* Toast Notification */}
      {toastMessage && (
        <Toast
          message={toastMessage}
          type="info"
          onDismiss={() => setToastMessage(null)}
        />
      )}

      {/* Top Application Bar */}
      <View style={styles.topAppBar}>
        <TouchableOpacity
          onPress={handleBack}
          style={styles.navBackBtn}
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>

        <View style={styles.appBarTitleRow}>
          <View style={styles.brandIconBox}>
            <Ionicons name="megaphone" size={15} color={colors.onPrimary} />
          </View>
          <AppText variant="headlineSm" color={colors.textPrimary} numberOfLines={1}>
            Campaign Creator
          </AppText>
        </View>

        <TouchableOpacity
          onPress={handleManualSaveDraft}
          style={styles.topDraftBtn}
          accessibilityLabel="Save Draft"
        >
          <Ionicons name="save-outline" size={18} color={colors.primaryInk} />
        </TouchableOpacity>
      </View>

      {/* Scrollable Content Body */}
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 90 },
        ]}
      >
        {/* Persistent 5-Step Wizard Header */}
        <WizardHeader
          currentStep={step}
          totalSteps={5}
          stepName={currentMeta.name}
          stepSubtitle={currentMeta.subtitle}
          onSaveDraft={handleManualSaveDraft}
          onStepPress={handleJumpToStep}
        />

        {/* Current Step Component */}
        {step === 1 && (
          <Step1Basics
            draft={draft}
            errors={errors}
            onUpdate={handleUpdateDraft}
          />
        )}

        {step === 2 && (
          <Step2Story
            draft={draft}
            errors={errors}
            onUpdate={handleUpdateDraft}
          />
        )}

        {step === 3 && (
          <Step3Visuals
            draft={draft}
            errors={errors}
            onUpdate={handleUpdateDraft}
          />
        )}

        {step === 4 && (
          <Step4Reach
            draft={draft}
            errors={errors}
            onUpdate={handleUpdateDraft}
          />
        )}

        {step === 5 && (
          <Step5Review
            draft={draft}
            errors={errors}
            onUpdate={handleUpdateDraft}
            onEditStep={handleJumpToStep}
          />
        )}
      </ScrollView>

      {/* Safe-Area-Aware Sticky Bottom Action Bar */}
      <View
        style={[
          styles.bottomActionBar,
          shadows.layer2,
          { paddingBottom: Math.max(insets.bottom, 12) },
        ]}
      >
        <View style={styles.bottomButtonsRow}>
          {step > 1 ? (
            <TouchableOpacity
              onPress={handleBack}
              style={styles.backActionBtn}
              activeOpacity={0.8}
            >
              <Ionicons name="arrow-back" size={18} color={colors.textPrimary} />
              <AppText variant="headlineSm" color={colors.textPrimary} style={styles.backBtnText}>
                Back
              </AppText>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={handleManualSaveDraft}
              style={styles.backActionBtn}
              activeOpacity={0.8}
            >
              <Ionicons name="save-outline" size={18} color={colors.textPrimary} />
              <AppText variant="headlineSm" color={colors.textPrimary} style={styles.backBtnText}>
                Draft
              </AppText>
            </TouchableOpacity>
          )}

          {step < 5 ? (
            <TouchableOpacity
              onPress={handleNext}
              style={styles.continueActionBtn}
              activeOpacity={0.85}
            >
              <AppText variant="headlineSm" color={colors.onPrimary} style={styles.continueBtnText}>
                {currentMeta.nextLabel}
              </AppText>
              <Ionicons name="arrow-forward" size={18} color={colors.onPrimary} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={handleSubmitCampaign}
              disabled={isSubmitting}
              style={[
                styles.continueActionBtn,
                styles.submitActionBtn,
                isSubmitting && styles.submitActionBtnDisabled,
              ]}
              activeOpacity={0.85}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color={colors.onPrimary} />
              ) : (
                <>
                  <AppText variant="headlineSm" color={colors.onPrimary} style={styles.continueBtnText}>
                    Submit Campaign for Review
                  </AppText>
                  <Ionicons name="checkmark-done" size={18} color={colors.onPrimary} />
                </>
              )}
            </TouchableOpacity>
          )}
        </View>

        <AppText variant="labelMicro" color={colors.textSecondary} style={styles.bottomDisclaimer}>
          {step === 5
            ? 'You retain rights to edit or withdraw the dossier during editorial verification.'
            : 'All entered details are preserved automatically while navigating between steps.'}
        </AppText>
      </View>

      {/* Success Confirmation Modal */}
      <WizardSuccessModal
        visible={showSuccessModal}
        campaign={submittedCampaign}
        onViewCampaign={() => {
          setShowSuccessModal(false);
          if (submittedCampaign) {
            router.push(`/campaign/${submittedCampaign.id}`);
          }
        }}
        onViewDashboard={() => {
          setShowSuccessModal(false);
          router.push('/creator/dashboard');
        }}
        onReturnHome={() => {
          setShowSuccessModal(false);
          router.replace('/(tabs)');
        }}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  topAppBar: {
    height: 54,
    paddingHorizontal: spacing.marginMobile,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceContainerLowest,
    borderBottomWidth: 1,
    borderBottomColor: colors.containmentBorder,
  },
  navBackBtn: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.sm,
  },
  appBarTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandIconBox: {
    width: 26,
    height: 26,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.primaryInk,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topDraftBtn: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.sm,
  },
  scrollContent: {
    paddingHorizontal: spacing.marginMobile,
    paddingTop: spacing.sm,
  },
  bottomActionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surfaceContainerLowest,
    borderTopWidth: 1,
    borderTopColor: colors.containmentBorder,
    paddingHorizontal: spacing.marginMobile,
    paddingTop: 10,
    gap: 4,
  },
  bottomButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  backActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 48,
    paddingHorizontal: 16,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceContainerHigh,
  },
  backBtnText: {
    fontWeight: '700',
    fontSize: 14,
  },
  continueActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primaryInk,
    paddingHorizontal: 16,
  },
  submitActionBtn: {
    backgroundColor: colors.primaryContainer,
  },
  submitActionBtnDisabled: {
    opacity: 0.7,
  },
  continueBtnText: {
    fontWeight: '700',
    fontSize: 14,
  },
  bottomDisclaimer: {
    textAlign: 'center',
    fontSize: 10.5,
    marginTop: 2,
  },
});
