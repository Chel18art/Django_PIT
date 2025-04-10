import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TextInput, Button,
  FlatList, TouchableOpacity, Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const CategoriesScreen = ({ navigation }) => {
  const [categoryName, setCategoryName] = useState('');
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch categories from the API
  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/categories/');
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      Alert.alert('Error', 'Failed to fetch categories');
    }
  };

  // Handle adding a new category
  const handleAddCategory = async () => {
    if (categoryName.trim() === '') {
      Alert.alert('Error', 'Category name cannot be empty');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/categories/', {
        name: categoryName,
      });
      setCategories(prev => [...prev, response.data]);
      setCategoryName('');
      Alert.alert('Success', 'Category added!');
    } catch (error) {
      console.error("Error adding category:", error);
      Alert.alert('Error', 'Failed to add category');
    } finally {
      setLoading(false);
    }
  };

  // Handle deleting a category
  const handleDeleteCategory = async (id) => {
    try {
      console.log("Attempting to delete category with ID:", id); // Debugging log
      await axios.delete(`http://127.0.0.1:8000/api/categories/${id}`);
      setCategories(prev => prev.filter(c => c.id !== id));
      Alert.alert('Success', 'Category deleted!');
    } catch (error) {
      console.error("Error deleting category:", error.response || error.message);
      Alert.alert('Error', 'Failed to delete category');
    }
  };
  

  // Filter categories based on the search query
  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Render each category item
  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.rowText}>#{item.id}</Text>
      <Text style={styles.rowText}>{item.created_at}</Text>
      <Text style={styles.rowText}>{item.name}</Text>
      <Text style={styles.rowText}>{item.created_by || 'N/A'}</Text>
      <TouchableOpacity onPress={() => handleDeleteCategory(item.id)} style={styles.deleteButton}>
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={28} color="black" />
      </TouchableOpacity>

      {/* Header */}
      <Text style={styles.header}>Manage Categories</Text>

      {/* Category Search Input */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search Categories"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* Category Name Input */}
      <Text style={styles.label}>Enter Category Name:</Text>
      <TextInput
        style={styles.input}
        placeholder="Category Name"
        value={categoryName}
        onChangeText={setCategoryName}
      />
      <Button
        title={loading ? 'Adding...' : 'Add Category'}
        onPress={handleAddCategory}
        disabled={loading}
      />

      {/* Table Header */}
      <View style={styles.tableHeader}>
        <Text style={styles.tableHeaderText}>#</Text>
        <Text style={styles.tableHeaderText}>Date/Time</Text>
        <Text style={styles.tableHeaderText}>Name</Text>
        <Text style={styles.tableHeaderText}>Created By</Text>
        <Text style={styles.tableHeaderText}>Action</Text>
      </View>

      {/* Category List */}
      <FlatList
        data={filteredCategories}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: '#f9f9f9',
    flex: 1,
  },
  backButton: {
    marginBottom: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4e73df',
    marginBottom: 10,
    textAlign: 'center',
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: 'white',
    marginBottom: 10,
  },
  searchInput: {
    padding: 8,
    borderColor: '#aaa',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: 'white',
    marginBottom: 15,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#4e73df',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'space-between',
  },
  tableHeaderText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
    width: '20%',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  rowText: {
    width: '20%',
    textAlign: 'center',
    fontSize: 12,
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  deleteText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default CategoriesScreen;
