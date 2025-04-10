import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Button, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const InventoryScreen = ({ navigation }) => {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get('https://your-api-url.com/api/items/');
        setItems(response.data);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };
    fetchItems();
  }, []);

  // Filter items based on the search query
  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.rowText}>#{item.id}</Text>
      <Text style={styles.rowText}>{item.name}</Text>
      <Text style={styles.rowText}>{item.category}</Text>
      <Text style={styles.rowText}>{item.description}</Text>
      <Text style={styles.rowText}>{item.quantity}</Text>
      <Text style={styles.rowText}>₱{item.price}</Text>
      <View style={styles.actionButtons}>
        <Button title="Stock Entry" onPress={() => alert('Stock Entry clicked')} />
        <Button title="Update" onPress={() => alert('Update clicked')} />
        <Button title="Delete" color="red" onPress={() => alert('Delete clicked')} />
      </View>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.header}>Inventory</Text>
      
      {/* Search Bar */}
      <TextInput
        placeholder="Search items..."
        style={styles.search}
        value={search}
        onChangeText={setSearch}
      />
      
      {/* Table Header */}
      <View style={styles.tableHeader}>
        <Text style={styles.tableHeaderText}>Item #</Text>
        <Text style={styles.tableHeaderText}>Name</Text>
        <Text style={styles.tableHeaderText}>Category</Text>
        <Text style={styles.tableHeaderText}>Description</Text>
        <Text style={styles.tableHeaderText}>Qty</Text>
        <Text style={styles.tableHeaderText}>Price</Text>
        <Text style={styles.tableHeaderText}>Action</Text>
      </View>

      {/* Item Rows */}
      <FlatList 
        data={filteredItems} 
        renderItem={renderItem} 
        keyExtractor={item => item.id.toString()} 
      />
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
  search: {
    width: '90%',  // Reduced the width of the search bar
    padding: 10,
    marginBottom: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: 'white',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#4e73df',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    justifyContent: 'space-between',
    width: '100%',
  },
  tableHeaderText: {
    color: 'white',
    fontWeight: 'bold',
    width: '14%',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'space-between',
    width: '100%',
  },
  rowText: {
    width: '14%',
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '30%',
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 1,
  },
});

export default InventoryScreen;
