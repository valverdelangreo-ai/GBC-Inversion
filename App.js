import React from 'react';
import { StyleSheet, Text, View, FlatList, SafeAreaView, StatusBar, TouchableOpacity } from 'react-native';

const MOCK_DATA = [
  { id: '1', ticker: 'MSFT', name: 'Microsoft Corp.', price: 335.20, fairValue: 290.00, marginOfSafety: 20, status: 'VIGILANCIA', distance: '+15.5%' },
  { id: '2', ticker: 'GOOGL', name: 'Alphabet Inc.', price: 125.40, fairValue: 150.00, marginOfSafety: 25, status: 'EN ZONA', distance: '-4.2%' },
  { id: '3', ticker: 'V', name: 'Visa Inc.', price: 240.10, fairValue: 245.00, marginOfSafety: 15, status: 'CONFIRMAR', distance: '-1.5%' },
  { id: '4', ticker: 'TSLA', name: 'Tesla Inc.', price: 180.50, fairValue: 140.00, marginOfSafety: 30, status: 'PELIGRO', distance: '+28.9%' }
];

export default function App() {
  const getStatusStyle = (status) => {
    switch(status) {
      case 'EN ZONA': return { bg: '#0A2E13', text: '#39FF14', border: '#1A5925' }; 
      case 'VIGILANCIA': return { bg: '#332700', text: '#FFBF00', border: '#664E00' }; 
      case 'PELIGRO': return { bg: '#330A0A', text: '#FF0033', border: '#661414' }; 
      case 'CONFIRMAR': return { bg: '#0A1E33', text: '#00BFFF', border: '#143C66' }; 
      default: return { bg: '#1E1E1E', text: '#888888', border: '#333333' };
    }
  };

  const renderItem = ({ item }) => {
    const statusStyle = getStatusStyle(item.status);
    return (
      <TouchableOpacity activeOpacity={0.7} style={styles.card}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.ticker}>{item.ticker}</Text>
            <Text style={styles.companyName}>{item.name}</Text>
          </View>
          <Text style={styles.price}>${item.price.toFixed(2)}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.metricsRow}>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>VALOR RAZ.</Text>
            <Text style={styles.metricValue}>${item.fairValue.toFixed(2)}</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>DISTANCIA</Text>
            <Text style={[styles.metricValue, { color: item.distance.includes('-') ? '#39FF14' : '#FF0033' }]}>
              {item.distance}
            </Text>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg, borderColor: statusStyle.border }]}>
          <Text style={[styles.statusText, { color: statusStyle.text }]}>● {item.status}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>SISTEMA GBC</Text>
        <Text style={styles.headerSubtitle}>RADAR DE INVERSIÓN</Text>
      </View>
      <FlatList
        data={MOCK_DATA}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listPadding}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },
  header: { paddingHorizontal: 16, paddingTop: 40, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#222' },
  headerTitle: { color: '#FFFFFF', fontSize: 22, fontWeight: '900', letterSpacing: 1 },
  headerSubtitle: { color: '#888888', fontSize: 12, fontWeight: '600', letterSpacing: 2, marginTop: 2 },
  listPadding: { paddingBottom: 100 },
  card: { backgroundColor: '#0F0F0F', marginHorizontal: 16, marginTop: 16, padding: 16, borderRadius: 8, borderWidth: 1, borderColor: '#222222' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  ticker: { color: '#FFFFFF', fontSize: 20, fontWeight: '800' },
  companyName: { color: '#666666', fontSize: 12, marginTop: 2 },
  price: { color: '#FFFFFF', fontSize: 24, fontWeight: 'bold' },
  divider: { height: 1, backgroundColor: '#222', marginVertical: 12 },
  metricsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  metric: { flex: 1 },
  metricLabel: { color: '#666666', fontSize: 10, fontWeight: '700', marginBottom: 4 },
  metricValue: { color: '#E0E0E0', fontSize: 14, fontWeight: '600' },
  statusBadge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 4, borderWidth: 1 },
  statusText: { fontSize: 11, fontWeight: '900', letterSpacing: 1 }
});
