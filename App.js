import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';

const API_KEY = 'oN2GDy2pF5GflIQhEeVGuPjM1HnTVy4m';
// Símbolos que suelen funcionar en el plan gratuito
const SYMBOLS = ['AAPL', 'TSLA', 'AMZN'];

export default function App() {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchQuotes = useCallback(async () => {
    try {
      setError(null);
      const results = [];
      const errors = [];

      for (const symbol of SYMBOLS) {
        try {
          const url = `https://financialmodelingprep.com/stable/quote?symbol=${symbol}&apikey=${API_KEY}`;
          const response = await fetch(url);
          if (!response.ok) {
            const text = await response.text();
            errors.push(`${symbol}: HTTP ${response.status}`);
            continue;
          }
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            results.push(data[0]);
          }
        } catch (e) {
          errors.push(`${symbol}: ${e.message}`);
        }
      }

      setQuotes(results);
      if (results.length === 0 && errors.length > 0) {
        setError(errors.join('\n'));
      }
    } catch (e) {
      setError(e.message || 'Error de red');
      setQuotes([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchQuotes();
  }, [fetchQuotes]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchQuotes();
  };

  const formatPrice = (n) =>
    n != null ? n.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '—';

  const formatChange = (n) =>
    n != null ? (n >= 0 ? '+' : '') + n.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '—';

  const formatPercent = (n) =>
    n != null ? (n >= 0 ? '+' : '') + n.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%' : '—';

  const formatMarketCap = (n) => {
    if (n == null) return '—';
    if (n >= 1e12) return (n / 1e12).toFixed(2) + ' T';
    if (n >= 1e9) return (n / 1e9).toFixed(1) + ' B';
    return n.toLocaleString('es-ES');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0c0d0b" />
      <View style={styles.header}>
        <View>
          <Text style={styles.brand}>GBC</Text>
          <Text style={styles.brandSub}>Inversión</Text>
        </View>
        <Text style={styles.headerMeta}>Cotizaciones</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#8FA38A" />
        }
      >
        {loading && (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#8FA38A" />
            <Text style={styles.loadingText}>Cargando mercado…</Text>
          </View>
        )}

        {error && !loading && quotes.length === 0 && (
          <View style={styles.errorBox}>
            <Text style={styles.errorTitle}>No se pudieron cargar los datos</Text>
            <Text style={styles.errorMsg}>{error}</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={fetchQuotes}>
              <Text style={styles.retryText}>Reintentar</Text>
            </TouchableOpacity>
          </View>
        )}

        {!loading && quotes.length > 0 && (
          <>
            <Text style={styles.sectionLabel}>Seguimiento</Text>
            {quotes.map((q) => {
              const positive = (q.change ?? 0) >= 0;
              return (
                <View key={q.symbol} style={styles.card}>
                  <View style={styles.cardTop}>
                    <View>
                      <Text style={styles.symbol}>{q.symbol}</Text>
                      <Text style={styles.name} numberOfLines={1}>{q.name}</Text>
                    </View>
                    <View style={styles.priceBlock}>
                      <Text style={styles.price}>{formatPrice(q.price)}</Text>
                      <Text style={[styles.change, positive ? styles.positive : styles.negative]}>
                        {formatChange(q.change)}  {formatPercent(q.changePercentage)}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.metaRow}>
                    <Meta label="Apertura" value={formatPrice(q.open)} />
                    <Meta label="Cierre ant." value={formatPrice(q.previousClose)} />
                    <Meta label="Máx / Mín" value={`${formatPrice(q.dayHigh)} / ${formatPrice(q.dayLow)}`} />
                  </View>
                  <View style={styles.metaRow}>
                    <Meta label="Capitalización" value={formatMarketCap(q.marketCap)} />
                    <Meta label="Volumen" value={q.volume ? q.volume.toLocaleString('es-ES') : '—'} />
                    <Meta label="Bolsa" value={q.exchange || '—'} />
                  </View>
                </View>
              );
            })}
            <Text style={styles.footerNote}>
              Datos de Financial Modeling Prep · Plan gratuito (símbolos limitados)
            </Text>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function Meta({ label, value }) {
  return (
    <View style={styles.meta}>
      <Text style={styles.metaLabel}>{label}</Text>
      <Text style={styles.metaValue} numberOfLines={1}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0c0d0b',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#2a2c28',
  },
  brand: {
    color: '#eceae3',
    fontSize: 28,
    fontWeight: '600',
    letterSpacing: 1,
  },
  brandSub: {
    color: '#8FA38A',
    fontSize: 15,
    marginTop: -2,
    letterSpacing: 0.5,
  },
  headerMeta: {
    color: '#7a7d76',
    fontSize: 13,
    letterSpacing: 0.5,
  },
  scroll: {
    padding: 16,
    paddingBottom: 40,
  },
  center: {
    alignItems: 'center',
    marginTop: 80,
  },
  loadingText: {
    color: '#c5cbb6',
    marginTop: 12,
    fontSize: 15,
  },
  errorBox: {
    backgroundColor: '#1a1c18',
    borderRadius: 12,
    padding: 20,
    marginTop: 24,
    borderWidth: 1,
    borderColor: '#3a2a24',
  },
  errorTitle: {
    color: '#eceae3',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  errorMsg: {
    color: '#c5cbb6',
    fontSize: 13,
    lineHeight: 18,
  },
  retryBtn: {
    marginTop: 16,
    alignSelf: 'flex-start',
    backgroundColor: '#8FA38A',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: '#0c0d0b',
    fontWeight: '600',
    fontSize: 14,
  },
  sectionLabel: {
    color: '#8FA38A',
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 12,
    marginTop: 4,
  },
  card: {
    backgroundColor: '#141612',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#2a2c28',
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  symbol: {
    color: '#eceae3',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  name: {
    color: '#8a8e86',
    fontSize: 13,
    marginTop: 2,
    maxWidth: 180,
  },
  priceBlock: {
    alignItems: 'flex-end',
  },
  price: {
    color: '#eceae3',
    fontSize: 22,
    fontWeight: '600',
  },
  change: {
    fontSize: 13,
    marginTop: 2,
    fontWeight: '500',
  },
  positive: {
    color: '#8FA38A',
  },
  negative: {
    color: '#c17b6e',
  },
  metaRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
  meta: {
    flex: 1,
  },
  metaLabel: {
    color: '#6e726c',
    fontSize: 11,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  metaValue: {
    color: '#c5cbb6',
    fontSize: 13,
    marginTop: 2,
    fontWeight: '500',
  },
  footerNote: {
    color: '#5a5e58',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 20,
    lineHeight: 16,
  },
});
          
