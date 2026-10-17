import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, StatusBar, ScrollView } from 'react-native';

const API_KEY = 'oN2GDy2pF5GflIQhEeVGuPjM1HnTVy4m';

export default function App() {
  const [log, setLog] = useState("Iniciando sistema de diagnóstico...\n");

  const addLog = (msg) => setLog(prev => prev + msg + "\n\n");

  useEffect(() => {
    const probarAPI = async () => {
      try {
        addLog(`1. Llave configurada: ${API_KEY.substring(0, 5)}...`);
        addLog("2. Construyendo URL de petición a Financial Modeling Prep...");
        
      const url = `https://financialmodelingprep.com/stable/quote?symbol=MSFT,GOOGL&apikey=${API_KEY}`;
                                                                                    
        
        addLog("3. Conectando al servidor...");
        const response = await fetch(url);
        
        addLog(`4. Código HTTP de respuesta: ${response.status}`);
        
        const text = await response.text();
        addLog(`5. Respuesta bruta del servidor:\n${text}`);

      } catch (error) {
        addLog(`ERROR CRÍTICO DE RED:\n${error.message}`);
      }
    };

    probarAPI();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>MODO DIAGNÓSTICO</Text>
      </View>
      <ScrollView style={styles.logContainer}>
        <Text style={styles.logText}>{log}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },
  header: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#222' },
  headerTitle: { color: '#FFBF00', fontSize: 18, fontWeight: 'bold' },
  logContainer: { padding: 16 },
  logText: { color: '#39FF14', fontFamily: 'monospace', fontSize: 14 }
});
