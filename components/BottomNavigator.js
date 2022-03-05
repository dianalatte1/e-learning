import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";

import TransactionScreen from "../screens/TransactionScreen";
import SearchScreen from "../screens/SearchScreen";

const Tab = createBottomTabNavigator();

const BottomNavigator = (props) => {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Transacción" component={TransactionScreen} />
        <Tab.Screen name="Búsqueda" component={SearchScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default BottomNavigator;
