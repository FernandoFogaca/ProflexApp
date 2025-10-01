// src/screens/MarketingScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Share,
  Linking,
  Alert,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function MarketingScreen() {
  const [mensagem, setMensagem] = useState("");
  const [campanhas, setCampanhas] = useState([
    {
      id: "1",
      title: "October Promo",
      msg: "🎉 Special promotion in October! Book your appointment and get 20% off.",
    },
    {
      id: "2",
      title: "Appointment Reminder",
      msg: "Hello! Don’t forget your appointment with us. We’re waiting for you! 🧑‍⚕️",
    },
  ]);

  // Create new campaign
  const addCampanha = () => {
    if (!mensagem.trim()) {
      Alert.alert("Error", "Please type a message first.");
      return;
    }
    const nova = {
      id: Date.now().toString(),
      title: "Campaign",
      msg: mensagem.trim(),
    };
    setCampanhas([nova, ...campanhas]);
    setMensagem("");
  };

  // Share
  const shareMensagem = async (msg) => {
    try {
      await Share.share({ message: msg });
    } catch (e) {
      console.log("Error sharing:", e);
    }
  };

  // WhatsApp
  const sendWhatsApp = (msg) => {
    const url = `whatsapp://send?text=${encodeURIComponent(msg)}`;
    Linking.openURL(url).catch(() =>
      Alert.alert("Error", "WhatsApp is not installed.")
    );
  };

  // Edit
  const editCampanha = (id) => {
    const camp = campanhas.find((c) => c.id === id);
    if (!camp) return;
    setMensagem(camp.msg);
    setCampanhas(campanhas.filter((c) => c.id !== id));
  };

  // Delete
  const deleteCampanha = (id) => {
    setCampanhas(campanhas.filter((c) => c.id !== id));
  };

  // Image upload
  const pickImage = async (id) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      const updated = campanhas.map((c) =>
        c.id === id ? { ...c, image: result.assets[0].uri } : c
      );
      setCampanhas(updated);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Marketing Campaigns</Text>

      {/* Create new campaign */}
      <TextInput
        style={styles.input}
        placeholder="Write your campaign message..."
        value={mensagem}
        onChangeText={setMensagem}
      />
      <TouchableOpacity style={styles.button} onPress={addCampanha}>
        <Text style={styles.buttonText}>Add Campaign</Text>
      </TouchableOpacity>

      {/* Campaign list */}
      <FlatList
        data={campanhas}
        keyExtractor={(item) => item.id}
        style={{ marginTop: 20, width: "100%" }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.nome}>{item.title}</Text>
              <Text style={styles.info}>{item.msg}</Text>
              {item.image && (
                <Image
                  source={{ uri: item.image }}
                  style={{ width: "100%", height: 120, marginTop: 8, borderRadius: 8 }}
                  resizeMode="cover"
                />
              )}
            </View>
            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.smallButton, { backgroundColor: "#ffc107" }]}
                onPress={() => editCampanha(item.id)}
              >
                <Text style={styles.actionText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.smallButton, { backgroundColor: "#dc3545" }]}
                onPress={() => deleteCampanha(item.id)}
              >
                <Text style={styles.actionText}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.smallButton, { backgroundColor: "steelblue" }]}
                onPress={() => shareMensagem(item.msg)}
              >
                <Text style={styles.actionText}>Share</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.smallButton, { backgroundColor: "#25D366" }]}
                onPress={() => sendWhatsApp(item.msg)}
              >
                <Text style={styles.actionText}>WhatsApp</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.smallButton, { backgroundColor: "#6c757d" }]}
                onPress={() => pickImage(item.id)}
              >
                <Text style={styles.actionText}>Image</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f9f9f9" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 15, textAlign: "center" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#4390a1",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  nome: { fontSize: 18, fontWeight: "bold", marginBottom: 5 },
  info: { fontSize: 14, color: "#555" },
  actions: {
    flexDirection: "row",
    marginTop: 10,
    flexWrap: "wrap",
    gap: 6,
  },
  smallButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginRight: 4,
  },
  actionText: { color: "#fff", fontWeight: "600", fontSize: 12 },
});
