import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  Linking,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ProfileScreen() {
  const [user, setUser] = useState({
    name: "Fernando Fogaça",
    email: "fernando@example.com",
    phone: "(11) 99999-9999",
    avatar: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
  });

  const [editing, setEditing] = useState(false);

  // carregar dados salvos
  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem("userProfile");
      if (saved) setUser(JSON.parse(saved));
    })();
  }, []);

  // salvar dados
  const saveProfile = async (updatedUser) => {
    setUser(updatedUser);
    await AsyncStorage.setItem("userProfile", JSON.stringify(updatedUser));
    Alert.alert("Sucesso", "Perfil atualizado!");
  };

  // escolher foto
  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permissão necessária", "Permita acesso às fotos.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      const updatedUser = { ...user, avatar: result.assets[0].uri };
      saveProfile(updatedUser);
    }
  };

  // abrir WhatsApp com o número do perfil
  const openWhatsApp = () => {
    const cleanPhone = user.phone.replace(/\D/g, ""); // remove caracteres não numéricos
    const url = `https://wa.me/${cleanPhone}`;
    Linking.openURL(url).catch(() =>
      Alert.alert("Erro", "Não foi possível abrir o WhatsApp.")
    );
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Você saiu da sua conta!");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Avatar */}
      <TouchableOpacity onPress={pickImage}>
        <Image source={{ uri: user.avatar }} style={styles.avatar} />
        <Text style={styles.changePhoto}>Change Photo</Text>
      </TouchableOpacity>

      {editing ? (
        <>
          <TextInput
            style={styles.input}
            value={user.name}
            onChangeText={(t) => setUser({ ...user, name: t })}
            placeholder="Name"
          />
          <TextInput
            style={styles.input}
            value={user.email}
            onChangeText={(t) => setUser({ ...user, email: t })}
            placeholder="Email"
          />
          <TextInput
            style={styles.input}
            value={user.phone}
            onChangeText={(t) => setUser({ ...user, phone: t })}
            placeholder="Phone"
          />

          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#28a745" }]}
            onPress={() => {
              saveProfile(user);
              setEditing(false);
            }}
          >
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
          <Text style={styles.phone}>{user.phone}</Text>

          {/* Botões */}
          <View style={styles.buttons}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: "#ffc107" }]}
              onPress={() => setEditing(true)}
            >
              <Text style={styles.buttonText}>Edit Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: "#25D366" }]}
              onPress={openWhatsApp}
            >
              <Text style={styles.buttonText}>WhatsApp</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.logout]}
              onPress={handleLogout}
            >
              <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 5,
  },
  changePhoto: {
    color: "#007bff",
    marginBottom: 15,
    fontSize: 14,
    textAlign: "center",
  },
  name: { fontSize: 22, fontWeight: "bold", marginBottom: 5 },
  email: { fontSize: 16, color: "#555", marginBottom: 2 },
  phone: { fontSize: 16, color: "#777", marginBottom: 20 },
  buttons: { marginTop: 20, width: "100%", alignItems: "center" },
  button: {
    width: "80%",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  logout: { backgroundColor: "#dc3545" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  input: {
    width: "90%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
});
