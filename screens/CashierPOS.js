// CashierPOS.js
import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';

const CashierPOS = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    axios
      .get('http://127.0.0.1:8000/api/items/', {
        headers: { Authorization: `Token ${localStorage.getItem('token')}` },
      })
      .then((response) => {
        setItems(response.data);
      })
      .catch((error) => {
        console.error('Error fetching items:', error);
      });
  }, []);

  const addToCart = (itemId) => {
    console.log('Item added to cart:', itemId);
    // Implement cart functionality
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cashier POS</Text>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text>{item.name}</Text>
            <Button title="Add to Cart" onPress={() => addToCart(item.id)} />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
});

export default CashierPOS;
