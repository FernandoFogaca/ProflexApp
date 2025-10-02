import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

import HomeScreen from "./src/screens/HomeScreen";
import AgendaScreen from "./src/screens/AgendaScreen";
import PacienteScreen from "./src/screens/PacienteScreen";
import MarketingScreen from "./src/screens/MarketingScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import CompromissosScreen from "./src/screens/CompromissosScreen";
import LoginScreen from "./src/screens/LoginScreen";
import NewsScreen from "./src/screens/NewsScreen";


import CadastroCompleto from "./src/screens/CadastroCompleto/CadastroCompleto";

import { ThemeProvider } from "./src/context/ThemeContext";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function Tabs() {
  return (
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
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>

          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Main" component={Tabs} />
          <Stack.Screen name="Compromissos" component={CompromissosScreen} />
          <Stack.Screen name="Noticias" component={NewsScreen} />

          <Stack.Screen name="CadastroCompleto" component={CadastroCompleto} />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}
