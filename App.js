// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import AdminDashboard from './screens/AdminDashboard';
import CashierPOS from './screens/CashierPOS';
import InventoryScreen from './screens/InventoryScreen';
import AddItemScreen from './screens/AddItemScreen';
import SalesReportScreen from './screens/SalesReportScreen';
import CategoriesScreen from './screens/CategoriesScreen';
import UserManagementScreen from './screens/UserManagementScreen';
const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
        <Stack.Screen name="CashierPOS" component={CashierPOS} />
        <Stack.Screen name="InventoryScreen" component={InventoryScreen} />
        <Stack.Screen name="AddItemScreen" component={AddItemScreen} />
        <Stack.Screen name="SalesReportScreen" component={SalesReportScreen} />
        <Stack.Screen name="CategoriesScreen" component={CategoriesScreen} />
        <Stack.Screen name="UserManagementScreen" component={UserManagementScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
