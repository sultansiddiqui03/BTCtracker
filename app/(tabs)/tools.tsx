import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calculator, Target, TrendingUp, ChartPie as PieChart, DollarSign } from 'lucide-react-native';

interface PositionCalculation {
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  riskAmount: number;
  positionSize: number;
  riskReward: number;
  potentialProfit: number;
  potentialLoss: number;
}

export default function ToolsScreen() {
  const [entryPrice, setEntryPrice] = useState('67840');
  const [stopLoss, setStopLoss] = useState('67000');
  const [takeProfit, setTakeProfit] = useState('69500');
  const [riskAmount, setRiskAmount] = useState('1000');
  const [calculation, setCalculation] = useState<PositionCalculation | null>(null);

  const calculatePosition = () => {
    const entry = parseFloat(entryPrice);
    const stop = parseFloat(stopLoss);
    const target = parseFloat(takeProfit);
    const risk = parseFloat(riskAmount);

    if (!entry || !stop || !target || !risk) return;

    const riskPerShare = Math.abs(entry - stop);
    const rewardPerShare = Math.abs(target - entry);
    const positionSize = risk / riskPerShare;
    const riskReward = rewardPerShare / riskPerShare;
    const potentialProfit = positionSize * rewardPerShare;
    const potentialLoss = risk;

    setCalculation({
      entryPrice: entry,
      stopLoss: stop,
      takeProfit: target,
      riskAmount: risk,
      positionSize,
      riskReward,
      potentialProfit,
      potentialLoss,
    });
  };

  const riskMetrics = [
    { label: 'Portfolio Risk', value: '2.5%', status: 'Safe', color: '#00C853' },
    { label: 'Volatility (ATR)', value: '$892.15', status: 'High', color: '#FFD700' },
    { label: 'Sharpe Ratio', value: '1.42', status: 'Good', color: '#00C853' },
    { label: 'Max Drawdown', value: '8.7%', status: 'Normal', color: '#FFD700' },
  ];

  const tradingMetrics = [
    { label: 'Win Rate', value: '68%', icon: Target },
    { label: 'Avg R:R', value: '2.1:1', icon: TrendingUp },
    { label: 'Total Trades', value: '247', icon: PieChart },
    { label: 'Profit Factor', value: '1.85', icon: DollarSign },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Trading Tools</Text>
          <View style={styles.headerIcon}>
            <Calculator size={24} color="#2196F3" />
          </View>
        </View>

        {/* Position Calculator */}
        <View style={styles.calculatorCard}>
          <Text style={styles.cardTitle}>Position Size Calculator</Text>
          
          <View style={styles.inputGrid}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Entry Price ($)</Text>
              <TextInput
                style={styles.input}
                value={entryPrice}
                onChangeText={setEntryPrice}
                keyboardType="numeric"
                placeholder="67840"
                placeholderTextColor="#666"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Stop Loss ($)</Text>
              <TextInput
                style={styles.input}
                value={stopLoss}
                onChangeText={setStopLoss}
                keyboardType="numeric"
                placeholder="67000"
                placeholderTextColor="#666"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Take Profit ($)</Text>
              <TextInput
                style={styles.input}
                value={takeProfit}
                onChangeText={setTakeProfit}
                keyboardType="numeric"
                placeholder="69500"
                placeholderTextColor="#666"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Risk Amount ($)</Text>
              <TextInput
                style={styles.input}
                value={riskAmount}
                onChangeText={setRiskAmount}
                keyboardType="numeric"
                placeholder="1000"
                placeholderTextColor="#666"
              />
            </View>
          </View>
          
          <TouchableOpacity style={styles.calculateButton} onPress={calculatePosition}>
            <Text style={styles.calculateButtonText}>Calculate Position</Text>
          </TouchableOpacity>

          {calculation && (
            <View style={styles.resultsCard}>
              <Text style={styles.resultsTitle}>Calculation Results</Text>
              <View style={styles.resultsGrid}>
                <View style={styles.resultItem}>
                  <Text style={styles.resultLabel}>Position Size</Text>
                  <Text style={styles.resultValue}>{calculation.positionSize.toFixed(6)} BTC</Text>
                </View>
                <View style={styles.resultItem}>
                  <Text style={styles.resultLabel}>Risk:Reward</Text>
                  <Text style={[styles.resultValue, { color: calculation.riskReward >= 2 ? '#00C853' : '#FFD700' }]}>
                    1:{calculation.riskReward.toFixed(2)}
                  </Text>
                </View>
                <View style={styles.resultItem}>
                  <Text style={styles.resultLabel}>Potential Profit</Text>
                  <Text style={[styles.resultValue, { color: '#00C853' }]}>
                    +${calculation.potentialProfit.toFixed(2)}
                  </Text>
                </View>
                <View style={styles.resultItem}>
                  <Text style={styles.resultLabel}>Potential Loss</Text>
                  <Text style={[styles.resultValue, { color: '#FF1744' }]}>
                    -${calculation.potentialLoss.toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Risk Management */}
        <View style={styles.riskCard}>
          <Text style={styles.cardTitle}>Risk Management</Text>
          <View style={styles.riskGrid}>
            {riskMetrics.map((metric, index) => (
              <View key={index} style={styles.riskItem}>
                <Text style={styles.riskLabel}>{metric.label}</Text>
                <Text style={styles.riskValue}>{metric.value}</Text>
                <View style={[styles.riskStatus, { backgroundColor: metric.color + '20', borderColor: metric.color }]}>
                  <Text style={[styles.riskStatusText, { color: metric.color }]}>{metric.status}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Trading Performance */}
        <View style={styles.performanceCard}>
          <Text style={styles.cardTitle}>Trading Performance</Text>
          <View style={styles.metricsGrid}>
            {tradingMetrics.map((metric, index) => (
              <View key={index} style={styles.metricItem}>
                <View style={styles.metricIcon}>
                  <metric.icon size={20} color="#2196F3" />
                </View>
                <Text style={styles.metricLabel}>{metric.label}</Text>
                <Text style={styles.metricValue}>{metric.value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Market Analysis Tools */}
        <View style={styles.analysisCard}>
          <Text style={styles.cardTitle}>Market Analysis</Text>
          <View style={styles.analysisTools}>
            <TouchableOpacity style={styles.analysisTool}>
              <Text style={styles.analysisToolText}>Fibonacci Calculator</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.analysisTool}>
              <Text style={styles.analysisToolText}>Support/Resistance</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.analysisTool}>
              <Text style={styles.analysisToolText}>Pivot Points</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.analysisTool}>
              <Text style={styles.analysisToolText}>Volume Profile</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  calculatorCard: {
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
  inputGrid: {
    gap: 16,
    marginBottom: 20,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#888',
  },
  input: {
    backgroundColor: '#2a2a2a',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#fff',
  },
  calculateButton: {
    backgroundColor: '#2196F3',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  calculateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resultsCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#444',
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 16,
  },
  resultsGrid: {
    gap: 12,
  },
  resultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultLabel: {
    fontSize: 14,
    color: '#888',
  },
  resultValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  riskCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  riskGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  riskItem: {
    width: '48%',
    backgroundColor: '#2a2a2a',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  riskLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 8,
  },
  riskValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  riskStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  riskStatusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  performanceCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metricItem: {
    width: '48%',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  metricIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0a0a0a',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  metricLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  analysisCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#333',
  },
  analysisTools: {
    gap: 12,
  },
  analysisTool: {
    backgroundColor: '#2a2a2a',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  analysisToolText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
});