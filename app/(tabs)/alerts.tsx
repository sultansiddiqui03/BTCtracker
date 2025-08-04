import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, Plus, TrendingUp, Volume2, Target, Trash2 } from 'lucide-react-native';

interface Alert {
  id: string;
  type: 'price' | 'indicator' | 'volume';
  condition: string;
  value: string;
  isActive: boolean;
  triggered: boolean;
  createdAt: string;
}

export default function AlertsScreen() {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      type: 'price',
      condition: 'Price above $68,000',
      value: '$68,000',
      isActive: true,
      triggered: false,
      createdAt: '2 hours ago',
    },
    {
      id: '2',
      type: 'indicator',
      condition: 'RSI below 30',
      value: '30',
      isActive: true,
      triggered: true,
      createdAt: '1 day ago',
    },
    {
      id: '3',
      type: 'volume',
      condition: 'Volume spike > 200%',
      value: '200%',
      isActive: false,
      triggered: false,
      createdAt: '3 days ago',
    },
  ]);

  const [newAlertType, setNewAlertType] = useState<'price' | 'indicator' | 'volume'>('price');
  const [newAlertValue, setNewAlertValue] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  const alertTypes = [
    { type: 'price' as const, label: 'Price Alert', icon: TrendingUp },
    { type: 'indicator' as const, label: 'Technical', icon: Target },
    { type: 'volume' as const, label: 'Volume', icon: Volume2 },
  ];

  const toggleAlert = (id: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, isActive: !alert.isActive } : alert
    ));
  };

  const deleteAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const createAlert = () => {
    if (!newAlertValue.trim()) return;

    const newAlert: Alert = {
      id: Date.now().toString(),
      type: newAlertType,
      condition: `${newAlertType} alert for ${newAlertValue}`,
      value: newAlertValue,
      isActive: true,
      triggered: false,
      createdAt: 'Just now',
    };

    setAlerts(prev => [newAlert, ...prev]);
    setNewAlertValue('');
    setShowCreateForm(false);
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'price': return TrendingUp;
      case 'indicator': return Target;
      case 'volume': return Volume2;
      default: return Bell;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'price': return '#2196F3';
      case 'indicator': return '#FFD700';
      case 'volume': return '#9C27B0';
      default: return '#888';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Price Alerts</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => setShowCreateForm(!showCreateForm)}
          >
            <Plus size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Alert Stats */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{alerts.filter(a => a.isActive).length}</Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{alerts.filter(a => a.triggered).length}</Text>
            <Text style={styles.statLabel}>Triggered</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{alerts.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
        </View>

        {/* Create Alert Form */}
        {showCreateForm && (
          <View style={styles.createCard}>
            <Text style={styles.cardTitle}>Create New Alert</Text>
            
            <View style={styles.alertTypeSelector}>
              {alertTypes.map((type) => (
                <TouchableOpacity
                  key={type.type}
                  style={[
                    styles.typeButton,
                    newAlertType === type.type && styles.typeButtonActive
                  ]}
                  onPress={() => setNewAlertType(type.type)}
                >
                  <type.icon size={16} color={newAlertType === type.type ? '#fff' : '#888'} />
                  <Text style={[
                    styles.typeButtonText,
                    newAlertType === type.type && styles.typeButtonTextActive
                  ]}>
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              style={styles.alertInput}
              value={newAlertValue}
              onChangeText={setNewAlertValue}
              placeholder={`Enter ${newAlertType} value...`}
              placeholderTextColor="#666"
            />

            <View style={styles.createActions}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setShowCreateForm(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.createAlertButton} onPress={createAlert}>
                <Text style={styles.createAlertButtonText}>Create Alert</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Alerts List */}
        <ScrollView style={styles.alertsList} showsVerticalScrollIndicator={false}>
          {alerts.map((alert) => {
            const AlertIcon = getAlertIcon(alert.type);
            const alertColor = getAlertColor(alert.type);
            
            return (
              <View key={alert.id} style={[
                styles.alertItem,
                alert.triggered && styles.alertItemTriggered,
                !alert.isActive && styles.alertItemInactive
              ]}>
                <View style={styles.alertHeader}>
                  <View style={styles.alertInfo}>
                    <View style={[styles.alertIcon, { backgroundColor: alertColor + '20' }]}>
                      <AlertIcon size={16} color={alertColor} />
                    </View>
                    <View style={styles.alertDetails}>
                      <Text style={styles.alertCondition}>{alert.condition}</Text>
                      <Text style={styles.alertTime}>{alert.createdAt}</Text>
                    </View>
                  </View>
                  <View style={styles.alertActions}>
                    <Switch
                      value={alert.isActive}
                      onValueChange={() => toggleAlert(alert.id)}
                      trackColor={{ false: '#333', true: '#2196F3' }}
                      thumbColor={alert.isActive ? '#fff' : '#888'}
                    />
                    <TouchableOpacity 
                      style={styles.deleteButton}
                      onPress={() => deleteAlert(alert.id)}
                    >
                      <Trash2 size={16} color="#FF1744" />
                    </TouchableOpacity>
                  </View>
                </View>
                
                <View style={styles.alertValue}>
                  <Text style={styles.alertValueText}>Target: {alert.value}</Text>
                  {alert.triggered && (
                    <View style={styles.triggeredBadge}>
                      <Text style={styles.triggeredText}>TRIGGERED</Text>
                    </View>
                  )}
                </View>
              </View>
            );
          })}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#888',
  },
  createCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 16,
  },
  alertTypeSelector: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#2a2a2a',
    borderWidth: 1,
    borderColor: '#333',
  },
  typeButtonActive: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  typeButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#888',
    marginLeft: 4,
  },
  typeButtonTextActive: {
    color: '#fff',
  },
  alertInput: {
    backgroundColor: '#2a2a2a',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#fff',
    marginBottom: 16,
  },
  createActions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#2a2a2a',
    borderWidth: 1,
    borderColor: '#333',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#888',
    textAlign: 'center',
  },
  createAlertButton: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#00C853',
  },
  createAlertButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
  alertsList: {
    flex: 1,
  },
  alertItem: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  alertItemTriggered: {
    borderColor: '#00C853',
    backgroundColor: '#1a2a1a',
  },
  alertItemInactive: {
    opacity: 0.6,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  alertInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  alertIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  alertDetails: {
    flex: 1,
  },
  alertCondition: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 2,
  },
  alertTime: {
    fontSize: 12,
    color: '#888',
  },
  alertActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  deleteButton: {
    padding: 8,
  },
  alertValue: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  alertValueText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2196F3',
  },
  triggeredBadge: {
    backgroundColor: '#00C853',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  triggeredText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
  },
});