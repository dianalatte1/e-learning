import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";

import TransactionScreen from "../screens/TransactionScreen";
import SearchScreen from "../screens/SearchScreen";
//importing the Ionicons
import Ionicons from "react-native-vector-icons/Ionicons";
//creating the constan Tab
const Tab = createBottomTabNavigator();

const BottomNavigator = (props) => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;

            if (route.name === "Transacción") {
              iconName = "book";
            } else if (route.name === "Buscar") {
              iconName = "search";
            }

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "#FFFFFF",
          tabBarInactiveTintColor: "black",
          tabBarLabelStyle: {
            fontSize: 15,
            fontFamily: "Rajdhani_600SemiBold",
          },
          tabBarItemStyle: {
            marginLeft: 10,
            marginRight: 10,
            borderRadius: 30,
            borderWidth: 2,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#5653d4",
          },
          tabBarLabelPosition: "beside-icon",
          tabBarStyle: [
            {
              display: "flex",
            },
            null,
          ],
        })}
      >
        {/* The name of screen will be the same than route.name */}
        <Tab.Screen name="Transacción" component={TransactionScreen} />
        <Tab.Screen name="Buscar" component={SearchScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default BottomNavigator;
