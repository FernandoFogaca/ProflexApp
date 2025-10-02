import React, { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  Switch,
} from "react-native"
import * as ImagePicker from "expo-image-picker"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useTheme } from "../context/ThemeContext"

export default function ProfileScreen() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === "dark"

  const [user, setUser] = useState(null) 
  const [editing, setEditing] = useState(false)

 
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem("userProfile")
        if (saved) {
          setUser(JSON.parse(saved))
        } else {
          
          setUser({
            name: "Fernando Fogaça",
            email: "fernando@example.com",
            phone: "(11) 99999-9999",
            avatar:
              "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
          })
        }
      } catch (e) {
        console.log("Erro ao carregar perfil:", e)
      }
    })()
  }, [])

  const saveProfile = async (updatedUser) => {
    try {
      setUser(updatedUser)
      await AsyncStorage.setItem("userProfile", JSON.stringify(updatedUser))
    } catch (e) {
      console.log("Erro ao salvar perfil:", e)
    }
  }

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (!permission.granted) {
      Alert.alert("Permissão necessária", "Permita acesso às fotos.")
      return
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    })
    if (!result.canceled) {
      const updatedUser = { ...user, avatar: result.assets[0].uri }
      saveProfile(updatedUser)
    }
  }

  const handleLogout = async () => {
    await AsyncStorage.removeItem("userProfile")
    Alert.alert("Logout", "Você saiu da sua conta!")
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={{ color: isDark ? "#fff" : "#000" }}>Carregando...</Text>
      </View>
    )
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? "#121212" : "#f9f9f9" },
      ]}
    >
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
              saveProfile(user)
              setEditing(false)
            }}
          >
            <Text style={styles.buttonText}>Salvar</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={[styles.name, { color: isDark ? "#fff" : "#000" }]}>
            {user.name}
          </Text>
          <Text style={[styles.email, { color: isDark ? "#ccc" : "#555" }]}>
            {user.email}
          </Text>
          <Text style={[styles.phone, { color: isDark ? "#aaa" : "#777" }]}>
            {user.phone}
          </Text>

          {/* Botão Editar */}
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#ffc107" }]}
            onPress={() => setEditing(true)}
          >
            <Text style={styles.buttonText}>Editar Perfil</Text>
          </TouchableOpacity>

         
          <TouchableOpacity
            style={[styles.button, styles.logout]}
            onPress={handleLogout}
          >
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>

          {/* Chavinha embaixo do Logout */}
          <View style={styles.switchRow}>
            <Text style={{ color: isDark ? "#fff" : "#000", fontSize: 16 }}>
              {isDark ? "Dark Mode" : "Light Mode"}
            </Text>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              thumbColor={isDark ? "#fff" : "#4390a1"}
              trackColor={{ false: "#ccc", true: "#4390a1" }}
            />
          </View>
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  avatar: { width: 120, height: 120, borderRadius: 60, marginBottom: 10 },
  changePhoto: { color: "#007bff", marginBottom: 20, fontSize: 14 },
  name: { fontSize: 22, fontWeight: "bold", marginBottom: 5 },
  email: { fontSize: 16, marginBottom: 2 },
  phone: { fontSize: 16, marginBottom: 20 },
  button: {
    width: "80%",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
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
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "80%",
    marginTop: 10,
    paddingHorizontal: 10,
  },
})
