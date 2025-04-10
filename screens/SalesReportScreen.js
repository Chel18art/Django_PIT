// screens/SalesReportScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const SalesReportScreen = ({ navigation }) => {
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const response = await axios.get('https://your-api-url.com/api/sales/');
        setSalesData(response.data);
      } catch (error) {
        console.error("Error fetching sales:", error);
      }
    };
    fetchSales();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text>{item.date} | {item.item} | ₱{item.price} x {item.qty}</Text>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>
      <Text style={styles.header}>Sales Report</Text>
      <View style={styles.filters}>
        <Button title="Today" />
        <Button title="This Week" />
        <Button title="This Month" />
        <Button title="This Year" />
      </View>
      <FlatList data={salesData} renderItem={renderItem} keyExtractor={item => item.id} />
      <Text style={styles.total}>Total Sales Today: ₱55</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f0f4f8',
    flex: 1,
    alignItems: 'center',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#4e73df',
  },
  filters: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    width: '100%',
  },
  item: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  total: {
    marginTop: 15,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4e73df',
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 1,
  },
});

export default SalesReportScreen;
