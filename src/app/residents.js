import { Feather } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  Badge, Button, Card, Chips, Empty, ErrorNote, Field, Loading, Row, Screen,
  Sheet, T, tap, useResource
} from '../components/ui';
import { api } from '../lib/api';
import { useAuth } from '../lib/auth';
import { colors, fonts, radius } from '../theme';

const OCCUPANCY_OPTIONS = ['Tenant', 'Owner'];

export default function Residents() {
  const { user } = useAuth();
  const isManager = ['MAIN_ADMIN', 'BLOCK_SUB_ADMIN', 'FACILITY_MANAGER'].includes(user?.role);
  const { data, loading, error, reload, refreshing } = useResource(() => api('/residents'), [user?.userId]);

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [showAddForm, setShowAddForm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Registration Form State
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    apartmentId: '',
    blockId: user?.blockId || 'B001',
    communityId: user?.communityId || 'C001',
    ownerOrTenant: 'Tenant',
    familyMembers: '1',
    emergencyContact: '',
  });

  const setField = (key) => (val) => setForm((prev) => ({ ...prev, [key]: val }));

  const residents = (data || []).filter((r) => {
    const q = search.trim().toLowerCase();
    const matchesSearch = !q ||
      (r.name && r.name.toLowerCase().includes(q)) ||
      (r.apartmentId && r.apartmentId.toLowerCase().includes(q)) ||
      (r.blockId && r.blockId.toLowerCase().includes(q)) ||
      (r.phone && r.phone.includes(q)) ||
      (r.email && r.email.toLowerCase().includes(q));

    if (!matchesSearch) return false;
    if (filter === 'All') return true;
    if (filter === 'Active') return r.status === 'Active';
    if (filter === 'Tenant') return r.ownerOrTenant === 'Tenant';
    if (filter === 'Owner') return r.ownerOrTenant === 'Owner';
    return true;
  });

  const handleRegister = async () => {
    if (!form.name.trim() || !form.email.trim() || !form.apartmentId.trim() || !form.blockId.trim()) {
      return setFormError(new Error('Name, Email, Apartment ID, and Block ID are required.'));
    }
    setBusy(true);
    setFormError(null);
    setSuccessMsg(null);

    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password.trim() || 'Demo@123',
        apartmentId: form.apartmentId.trim().toUpperCase(),
        blockId: form.blockId.trim().toUpperCase(),
        communityId: form.communityId.trim().toUpperCase() || 'C001',
        phone: form.phone.trim(),
        ownerOrTenant: form.ownerOrTenant,
        familyMembers: Number(form.familyMembers) || 1,
        emergencyContact: form.emergencyContact.trim(),
        status: 'Active',
      };

      const created = await api('/residents', { method: 'POST', body: payload });
      setSuccessMsg(`Resident ${created.name} (${created.residentId}) registered successfully! Login credential created.`);
      setShowAddForm(false);
      setForm({
        name: '',
        email: '',
        password: '',
        phone: '',
        apartmentId: '',
        blockId: user?.blockId || 'B001',
        communityId: user?.communityId || 'C001',
        ownerOrTenant: 'Tenant',
        familyMembers: '1',
        emergencyContact: '',
      });
      await reload();
    } catch (err) {
      setFormError(err);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen refreshing={refreshing} onRefresh={reload}>
      <Stack.Screen options={{ title: 'Resident Directory' }} />

      <View style={styles.headerArea}>
        <T.label style={{ color: colors.brassDeep, marginBottom: 4 }}>SAFEHOME OPERATIONS</T.label>
        <Text style={styles.title}>Resident Management</Text>
        <T.muted style={{ marginTop: 2, marginBottom: 14 }}>
          {isManager ? 'Register, inspect and manage society residents and credentials.' : 'Resident directory and community members.'}
        </T.muted>
      </View>

      {/* Action Banner for Managers */}
      {isManager && (
        <Card style={styles.actionCard}>
          <Row style={{ justifyContent: 'space-between' }}>
            <View style={{ flex: 1 }}>
              <T.title style={{ color: colors.onInk }}>Onboard New Resident</T.title>
              <Text style={styles.actionSub}>Create verified resident record & portal access</Text>
            </View>
            <Button
              title={showAddForm ? 'Cancel' : 'Register'}
              icon={showAddForm ? 'x' : 'user-plus'}
              variant={showAddForm ? 'secondary' : 'brass'}
              small
              onPress={() => {
                tap();
                setShowAddForm(!showAddForm);
                setFormError(null);
              }}
            />
          </Row>
        </Card>
      )}

      {/* Success Notification */}
      {successMsg && (
        <View style={styles.successBox}>
          <Feather name="check-circle" size={16} color={colors.ok} />
          <Text style={styles.successText}>{successMsg}</Text>
        </View>
      )}

      {/* Registration Form Sheet */}
      {showAddForm && (
        <Sheet title="New Resident Registration">
          <ErrorNote error={formError} />
          <Field
            label="Full Name *"
            value={form.name}
            onChangeText={setField('name')}
            placeholder="e.g. Ramesh Varma"
          />
          <Field
            label="Email Address (Login ID) *"
            value={form.email}
            onChangeText={setField('email')}
            placeholder="ramesh@residence.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Field
            label="Initial Password"
            value={form.password}
            onChangeText={setField('password')}
            placeholder="Leave blank for default: Demo@123"
            secureTextEntry
          />
          <Field
            label="Phone Number"
            value={form.phone}
            onChangeText={setField('phone')}
            placeholder="10-digit mobile number"
            keyboardType="phone-pad"
            maxLength={10}
          />
          <Row gap={12}>
            <View style={{ flex: 1 }}>
              <Field
                label="Apartment *"
                value={form.apartmentId}
                onChangeText={setField('apartmentId')}
                placeholder="e.g. A104"
                autoCapitalize="characters"
              />
            </View>
            <View style={{ flex: 1 }}>
              <Field
                label="Block ID *"
                value={form.blockId}
                onChangeText={setField('blockId')}
                placeholder="e.g. B001"
                autoCapitalize="characters"
              />
            </View>
          </Row>

          <Text style={styles.fieldHeader}>Occupancy Type</Text>
          <Chips
            options={OCCUPANCY_OPTIONS}
            value={form.ownerOrTenant}
            onChange={setField('ownerOrTenant')}
            scroll={false}
          />

          <Row gap={12}>
            <View style={{ flex: 1 }}>
              <Field
                label="Family Members"
                value={form.familyMembers}
                onChangeText={setField('familyMembers')}
                keyboardType="numeric"
              />
            </View>
            <View style={{ flex: 1 }}>
              <Field
                label="Emergency Contact"
                value={form.emergencyContact}
                onChangeText={setField('emergencyContact')}
                placeholder="Phone"
                keyboardType="phone-pad"
                maxLength={10}
              />
            </View>
          </Row>

          <Button
            title="Complete Registration"
            icon="check"
            onPress={handleRegister}
            loading={busy}
            style={{ marginTop: 8 }}
          />
        </Sheet>
      )}

      {/* Search & Filter Bar */}
      <Field
        value={search}
        onChangeText={setSearch}
        placeholder="Search residents by name, flat, phone..."
        style={{ marginTop: 8, marginBottom: 8 }}
      />
      <Chips
        options={['All', 'Active', 'Tenant', 'Owner']}
        value={filter}
        onChange={setFilter}
      />

      <ErrorNote error={error} onRetry={reload} />

      {/* Resident List */}
      {loading ? (
        <Loading label="Loading resident directory..." />
      ) : !residents.length ? (
        <Empty
          icon="users"
          title="No residents found"
          message={search ? 'No residents matched your search query.' : 'No resident records registered yet.'}
          action={isManager && !showAddForm ? 'Register Resident' : null}
          onAction={() => setShowAddForm(true)}
        />
      ) : (
        residents.map((r) => {
          const initials = String(r.name || '?')
            .split(' ')
            .map((p) => p[0])
            .slice(0, 2)
            .join('')
            .toUpperCase();

          return (
            <Card key={r.residentId} style={styles.residentCard}>
              <Row style={{ alignItems: 'flex-start' }} gap={12}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{initials}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Row style={{ justifyContent: 'space-between', flexWrap: 'wrap' }}>
                    <Text style={styles.resName}>{r.name}</Text>
                    <Badge tone={r.status === 'Active' ? 'ok' : 'neutral'}>{r.status || 'Active'}</Badge>
                  </Row>
                  <Text style={styles.resMeta}>
                    ID: {r.residentId} · Flat {r.apartmentId} · {r.blockId}
                  </Text>
                  <View style={styles.tagRow}>
                    <Badge tone={r.ownerOrTenant === 'Owner' ? 'brass' : 'neutral'}>
                      {r.ownerOrTenant || 'Tenant'}
                    </Badge>
                    {r.familyMembers ? (
                      <Text style={styles.subDetail}>
                        <Feather name="users" size={11} color={colors.faint} /> {r.familyMembers} members
                      </Text>
                    ) : null}
                  </View>
                  <Row gap={14} style={{ marginTop: 8, flexWrap: 'wrap' }}>
                    {r.phone ? (
                      <Row gap={4}>
                        <Feather name="phone" size={12} color={colors.faint} />
                        <Text style={styles.contactText}>{r.phone}</Text>
                      </Row>
                    ) : null}
                    {r.email ? (
                      <Row gap={4}>
                        <Feather name="mail" size={12} color={colors.faint} />
                        <Text style={styles.contactText}>{r.email}</Text>
                      </Row>
                    ) : null}
                  </Row>
                </View>
              </Row>
            </Card>
          );
        })
      )}
      <View style={{ height: 40 }} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerArea: { marginTop: 6 },
  title: { fontFamily: fonts.display, fontSize: 26, color: colors.ink },
  actionCard: {
    backgroundColor: colors.ink2,
    borderColor: colors.ink2,
    marginBottom: 16,
    paddingVertical: 14,
  },
  actionSub: { fontFamily: fonts.body, fontSize: 12.5, color: colors.onInkMuted, marginTop: 2 },
  successBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#EBF7EE',
    borderColor: '#C3E6CB',
    borderWidth: 1,
    borderRadius: radius.md,
    padding: 12,
    marginBottom: 14,
  },
  successText: { fontFamily: fonts.semibold, fontSize: 13, color: colors.ok, flex: 1 },
  fieldHeader: {
    fontFamily: fonts.bold,
    fontSize: 12.5,
    color: colors.muted,
    marginBottom: 8,
    marginTop: 2,
  },
  residentCard: {
    marginBottom: 12,
    padding: 14,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.brassSoft,
    borderWidth: 1,
    borderColor: colors.brass,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: fonts.display,
    fontSize: 17,
    color: colors.brassDeep,
  },
  resName: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.text,
  },
  resMeta: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.muted,
    marginTop: 2,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },
  subDetail: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.muted,
  },
  contactText: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.textSoft,
  },
});
