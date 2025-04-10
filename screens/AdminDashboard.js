// screens/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import axios from 'axios'; // Import Axios for API calls

const AdminDashboard = ({ navigation }) => {
  // State variables to hold fetched data
  const [totalItems, setTotalItems] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [totalCategories, setTotalCategories] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  
  // Fetch data from the backend on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const itemsResponse = await axios.get('http://your-backend-api.com/api/total-items/');
        const salesResponse = await axios.get('http://your-backend-api.com/api/total-sales/');
        const categoriesResponse = await axios.get('http://your-backend-api.com/api/categories/');
        const usersResponse = await axios.get('http://your-backend-api.com/api/users/');

        // Update state with the fetched data
        setTotalItems(itemsResponse.data.total);
        setTotalSales(salesResponse.data.total);
        setTotalCategories(categoriesResponse.data.total);
        setTotalUsers(usersResponse.data.total);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures this runs only once after the first render

  const stats = [
    { label: 'Total Items', value: totalItems, icon: 'box', screen: 'InventoryScreen' },
    { label: 'Total Sales', value: `₱${totalSales.toLocaleString()}`, icon: 'credit-card', screen: 'SalesReportScreen' },
    { label: 'Categories', value: totalCategories, icon: 'category', screen: 'CategoriesScreen' },
    { label: 'Users', value: totalUsers, icon: 'users', screen: 'UserManagementScreen' },
  ];

  const options = [
    { label: 'Inventory', screen: 'InventoryScreen' },
    { label: 'Add Item', screen: 'AddItemScreen' },
    { label: 'Sales Report', screen: 'SalesReportScreen' },
    { label: 'Categories', screen: 'CategoriesScreen' },
    { label: 'User Management', screen: 'UserManagementScreen' },
    { label: 'Logout', screen: 'Login', color: '#faaac7' },
  ];

  const palette = [
    '#ff7332', '#e96842', '#d25d52', '#bc5262',
    '#a54771', '#943e79', '#833580', '#722c88', '#60238f'
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Admin Dashboard</Text>

      {/* Stats Grid */}
      <View style={styles.grid}>
        {stats.map((stat, i) => (
          <TouchableOpacity
            key={stat.label}
            style={[
              styles.card,
              { backgroundColor: palette[i % palette.length] },
            ]}
            onPress={() => navigation.navigate(stat.screen)}
          >
            <FontAwesome5 name={stat.icon} size={40} color="#fff" />
            <Text style={styles.cardValue}>{stat.value}</Text>
            <Text style={styles.cardLabel}>{stat.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Options Grid */}
      <View style={styles.grid}>
        {options.map((opt, i) => {
          const bgColor = opt.color ? opt.color : palette[(i + stats.length) % palette.length];
          return (
            <TouchableOpacity
              key={opt.label}
              style={[styles.card, { backgroundColor: bgColor }]}
              onPress={() => navigation.navigate(opt.screen)}
            >
              <MaterialIcons name="navigate-next" size={30} color="#fff" />
              <Text style={styles.optionText}>{opt.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  grid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  card: {
    width: '48%',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,            // Android shadow
    shadowColor: '#000',     // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardValue: {
    fontSize: 26,
    fontWeight: '700',
    color: '#fff',
    marginTop: 10,
  },
  cardLabel: {
    fontSize: 14,
    color: '#f0f0f0',
    marginTop: 5,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginTop: 10,
  },
});

export default AdminDashboard;
