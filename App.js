import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "./src/screens/HomeScreen";
import AgendaScreen from "./src/screens/AgendaScreen";
import PacienteScreen from "./src/screens/PacienteScreen";
import MarketingScreen from "./src/screens/MarketingScreen";
import ProfileScreen from "./src/screens/ProfileScreen";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ color, size }) => {
            let iconName = "ellipse";
            if (route.name === "Home") iconName = "home";
            else if (route.name === "Agenda") iconName = "calendar";
            else if (route.name === "Pacientes") iconName = "people";
            else if (route.name === "Marketing") iconName = "megaphone";
            else if (route.name === "Perfil") iconName = "person";

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "#4390a1",
          tabBarInactiveTintColor: "gray",
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Agenda" component={AgendaScreen} />
        <Tab.Screen name="Pacientes" component={PacienteScreen} />
        <Tab.Screen name="Marketing" component={MarketingScreen} />
        <Tab.Screen name="Perfil" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
