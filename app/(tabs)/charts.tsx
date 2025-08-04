import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChartBar as BarChart3, TrendingUp, Activity, Target } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface ChartData {
  time: string;
  price: number;
  volume: number;
}

interface TechnicalIndicator {
  name: string;
  value: number;
  signal: 'BUY' | 'SELL' | 'NEUTRAL';
  color: string;
}

export default function ChartsScreen() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('1m');
  const [selectedIndicators, setSelectedIndicators] = useState(['RSI', 'MACD', 'BB']);

  const timeframes = ['1m', '5m', '15m', '30m', '1h', '4h', '1d'];
  
  const indicators: TechnicalIndicator[] = [
    { name: 'RSI (14)', value: 67.4, signal: 'NEUTRAL', color: '#FFD700' },
    { name: 'MACD', value: 234.5, signal: 'BUY', color: '#00C853' },
    { name: 'BB Upper', value: 68200, signal: 'SELL', color: '#FF1744' },
    { name: 'EMA (20)', value: 67650, signal: 'BUY', color: '#00C853' },
    { name: 'Volume', value: 145.8, signal: 'BUY', color: '#2196F3' },
    { name: 'ATR', value: 890.2, signal: 'NEUTRAL', color: '#FFD700' },
  ];

  const availableIndicators = [
    'RSI', 'MACD', 'BB', 'EMA', 'SMA', 'Stoch', 'Williams %R', 'CCI', 'MFI', 'ADX',
    'VWAP', 'Parabolic SAR', 'Ichimoku', 'Fibonacci', 'Volume Profile'
  ];

  const chartData: ChartData[] = Array.from({ length: 100 }, (_, i) => ({
    time: `${i}:00`,
    price: 67000 + Math.random() * 2000,
    volume: Math.random() * 100,
  }));

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case 'BUY': return '#00C853';
      case 'SELL': return '#FF1744';
      default: return '#FFD700';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Advanced Charts</Text>
          <View style={styles.headerStats}>
            <Text style={styles.currentPrice}>$67,840.25</Text>
            <Text style={styles.priceChange}>+1.87%</Text>
          </View>
        </View>

        {/* Timeframe Selector */}
        <View style={styles.timeframeCard}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.timeframeButtons}>
              {timeframes.map((timeframe) => (
                <TouchableOpacity
                  key={timeframe}
                  style={[
                    styles.timeframeButton,
                    selectedTimeframe === timeframe && styles.timeframeButtonActive
                  ]}
                  onPress={() => setSelectedTimeframe(timeframe)}
                >
                  <Text style={[
                    styles.timeframeText,
                    selectedTimeframe === timeframe && styles.timeframeTextActive
                  ]}>
                    {timeframe}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Chart Placeholder */}
        <View style={styles.chartCard}>
          <View style={styles.chartContainer}>
            <View style={styles.chartPlaceholder}>
              <BarChart3 size={48} color="#333" />
              <Text style={styles.chartPlaceholderText}>
                Advanced Chart Visualization
              </Text>
              <Text style={styles.chartPlaceholderSubtext}>
                Candlestick chart with volume bars
              </Text>
            </View>
          </View>
        </View>

        {/* Technical Indicators */}
        <View style={styles.indicatorsCard}>
          <View style={styles.indicatorsHeader}>
            <Text style={styles.cardTitle}>Technical Indicators</Text>
            <TouchableOpacity style={styles.configButton}>
              <Target size={16} color="#2196F3" />
              <Text style={styles.configButtonText}>Configure</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.indicatorsGrid}>
            {indicators.map((indicator, index) => (
              <View key={index} style={styles.indicatorItem}>
                <View style={styles.indicatorHeader}>
                  <Text style={styles.indicatorName}>{indicator.name}</Text>
                  <View style={[styles.signalBadge, { backgroundColor: getSignalColor(indicator.signal) }]}>
                    <Text style={styles.signalText}>{indicator.signal}</Text>
                  </View>
                </View>
                <Text style={styles.indicatorValue}>
                  {indicator.name === 'RSI (14)' || indicator.name === 'Volume' 
                    ? indicator.value.toFixed(1)
                    : `$${indicator.value.toLocaleString()}`
                  }
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Available Indicators */}
        <View style={styles.availableCard}>
          <Text style={styles.cardTitle}>Available Indicators</Text>
          <View style={styles.indicatorTags}>
            {availableIndicators.map((indicator, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.indicatorTag,
                  selectedIndicators.includes(indicator) && styles.indicatorTagActive
                ]}
                onPress={() => {
                  if (selectedIndicators.includes(indicator)) {
                    setSelectedIndicators(prev => prev.filter(i => i !== indicator));
                  } else {
                    setSelectedIndicators(prev => [...prev, indicator]);
                  }
                }}
              >
                <Text style={[
                  styles.indicatorTagText,
                  selectedIndicators.includes(indicator) && styles.indicatorTagTextActive
                ]}>
                  {indicator}
                </Text>
              </TouchableOpacity>
            ))}
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
  headerStats: {
    alignItems: 'flex-end',
  },
  currentPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  priceChange: {
    fontSize: 14,
    fontWeight: '600',
    color: '#00C853',
  },
  timeframeCard: {
    marginBottom: 16,
  },
  timeframeButtons: {
    flexDirection: 'row',
    paddingHorizontal: 4,
  },
  timeframeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 12,
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#333',
  },
  timeframeButtonActive: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  timeframeText: {
    color: '#888',
    fontSize: 14,
    fontWeight: '600',
  },
  timeframeTextActive: {
    color: '#fff',
  },
  chartCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  chartContainer: {
    height: 300,
    borderRadius: 12,
    backgroundColor: '#0f0f0f',
  },
  chartPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartPlaceholderText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
  },
  chartPlaceholderSubtext: {
    fontSize: 14,
    color: '#444',
    marginTop: 8,
  },
  indicatorsCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  indicatorsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  configButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  configButtonText: {
    color: '#2196F3',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  indicatorsGrid: {
    gap: 12,
  },
  indicatorItem: {
    backgroundColor: '#2a2a2a',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  indicatorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  indicatorName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  signalBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  signalText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
  },
  indicatorValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  availableCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#333',
  },
  indicatorTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  indicatorTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#2a2a2a',
    borderWidth: 1,
    borderColor: '#333',
  },
  indicatorTagActive: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  indicatorTagText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#888',
  },
  indicatorTagTextActive: {
    color: '#fff',
  },
});