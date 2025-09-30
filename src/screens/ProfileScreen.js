// src/screens/ProfileScreen.js
import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from "react-native";

export default function ProfileScreen() {
  const [user, setUser] = useState({
    name: "Fernando Fogaça",
    email: "fernando@example.com",
    phone: "(11) 99999-9999",
    avatar: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
  });

  const handleLogout = () => {
    Alert.alert("Sair", "Você saiu da sua conta!");
  };

  return (
    <View style={styles.container}>
      {/* Avatar */}
      <Image source={{ uri: user.avatar }} style={styles.avatar} />

      {/* Nome */}
      <Text style={styles.name}>{user.name}</Text>
      <Text style={styles.email}>{user.email}</Text>
      <Text style={styles.phone}>{user.phone}</Text>

      {/* Botões */}
      <View style={styles.buttons}>
        <TouchableOpacity style={styles.button} onPress={() => Alert.alert("Editar Perfil")}>
          <Text style={styles.buttonText}>Editar Perfil</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.logout]} onPress={handleLogout}>
          <Text style={[styles.buttonText, { color: "#fff" }]}>Sair</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: "#555",
    marginBottom: 2,
  },
  phone: {
    fontSize: 16,
    color: "#777",
    marginBottom: 20,
  },
  buttons: {
    marginTop: 20,
    width: "100%",
    alignItems: "center",
  },
  button: {
    width: "80%",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#4390a1",
    alignItems: "center",
    marginBottom: 10,
  },
  logout: {
    backgroundColor: "#dc3545",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
