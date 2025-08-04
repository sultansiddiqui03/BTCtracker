import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TrendingUp, TrendingDown, Eye, Activity, DollarSign } from 'lucide-react-native';

interface PriceData {
  price: number;
  change24h: number;
  changePercent: string;
  volume24h: number;
  marketCap: number;
  high24h: number;
  low24h: number;
}

interface ExchangePrice {
  exchange: string;
  price: number;
  volume: number;
  spread: number;
}

export default function PriceScreen() {
  const [priceData, setPriceData] = useState<PriceData>({
    price: 67840.25,
    change24h: 1247.82,
    changePercent: '+1.87%',
    volume24h: 28540000000,
    marketCap: 1340000000000,
    high24h: 68150.00,
    low24h: 66200.15,
  });

  const [exchangePrices] = useState<ExchangePrice[]>([
    { exchange: 'Binance', price: 67840.25, volume: 8500000000, spread: 0.05 },
    { exchange: 'Coinbase', price: 67838.50, volume: 5200000000, spread: 0.08 },
    { exchange: 'Kraken', price: 67845.75, volume: 3100000000, spread: 0.12 },
    { exchange: 'Bitfinex', price: 67839.80, volume: 2800000000, spread: 0.10 },
  ]);

  const [marketMetrics] = useState({
    fearGreedIndex: 72,
    dominance: 58.4,
    activeAddresses: 1250000,
    whaleTransactions: 45,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setPriceData(prev => ({
        ...prev,
        price: prev.price + (Math.random() - 0.5) * 50,
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const formatLargeNumber = (value: number) => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    return formatCurrency(value);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Bitcoin Live Tracker</Text>
          <View style={styles.statusIndicator}>
            <View style={styles.liveIndicator} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        </View>

        {/* Main Price Card */}
        <View style={styles.priceCard}>
          <View style={styles.priceHeader}>
            <Text style={styles.symbol}>BTC/USD</Text>
            <View style={styles.trendIndicator}>
              {priceData.change24h >= 0 ? (
                <TrendingUp size={20} color="#00C853" />
              ) : (
                <TrendingDown size={20} color="#FF1744" />
              )}
              <Text style={[styles.changePercent, { color: priceData.change24h >= 0 ? '#00C853' : '#FF1744' }]}>
                {priceData.changePercent}
              </Text>
            </View>
          </View>
          
          <Text style={styles.mainPrice}>
            {formatCurrency(priceData.price)}
          </Text>
          
          <Text style={[styles.change24h, { color: priceData.change24h >= 0 ? '#00C853' : '#FF1744' }]}>
            {priceData.change24h >= 0 ? '+' : ''}{formatCurrency(priceData.change24h)}
          </Text>
        </View>

        {/* Market Overview */}
        <View style={styles.overviewCard}>
          <Text style={styles.cardTitle}>Market Overview</Text>
          <View style={styles.metricsGrid}>
            <View style={styles.metric}>
              <Text style={styles.metricLabel}>24h High</Text>
              <Text style={styles.metricValue}>{formatCurrency(priceData.high24h)}</Text>
            </View>
            <View style={styles.metric}>
              <Text style={styles.metricLabel}>24h Low</Text>
              <Text style={styles.metricValue}>{formatCurrency(priceData.low24h)}</Text>
            </View>
            <View style={styles.metric}>
              <Text style={styles.metricLabel}>Volume 24h</Text>
              <Text style={styles.metricValue}>{formatLargeNumber(priceData.volume24h)}</Text>
            </View>
            <View style={styles.metric}>
              <Text style={styles.metricLabel}>Market Cap</Text>
              <Text style={styles.metricValue}>{formatLargeNumber(priceData.marketCap)}</Text>
            </View>
          </View>
        </View>

        {/* Exchange Prices */}
        <View style={styles.exchangeCard}>
          <Text style={styles.cardTitle}>Exchange Prices</Text>
          {exchangePrices.map((exchange, index) => (
            <View key={index} style={styles.exchangeRow}>
              <View style={styles.exchangeInfo}>
                <Text style={styles.exchangeName}>{exchange.exchange}</Text>
                <Text style={styles.exchangeVolume}>Vol: {formatLargeNumber(exchange.volume)}</Text>
              </View>
              <View style={styles.exchangePriceInfo}>
                <Text style={styles.exchangePrice}>{formatCurrency(exchange.price)}</Text>
                <Text style={styles.exchangeSpread}>Spread: {exchange.spread}%</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Market Sentiment */}
        <View style={styles.sentimentCard}>
          <Text style={styles.cardTitle}>Market Sentiment</Text>
          <View style={styles.sentimentGrid}>
            <View style={styles.sentimentItem}>
              <View style={styles.sentimentIcon}>
                <Eye size={18} color="#FFD700" />
              </View>
              <Text style={styles.sentimentLabel}>Fear & Greed</Text>
              <Text style={styles.sentimentValue}>{marketMetrics.fearGreedIndex}</Text>
              <Text style={styles.sentimentStatus}>Greed</Text>
            </View>
            <View style={styles.sentimentItem}>
              <View style={styles.sentimentIcon}>
                <Activity size={18} color="#2196F3" />
              </View>
              <Text style={styles.sentimentLabel}>Dominance</Text>
              <Text style={styles.sentimentValue}>{marketMetrics.dominance}%</Text>
              <Text style={styles.sentimentStatus}>Strong</Text>
            </View>
            <View style={styles.sentimentItem}>
              <View style={styles.sentimentIcon}>
                <DollarSign size={18} color="#00C853" />
              </View>
              <Text style={styles.sentimentLabel}>Whale Moves</Text>
              <Text style={styles.sentimentValue}>{marketMetrics.whaleTransactions}</Text>
              <Text style={styles.sentimentStatus}>Active</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsCard}>
          <Text style={styles.cardTitle}>Quick Actions</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Set Alert</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Calculate Position</Text>
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
    color: '#FFD700',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  liveIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00C853',
    marginRight: 8,
  },
  liveText: {
    color: '#00C853',
    fontSize: 12,
    fontWeight: '600',
  },
  priceCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  priceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  symbol: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  trendIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  changePercent: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  mainPrice: {
    fontSize: 48,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  change24h: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  overviewCard: {
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
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metric: {
    width: '48%',
    marginBottom: 16,
  },
  metricLabel: {
    fontSize: 14,
    color: '#888',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  exchangeCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  exchangeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  exchangeInfo: {
    flex: 1,
  },
  exchangeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 2,
  },
  exchangeVolume: {
    fontSize: 12,
    color: '#888',
  },
  exchangePriceInfo: {
    alignItems: 'flex-end',
  },
  exchangePrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 2,
  },
  exchangeSpread: {
    fontSize: 12,
    color: '#888',
  },
  sentimentCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  sentimentGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sentimentItem: {
    alignItems: 'center',
    flex: 1,
  },
  sentimentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2a2a2a',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  sentimentLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  sentimentValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 2,
  },
  sentimentStatus: {
    fontSize: 11,
    color: '#00C853',
    fontWeight: '600',
  },
  actionsCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#333',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 4,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});