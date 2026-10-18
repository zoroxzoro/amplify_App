import React, { useState, useMemo } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
  Switch,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { AppText } from '../../src/components/AppText';
import {
  ProfileStatTile,
  ProfileMenuRow,
  ProfileInfoModal,
} from '../../src/components/Profile';
import { colors } from '../../src/theme/colors';
import { spacing, borderRadius, shadows } from '../../src/theme/spacing';
import { useCampaigns, DEMO_CREATOR } from '../../src/context/CampaignContext';
import { formatCurrencyINR } from '../../src/utils/formatters';

type ActiveModalType =
  | null
  | 'edit_profile'
  | 'credentials'
  | 'backed_campaigns'
  | 'saved_dossiers'
  | 'escrow_receipts'
  | 'notifications'
  | 'security'
  | 'privacy'
  | 'how_it_works'
  | 'faq'
  | 'partners'
  | 'whitepaper'
  | 'guidelines'
  | 'terms';

export default function ProfileScreen() {
  const router = useRouter();
  const {
    creatorCampaigns,
    contributions,
    campaigns,
    creatorViewMode,
    setCreatorViewMode,
  } = useCampaigns();

  // Local demo editable fields
  const [displayName, setDisplayName] = useState(DEMO_CREATOR.name);
  const [organization, setOrganization] = useState('Centre for Ecological Design, Bengaluru');
  const [tempName, setTempName] = useState(DEMO_CREATOR.name);
  const [tempOrg, setTempOrg] = useState('Centre for Ecological Design, Bengaluru');

  // Preferences state
  const [notificationsFlight, setNotificationsFlight] = useState(true);
  const [notificationsMilestone, setNotificationsMilestone] = useState(true);
  const [notificationsEditorial, setNotificationsEditorial] = useState(true);
  const [isPrivacyProtected, setIsPrivacyProtected] = useState(true);

  // Active modal
  const [activeModal, setActiveModal] = useState<ActiveModalType>(null);

  // Computed metrics
  const activeFlightsCount = useMemo(() => {
    return creatorCampaigns.filter(
      (c) => c.status === 'active' || c.status === 'amplified'
    ).length;
  }, [creatorCampaigns]);

  const reviewCount = useMemo(() => {
    return creatorCampaigns.filter(
      (c) => c.status === 'pending_review' || c.status === 'pending'
    ).length;
  }, [creatorCampaigns]);

  const actionNeededCount = useMemo(() => {
    return creatorCampaigns.filter(
      (c) => c.status === 'rejected' || c.status === 'restricted'
    ).length;
  }, [creatorCampaigns]);

  const totalFundedINR = useMemo(() => {
    const fromContribs = contributions.reduce((sum, c) => sum + c.amount, 0);
    return fromContribs > 0 ? fromContribs : 14500;
  }, [contributions]);

  const totalAmplifiedFormatted = useMemo(() => {
    if (creatorViewMode === 'new_creator') {
      return totalFundedINR > 14500 ? formatCurrencyINR(totalFundedINR) : '₹0';
    }
    return '₹3.22L';
  }, [creatorViewMode, totalFundedINR]);

  const handleSaveProfile = () => {
    if (tempName.trim()) setDisplayName(tempName.trim());
    if (tempOrg.trim()) setOrganization(tempOrg.trim());
    setActiveModal(null);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header Row with Title and Mode Switcher */}
        <View style={styles.screenHeader}>
          <AppText variant="headlineMd" color={colors.textPrimary} style={styles.screenTitle}>
            Profile & Account
          </AppText>
          <View style={styles.modeToggleGroup}>
            <TouchableOpacity
              onPress={() => setCreatorViewMode('demo_creator')}
              style={[
                styles.modeToggleBtn,
                creatorViewMode === 'demo_creator' && styles.modeToggleBtnActive,
              ]}
            >
              <AppText
                variant="labelMicro"
                color={creatorViewMode === 'demo_creator' ? colors.onPrimary : colors.textSecondary}
              >
                Dr. Sen
              </AppText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setCreatorViewMode('new_creator')}
              style={[
                styles.modeToggleBtn,
                creatorViewMode === 'new_creator' && styles.modeToggleBtnActive,
              ]}
            >
              <AppText
                variant="labelMicro"
                color={creatorViewMode === 'new_creator' ? colors.onPrimary : colors.textSecondary}
              >
                New User
              </AppText>
            </TouchableOpacity>
          </View>
        </View>

        {/* Identity & Steward Card */}
        <View style={[styles.profileCard, shadows.layer1]}>
          <View style={styles.identityTopRow}>
            {/* Avatar with Verified Medallion and Online Pulse */}
            <View style={styles.avatarWrapper}>
              <Image
                source={{
                  uri:
                    creatorViewMode === 'new_creator'
                      ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80'
                      : DEMO_CREATOR.avatarUrl,
                }}
                style={styles.avatarImage}
              />
              <View style={styles.verifiedMedallion} accessibilityLabel="Verified Steward">
                <MaterialIcons name="verified" size={13} color={colors.onPrimary} />
              </View>
              <View style={styles.pulseDotWrapper}>
                <View style={styles.pulseRing} />
                <View style={styles.pulseCenter} />
              </View>
            </View>

            {/* Verification Pill */}
            <View style={styles.verificationMetaCol}>
              <View style={styles.verificationPill}>
                <MaterialIcons name="shield" size={13} color={colors.primaryInk} />
                <AppText variant="labelMicro" color={colors.primaryInk} style={styles.verificationText}>
                  KYC VERIFIED
                </AppText>
              </View>
              <AppText variant="labelMicro" color={colors.textSecondary}>
                {creatorViewMode === 'new_creator' ? 'Community Creator' : 'Academic Steward'}
              </AppText>
            </View>
          </View>

          {/* Name & Title */}
          <View style={styles.nameBlock}>
            <AppText variant="headlineLg" color={colors.textPrimary} style={styles.displayName}>
              {creatorViewMode === 'new_creator' ? 'New Creator Steward' : displayName}
            </AppText>
            <AppText variant="bodySm" color={colors.textSecondary} style={styles.stewardCode}>
              {creatorViewMode === 'new_creator'
                ? '@new_steward • Steward ID #9001-NEW'
                : `@ananya_sen • ${DEMO_CREATOR.idCode}`}
            </AppText>
            <View style={styles.affiliationRow}>
              <MaterialIcons name="account-balance" size={15} color={colors.primaryInk} />
              <AppText variant="labelMd" color={colors.primaryInk} style={styles.affiliationText}>
                {organization}
              </AppText>
            </View>
          </View>

          {/* Impact Summary Metric Tiles */}
          <View style={styles.statTilesRow}>
            <ProfileStatTile
              label="Amplified"
              value={totalAmplifiedFormatted}
              sublabel="Verified pool"
              isPrimary
            />
            <ProfileStatTile
              label="Created"
              value={creatorCampaigns.length}
              sublabel="Campaigns"
            />
            <ProfileStatTile
              label="Backed"
              value={contributions.length + (creatorViewMode === 'new_creator' ? 0 : 14)}
              sublabel="Syndicates"
            />
          </View>

          {/* Steward Controls Row */}
          <View style={styles.controlsRow}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                setTempName(displayName);
                setTempOrg(organization);
                setActiveModal('edit_profile');
              }}
              style={styles.editProfileBtn}
            >
              <MaterialIcons name="edit-note" size={18} color={colors.textPrimary} />
              <AppText variant="headlineSm" color={colors.textPrimary} style={styles.editBtnText}>
                Edit Profile
              </AppText>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setActiveModal('credentials')}
              style={styles.credentialsBtn}
            >
              <MaterialIcons name="badge" size={17} color={colors.primaryInk} />
              <AppText variant="labelMd" color={colors.primaryInk} style={styles.credBtnText}>
                Credentials
              </AppText>
            </TouchableOpacity>
          </View>
        </View>

        {/* Section 1: My Amplification Portfolio */}
        <View style={styles.menuSection}>
          <View style={styles.sectionHeaderRow}>
            <AppText variant="labelMicro" color={colors.textSecondary} style={styles.sectionHeaderTitle}>
              AMPLIFICATION PORTFOLIO
            </AppText>
            <AppText variant="labelMicro" color={colors.primaryContainer} style={{ fontWeight: '600' }}>
              Node Active
            </AppText>
          </View>

          <View style={[styles.menuBlock, shadows.layer1]}>
            <ProfileMenuRow
              icon="campaign"
              title="My Campaigns (Creator Studio)"
              subtitle={`${activeFlightsCount} live flights, ${reviewCount} in review`}
              badge={actionNeededCount > 0 ? 'Action Needed' : undefined}
              badgeVariant="action"
              onPress={() => router.push('/creator/dashboard')}
            />
            <ProfileMenuRow
              icon="volunteer-activism"
              title="Backed Campaigns & Contributions"
              subtitle={`${contributions.length + (creatorViewMode === 'new_creator' ? 0 : 14)} initiatives supported`}
              badge={`${contributions.length + (creatorViewMode === 'new_creator' ? 0 : 14)} Active`}
              badgeVariant="success"
              onPress={() => setActiveModal('backed_campaigns')}
            />
            <ProfileMenuRow
              icon="bookmarks"
              title="Saved Dossiers & Bookmarks"
              subtitle="8 reading list items & research briefs"
              badge="8 items"
              onPress={() => setActiveModal('saved_dossiers')}
            />
            <ProfileMenuRow
              icon="receipt-long"
              title="Payment History & Escrow Receipts"
              subtitle="Itemized bank vouchers, tax invoices, UPI clearing"
              showDivider={false}
              onPress={() => setActiveModal('escrow_receipts')}
            />
          </View>
        </View>

        {/* Section 2: Preferences & Governance */}
        <View style={styles.menuSection}>
          <View style={styles.sectionHeaderRow}>
            <AppText variant="labelMicro" color={colors.textSecondary} style={styles.sectionHeaderTitle}>
              PREFERENCES & GOVERNANCE
            </AppText>
          </View>

          <View style={[styles.menuBlock, shadows.layer1]}>
            <ProfileMenuRow
              icon="notifications-active"
              title="Notification Preferences"
              subtitle="Real-time flight alerts, milestone updates, editorial notes"
              onPress={() => setActiveModal('notifications')}
            />
            <ProfileMenuRow
              icon="lock-reset"
              title="Account & Escrow Security"
              subtitle="Two-factor auth, recovery keys, KYC documentation"
              onPress={() => setActiveModal('security')}
            />
            <ProfileMenuRow
              icon="visibility-off"
              title="Civic Privacy & Backer Ledger"
              subtitle="Private by default (initials only on public ledgers)"
              badge={isPrivacyProtected ? 'Protected' : 'Public'}
              badgeVariant={isPrivacyProtected ? 'success' : 'neutral'}
              showDivider={false}
              onPress={() => setActiveModal('privacy')}
            />
          </View>
        </View>

        {/* Section 3: Institutional Trust & Knowledge */}
        <View style={styles.menuSection}>
          <View style={styles.sectionHeaderRow}>
            <AppText variant="labelMicro" color={colors.textSecondary} style={styles.sectionHeaderTitle}>
              INSTITUTIONAL TRUST & KNOWLEDGE
            </AppText>
          </View>

          <View style={[styles.menuBlock, shadows.layer1]}>
            <ProfileMenuRow
              icon="alt-route"
              title="How Amplification Works"
              subtitle="The 3-stage protocol: Draft → Audit → Syndication"
              onPress={() => setActiveModal('how_it_works')}
            />
            <ProfileMenuRow
              icon="fact-check"
              title="Verification & Audit Standards (FAQ)"
              subtitle="Peer-review criteria, CPM pricing, and refund guarantees"
              onPress={() => setActiveModal('faq')}
            />
            <ProfileMenuRow
              icon="hub"
              title="Partner Syndicates & Press Mastheads"
              subtitle="Meta, Regional Press, WhatsApp Civic Broadcast Nodes"
              onPress={() => setActiveModal('partners')}
            />
            <ProfileMenuRow
              icon="account-balance"
              title="Statutory Escrow Protocol Whitepaper"
              subtitle="RBI-compliant funds segregation & automated reversal"
              showDivider={false}
              onPress={() => setActiveModal('whitepaper')}
            />
          </View>
        </View>

        {/* Section 4: Legal & Governance Charter */}
        <View style={styles.menuSection}>
          <View style={styles.sectionHeaderRow}>
            <AppText variant="labelMicro" color={colors.textSecondary} style={styles.sectionHeaderTitle}>
              LEGAL & GOVERNANCE CHARTER
            </AppText>
          </View>

          <View style={[styles.menuBlock, shadows.layer1]}>
            <ProfileMenuRow
              icon="menu-book"
              title="Community Editorial Guidelines"
              onPress={() => setActiveModal('guidelines')}
            />
            <ProfileMenuRow
              icon="verified-user"
              title="Terms of Public Syndication"
              showDivider={false}
              onPress={() => setActiveModal('terms')}
            />
          </View>
        </View>
      </ScrollView>

      {/* MODAL 1: Edit Profile */}
      <ProfileInfoModal
        visible={activeModal === 'edit_profile'}
        onClose={() => setActiveModal(null)}
        title="Edit Steward Profile"
        subtitle="Local demo session profile"
        icon="edit-note"
      >
        <View style={styles.modalFieldGroup}>
          <AppText variant="labelMd" color={colors.textPrimary} style={styles.fieldLabel}>
            Display Name
          </AppText>
          <TextInput
            value={tempName}
            onChangeText={setTempName}
            style={styles.textInput}
            placeholder="Enter name"
            placeholderTextColor={colors.textMuted}
          />
        </View>

        <View style={styles.modalFieldGroup}>
          <AppText variant="labelMd" color={colors.textPrimary} style={styles.fieldLabel}>
            Affiliated Institution
          </AppText>
          <TextInput
            value={tempOrg}
            onChangeText={setTempOrg}
            style={styles.textInput}
            placeholder="Enter institution"
            placeholderTextColor={colors.textMuted}
          />
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleSaveProfile}
          style={styles.primaryModalBtn}
        >
          <AppText variant="labelMd" color={colors.onPrimary} style={{ fontWeight: '700' }}>
            Save Changes
          </AppText>
        </TouchableOpacity>
      </ProfileInfoModal>

      {/* MODAL 2: Credentials */}
      <ProfileInfoModal
        visible={activeModal === 'credentials'}
        onClose={() => setActiveModal(null)}
        title="Certified Credentials"
        subtitle="Cryptographically attested institutional identity"
        icon="badge"
      >
        <View style={styles.infoCard}>
          <AppText variant="headlineSm" color={colors.primaryInk}>
            Steward ID #8842-SEN
          </AppText>
          <AppText variant="bodySm" color={colors.textSecondary} style={{ marginTop: 4 }}>
            Verification Tier: Institutional Senior Fellow • Level 3 KYC
          </AppText>
          <AppText variant="labelMicro" color={colors.textMuted} style={{ marginTop: 8 }}>
            Merkle Attestation: 0x8842...fe91 sealed by National Civic Node
          </AppText>
        </View>

        <View style={styles.credentialItem}>
          <MaterialIcons name="school" size={20} color={colors.primaryInk} />
          <View style={{ flex: 1 }}>
            <AppText variant="headlineSm" color={colors.textPrimary} style={{ fontSize: 14 }}>
              Centre for Ecological Design, Bengaluru
            </AppText>
            <AppText variant="bodySm" color={colors.textSecondary}>
              Lead Research Scientist • Urban Heat Mitigation
            </AppText>
          </View>
        </View>

        <View style={styles.credentialItem}>
          <MaterialIcons name="verified" size={20} color={colors.primaryInk} />
          <View style={{ flex: 1 }}>
            <AppText variant="headlineSm" color={colors.textPrimary} style={{ fontSize: 14 }}>
              RBI-Compliant Statutory Escrow Custodian
            </AppText>
            <AppText variant="bodySm" color={colors.textSecondary}>
              Authorised campaign flight co-signer
            </AppText>
          </View>
        </View>
      </ProfileInfoModal>

      {/* MODAL 3: Backed Campaigns & Contributions */}
      <ProfileInfoModal
        visible={activeModal === 'backed_campaigns'}
        onClose={() => setActiveModal(null)}
        title="My Contributions"
        subtitle="All recorded backing for civic amplification"
        icon="volunteer-activism"
      >
        {contributions.length === 0 ? (
          <View style={{ padding: spacing.md, alignItems: 'center' }}>
            <AppText variant="bodyMd" color={colors.textSecondary} style={{ textAlign: 'center' }}>
              No contributions recorded in this demo session yet.
            </AppText>
            <TouchableOpacity
              onPress={() => {
                setActiveModal(null);
                router.push('/(tabs)/explore');
              }}
              style={[styles.primaryModalBtn, { marginTop: spacing.md }]}
            >
              <AppText variant="labelMd" color={colors.onPrimary}>
                Explore Active Campaigns
              </AppText>
            </TouchableOpacity>
          </View>
        ) : (
          contributions.map((c) => (
            <TouchableOpacity
              key={c.id}
              activeOpacity={0.8}
              onPress={() => {
                setActiveModal(null);
                router.push(`/campaign/${c.campaignId}` as any);
              }}
              style={styles.contributionRow}
            >
              <View style={{ flex: 1 }}>
                <AppText variant="headlineSm" color={colors.textPrimary} style={{ fontSize: 14 }}>
                  {c.campaignTitle}
                </AppText>
                <AppText variant="bodySm" color={colors.textSecondary}>
                  Pledged ₹{c.amount.toLocaleString()} • {c.estimatedReach.min.toLocaleString()}–{c.estimatedReach.max.toLocaleString()} Est. Reach
                </AppText>
                <AppText variant="labelMicro" color={colors.primaryInk} style={{ marginTop: 2 }}>
                  {c.receiptId || c.id} • Confirmed
                </AppText>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.outlineVariant} />
            </TouchableOpacity>
          ))
        )}
      </ProfileInfoModal>

      {/* MODAL 4: Saved Dossiers */}
      <ProfileInfoModal
        visible={activeModal === 'saved_dossiers'}
        onClose={() => setActiveModal(null)}
        title="Saved Dossiers & Bookmarks"
        subtitle="Curated public interest research briefs"
        icon="bookmarks"
      >
        {campaigns.slice(0, 3).map((camp) => (
          <TouchableOpacity
            key={camp.id}
            activeOpacity={0.8}
            onPress={() => {
              setActiveModal(null);
              router.push(`/campaign/${camp.id}` as any);
            }}
            style={styles.contributionRow}
          >
            <View style={{ flex: 1 }}>
              <AppText variant="headlineSm" color={colors.textPrimary} style={{ fontSize: 14 }}>
                {camp.title}
              </AppText>
              <AppText variant="bodySm" color={colors.textSecondary} numberOfLines={2}>
                {camp.shortDescription}
              </AppText>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.outlineVariant} />
          </TouchableOpacity>
        ))}
      </ProfileInfoModal>

      {/* MODAL 5: Escrow Receipts */}
      <ProfileInfoModal
        visible={activeModal === 'escrow_receipts'}
        onClose={() => setActiveModal(null)}
        title="Escrow Receipts & Tax Vouchers"
        subtitle="Statutory banking receipts for simulated contributions"
        icon="receipt-long"
      >
        <View style={styles.infoCard}>
          <AppText variant="headlineSm" color={colors.primaryInk}>
            Statutory Escrow Guarantee
          </AppText>
          <AppText variant="bodySm" color={colors.textSecondary} style={{ marginTop: 4 }}>
            All campaign backing is held in an RBI-compliant escrow account. 92% is earmarked for media distribution, with an 8% platform verification charge.
          </AppText>
        </View>

        {contributions.map((c) => (
          <View key={c.id} style={styles.receiptItem}>
            <View style={{ flex: 1 }}>
              <AppText variant="labelMicro" color={colors.primaryInk} style={{ fontWeight: '700' }}>
                {c.receiptId || 'REC-554210'}
              </AppText>
              <AppText variant="bodyMd" color={colors.textPrimary}>
                ₹{c.amount.toLocaleString()} Backing Allocation
              </AppText>
              <AppText variant="bodySm" color={colors.textSecondary}>
                {c.campaignTitle}
              </AppText>
            </View>
            <View style={styles.verifiedTag}>
              <MaterialIcons name="check-circle" size={14} color={colors.primaryInk} />
              <AppText variant="labelMicro" color={colors.primaryInk} style={{ fontWeight: '600' }}>
                CLEARED
              </AppText>
            </View>
          </View>
        ))}
      </ProfileInfoModal>

      {/* MODAL 6: Notification Preferences */}
      <ProfileInfoModal
        visible={activeModal === 'notifications'}
        onClose={() => setActiveModal(null)}
        title="Notification Preferences"
        subtitle="Manage alerts and telemetry updates"
        icon="notifications-active"
      >
        <View style={styles.toggleRow}>
          <View style={{ flex: 1, paddingRight: spacing.sm }}>
            <AppText variant="headlineSm" color={colors.textPrimary} style={{ fontSize: 15 }}>
              Flight Telemetry & CPM Alerts
            </AppText>
            <AppText variant="bodySm" color={colors.textSecondary}>
              Real-time notifications when your ad flights achieve target reach
            </AppText>
          </View>
          <Switch
            value={notificationsFlight}
            onValueChange={setNotificationsFlight}
            trackColor={{ false: colors.surfaceContainer, true: colors.primaryContainer }}
          />
        </View>

        <View style={styles.toggleRow}>
          <View style={{ flex: 1, paddingRight: spacing.sm }}>
            <AppText variant="headlineSm" color={colors.textPrimary} style={{ fontSize: 15 }}>
              Funding Milestone Updates
            </AppText>
            <AppText variant="bodySm" color={colors.textSecondary}>
              Alerts when campaigns meet 50% and 100% statutory escrow goals
            </AppText>
          </View>
          <Switch
            value={notificationsMilestone}
            onValueChange={setNotificationsMilestone}
            trackColor={{ false: colors.surfaceContainer, true: colors.primaryContainer }}
          />
        </View>

        <View style={styles.toggleRow}>
          <View style={{ flex: 1, paddingRight: spacing.sm }}>
            <AppText variant="headlineSm" color={colors.textPrimary} style={{ fontSize: 15 }}>
              Editorial Peer-Review Notes
            </AppText>
            <AppText variant="bodySm" color={colors.textSecondary}>
              Direct revisions requested by the editorial consensus board
            </AppText>
          </View>
          <Switch
            value={notificationsEditorial}
            onValueChange={setNotificationsEditorial}
            trackColor={{ false: colors.surfaceContainer, true: colors.primaryContainer }}
          />
        </View>
      </ProfileInfoModal>

      {/* MODAL 7: Account Security */}
      <ProfileInfoModal
        visible={activeModal === 'security'}
        onClose={() => setActiveModal(null)}
        title="Account & Escrow Security"
        subtitle="Cryptographic verification and recovery keys"
        icon="lock-reset"
      >
        <View style={styles.infoCard}>
          <AppText variant="headlineSm" color={colors.primaryInk}>
            Two-Factor Auth Active
          </AppText>
          <AppText variant="bodySm" color={colors.textSecondary} style={{ marginTop: 4 }}>
            Authenticated via hardware security key and certified institutional credentials.
          </AppText>
        </View>
        <View style={styles.credentialItem}>
          <MaterialIcons name="key" size={20} color={colors.primaryInk} />
          <View style={{ flex: 1 }}>
            <AppText variant="headlineSm" color={colors.textPrimary} style={{ fontSize: 14 }}>
              Recovery Key Hash
            </AppText>
            <AppText variant="bodySm" color={colors.textSecondary}>
              SHA-256: 7f83b165...94d3
            </AppText>
          </View>
        </View>
      </ProfileInfoModal>

      {/* MODAL 8: Civic Privacy */}
      <ProfileInfoModal
        visible={activeModal === 'privacy'}
        onClose={() => setActiveModal(null)}
        title="Civic Privacy & Backer Ledger"
        subtitle="Manage public ledger visibility"
        icon="visibility-off"
      >
        <View style={styles.toggleRow}>
          <View style={{ flex: 1, paddingRight: spacing.sm }}>
            <AppText variant="headlineSm" color={colors.textPrimary} style={{ fontSize: 15 }}>
              Protected Backer Mode
            </AppText>
            <AppText variant="bodySm" color={colors.textSecondary}>
              When enabled, your name appears only as initials (e.g., &quot;A. S.&quot;) on public campaign contributor ledgers.
            </AppText>
          </View>
          <Switch
            value={isPrivacyProtected}
            onValueChange={setIsPrivacyProtected}
            trackColor={{ false: colors.surfaceContainer, true: colors.primaryContainer }}
          />
        </View>
      </ProfileInfoModal>

      {/* MODAL 9: How Amplification Works */}
      <ProfileInfoModal
        visible={activeModal === 'how_it_works'}
        onClose={() => setActiveModal(null)}
        title="How Amplification Works"
        subtitle="The 3-stage protocol: Draft → Audit → Syndication"
        icon="alt-route"
      >
        <View style={styles.protocolStep}>
          <View style={styles.stepNumBadge}>
            <AppText variant="labelMd" color={colors.onPrimary} style={{ fontWeight: '700' }}>
              1
            </AppText>
          </View>
          <View style={{ flex: 1 }}>
            <AppText variant="headlineSm" color={colors.textPrimary}>
              Blueprint & Story Dossier
            </AppText>
            <AppText variant="bodySm" color={colors.textSecondary} style={{ marginTop: 2 }}>
              Creators submit verified civic issues with evidence, peer-reviewed citations, and geographic targeting.
            </AppText>
          </View>
        </View>

        <View style={styles.protocolStep}>
          <View style={styles.stepNumBadge}>
            <AppText variant="labelMd" color={colors.onPrimary} style={{ fontWeight: '700' }}>
              2
            </AppText>
          </View>
          <View style={{ flex: 1 }}>
            <AppText variant="headlineSm" color={colors.textPrimary}>
              Statutory Escrow & Fact-Checking
            </AppText>
            <AppText variant="bodySm" color={colors.textSecondary} style={{ marginTop: 2 }}>
              Community co-distributors pledge funds held in segregated escrow. Editorial desk verifies all assertions.
            </AppText>
          </View>
        </View>

        <View style={styles.protocolStep}>
          <View style={styles.stepNumBadge}>
            <AppText variant="labelMd" color={colors.onPrimary} style={{ fontWeight: '700' }}>
              3
            </AppText>
          </View>
          <View style={{ flex: 1 }}>
            <AppText variant="headlineSm" color={colors.textPrimary}>
              Syndicated Public Broadcast
            </AppText>
            <AppText variant="bodySm" color={colors.textSecondary} style={{ marginTop: 2 }}>
              Ads are served into local news feeds, with real-time delivery logs sealed by Merkle cryptographic proofs.
            </AppText>
          </View>
        </View>
      </ProfileInfoModal>

      {/* MODAL 10: FAQ */}
      <ProfileInfoModal
        visible={activeModal === 'faq'}
        onClose={() => setActiveModal(null)}
        title="Verification Standards (FAQ)"
        subtitle="Peer-review criteria, CPM pricing, and escrow guarantees"
        icon="fact-check"
      >
        <View style={styles.faqCard}>
          <AppText variant="headlineSm" color={colors.primaryInk} style={{ fontSize: 14 }}>
            What is Effective CPM?
          </AppText>
          <AppText variant="bodySm" color={colors.textSecondary} style={{ marginTop: 4 }}>
            Effective Cost Per Mille represents the cost per 1,000 verified citizens reached across partner media networks.
          </AppText>
        </View>

        <View style={styles.faqCard}>
          <AppText variant="headlineSm" color={colors.primaryInk} style={{ fontSize: 14 }}>
            What happens if a campaign is not approved?
          </AppText>
          <AppText variant="bodySm" color={colors.textSecondary} style={{ marginTop: 4 }}>
            Any pledges held in escrow are automatically reversed back to the community co-distributors with zero deduction.
          </AppText>
        </View>
      </ProfileInfoModal>

      {/* MODAL 11: Partners */}
      <ProfileInfoModal
        visible={activeModal === 'partners'}
        onClose={() => setActiveModal(null)}
        title="Partner Syndicates"
        subtitle="Media networks and broadcast nodes"
        icon="hub"
      >
        <View style={styles.credentialItem}>
          <MaterialIcons name="public" size={20} color={colors.primaryInk} />
          <View style={{ flex: 1 }}>
            <AppText variant="headlineSm" color={colors.textPrimary} style={{ fontSize: 14 }}>
              Google Public Interest Ads
            </AppText>
            <AppText variant="bodySm" color={colors.textSecondary}>
              Civic search placement & YouTube geo-targeted notices
            </AppText>
          </View>
        </View>

        <View style={styles.credentialItem}>
          <MaterialIcons name="rss-feed" size={20} color={colors.primaryInk} />
          <View style={{ flex: 1 }}>
            <AppText variant="headlineSm" color={colors.textPrimary} style={{ fontSize: 14 }}>
              Regional Language News Consortia
            </AppText>
            <AppText variant="bodySm" color={colors.textSecondary}>
              Local digital newspapers and journalistic syndicates
            </AppText>
          </View>
        </View>
      </ProfileInfoModal>

      {/* MODAL 12: Whitepaper */}
      <ProfileInfoModal
        visible={activeModal === 'whitepaper'}
        onClose={() => setActiveModal(null)}
        title="Escrow Protocol Whitepaper"
        subtitle="Statutory segregation & automated reversal"
        icon="account-balance"
      >
        <View style={styles.infoCard}>
          <AppText variant="headlineSm" color={colors.primaryInk}>
            Statutory Funds Segregation
          </AppText>
          <AppText variant="bodySm" color={colors.textSecondary} style={{ marginTop: 4 }}>
            All public contributions flow directly into a designated Escrow Trust Account. Neither campaign creators nor third parties can liquidate capital without multi-party cryptographic attestation.
          </AppText>
        </View>
      </ProfileInfoModal>

      {/* MODAL 13 & 14: Guidelines & Terms */}
      <ProfileInfoModal
        visible={activeModal === 'guidelines' || activeModal === 'terms'}
        onClose={() => setActiveModal(null)}
        title={activeModal === 'guidelines' ? 'Editorial Guidelines' : 'Terms of Public Syndication'}
        subtitle="Governance Charter"
        icon="menu-book"
      >
        <View style={styles.infoCard}>
          <AppText variant="headlineSm" color={colors.primaryInk}>
            Public Interest Verification Standards
          </AppText>
          <AppText variant="bodySm" color={colors.textSecondary} style={{ marginTop: 4 }}>
            Campaigns must be supported by verifiable public data, peer-reviewed scientific citations, or official municipal audit reports. Hate speech, commercial promotion, and unverified allegations are strictly barred.
          </AppText>
        </View>
      </ProfileInfoModal>
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
  screenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xs,
  },
  screenTitle: {
    fontWeight: '700',
  },
  modeToggleGroup: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceContainer,
    borderRadius: borderRadius.full,
    padding: 3,
  },
  modeToggleBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  modeToggleBtnActive: {
    backgroundColor: colors.primaryContainer,
  },
  profileCard: {
    backgroundColor: colors.surfaceContainerLowest,
    marginHorizontal: spacing.lg,
    marginTop: spacing.sm,
    borderRadius: borderRadius.xl * 1.2,
    padding: spacing.lg,
  },
  identityTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatarImage: {
    width: 72,
    height: 72,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.surfaceContainer,
  },
  verifiedMedallion: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.surfaceContainerLowest,
  },
  pulseDotWrapper: {
    position: 'absolute',
    top: 4,
    left: 4,
    width: 12,
    height: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseRing: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primaryFixed,
    opacity: 0.7,
  },
  pulseCenter: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primaryContainer,
  },
  verificationMetaCol: {
    alignItems: 'flex-end',
    gap: 4,
  },
  verificationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.surfaceContainer,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  verificationText: {
    letterSpacing: 0.6,
    fontWeight: '700',
  },
  nameBlock: {
    marginTop: spacing.md,
  },
  displayName: {
    fontWeight: '600',
  },
  stewardCode: {
    marginTop: 2,
  },
  affiliationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  affiliationText: {
    fontWeight: '600',
  },
  statTilesRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  editProfileBtn: {
    flex: 1,
    height: 44,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.secondaryContainer,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  editBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
  credentialsBtn: {
    height: 44,
    paddingHorizontal: 14,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surfaceContainerLow,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  credBtnText: {
    fontWeight: '600',
  },
  menuSection: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    marginBottom: spacing.xs,
  },
  sectionHeaderTitle: {
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  menuBlock: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
  },
  modalFieldGroup: {
    marginBottom: spacing.md,
  },
  fieldLabel: {
    marginBottom: 6,
    fontWeight: '600',
  },
  textInput: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.surfaceContainerHigh,
  },
  primaryModalBtn: {
    backgroundColor: colors.primaryContainer,
    paddingVertical: 13,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoCard: {
    backgroundColor: colors.surfaceContainerLow,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
  },
  credentialItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceContainerLow,
  },
  contributionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceContainerLow,
  },
  receiptItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceContainerLow,
  },
  verifiedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.surfaceContainer,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceContainerLow,
  },
  protocolStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  stepNumBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  faqCard: {
    backgroundColor: colors.surfaceContainerLow,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
  },
});
