// screens/AddItemScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';

const AddItemScreen = ({ navigation }) => {
  const [category, setCategory] = useState('Food');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleAddItem = () => {
    if (!name || !price || !description) {
      setError('Please fill in all fields');
      return;
    }

    const itemData = { name, category, price, description };

    axios
      .post('http://127.0.0.1:8000/api/items/', itemData)
      .then((response) => {
        Alert.alert('Success', 'Item added successfully');
        navigation.goBack();
      })
      .catch((err) => {
        console.log(err);
        setError('Failed to add item');
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add New Item</Text>
      <TextInput
        placeholder="Item Name"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />
      <Picker
        selectedValue={category}
        onValueChange={(value) => setCategory(value)}
        style={styles.input}
      >
        <Picker.Item label="Food" value="Food" />
        <Picker.Item label="Drink" value="Drink" />
      </Picker>
      <TextInput
        placeholder="Price"
        keyboardType="numeric"
        style={styles.input}
        value={price}
        onChangeText={setPrice}
      />
      <TextInput
        placeholder="Description"
        style={styles.input}
        value={description}
        onChangeText={setDescription}
      />
      <Button title="Add Item" onPress={handleAddItem} />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 15 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 10,
    borderRadius: 5,
  },
  error: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },
});

export default AddItemScreen;
