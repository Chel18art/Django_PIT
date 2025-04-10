// screens/UserManagement.js
import React from 'react';
import { View, Text, StyleSheet, TextInput, Button, FlatList } from 'react-native';

const UserManagementScreen = () => {
  const data = [
    { id: '1', username: 'admin', type: 'admin', created: '2025-04-09' },
  ];

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text>{item.username} | {item.type} | {item.created}</Text>
      <Button title="Delete" color="red" />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>User Management</Text>
      <TextInput placeholder="Username" style={styles.input} />
      <TextInput placeholder="Password" secureTextEntry style={styles.input} />
      <TextInput placeholder="Repeat Password" secureTextEntry style={styles.input} />
      <TextInput placeholder="Account Type (admin/cashier)" style={styles.input} />
      <Button title="Create User" />
      <FlatList data={data} renderItem={renderItem} keyExtractor={item => item.id} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  input: { borderWidth: 1, padding: 8, marginBottom: 10, borderRadius: 5 },
  item: {
    backgroundColor: '#eee',
    padding: 10,
    marginBottom: 5,
    borderRadius: 5,
  },
});

export default UserManagementScreen;
