import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BookOpen, ArrowUp, ArrowDown, Activity } from 'lucide-react-native';

interface OrderBookEntry {
  price: number;
  amount: number;
  total: number;
}

interface MarketDepth {
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
  spread: number;
  midPrice: number;
}

export default function OrderBookScreen() {
  const [marketDepth, setMarketDepth] = useState<MarketDepth>({
    bids: [],
    asks: [],
    spread: 0.5,
    midPrice: 67840.25,
  });

  const [selectedDepth, setSelectedDepth] = useState(20);
  const depthOptions = [10, 20, 50, 100];

  useEffect(() => {
    // Generate mock order book data
    const generateOrderBook = () => {
      const midPrice = 67840.25 + (Math.random() - 0.5) * 10;
      const spread = 0.3 + Math.random() * 0.4;
      
      const bids: OrderBookEntry[] = [];
      const asks: OrderBookEntry[] = [];
      
      let totalBid = 0;
      let totalAsk = 0;
      
      for (let i = 0; i < selectedDepth; i++) {
        const bidPrice = midPrice - (spread / 2) - (i * 0.25);
        const askPrice = midPrice + (spread / 2) + (i * 0.25);
        
        const bidAmount = Math.random() * 5 + 0.1;
        const askAmount = Math.random() * 5 + 0.1;
        
        totalBid += bidAmount;
        totalAsk += askAmount;
        
        bids.push({
          price: bidPrice,
          amount: bidAmount,
          total: totalBid,
        });
        
        asks.push({
          price: askPrice,
          amount: askAmount,
          total: totalAsk,
        });
      }
      
      setMarketDepth({
        bids: bids.sort((a, b) => b.price - a.price),
        asks: asks.sort((a, b) => a.price - b.price),
        spread,
        midPrice,
      });
    };

    generateOrderBook();
    const interval = setInterval(generateOrderBook, 500);
    return () => clearInterval(interval);
  }, [selectedDepth]);

  const formatPrice = (price: number) => price.toFixed(2);
  const formatAmount = (amount: number) => amount.toFixed(4);

  const getVolumeBarWidth = (amount: number, maxAmount: number) => {
    return Math.max((amount / maxAmount) * 100, 5);
  };

  const maxBidAmount = Math.max(...marketDepth.bids.map(b => b.amount));
  const maxAskAmount = Math.max(...marketDepth.asks.map(a => a.amount));

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Order Book</Text>
          <View style={styles.depthSelector}>
            {depthOptions.map((depth) => (
              <TouchableOpacity
                key={depth}
                style={[
                  styles.depthButton,
                  selectedDepth === depth && styles.depthButtonActive
                ]}
                onPress={() => setSelectedDepth(depth)}
              >
                <Text style={[
                  styles.depthText,
                  selectedDepth === depth && styles.depthTextActive
                ]}>
                  {depth}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Market Stats */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Mid Price</Text>
            <Text style={styles.statValue}>${formatPrice(marketDepth.midPrice)}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Spread</Text>
            <Text style={styles.statValue}>{marketDepth.spread.toFixed(2)}%</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Total Bids</Text>
            <Text style={styles.statValue}>{marketDepth.bids.length}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Total Asks</Text>
            <Text style={styles.statValue}>{marketDepth.asks.length}</Text>
          </View>
        </View>

        {/* Order Book */}
        <View style={styles.orderBookCard}>
          <View style={styles.orderBookHeader}>
            <Text style={styles.columnHeader}>Price</Text>
            <Text style={styles.columnHeader}>Amount</Text>
            <Text style={styles.columnHeader}>Total</Text>
          </View>

          {/* Asks (Sell Orders) */}
          <View style={styles.asksSection}>
            <View style={styles.sectionHeader}>
              <ArrowUp size={16} color="#FF1744" />
              <Text style={styles.sectionTitle}>Asks</Text>
            </View>
            <ScrollView style={styles.ordersContainer} showsVerticalScrollIndicator={false}>
              {marketDepth.asks.slice().reverse().map((ask, index) => (
                <View key={index} style={styles.orderRow}>
                  <View 
                    style={[
                      styles.volumeBar,
                      styles.askVolumeBar,
                      { width: `${getVolumeBarWidth(ask.amount, maxAskAmount)}%` }
                    ]}
                  />
                  <Text style={[styles.priceText, styles.askPrice]}>${formatPrice(ask.price)}</Text>
                  <Text style={styles.amountText}>{formatAmount(ask.amount)}</Text>
                  <Text style={styles.totalText}>{formatAmount(ask.total)}</Text>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Spread */}
          <View style={styles.spreadRow}>
            <Activity size={16} color="#FFD700" />
            <Text style={styles.spreadText}>
              Spread: ${(marketDepth.asks[0]?.price - marketDepth.bids[0]?.price || 0).toFixed(2)}
            </Text>
          </View>

          {/* Bids (Buy Orders) */}
          <View style={styles.bidsSection}>
            <View style={styles.sectionHeader}>
              <ArrowDown size={16} color="#00C853" />
              <Text style={styles.sectionTitle}>Bids</Text>
            </View>
            <ScrollView style={styles.ordersContainer} showsVerticalScrollIndicator={false}>
              {marketDepth.bids.map((bid, index) => (
                <View key={index} style={styles.orderRow}>
                  <View 
                    style={[
                      styles.volumeBar,
                      styles.bidVolumeBar,
                      { width: `${getVolumeBarWidth(bid.amount, maxBidAmount)}%` }
                    ]}
                  />
                  <Text style={[styles.priceText, styles.bidPrice]}>${formatPrice(bid.price)}</Text>
                  <Text style={styles.amountText}>{formatAmount(bid.amount)}</Text>
                  <Text style={styles.totalText}>{formatAmount(bid.total)}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
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
  depthSelector: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: '#333',
  },
  depthButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  depthButtonActive: {
    backgroundColor: '#2196F3',
  },
  depthText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#888',
  },
  depthTextActive: {
    color: '#fff',
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
  statLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  orderBookCard: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  orderBookHeader: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    marginBottom: 8,
  },
  columnHeader: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: '#888',
    textAlign: 'center',
  },
  asksSection: {
    flex: 1,
  },
  bidsSection: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 8,
  },
  ordersContainer: {
    flex: 1,
  },
  orderRow: {
    flexDirection: 'row',
    paddingVertical: 4,
    paddingHorizontal: 4,
    position: 'relative',
  },
  volumeBar: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0.2,
    borderRadius: 2,
  },
  bidVolumeBar: {
    backgroundColor: '#00C853',
  },
  askVolumeBar: {
    backgroundColor: '#FF1744',
  },
  priceText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  bidPrice: {
    color: '#00C853',
  },
  askPrice: {
    color: '#FF1744',
  },
  amountText: {
    flex: 1,
    fontSize: 13,
    color: '#fff',
    textAlign: 'center',
  },
  totalText: {
    flex: 1,
    fontSize: 13,
    color: '#888',
    textAlign: 'center',
  },
  spreadRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    marginVertical: 8,
  },
  spreadText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFD700',
    marginLeft: 8,
  },
});